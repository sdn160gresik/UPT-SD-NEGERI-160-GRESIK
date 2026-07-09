// Premium Digital Book Viewer
document.addEventListener("DOMContentLoaded",()=>{
loadBook();
initToolbar();
});

async function loadBook(){
const book=document.getElementById("book");
const prev=document.getElementById("prevBtn");
const next=document.getElementById("nextBtn");
const indicator=document.getElementById("pageIndicator");
const pageText=document.getElementById("pageText");
const progress=document.getElementById("progressFill");
let pages=[],i=1,current=Number(localStorage.getItem("page")||0);

while(true){
 try{
   const f=`pages/page${String(i).padStart(3,"0")}.html`;
   const r=await fetch(f);
   if(!r.ok)break;
   book.insertAdjacentHTML("beforeend",await r.text());
   i++;
 }catch{break;}
}
pages=[...document.querySelectorAll(".page")];
pages.forEach(p=>{
 p.querySelectorAll("img").forEach(img=>{
   img.loading="lazy";
   img.onclick=()=>openLightbox(img.src);
 });
});
function show(){
 pages.forEach((p,n)=>p.classList.toggle("active",n===current));
 indicator.textContent=`${current+1} / ${pages.length}`;
 if(pageText)pageText.textContent=`${current+1} dari ${pages.length}`;
 if(progress)progress.style.width=((current+1)/pages.length*100)+"%";
 prev.disabled=current==0;
 next.disabled=current==pages.length-1;
 localStorage.setItem("page",current);
}
prev.onclick=()=>{if(current>0){current--;show();}};
next.onclick=()=>{if(current<pages.length-1){current++;show();}};
document.addEventListener("keydown",e=>{
 if(e.key==="ArrowRight")next.click();
 if(e.key==="ArrowLeft")prev.click();
});
let sx=0;
book.addEventListener("touchstart",e=>sx=e.changedTouches[0].clientX);
book.addEventListener("touchend",e=>{
 let dx=e.changedTouches[0].clientX-sx;
 if(dx<-60)next.click();
 if(dx>60)prev.click();
});
show();
hideLoading();
}
function initToolbar(){
let scale=1;
document.getElementById("zoomInBtn")?.addEventListener("click",()=>{
 scale=Math.min(scale+.1,2);
 document.getElementById("book").style.transform=`scale(${scale})`;
});
document.getElementById("zoomOutBtn")?.addEventListener("click",()=>{
 scale=Math.max(scale-.1,.8);
 document.getElementById("book").style.transform=`scale(${scale})`;
});
document.getElementById("fullscreenBtn")?.addEventListener("click",()=>{
 if(!document.fullscreenElement)document.documentElement.requestFullscreen();
 else document.exitFullscreen();
});
document.querySelectorAll("button").forEach(btn=>{
 btn.addEventListener("click",ripple);
});
}
function ripple(e){
 const b=e.currentTarget;
 const s=document.createElement("span");
 s.style.position="absolute";
 s.style.borderRadius="50%";
 s.style.background="rgba(255,255,255,.5)";
 s.style.width=s.style.height="20px";
 s.style.left=e.offsetX+"px";
 s.style.top=e.offsetY+"px";
 s.animate([{transform:"scale(0)"},{transform:"scale(12)",opacity:0}],{duration:500});
 b.appendChild(s);
 setTimeout(()=>s.remove(),500);
}
function openLightbox(src){
 const lb=document.getElementById("lightbox");
 const img=document.getElementById("lightbox-image");
 if(!lb||!img)return;
 img.src=src;
 lb.style.display="flex";
}
document.querySelector(".close")?.addEventListener("click",()=>document.getElementById("lightbox").style.display="none");
function hideLoading(){
 setTimeout(()=>{
 const l=document.getElementById("loadingScreen");
 if(l)l.style.display="none";
 },600);
}
