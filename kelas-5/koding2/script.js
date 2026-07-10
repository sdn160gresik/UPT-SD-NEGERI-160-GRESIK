/* ==========================================================
   Futuristic Digital Book
   script.js
========================================================== */

"use strict";

/* ==========================================================
   CONFIG
========================================================== */

const CONFIG = {

    TOTAL_PAGE: 1,          // Ubah sesuai jumlah halaman
    PAGE_FOLDER: "pages",
    PAGE_PREFIX: "page",
    PAGE_EXTENSION: ".html",

    ANIMATION_TIME: 250

};

/* ==========================================================
   STATE
========================================================== */

const Book = {

    currentPage: 1,

    totalPage: 0,

    pages: [],

    book: null,

    prev: null,

    next: null,

    indicator: null

};

/* ==========================================================
   START
========================================================== */

document.addEventListener("DOMContentLoaded", init);

/* ==========================================================
   INITIALIZE
========================================================== */

async function init() {

    Book.book = document.getElementById("book");
    Book.prev = document.getElementById("prevBtn");
    Book.next = document.getElementById("nextBtn");
    Book.indicator = document.getElementById("pageIndicator");

    await loadPages();

    bindNavigation();

    bindKeyboard();

    bindSwipe();

    bindLightbox();

    updateLayout();

    window.addEventListener("resize", updateLayout);

}

/* ==========================================================
   LOAD PAGES
========================================================== */

async function loadPages() {

    for (let i = 1; i <= CONFIG.TOTAL_PAGE; i++) {

        const file =
            `${CONFIG.PAGE_FOLDER}/` +
            `${CONFIG.PAGE_PREFIX}${String(i).padStart(3, "0")}` +
            `${CONFIG.PAGE_EXTENSION}`;

        try {

            const response = await fetch(file);

            if (!response.ok) continue;

            const html = await response.text();

            Book.book.insertAdjacentHTML("beforeend", html);

        }

        catch (error) {

            console.error(file, error);

        }

    }

    Book.pages = [...document.querySelectorAll(".page")];

    Book.totalPage = Book.pages.length;

    showPage(1);

}

/* ==========================================================
   SHOW PAGE
========================================================== */

function showPage(index) {

    if (!Book.pages.length) return;

    index = Math.max(1, Math.min(index, Book.totalPage));

    Book.pages.forEach(page => {

        page.classList.remove("active");

    });

    Book.currentPage = index;

    const page = Book.pages[index - 1];

    page.classList.add("active");

    page.scrollTop = 0;

    updateNavigation();

}

/* ==========================================================
   UPDATE NAVIGATION
========================================================== */

function updateNavigation() {

    Book.indicator.textContent =
        `${Book.currentPage} / ${Book.totalPage}`;

    Book.prev.disabled =
        Book.currentPage === 1;

    Book.next.disabled =
        Book.currentPage === Book.totalPage;

}

/* ==========================================================
   EVENTS
========================================================== */

function bindNavigation() {

    Book.prev.addEventListener("click", () => {

        previousPage();

    });

    Book.next.addEventListener("click", () => {

        nextPage();

    });

}

function bindKeyboard() {

    document.addEventListener("keydown", event => {

        switch (event.key) {

            case "ArrowLeft":

                previousPage();

                break;

            case "ArrowRight":

                nextPage();

                break;

            case "Home":

                showPage(1);

                break;

            case "End":

                showPage(Book.totalPage);

                break;

            case "Escape":

                closeLightbox();

                break;

        }

    });

}

/* ==========================================================
   NEXT / PREVIOUS
========================================================== */

function nextPage() {

    if (Book.currentPage < Book.totalPage) {

        showPage(Book.currentPage + 1);

    }

}

function previousPage() {

    if (Book.currentPage > 1) {

        showPage(Book.currentPage - 1);

    }

}

/* ==========================================================
   SWIPE
========================================================== */

function bindSwipe() {

    let startX = 0;

    let endX = 0;

    Book.book.addEventListener("touchstart", e => {

        startX = e.changedTouches[0].clientX;

    });

    Book.book.addEventListener("touchend", e => {

        endX = e.changedTouches[0].clientX;

        const distance = endX - startX;

        if (Math.abs(distance) < 80) return;

        if (distance > 0) {

            previousPage();

        } else {

            nextPage();

        }

    });

}

/* ==========================================================
   LIGHTBOX
========================================================== */

function bindLightbox() {

    const lightbox = document.getElementById("lightbox");

    const image = document.getElementById("lightbox-image");

    Book.book.addEventListener("click", event => {

        if (!event.target.matches("img")) return;

        image.src = event.target.src;

        lightbox.classList.add("show");

        lightbox.setAttribute("aria-hidden", "false");

    });

    document.querySelector(".close").addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", event => {

        if (event.target === lightbox) {

            closeLightbox();

        }

    });

}

function closeLightbox() {

    const lightbox = document.getElementById("lightbox");

    lightbox.classList.remove("show");

    lightbox.setAttribute("aria-hidden", "true");

}

/* ==========================================================
   LAYOUT
========================================================== */

function updateLayout() {

    const nav = document.querySelector(".navigation");

    Book.book.style.paddingBottom =
        (nav.offsetHeight + 30) + "px";

}

/* ==========================================================
   PUBLIC API
========================================================== */

window.BookViewer = {

    next: nextPage,

    previous: previousPage,

    goTo: showPage

};
