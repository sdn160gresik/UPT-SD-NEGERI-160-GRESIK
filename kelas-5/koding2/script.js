/* script.js - HUD Book Viewer */
"use strict";

const TOTAL_PAGE = 1; // ubah sesuai jumlah halaman
let currentPage = 1;

document.addEventListener("DOMContentLoaded", async () => {
  await loadBook();
  fitHud();
  window.addEventListener("resize", fitHud);
});

async function loadBook() {
  const book = document.getElementById("book");
  if (!book) return;

  for (let i = 1; i <= TOTAL_PAGE; i++) {
    const file = `pages/page${String(i).padStart(3,"0")}.html`;
    try {
      const res = await fetch(file);
      if (!res.ok) continue;
      book.insertAdjacentHTML("beforeend", await res.text());
    } catch(e) {
      console.error("Gagal memuat", file, e);
    }
  }
  initializeBook();
}

function initializeBook(){
  const pages=[...document.querySelectorAll(".page")];
  const prev=document.getElementById("prevBtn");
  const next=document.getElementById("nextBtn");
  const indicator=document.getElementById("pageIndicator");

  function show(n){
    if(!pages.length) return;
    pages.forEach(p=>p.classList.remove("active"));
    currentPage=Math.max(1,Math.min(n,pages.length));
    pages[currentPage-1].classList.add("active");
    indicator.textContent=`${currentPage} / ${pages.length}`;
    prev.disabled=currentPage===1;
    next.disabled=currentPage===pages.length;
  }

  prev.onclick=()=>show(currentPage-1);
  next.onclick=()=>show(currentPage+1);

  document.addEventListener("keydown",e=>{
    if(e.key==="ArrowLeft") prev.click();
    if(e.key==="ArrowRight") next.click();
    if(e.key==="Escape") closeLightbox();
  });

  initLightbox();
  show(1);
}

function fitHud(){
  const book=document.getElementById("book");
  const nav=document.querySelector(".navigation");
  if(book && nav){
    book.style.paddingBottom=(nav.offsetHeight+20)+"px";
  }
}

function initLightbox(){
  document.querySelectorAll("#book img").forEach(img=>{
    img.addEventListener("click",()=>{
      document.getElementById("lightbox-image").src=img.src;
      document.getElementById("lightbox").classList.add("show");
    });
  });
  document.querySelector(".close").onclick=closeLightbox;
  document.getElementById("lightbox").onclick=e=>{
    if(e.target.id==="lightbox") closeLightbox();
  };
}

function closeLightbox(){
  document.getElementById("lightbox").classList.remove("show");
}
