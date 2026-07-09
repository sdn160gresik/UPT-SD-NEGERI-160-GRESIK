/* HUD Edition - mempertahankan logika utama */
"use strict";

const TOTAL_PAGE = 2;
let currentPage = 1;

document.addEventListener("DOMContentLoaded", () => {
    loadBook();
    window.addEventListener("resize", fitHud);
});

async function loadBook() {
    const book = document.getElementById("book");
    if (!book) return;

    for (let i = 1; i <= TOTAL_PAGE; i++) {
        const filename = `pages/page${String(i).padStart(3, "0")}.html`;
        try {
            const res = await fetch(filename);
            if (!res.ok) continue;
            book.insertAdjacentHTML("beforeend", await res.text());
        } catch (e) {
            console.warn(e);
        }
    }

    initializeBook();
    fitHud();
}

function initializeBook() {
    initNavigation();
    initLightbox();
}

function fitHud(){
    const hud=document.querySelector(".hud-screen");
    const book=document.getElementById("book");
    if(hud && book){
        book.style.height=hud.clientHeight+"px";
    }
}

function initNavigation(){

    const pages=document.querySelectorAll(".page");
    const prev=document.getElementById("prevBtn");
    const next=document.getElementById("nextBtn");
    const indicator=document.getElementById("pageIndicator");

    function show(page){
        pages.forEach(p=>p.classList.remove("active"));
        if(!pages[page-1]) return;
        pages[page-1].classList.add("active");
        currentPage=page;
        indicator.textContent=`${page} / ${pages.length}`;
        prev.disabled=(page===1);
        next.disabled=(page===pages.length);
    }

    prev.addEventListener("click",()=>{if(currentPage>1)show(currentPage-1)});
    next.addEventListener("click",()=>{if(currentPage<pages.length)show(currentPage+1)});

    document.addEventListener("keydown",(e)=>{
        if(e.key==="ArrowLeft" && currentPage>1)show(currentPage-1);
        if(e.key==="ArrowRight" && currentPage<pages.length)show(currentPage+1);
    });

    show(1);
}

function initLightbox(){

    const lightbox=document.getElementById("lightbox");
    const preview=document.getElementById("lightbox-image");
    const close=document.querySelector(".close");

    function bindImages(){
        document.querySelectorAll(".image-frame img,img").forEach(img=>{
            img.onclick=()=>{
                preview.src=img.src;
                preview.alt=img.alt;
                lightbox.classList.add("show");
                document.body.style.overflow="hidden";
            }
        });
    }

    bindImages();

    close.onclick=closeBox;

    lightbox.onclick=(e)=>{
        if(e.target===lightbox)closeBox();
    };

    document.addEventListener("keydown",(e)=>{
        if(e.key==="Escape")closeBox();
    });

    function closeBox(){
        lightbox.classList.remove("show");
        preview.src="";
        document.body.style.overflow="";
    }
}

function scrollToPage(page){
    const pages=document.querySelectorAll(".page");
    if(page<1||page>pages.length)return;
    pages[page-1].scrollIntoView({behavior:"smooth"});
}

function findPage(keyword){
    keyword=keyword.toLowerCase();
    document.querySelectorAll(".page").forEach(page=>{
        if(page.innerText.toLowerCase().includes(keyword)){
            page.scrollIntoView({behavior:"smooth"});
        }
    });
}
