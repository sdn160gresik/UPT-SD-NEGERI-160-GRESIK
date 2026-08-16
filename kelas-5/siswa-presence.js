/* =========================================================
   SISTEM PRESENCE SISWA
   UPT SDN 160 GRESIK
   ========================================================= */

const PRESENCE_CHANNEL = "siswa-online-kelas-5";

let currentUser = null;
let currentNama = "Siswa";
let currentUsername = "";
let currentPage = document.title || "Halaman";

window.siswaPresenceChannel = null;


/* =========================================================
   MULAI PRESENCE
========================================================= */

async function mulaiPresence() {

    try {

        const {
            data,
            error
        } = await supabaseClient.auth.getSession();


        /* -------------------------------------------------
           BELUM LOGIN
        ------------------------------------------------- */

        if (error || !data.session) {

            console.log(
                "Tidak ada siswa yang login."
            );

            return;
        }


        /* -------------------------------------------------
           DATA USER
        ------------------------------------------------- */

        currentUser =
            data.session.user;


        currentNama =
            currentUser.user_metadata?.nama ||
            currentUser.user_metadata?.name ||
            currentUser.email ||
            "Siswa";


        currentUsername =
            currentUser.user_metadata?.username ||
            "";


        /* -------------------------------------------------
           NAMA HALAMAN
        ------------------------------------------------- */

        currentPage =
            document.title ||
            "Sedang belajar";


        /* -------------------------------------------------
           BUAT CHANNEL
        ------------------------------------------------- */

        const channel =
            supabaseClient.channel(
                PRESENCE_CHANNEL,
                {
                    config: {
                        presence: {
                            key: currentUser.id
                        }
                    }
                }
            );


        window.siswaPresenceChannel =
            channel;


        /* =================================================
           PRESENCE SYNC
        ================================================= */

        channel.on(
            "presence",
            {
                event: "sync"
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
           SISWA MASUK
        ================================================= */

        channel.on(
            "presence",
            {
                event: "join"
            },
            ({ key, newPresences }) => {

                console.log(
                    "Siswa masuk:",
                    key,
                    newPresences
                );

            }
        );


        /* =================================================
           SISWA KELUAR
        ================================================= */

        channel.on(
            "presence",
            {
                event: "leave"
            },
            ({ key, leftPresences }) => {

                console.log(
                    "Siswa keluar:",
                    key,
                    leftPresences
                );

            }
        );


        /* =================================================
           CONNECT
        ================================================= */

        await channel.subscribe(
            async (status) => {

                console.log(
                    "Status Presence:",
                    status
                );


                if (
                    status === "SUBSCRIBED"
                ) {

                    await kirimPresence();

                    console.log(
                        "🟢 Presence siswa aktif."
                    );

                }

            }
        );


    }
    catch (error) {

        console.error(
            "Presence error:",
            error
        );

    }

}


/* =========================================================
   KIRIM STATUS SISWA
========================================================= */

async function kirimPresence() {

    if (
        !window.siswaPresenceChannel ||
        !currentUser
    ) {

        return;
    }


    await window.siswaPresenceChannel.track({

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
            new Date().toISOString()

    });

}


/* =========================================================
   TAMPILKAN SISWA AKTIF
========================================================= */

function tampilkanSiswaAktif(state) {

    const container =
        document.getElementById(
            "daftarSiswaAktif"
        );


    if (!container) {

        return;
    }


    const siswa = [];


    Object.keys(state).forEach(
        key => {

            const daftar =
                state[key];


            if (
                !daftar ||
                !daftar.length
            ) {

                return;
            }


            const data =
                daftar[
                    daftar.length - 1
                ];


            siswa.push(data);

        }
    );


    /* -----------------------------------------------------
       URUTKAN BERDASARKAN NAMA
    ----------------------------------------------------- */

    siswa.sort(
        (a, b) =>
            String(a.nama || "")
                .localeCompare(
                    String(b.nama || ""),
                    "id"
                )
    );


    /* -----------------------------------------------------
       BERSIHKAN
    ----------------------------------------------------- */

    container.innerHTML = "";


    /* -----------------------------------------------------
       JUMLAH ONLINE
    ----------------------------------------------------- */

    const jumlah =
        document.createElement(
            "div"
        );


    jumlah.className =
        "jumlah-siswa-online";


    jumlah.innerHTML =
        `🟢 ${siswa.length} siswa sedang online`;


    container.appendChild(
        jumlah
    );


    /* -----------------------------------------------------
       TIDAK ADA SISWA
    ----------------------------------------------------- */

    if (
        siswa.length === 0
    ) {

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


    /* -----------------------------------------------------
       DAFTAR SISWA
    ----------------------------------------------------- */

    siswa.forEach(
        data => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "siswa-online-item";


            item.innerHTML = `

                <div class="status-online">
                    🟢
                </div>

                <div class="siswa-info">

                    <div class="siswa-nama">
                        ${escapeHTML(
                            data.nama ||
                            "Siswa"
                        )}
                    </div>

                    <div class="siswa-halaman">

                        📖 Sedang membuka:
                        <strong>
                            ${escapeHTML(
                                data.halaman ||
                                "Sedang belajar"
                            )}
                        </strong>

                    </div>

                </div>

            `;


            container.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   UPDATE HALAMAN
   Dipanggil jika siswa berpindah halaman
========================================================= */

async function updateHalamanSiswa(
    namaHalaman
) {

    currentPage =
        namaHalaman ||
        document.title ||
        "Sedang belajar";


    await kirimPresence();

}


/* =========================================================
   KEAMANAN HTML
========================================================= */

function escapeHTML(text) {

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
   JALANKAN
========================================================= */

mulaiPresence();
