/* ==========================================================
   HUD DIGITAL BOOK
   script.js
========================================================== */
"use strict";

const TOTAL_PAGE = 1; // ubah sesuai jumlah halaman

let currentPage = 1;
let pages = [];

document.addEventListener("DOMContentLoaded", async () => {
    await loadPages();
    initializeBook();
    initializeLightbox();
    initializeKeyboard();
    initializeTouch();
});

async function loadPages(){
    const book=document.getElementById("book");
    if(!book) return;

    for(let i=1;i<=TOTAL_PAGE;i++){
        const file=`pages/page${String(i).padStart(3,"0")}.html`;
        try{
            const res=await fetch(file);
            if(!res.ok) continue;
            book.insertAdjacentHTML("beforeend",await res.text());
        }catch(e){
            console.error(e);
        }
    }
}

function initializeBook(){
    pages=[...document.querySelectorAll(".page")];
    if(!pages.length) return;

    document.getElementById("prevBtn").onclick=previousPage;
    document.getElementById("nextBtn").onclick=nextPage;

    showPage(1);
}

function showPage(n){
    currentPage=Math.max(1,Math.min(n,pages.length));

    pages.forEach(p=>p.classList.remove("active"));
    pages[currentPage-1].classList.add("active");

    document.getElementById("pageIndicator").textContent=
        `${currentPage} / ${pages.length}`;

    document.getElementById("prevBtn").disabled=currentPage===1;
    document.getElementById("nextBtn").disabled=currentPage===pages.length;

    document.getElementById("book").scrollTop=0;
}

function previousPage(){
    if(currentPage>1) showPage(currentPage-1);
}

function nextPage(){
    if(currentPage<pages.length) showPage(currentPage+1);
}

function initializeKeyboard(){
    document.addEventListener("keydown",e=>{
        if(e.key==="ArrowLeft") previousPage();
        if(e.key==="ArrowRight") nextPage();
        if(e.key==="Escape") closeLightbox();
    });
}

function initializeTouch(){
    let startX=0;

    document.getElementById("book").addEventListener("touchstart",e=>{
        startX=e.changedTouches[0].clientX;
    });

    document.getElementById("book").addEventListener("touchend",e=>{
        const endX=e.changedTouches[0].clientX;
        const diff=endX-startX;

        if(diff>80) previousPage();
        if(diff<-80) nextPage();
    });
}

function initializeLightbox(){

    const lightbox=document.getElementById("lightbox");
    const preview=document.getElementById("lightbox-image");

    document.querySelectorAll("#book img").forEach(img=>{

        img.onclick=()=>{

            preview.src=img.src;
            lightbox.classList.add("show");

        };

    });

    document.querySelector(".close").onclick=closeLightbox;

    lightbox.onclick=e=>{
        if(e.target===lightbox) closeLightbox();
    };

}

function closeLightbox(){

    document.getElementById("lightbox")
        .classList.remove("show");

}
