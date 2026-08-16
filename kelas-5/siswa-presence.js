/* =========================================================
   SISTEM PRESENCE SISWA
   UPT SDN 160 GRESIK
   ========================================================= */

const PRESENCE_CHANNEL = "siswa-online-kelas-5";

/* ---------------------------------------------------------
   CEK SUPABASE SUDAH TERSEDIA
--------------------------------------------------------- */

if (typeof supabaseClient === "undefined") {
    console.error("supabaseClient belum tersedia.");
}

/* ---------------------------------------------------------
   DATA SISWA YANG LOGIN
--------------------------------------------------------- */

let currentUser = null;
let currentNama = "Siswa";
let currentUsername = "";
let currentPage = document.title || "Halaman";

/* ---------------------------------------------------------
   AMBIL SESSION
--------------------------------------------------------- */

async function mulaiPresence() {

    const {
        data,
        error
    } = await supabaseClient.auth.getSession();

    if (error || !data.session) {
        console.log("Tidak ada siswa yang login.");
        return;
    }

    currentUser = data.session.user;

    currentNama =
        currentUser.user_metadata?.nama ||
        currentUser.user_metadata?.name ||
        currentUser.email ||
        "Siswa";

    currentUsername =
        currentUser.user_metadata?.username ||
        "";

    /* Mulai koneksi realtime */

    const channel =
        supabaseClient.channel(PRESENCE_CHANNEL, {

            config: {
                presence: {
                    key: currentUser.id
                }
            }

        });
window.siswaPresenceChannel = channel;
    /* -----------------------------------------------------
       KETIKA ADA PERUBAHAN SISWA ONLINE
    ----------------------------------------------------- */

    channel
        .on(
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

                tampilkanSiswaAktif(state);

            }
        )

        .on(
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
        )

        .on(
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

    /* -----------------------------------------------------
       JOIN CHANNEL
    ----------------------------------------------------- */

    const status =
        await channel.subscribe(
            async (status) => {

                if (status === "SUBSCRIBED") {

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
                            new Date().toISOString()

                    });

                    console.log(
                        "Presence siswa aktif."
                    );

                }

            }
        );

}

/* ---------------------------------------------------------
   TAMPILKAN SISWA AKTIF
--------------------------------------------------------- */

function tampilkanSiswaAktif(state) {

    const container =
        document.getElementById(
            "daftarSiswaAktif"
        );

    if (!container) return;

    const siswa = [];

    Object.keys(state).forEach(key => {

        const daftar =
            state[key];

        if (!daftar || !daftar.length)
            return;

        const data =
            daftar[daftar.length - 1];

        siswa.push(data);

    });

    /* Bersihkan */

    container.innerHTML = "";

    /* Jumlah siswa */

    const jumlah =
        document.createElement("div");

    jumlah.className =
        "jumlah-siswa-online";

    jumlah.innerHTML =
        `🟢 ${siswa.length} siswa sedang online`;

    container.appendChild(jumlah);

    /* Jika tidak ada */

    if (siswa.length === 0) {

        const kosong =
            document.createElement("div");

        kosong.className =
            "siswa-kosong";

        kosong.textContent =
            "Belum ada siswa yang online.";

        container.appendChild(kosong);

        return;
    }

    /* Daftar siswa */

    siswa.forEach(data => {

        const item =
            document.createElement("div");

        item.className =
            "siswa-online-item";

        item.innerHTML = `
            <div class="status-online">🟢</div>

            <div class="siswa-info">

                <div class="siswa-nama">
                    ${escapeHTML(data.nama)}
                </div>

                <div class="siswa-halaman">
                    📖 ${escapeHTML(
                        data.halaman || "Sedang belajar"
                    )}
                </div>

            </div>
        `;

        container.appendChild(item);

    });

}

/* ---------------------------------------------------------
   UBAH HALAMAN AKTIF
--------------------------------------------------------- */

async function updateHalamanSiswa(namaHalaman) {

    currentPage =
        namaHalaman;

    if (
        window.siswaPresenceChannel
    ) {

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

}

/* ---------------------------------------------------------
   KEAMANAN TEKS
--------------------------------------------------------- */

function escapeHTML(text) {

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}

/* ---------------------------------------------------------
   JALANKAN
--------------------------------------------------------- */

mulaiPresence();
