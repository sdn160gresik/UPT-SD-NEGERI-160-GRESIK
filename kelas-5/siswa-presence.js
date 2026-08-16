/* =========================================================
   SISTEM PRESENCE SISWA
   UPT SDN 160 GRESIK
   KELAS 5
   ========================================================= */


/* ---------------------------------------------------------
   NAMA CHANNEL PRESENCE
--------------------------------------------------------- */

const PRESENCE_CHANNEL =
    "siswa-online-kelas-5";


/* ---------------------------------------------------------
   CEK SUPABASE
--------------------------------------------------------- */

if(
    typeof supabaseClient === "undefined"
){

    console.error(
        "supabaseClient belum tersedia."
    );

}


/* ---------------------------------------------------------
   DATA SISWA
--------------------------------------------------------- */

let currentUser = null;

let currentNama = "Siswa";

let currentUsername = "";

let currentPage =
    document.title ||
    "Petualangan Kelas 5";


/* ---------------------------------------------------------
   AMBIL SESSION
--------------------------------------------------------- */

async function mulaiPresence(){

    try{

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
           ERROR
        ================================================= */

        if(error){

            console.error(
                "Gagal mengambil session Presence:",
                error
            );

            return;
        }


        /* =================================================
           TIDAK ADA SESSION
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
           METADATA
        ================================================= */

        const metadata =
            currentUser.user_metadata || {};


        /* =================================================
           AMBIL NAMA SISWA
           
           JANGAN GUNAKAN EMAIL SEBAGAI NAMA
        ================================================= */

        currentNama =
            metadata.nama ||
            metadata.name ||
            metadata.full_name ||
            metadata.display_name ||
            window.currentSiswa?.nama ||
            "Siswa";


        /* =================================================
           USERNAME
        ================================================= */

        currentUsername =
            metadata.username ||
            window.currentSiswa?.username ||
            "";


        /* =================================================
           JIKA DATA SUDAH DISET DARI HALAMAN
        ================================================= */

        if(
            window.currentSiswa
        ){

            currentNama =
                window.currentSiswa.nama ||
                currentNama;

            currentUsername =
                window.currentSiswa.username ||
                currentUsername;

        }


        /* =================================================
           DEBUG
        ================================================= */

        console.log(
            "================================"
        );

        console.log(
            "PRESENCE SISWA"
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
            "================================"
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
           SIMPAN CHANNEL SECARA GLOBAL
        ================================================= */

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
                    "Siswa aktif:",
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
                    "Siswa masuk:",
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
                    "Siswa keluar:",
                    key,
                    leftPresences
                );

            }

        );


        /* =================================================
           SUBSCRIBE
        ================================================= */

        await channel.subscribe(

            async (status) => {


                console.log(
                    "Status Presence:",
                    status
                );


                if(
                    status === "SUBSCRIBED"
                ){

                    /* =====================================
                       KIRIM DATA SISWA
                    ===================================== */

                    await channel.track({

                        user_id:
                            currentUser.id,

                        nama:
                            currentNama,

                        username:
                            currentUsername,

                        halaman:
                            currentPage,

                        status:
                            "online",

                        waktu:
                            new Date()
                                .toISOString()

                    });


                    console.log(
                        "Presence siswa aktif:",
                        currentNama
                    );

                }

            }

        );

    }
    catch(error){

        console.error(
            "Kesalahan sistem Presence:",
            error
        );

    }

}


/* ---------------------------------------------------------
   TAMPILKAN SISWA AKTIF
--------------------------------------------------------- */

function tampilkanSiswaAktif(state){

    const container =
        document.getElementById(
            "daftarSiswaAktif"
        );


    if(!container)
        return;


    const siswa = [];


    /* =====================================================
       BACA STATE PRESENCE
    ===================================================== */

    Object.keys(state)
        .forEach(key => {

            const daftar =
                state[key];


            if(
                !daftar ||
                !daftar.length
            ){

                return;

            }


            const data =
                daftar[
                    daftar.length - 1
                ];


            if(!data)
                return;


            siswa.push(
                data
            );

        });


    /* =====================================================
       BERSIHKAN CONTAINER
    ===================================================== */

    container.innerHTML =
        "";


    /* =====================================================
       JUMLAH SISWA
    ===================================================== */

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


    /* =====================================================
       JIKA KOSONG
    ===================================================== */

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


    /* =====================================================
       TAMPILKAN DAFTAR SISWA
    ===================================================== */

    siswa.forEach(
        data => {


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "siswa-online-item";


            /* =============================================
               NAMA SISWA
               
               TIDAK MENAMPILKAN EMAIL
            ============================================= */

            const nama =
                data.nama ||
                "Siswa";


            const halaman =
                data.halaman ||
                "Sedang belajar";


            item.innerHTML = `

                <div class="status-online">
                    🟢
                </div>

                <div class="siswa-info">

                    <div class="siswa-nama">
                        ${escapeHTML(nama)}
                    </div>

                    <div class="siswa-halaman">
                        📖 ${escapeHTML(halaman)}
                    </div>

                </div>

            `;


            container.appendChild(
                item
            );

        }
    );

}


/* ---------------------------------------------------------
   UPDATE HALAMAN SISWA
--------------------------------------------------------- */

async function updateHalamanSiswa(
    namaHalaman
){

    currentPage =
        namaHalaman;


    if(
        !window.siswaPresenceChannel ||
        !currentUser
    ){

        return;

    }


    try{

        await window
            .siswaPresenceChannel
            .track({

                user_id:
                    currentUser.id,

                nama:
                    currentNama,

                username:
                    currentUsername,

                halaman:
                    currentPage,

                status:
                    "online",

                waktu:
                    new Date()
                        .toISOString()

            });


        console.log(
            "Halaman Presence diperbarui:",
            currentPage
        );

    }
    catch(error){

        console.error(
            "Gagal memperbarui halaman:",
            error
        );

    }

}


/* ---------------------------------------------------------
   KEAMANAN TEKS
--------------------------------------------------------- */

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
