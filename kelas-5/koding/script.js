/* ==========================================================
   Buku Digital
   script.js
========================================================== */

"use strict";

/* ==========================================================
   KONFIGURASI
========================================================== */

// Jumlah halaman buku
// Jika nanti ada halaman baru,
// cukup ubah angka ini.

const TOTAL_PAGE = 2;

/*
Contoh

2  = page001 - page002

10 = page001 - page010

150 = page001 - page150

*/

let currentPage = 1;
/* ==========================================================
   LOAD HALAMAN
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadBook();

});


async function loadBook() {

    const book = document.getElementById("book");

    if (!book) return;

    for (let i = 1; i <= TOTAL_PAGE; i++) {

        const filename =
            `pages/page${String(i).padStart(3, "0")}.html`;

        try {

            const response = await fetch(filename);

            if (!response.ok) {

                console.warn(filename + " tidak ditemukan.");

                continue;

            }

            const html = await response.text();

            book.insertAdjacentHTML(
                "beforeend",
                html
            );

        }

        catch (err) {

            console.error(
                "Gagal memuat : ",
                filename,
                err
            );

        }

    }

    initializeBook();

}


/* ==========================================================
   INISIALISASI
========================================================== */

function initializeBook() {

    initLightbox();
initNavigation();
   initLightbox();
}



function initNavigation(){

    const pages =
        document.querySelectorAll(".page");

    const prevBtn =
        document.getElementById("prevBtn");

    const nextBtn =
        document.getElementById("nextBtn");

    const indicator =
        document.getElementById("pageIndicator");

    function showPage(page){

        pages.forEach(item=>{

            item.classList.remove("active");

        });

        pages[page-1].classList.add("active");

        currentPage=page;

        indicator.textContent=
            `${currentPage} / ${pages.length}`;

        prevBtn.disabled=
            currentPage===1;

        nextBtn.disabled=
            currentPage===pages.length;

    }

    prevBtn.addEventListener("click",()=>{

        if(currentPage>1){

            showPage(currentPage-1);

        }

    });

    nextBtn.addEventListener("click",()=>{

        if(currentPage<pages.length){

            showPage(currentPage+1);

        }

    });

    document.addEventListener("keydown",e=>{

        if(e.key==="ArrowLeft"){

            if(currentPage>1){

                showPage(currentPage-1);

            }

        }

        if(e.key==="ArrowRight"){

            if(currentPage<pages.length){

                showPage(currentPage+1);

            }

        }

    });

    showPage(1);

}
/* ==========================================================
   LIGHTBOX
========================================================== */

function initLightbox() {

    const lightbox =
        document.getElementById("lightbox");

    const preview =
        document.getElementById("lightbox-image");

    const close =
        document.querySelector(".close");

    if (!lightbox || !preview) return;



    const images =
        document.querySelectorAll(
            ".image-frame img, img"
        );



    images.forEach(image => {

        image.addEventListener("click", () => {

            preview.src = image.src;

            preview.alt = image.alt;

            lightbox.classList.add("show");

            document.body.style.overflow = "hidden";

        });

    });



    if (close) {

        close.addEventListener(
            "click",
            closeLightbox
        );

    }



    lightbox.addEventListener(
        "click",
        function (e) {

            if (e.target === lightbox) {

                closeLightbox();

            }

        }
    );



    document.addEventListener(
        "keydown",
        function (e) {

            if (e.key === "Escape") {

                closeLightbox();

            }

        }
    );



    function closeLightbox() {

        lightbox.classList.remove("show");

        preview.src = "";

        document.body.style.overflow = "";

    }

}


/* ==========================================================
   FUNGSI TAMBAHAN
========================================================== */

/*
Scroll ke halaman tertentu

scrollToPage(5)

*/

function scrollToPage(page) {

    const pages =
        document.querySelectorAll(".page");

    if (page < 1) return;

    if (page > pages.length) return;

    pages[page - 1].scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}



/*
Mencari halaman

findPage("Bab 2")

*/

function findPage(keyword) {

    keyword = keyword.toLowerCase();

    const pages =
        document.querySelectorAll(".page");

    pages.forEach(page => {

        if (
            page.innerText
                .toLowerCase()
                .includes(keyword)
        ) {

            page.scrollIntoView({

                behavior: "smooth"

            });

        }

    });

}
