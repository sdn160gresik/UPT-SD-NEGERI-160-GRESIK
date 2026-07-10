/* ==========================================================
   HUD DIGITAL BOOK
   script.js
========================================================== */

"use strict";

/* ==========================================================
   KONFIGURASI
========================================================== */

// Ubah sesuai jumlah halaman HTML
const TOTAL_PAGE = 1;

let currentPage = 1;
let pages = [];

/* ==========================================================
   START
========================================================== */

document.addEventListener("DOMContentLoaded", async () => {

    await loadPages();

    initializeBook();

    initializeLightbox();

    initializeKeyboard();

});

/* ==========================================================
   LOAD SEMUA HALAMAN
========================================================== */

async function loadPages(){

    const book = document.getElementById("book");

    if(!book) return;

    for(let i = 1; i <= TOTAL_PAGE; i++){

        const filename =
            `pages/page${String(i).padStart(3,"0")}.html`;

        try{

            const response = await fetch(filename);

            if(!response.ok){

                console.warn("Tidak menemukan:", filename);

                continue;

            }

            const html = await response.text();

            book.insertAdjacentHTML("beforeend", html);

        }

        catch(error){

            console.error("Gagal memuat", filename);

        }

    }

}

/* ==========================================================
   INISIALISASI
========================================================== */

function initializeBook(){

    pages = [...document.querySelectorAll(".page")];

    if(pages.length === 0){

        console.warn("Tidak ada halaman ditemukan.");

        return;

    }

    document
        .getElementById("prevBtn")
        .addEventListener("click", previousPage);

    document
        .getElementById("nextBtn")
        .addEventListener("click", nextPage);

    showPage(1);

}

/* ==========================================================
   TAMPILKAN HALAMAN
========================================================== */

function showPage(number){

    currentPage = Math.max(
        1,
        Math.min(number, pages.length)
    );

    pages.forEach(page=>{

        page.classList.remove("active");

    });

    pages[currentPage-1]
        .classList.add("active");

    updateNavigation();

}

/* ==========================================================
   NAVIGASI
========================================================== */

function previousPage(){

    if(currentPage>1){

        showPage(currentPage-1);

    }

}

function nextPage(){

    if(currentPage<pages.length){

        showPage(currentPage+1);

    }

}

function updateNavigation(){

    document.getElementById("pageIndicator").textContent =
        `${currentPage} / ${pages.length}`;

    document.getElementById("prevBtn").disabled =
        currentPage===1;

    document.getElementById("nextBtn").disabled =
        currentPage===pages.length;

}

/* ==========================================================
   KEYBOARD
========================================================== */

function initializeKeyboard(){

    document.addEventListener("keydown",(event)=>{

        switch(event.key){

            case "ArrowLeft":

                previousPage();

                break;

            case "ArrowRight":

                nextPage();

                break;

            case "Escape":

                closeLightbox();

                break;

        }

    });

}

/* ==========================================================
   LIGHTBOX
========================================================== */

function initializeLightbox(){

    const lightbox =
        document.getElementById("lightbox");

    const preview =
        document.getElementById("lightbox-image");

    document.querySelectorAll("#book img").forEach(image=>{

        image.addEventListener("click",()=>{

            preview.src = image.src;

            lightbox.classList.add("show");

        });

    });

    document
        .querySelector(".close")
        .addEventListener("click", closeLightbox);

    lightbox.addEventListener("click",(event)=>{

        if(event.target===lightbox){

            closeLightbox();

        }

    });

}

/* ==========================================================
   CLOSE LIGHTBOX
========================================================== */

function closeLightbox(){

    document
        .getElementById("lightbox")
        .classList.remove("show");

}
