/* =========================================================
   SISTEM PRESENCE & AKTIVITAS SISWA
   UPT SDN 160 GRESIK
   KELAS 5

   FUNGSI:
   1. Menampilkan siswa yang sedang online
   2. Menampilkan nama siswa
   3. Menampilkan halaman yang sedang dibuka
   4. Menampilkan aktivitas siswa
   5. Menampilkan waktu aktivitas terakhir
   6. Memperbarui aktivitas secara realtime
   7. Tidak menggunakan email sebagai nama siswa
========================================================= */


/* =========================================================
   KONFIGURASI
========================================================= */

const PRESENCE_CHANNEL =
    "siswa-online-kelas-5";


/* =========================================================
   DATA SISWA
========================================================= */

let currentUser = null;

let currentNama = "Siswa";

let currentUsername = "";

let currentPage =
    document.title ||
    "Petualangan Belajar Kelas 5";

let currentAktivitas =
    "Sedang belajar";


/* =========================================================
   CHANNEL PRESENCE
========================================================= */

let siswaPresenceChannel = null;


/* =========================================================
   CEK SUPABASE
========================================================= */

if(
    typeof supabaseClient === "undefined"
){

    console.error(
        "❌ supabaseClient belum tersedia."
    );

}


/* =========================================================
   FUNGSI AMBIL NAMA SISWA
========================================================= */

/*
   Fungsi ini sengaja TIDAK menggunakan email.

   Prioritas nama:
   1. window.currentSiswa.nama
   2. metadata.nama
   3. metadata.nama_siswa
   4. metadata.namaSiswa
   5. metadata.name
   6. metadata.full_name
   7. metadata.display_name

   Jika semuanya tidak ditemukan:
   "Siswa"
*/

function ambilNamaPresence(user){

    /* -----------------------------------------------------
       PRIORITAS 1
       Data yang sudah dibuat oleh halaman login
    ----------------------------------------------------- */

    if(
        window.currentSiswa &&
        typeof window.currentSiswa.nama === "string" &&
        window.currentSiswa.nama.trim() !== ""
    ){

        return window.currentSiswa.nama.trim();

    }


    /* -----------------------------------------------------
       USER TIDAK ADA
    ----------------------------------------------------- */

    if(!user){

        return "Siswa";

    }


    /* -----------------------------------------------------
       METADATA SUPABASE
    ----------------------------------------------------- */

    const metadata =
        user.user_metadata || {};


    /* -----------------------------------------------------
       DAFTAR KEMUNGKINAN NAMA
    ----------------------------------------------------- */

    const daftarNama = [

        metadata.nama,

        metadata.nama_siswa,

        metadata.namaSiswa,

        metadata.name,

        metadata.full_name,

        metadata.fullName,

        metadata.display_name,

        metadata.displayName,

        metadata.student_name,

        metadata.studentName,

        metadata.nama_lengkap,

        metadata.namaLengkap

    ];


    /* -----------------------------------------------------
       CARI NAMA VALID
    ----------------------------------------------------- */

    for(
        const nama of daftarNama
    ){

        if(
            typeof nama === "string" &&
            nama.trim() !== "" &&
            !nama.includes("@")
        ){

            return nama.trim();

        }

    }


    /* -----------------------------------------------------
       JANGAN PERNAH MENGGUNAKAN EMAIL
    ----------------------------------------------------- */

    return "Siswa";

}


/* =========================================================
   FUNGSI AMBIL USERNAME
========================================================= */

function ambilUsernamePresence(user){

    /* -----------------------------------------------------
       PRIORITAS DATA DARI HALAMAN
    ----------------------------------------------------- */

    if(
        window.currentSiswa &&
        typeof window.currentSiswa.username === "string"
    ){

        return window.currentSiswa.username;

    }


    if(!user){

        return "";

    }


    const metadata =
        user.user_metadata || {};


    return (

        metadata.username ||

        metadata.user_name ||

        metadata.username_siswa ||

        ""

    );

}


/* =========================================================
   FORMAT NAMA HALAMAN
========================================================= */

function namaHalamanDefault(){

    let halaman =
        document.title ||
        "Petualangan Belajar Kelas 5";


    halaman =
        halaman
            .replace(/\s+/g, " ")
            .trim();


    return halaman;

}


/* =========================================================
   FORMAT WAKTU
========================================================= */

function formatWaktuAktivitas(waktu){

    if(!waktu){

        return "Baru saja";

    }


    try{

        const tanggal =
            new Date(waktu);


        const sekarang =
            new Date();


        const selisih =
            Math.floor(
                (
                    sekarang.getTime() -
                    tanggal.getTime()
                ) / 1000
            );


        /* -------------------------------------------------
           KURANG DARI 10 DETIK
        ------------------------------------------------- */

        if(
            selisih < 10
        ){

            return "Baru saja";

        }


        /* -------------------------------------------------
           DETIK
        ------------------------------------------------- */

        if(
            selisih < 60
        ){

            return (
                `${selisih} detik yang lalu`
            );

        }


        /* -------------------------------------------------
           MENIT
        ------------------------------------------------- */

        const menit =
            Math.floor(
                selisih / 60
            );


        if(
            menit < 60
        ){

            return (
                `${menit} menit yang lalu`
            );

        }


        /* -------------------------------------------------
           JAM
        ------------------------------------------------- */

        const jam =
            Math.floor(
                menit / 60
            );


        if(
            jam < 24
        ){

            return (
                `${jam} jam yang lalu`
            );

        }


        /* -------------------------------------------------
           TANGGAL
        ------------------------------------------------- */

        return tanggal.toLocaleString(
            "id-ID",
            {

                day:
                    "2-digit",

                month:
                    "short",

                hour:
                    "2-digit",

                minute:
                    "2-digit"

            }
        );

    }
    catch(error){

        return "Baru saja";

    }

}


/* =========================================================
   MEMBUAT DATA PRESENCE
========================================================= */

function buatDataPresence(){

    return {

        /* -------------------------------------------------
           IDENTITAS
        ------------------------------------------------- */

        user_id:
            currentUser
                ? currentUser.id
                : "",

        nama:
            currentNama,

        username:
            currentUsername,


        /* -------------------------------------------------
           HALAMAN
        ------------------------------------------------- */

        halaman:
            currentPage,


        /* -------------------------------------------------
           AKTIVITAS
        ------------------------------------------------- */

        aktivitas:
            currentAktivitas,


        /* -------------------------------------------------
           STATUS
        ------------------------------------------------- */

        status:
            "online",


        /* -------------------------------------------------
           WAKTU
        ------------------------------------------------- */

        waktu:
            new Date().toISOString()

    };

}


/* =========================================================
   MULAI PRESENCE
========================================================= */

async function mulaiPresence(){

    try{

        /* =================================================
           CEK SUPABASE
        ================================================= */

        if(
            typeof supabaseClient === "undefined"
        ){

            console.error(
                "❌ Supabase Client tidak tersedia."
            );

            return;

        }


        /* =================================================
           AMBIL SESSION
        ================================================= */

        const {

            data,

            error

        } =
            await supabaseClient
                .auth
                .getSession();


        /* =================================================
           ERROR SESSION
        ================================================= */

        if(error){

            console.error(
                "❌ Gagal mengambil session:",
                error
            );

            return;

        }


        /* =================================================
           TIDAK ADA LOGIN
        ================================================= */

        if(
            !data ||
            !data.session ||
            !data.session.user
        ){

            console.log(
                "Tidak ada siswa yang login."
            );

            return;

        }


        /* =================================================
           USER
        ================================================= */

        currentUser =
            data.session.user;


        /* =================================================
           NAMA SISWA
        ================================================= */

        currentNama =
            ambilNamaPresence(
                currentUser
            );


        /* =================================================
           USERNAME
        ================================================= */

        currentUsername =
            ambilUsernamePresence(
                currentUser
            );


        /* =================================================
           HALAMAN AWAL
        ================================================= */

        currentPage =
            namaHalamanDefault();


        /* =================================================
           AKTIVITAS AWAL
        ================================================= */

        currentAktivitas =
            "Sedang belajar";


        /* =================================================
           DEBUG
        ================================================= */

        console.log(
            "===================================="
        );

        console.log(
            "PRESENCE SISWA KELAS 5"
        );

        console.log(
            "Nama:",
            currentNama
        );

        console.log(
            "Username:",
            currentUsername
        );

        console.log(
            "Halaman:",
            currentPage
        );

        console.log(
            "Aktivitas:",
            currentAktivitas
        );

        console.log(
            "===================================="
        );


        /* =================================================
           BUAT CHANNEL
        ================================================= */

        const channel =
            supabaseClient.channel(
                PRESENCE_CHANNEL,
                {

                    config: {

                        presence: {

                            key:
                                currentUser.id

                        }

                    }

                }
            );


        /* =================================================
           SIMPAN CHANNEL GLOBAL
        ================================================= */

        siswaPresenceChannel =
            channel;


        window.siswaPresenceChannel =
            channel;


        /* =================================================
           EVENT SYNC
        ================================================= */

        channel.on(

            "presence",

            {
                event:
                    "sync"
            },

            () => {

                const state =
                    channel.presenceState();


                console.log(
                    "🔄 Presence Sync:",
                    state
                );


                tampilkanSiswaAktif(
                    state
                );

            }

        );


        /* =================================================
           EVENT JOIN
        ================================================= */

        channel.on(

            "presence",

            {
                event:
                    "join"
            },

            ({
                key,
                newPresences
            }) => {

                console.log(
                    "🟢 Siswa masuk:",
                    key,
                    newPresences
                );

            }

        );


        /* =================================================
           EVENT LEAVE
        ================================================= */

        channel.on(

            "presence",

            {
                event:
                    "leave"
            },

            ({
                key,
                leftPresences
            }) => {

                console.log(
                    "🔴 Siswa keluar:",
                    key,
                    leftPresences
                );

            }

        );


        /* =================================================
           SUBSCRIBE
        ================================================= */

        await channel.subscribe(

            async function(status){

                console.log(
                    "Status Presence:",
                    status
                );


                /* =========================================
                   BERHASIL TERHUBUNG
                ========================================= */

                if(
                    status === "SUBSCRIBED"
                ){

                    const presenceData =
                        buatDataPresence();


                    /* -------------------------------------
                       TRACK SISWA
                    ------------------------------------- */

                    await channel.track(
                        presenceData
                    );


                    console.log(
                        "🟢 Presence aktif:",
                        presenceData
                    );


                    /*
                     * Jalankan update otomatis
                     * setiap 30 detik.
                     */

                    mulaiHeartbeat();

                }

            }

        );

    }
    catch(error){

        console.error(
            "❌ Kesalahan Presence:",
            error
        );

    }

}


/* =========================================================
   HEARTBEAT
========================================================= */

/*
   Presence diperbarui secara berkala.

   Tujuannya agar:
   - waktu aktivitas tetap diperbarui
   - status siswa tetap aktif
   - daftar guru tetap mendapatkan data terbaru
*/

let heartbeatInterval =
    null;


function mulaiHeartbeat(){

    /* -----------------------------------------------------
       HAPUS TIMER LAMA
    ----------------------------------------------------- */

    if(
        heartbeatInterval
    ){

        clearInterval(
            heartbeatInterval
        );

    }


    /* -----------------------------------------------------
       UPDATE SETIAP 30 DETIK
    ----------------------------------------------------- */

    heartbeatInterval =
        setInterval(

            async function(){

                if(
                    !siswaPresenceChannel ||
                    !currentUser
                ){

                    return;

                }


                try{

                    await siswaPresenceChannel.track(
                        buatDataPresence()
                    );


                    console.log(
                        "🔄 Heartbeat:",
                        currentNama,
                        currentAktivitas
                    );

                }
                catch(error){

                    console.warn(
                        "Gagal heartbeat:",
                        error
                    );

                }

            },

            30000

        );

}


/* =========================================================
   TAMPILKAN SISWA AKTIF
========================================================= */

function tampilkanSiswaAktif(state){

    const container =
        document.getElementById(
            "daftarSiswaAktif"
        );


    if(!container){

        return;

    }


    /* =================================================
       ARRAY SISWA
    ================================================= */

    const siswa = [];


    /* =================================================
       BACA PRESENCE STATE
    ================================================= */

    Object.keys(state)
        .forEach(

            function(key){

                const daftar =
                    state[key];


                if(
                    !daftar ||
                    !daftar.length
                ){

                    return;

                }


                /*
                 * Ambil presence terbaru.
                 */

                const data =
                    daftar[
                        daftar.length - 1
                    ];


                if(!data){

                    return;

                }


                siswa.push(
                    data
                );

            }

        );


    /* =================================================
       BERSIHKAN
    ================================================= */

    container.innerHTML =
        "";


    /* =================================================
       HEADER JUMLAH SISWA
    ================================================= */

    const jumlah =
        document.createElement(
            "div"
        );


    jumlah.className =
        "jumlah-siswa-online";


    jumlah.textContent =
        `🟢 ${siswa.length} siswa sedang online`;


    container.appendChild(
        jumlah
    );


    /* =================================================
       JIKA KOSONG
    ================================================= */

    if(
        siswa.length === 0
    ){

        const kosong =
            document.createElement(
                "div"
            );


        kosong.className =
            "siswa-kosong";


        kosong.textContent =
            "Belum ada siswa yang online.";


        container.appendChild(
            kosong
        );


        return;

    }


    /* =================================================
       URUTKAN BERDASARKAN NAMA
    ================================================= */

    siswa.sort(

        function(a,b){

            return String(
                a.nama || "Siswa"
            ).localeCompare(
                String(
                    b.nama || "Siswa"
                ),
                "id"
            );

        }

    );


    /* =================================================
       TAMPILKAN SISWA
    ================================================= */

    siswa.forEach(

        function(data){

            /* =========================================
               DATA
            ========================================= */

            const nama =
                data.nama ||
                "Siswa";


            const halaman =
                data.halaman ||
                "Petualangan Kelas 5";


            const aktivitas =
                data.aktivitas ||
                "Sedang belajar";


            const waktu =
                data.waktu ||
                "";


            /* =========================================
               ITEM
            ========================================= */

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "siswa-online-item";


            /* =========================================
               STATUS
            ========================================= */

            const status =
                document.createElement(
                    "div"
                );


            status.className =
                "status-online";


            status.textContent =
                "🟢";


            /* =========================================
               INFO
            ========================================= */

            const info =
                document.createElement(
                    "div"
                );


            info.className =
                "siswa-info";


            /* =========================================
               NAMA
            ========================================= */

            const namaElement =
                document.createElement(
                    "div"
                );


            namaElement.className =
                "siswa-nama";


            namaElement.textContent =
                nama;


            /* =========================================
               AKTIVITAS
            ========================================= */

            const aktivitasElement =
                document.createElement(
                    "div"
                );


            aktivitasElement.className =
                "siswa-aktivitas";


            aktivitasElement.textContent =
                `📝 ${aktivitas}`;


            /* =========================================
               HALAMAN
            ========================================= */

            const halamanElement =
                document.createElement(
                    "div"
                );


            halamanElement.className =
                "siswa-halaman";


            halamanElement.textContent =
                `📖 ${halaman}`;


            /* =========================================
               WAKTU
            ========================================= */

            const waktuElement =
                document.createElement(
                    "div"
                );


            waktuElement.className =
                "siswa-waktu";


            waktuElement.textContent =
                `⏱️ ${formatWaktuAktivitas(waktu)}`;


            /* =========================================
               MASUKKAN
            ========================================= */

            info.appendChild(
                namaElement
            );


            info.appendChild(
                aktivitasElement
            );


            info.appendChild(
                halamanElement
            );


            info.appendChild(
                waktuElement
            );


            item.appendChild(
                status
            );


            item.appendChild(
                info
            );


            container.appendChild(
                item
            );

        }

    );

}


/* =========================================================
   UPDATE AKTIVITAS SISWA
========================================================= */

/*
   Fungsi utama yang nantinya dipanggil dari berbagai
   halaman.

   Contoh:

   updateAktivitasSiswa(
       "Sedang mengerjakan Tugas"
   );

*/

async function updateAktivitasSiswa(
    aktivitas,
    halaman = null
){

    /* -----------------------------------------------------
       AKTIVITAS
    ----------------------------------------------------- */

    if(
        typeof aktivitas === "string" &&
        aktivitas.trim() !== ""
    ){

        currentAktivitas =
            aktivitas.trim();

    }


    /* -----------------------------------------------------
       HALAMAN
    ----------------------------------------------------- */

    if(
        typeof halaman === "string" &&
        halaman.trim() !== ""
    ){

        currentPage =
            halaman.trim();

    }


    /* -----------------------------------------------------
       CEK CHANNEL
    ----------------------------------------------------- */

    if(
        !siswaPresenceChannel ||
        !currentUser
    ){

        console.warn(
            "Presence belum aktif."
        );

        return;

    }


    /* -----------------------------------------------------
       KIRIM DATA
    ----------------------------------------------------- */

    try{

        const data =
            buatDataPresence();


        await siswaPresenceChannel.track(
            data
        );


        console.log(
            "✏️ Aktivitas diperbarui:",
            data
        );

    }
    catch(error){

        console.error(
            "❌ Gagal memperbarui aktivitas:",
            error
        );

    }

}


/* =========================================================
   UPDATE HALAMAN SISWA
========================================================= */

async function updateHalamanSiswa(
    namaHalaman,
    aktivitas = "Sedang belajar"
){

    currentPage =
        namaHalaman ||
        namaHalamanDefault();


    currentAktivitas =
        aktivitas ||
        "Sedang belajar";


    await updateAktivitasSiswa(

        currentAktivitas,

        currentPage

    );

}


/* =========================================================
   AKTIVITAS: SEDANG BELAJAR
========================================================= */

async function aktivitasSedangBelajar(
    namaHalaman
){

    await updateAktivitasSiswa(

        "Sedang belajar",

        namaHalaman ||
        namaHalamanDefault()

    );

}


/* =========================================================
   AKTIVITAS: SEDANG MENGERJAKAN TUGAS
========================================================= */

async function aktivitasMengerjakanTugas(
    namaTugas = "Tugas"
){

    await updateAktivitasSiswa(

        `Sedang mengerjakan ${namaTugas}`,

        "Tugas"

    );

}


/* =========================================================
   AKTIVITAS: SEDANG MENGERJAKAN KUIS
========================================================= */

async function aktivitasMengerjakanKuis(
    namaKuis = "Kuis"
){

    await updateAktivitasSiswa(

        `Sedang mengerjakan ${namaKuis}`,

        "Kuis"

    );

}


/* =========================================================
   AKTIVITAS: SEDANG MEMBACA
========================================================= */

async function aktivitasMembaca(
    namaMateri = "Materi pembelajaran"
){

    await updateAktivitasSiswa(

        `Sedang membaca ${namaMateri}`,

        namaMateri

    );

}


/* =========================================================
   AKTIVITAS: SEDANG MENGERJAKAN LKPD
========================================================= */

async function aktivitasLKPD(
    namaLKPD = "LKPD"
){

    await updateAktivitasSiswa(

        `Sedang mengerjakan ${namaLKPD}`,

        "LKPD"

    );

}


/* =========================================================
   AKTIVITAS: SEDANG BERMAIN
========================================================= */

async function aktivitasBermain(
    namaGame = "Game Pembelajaran"
){

    await updateAktivitasSiswa(

        `Sedang bermain ${namaGame}`,

        namaGame

    );

}


/* =========================================================
   AKTIVITAS: SELESAI
========================================================= */

async function aktivitasSelesai(
    namaAktivitas = "Belajar"
){

    await updateAktivitasSiswa(

        `Selesai ${namaAktivitas}`,

        namaAktivitas

    );

}


/* =========================================================
   KEAMANAN TEKS
========================================================= */

function escapeHTML(text){

    return String(text)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   SAAT HALAMAN DIBUKA
========================================================= */

document.addEventListener(

    "DOMContentLoaded",

    function(){

        /*
         * Mulai Presence setelah HTML selesai
         * dimuat.
         */

        mulaiPresence();

    }

);


/* =========================================================
   SAAT SISWA MENUTUP / MENINGGALKAN HALAMAN
========================================================= */

window.addEventListener(

    "beforeunload",

    function(){

        /*
         * Supabase Presence biasanya akan otomatis
         * mendeteksi koneksi yang terputus.
         *
         * Tidak perlu signOut di sini.
         */

        if(
            heartbeatInterval
        ){

            clearInterval(
                heartbeatInterval
            );

        }

    }

);


/* =========================================================
   EXPORT GLOBAL
========================================================= */

window.mulaiPresence =
    mulaiPresence;


window.updateAktivitasSiswa =
    updateAktivitasSiswa;


window.updateHalamanSiswa =
    updateHalamanSiswa;


window.aktivitasSedangBelajar =
    aktivitasSedangBelajar;


window.aktivitasMengerjakanTugas =
    aktivitasMengerjakanTugas;


window.aktivitasMengerjakanKuis =
    aktivitasMengerjakanKuis;


window.aktivitasMembaca =
    aktivitasMembaca;


window.aktivitasLKPD =
    aktivitasLKPD;


window.aktivitasBermain =
    aktivitasBermain;


window.aktivitasSelesai =
    aktivitasSelesai;


window.tampilkanSiswaAktif =
    tampilkanSiswaAktif;
