document.addEventListener("DOMContentLoaded", loadBook);

async function loadBook(){

    const book=document.getElementById("book");
    const prevBtn=document.getElementById("prevBtn");
    const nextBtn=document.getElementById("nextBtn");
    const indicator=document.getElementById("pageIndicator");

    let pages=[];
    let i=1;

    while(true){

        const file=`pages/page${String(i).padStart(3,"0")}.html`;

        try{

            const res=await fetch(file);

            if(!res.ok) break;

            book.insertAdjacentHTML("beforeend",await res.text());

            i++;

        }catch(e){

            break;

        }

    }

    pages=[...document.querySelectorAll(".page")];

    let current=0;

    function showPage(){

        pages.forEach((p,index)=>{

            p.classList.toggle("active",index===current);

        });

        indicator.textContent=`${current+1} / ${pages.length}`;

        prevBtn.disabled=current===0;
        nextBtn.disabled=current===pages.length-1;

        book.scrollTop=0;

    }

    prevBtn.onclick=()=>{

        if(current>0){

            current--;

            showPage();

        }

    }

    nextBtn.onclick=()=>{

        if(current<pages.length-1){

            current++;

            showPage();

        }

    }

    document.addEventListener("keydown",(e)=>{

        if(e.key==="ArrowRight") nextBtn.click();

        if(e.key==="ArrowLeft") prevBtn.click();

    });

    showPage();

}