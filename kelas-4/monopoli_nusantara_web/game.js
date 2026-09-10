(() => {
  const COLORS = ['#e34334','#2a7a9d','#2f8b51','#d29b25','#7952a5','#d35b86'];
  const TOKENS = ['🦎','⛵','🎭','🏯','🎋','🪭'];
  const DIE = ['⚀','⚁','⚂','⚃','⚄','⚅'];
  const SAVE_KEY = 'monopoli-nusantara-v1';

  const spaces = [
    {name:'GO', type:'go'},
    {name:'Keberuntungan', type:'chance'},
    {name:'Candi Prambanan', type:'property', region:'Yogyakarta', price:240, rent:60},
    {name:'Tari Legong', type:'property', region:'Bali', price:200, rent:50},
    {name:'Kapal Pinisi', type:'property', region:'Sulawesi Selatan', price:240, rent:60},
    {name:'Dana Budaya', type:'quiz'},
    {name:'Lombok', type:'property', region:'NTB', price:200, rent:50},
    {name:'Angklung', type:'property', region:'Jawa Barat', price:180, rent:40},
    {name:'Hanya Kunjungan', type:'visit'},
    {name:'Pantai Parangtritis', type:'property', region:'Yogyakarta', price:200, rent:50},
    {name:'Tari Jaipong', type:'property', region:'Jawa Barat', price:180, rent:40},
    {name:'Dana Budaya', type:'quiz'},
    {name:'Kerajinan Batik', type:'property', region:'Yogyakarta', price:180, rent:40},
    {name:'Reog Ponorogo', type:'property', region:'Jawa Timur', price:200, rent:50},
    {name:'Parkir Gratis', type:'parking'},
    {name:'Tari Kecak', type:'property', region:'Bali', price:200, rent:50},
    {name:'Candi Borobudur', type:'property', region:'Jawa Tengah', price:240, rent:60},
    {name:'Rumah Gadang', type:'property', region:'Sumatera Barat', price:220, rent:60},
    {name:'Dana Budaya', type:'quiz'},
    {name:'Tari Saman', type:'property', region:'Aceh', price:220, rent:50},
    {name:'Kerajinan Tenun', type:'property', region:'NTT', price:200, rent:50},
    {name:'Pulau Komodo', type:'property', region:'NTT', price:260, rent:60},
    {name:'Ayo Berkunjung!', type:'goto'},
    {name:'Toraja', type:'property', region:'Sulawesi Selatan', price:220, rent:50},
    {name:'Dana Budaya', type:'quiz'},
    {name:'Kebun Raya Bogor', type:'property', region:'Jawa Barat', price:200, rent:50},
    {name:'Tari Pakarena', type:'property', region:'Sulawesi Selatan', price:180, rent:40},
    {name:'Kuliner Rendang', type:'property', region:'Sumatera Barat', price:200, rent:50}
  ];

  // Center points measured against the 1536x1024 uploaded board image.
  const posPx = [
    [1215,903],[1110,904],[1005,904],[899,904],[792,904],[680,904],[568,904],[458,904],
    [250,902],[245,720],[244,607],[244,490],[244,368],[244,236],[272,86],
    [388,88],[500,88],[611,88],[719,88],[835,88],[949,88],[1061,88],[1200,89],
    [1192,230],[1193,349],[1194,480],[1193,606],[1192,725]
  ].map(([x,y]) => ({x:x/1536*100,y:y/1024*100}));

  const chanceCards = [
    {title:'Pertunjukan Wayang', text:'Pertunjukan wayang membawamu hoki! Terima dari Bank.', amount:200, image:'assets/chance/chance-1.jpg'},
    {title:'Rumah Gadang', text:'Kamu diundang ke rumah gadang dalam acara adat. Terima dari Bank.', amount:150, image:'assets/chance/chance-2.jpg'},
    {title:'Tarian Daerah', text:'Tarian daerah membawa keberuntungan bagimu! Terima dari Bank.', amount:100, image:'assets/chance/chance-3.jpg'},
    {title:'Kapal Pinisi', text:'Perdagangan lancar dengan kapal pinisi! Terima dari Bank.', amount:150, image:'assets/chance/chance-4.jpg'},
    {title:'Peninggalan Bersejarah', text:'Kamu menemukan peninggalan bersejarah yang bernilai! Terima dari Bank.', amount:250, image:'assets/chance/chance-5.jpg'},
    {title:'Reog Ponorogo', text:'Penampilan hebat Reog membuatmu terkenal! Terima dari Bank.', amount:200, image:'assets/chance/chance-6.jpg'},
    {title:'Batik', text:'Batik karyamu laris manis di pasaran! Terima dari Bank.', amount:150, image:'assets/chance/chance-7.jpg'},
    {title:'Angklung', text:'Permainan angklung mendatangkan rezeki! Terima dari Bank.', amount:100, image:'assets/chance/chance-8.jpg'},
    {title:'Syukuran', text:'Kamu diundang ke acara syukuran penuh berkah! Terima dari Bank.', amount:150, image:'assets/chance/chance-9.jpg'},
    {title:'Keramahan', text:'Keramahanmu dihargai semua orang! Terima dari Bank.', amount:100, image:'assets/chance/chance-10.jpg'}
  ];

  const quizzes = [
    {q:'Urutkan 2.450, 1.875, 3.200, 2.125 dari terkecil ke terbesar.', options:['1.875 – 2.125 – 2.450 – 3.200','1.875 – 2.450 – 2.125 – 3.200','2.125 – 1.875 – 2.450 – 3.200','3.200 – 2.450 – 2.125 – 1.875'], answer:0, image:'assets/quiz/quiz-1.jpg'},
    {q:'Jumlah motif batik yang dikumpulkan adalah 4.250 dan 4.205. Bilangan yang lebih besar adalah …', options:['4.025','4.205','4.250','4.502'], answer:2, image:'assets/quiz/quiz-2.jpg'},
    {q:'Urutkan 7.125, 6.950, 7.500, 6.875 dari terbesar ke terkecil.', options:['6.875 – 6.950 – 7.125 – 7.500','7.500 – 7.125 – 6.950 – 6.875','7.125 – 7.500 – 6.950 – 6.875','7.500 – 6.875 – 6.950 – 7.125'], answer:1, image:'assets/quiz/quiz-3.jpg'},
    {q:'Manakah tanda yang benar? 3.650 … 3.605', options:['<','>','=','≤'], answer:1, image:'assets/quiz/quiz-4.jpg'},
    {q:'Pilih bilangan yang paling kecil.', options:['8.120','8.201','8.012','8.210'], answer:2, image:'assets/quiz/quiz-5.jpg'},
    {q:'Urutkan 9.100, 8.999, 9.010, 8.909 dari terkecil ke terbesar.', options:['8.909 – 8.999 – 9.010 – 9.100','8.999 – 8.909 – 9.010 – 9.100','9.100 – 9.010 – 8.999 – 8.909','8.909 – 9.010 – 8.999 – 9.100'], answer:0, image:'assets/quiz/quiz-6.jpg'},
    {q:'Manakah tanda yang tepat? 5.678 … 5.687', options:['>','<','=','≥'], answer:1, image:'assets/quiz/quiz-7.jpg'},
    {q:'Bilangan 6.450 dibandingkan dengan 6.405 adalah …', options:['6.450 lebih kecil','6.450 lebih besar','Kedua bilangan sama','6.405 lebih besar'], answer:1, image:'assets/quiz/quiz-8.jpg'},
    {q:'Susun 2.999, 9.999, 5.999, 7.999 dari terbesar ke terkecil.', options:['9.999 – 7.999 – 5.999 – 2.999','2.999 – 5.999 – 7.999 – 9.999','9.999 – 5.999 – 7.999 – 2.999','7.999 – 9.999 – 5.999 – 2.999'], answer:0, image:'assets/quiz/quiz-9.jpg'},
    {q:'Pilih bilangan yang berada di antara 4.500 dan 5.000.', options:['4.250','4.750','5.250','3.750'], answer:1, image:'assets/quiz/quiz-10.jpg'},
    {q:'Manakah urutan 1.250, 1.025, 1.520, 1.205 dari terkecil ke terbesar?', options:['1.025 – 1.205 – 1.250 – 1.520','1.025 – 1.250 – 1.205 – 1.520','1.520 – 1.250 – 1.205 – 1.025','1.205 – 1.025 – 1.250 – 1.520'], answer:0, image:'assets/quiz/quiz-11.jpg'},
    {q:'Pilih pernyataan yang benar. 9.875 … 9.857', options:['9.875 < 9.857','9.875 > 9.857','9.875 = 9.857','9.875 ≤ 9.857'], answer:1, image:'assets/quiz/quiz-12.jpg'}
  ];

  let state = null;
  let pendingProperty = null;
  let extraTurn = false;
  let inputCount = 2;

  const $ = (id) => document.getElementById(id);
  const els = {
    setupModal:$('setupModal'), playerInputs:$('playerInputs'), addPlayerBtn:$('addPlayerBtn'), startBtn:$('startBtn'), resumeBtn:$('resumeBtn'), roundLimit:$('roundLimit'),
    rollBtn:$('rollBtn'), endTurnBtn:$('endTurnBtn'), propertyActions:$('propertyActions'), buyBtn:$('buyBtn'), skipBuyBtn:$('skipBuyBtn'),
    die1:$('die1'), die2:$('die2'), diceTotal:$('diceTotal'), turnName:$('turnName'), roundPill:$('roundPill'), statusText:$('statusText'), turnBadge:$('turnBadge'),
    playersList:$('playersList'), activityLog:$('activityLog'), tokensLayer:$('tokensLayer'), ownershipLayer:$('ownershipLayer'),
    eventModal:$('eventModal'), eventContent:$('eventContent'), eventCloseBtn:$('eventCloseBtn'),
    rulesModal:$('rulesModal'), rulesBtn:$('rulesBtn'), rulesCloseBtn:$('rulesCloseBtn'), rulesOkBtn:$('rulesOkBtn'),
    fullscreenBtn:$('fullscreenBtn'), endGameBtn:$('endGameBtn'), winnerModal:$('winnerModal'), winnerTitle:$('winnerTitle'), rankingList:$('rankingList'), playAgainBtn:$('playAgainBtn')
  };

  function money(n){ return `M${Number(n).toLocaleString('id-ID')}`; }
  function currentPlayer(){ return state?.players[state.currentIndex]; }
  function randomInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
  function log(message){
    if(!state) return;
    state.log.unshift({message, time:Date.now()});
    state.log = state.log.slice(0,24);
    renderLog(); save();
  }

  function renderPlayerInputs(){
    els.playerInputs.innerHTML='';
    for(let i=0;i<inputCount;i++){
      const row=document.createElement('div'); row.className='player-input-row';
      row.innerHTML=`
        <div class="player-color" style="background:${COLORS[i]}">${TOKENS[i]}</div>
        <input class="name-input" maxlength="18" data-player-index="${i}" value="Pemain ${i+1}" aria-label="Nama pemain ${i+1}" />
        <button class="remove-player" data-remove="${i}" ${inputCount<=2?'disabled':''}>×</button>`;
      els.playerInputs.appendChild(row);
    }
    els.addPlayerBtn.disabled = inputCount>=6;
    els.playerInputs.querySelectorAll('[data-remove]').forEach(btn=>btn.addEventListener('click',()=>{
      if(inputCount>2){ inputCount--; renderPlayerInputs(); }
    }));
  }

  function newGame(){
    const inputs=[...els.playerInputs.querySelectorAll('.name-input')];
    const names=inputs.map((i,idx)=>i.value.trim()||`Pemain ${idx+1}`);
    state={
      version:1,
      players:names.map((name,i)=>({id:i,name,color:COLORS[i],token:TOKENS[i],pos:0,cash:1500,properties:[],active:true})),
      currentIndex:0, round:1, maxRounds:Number(els.roundLimit.value), owners:{}, log:[], phase:'roll', lastDice:[1,1], quizOrder:shuffle([...Array(quizzes.length).keys()]), quizCursor:0, chanceOrder:shuffle([...Array(chanceCards.length).keys()]), chanceCursor:0
    };
    pendingProperty=null; extraTurn=false;
    els.setupModal.classList.remove('show');
    els.winnerModal.classList.remove('show');
    log(`Game dimulai dengan ${state.players.length} pemain.`);
    renderAll();
  }

  function shuffle(arr){
    for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; }
    return arr;
  }

  function save(){
    if(!state) return;
    localStorage.setItem(SAVE_KEY,JSON.stringify(state));
    els.resumeBtn.classList.remove('hidden');
  }

  function resumeGame(){
    try{
      const parsed=JSON.parse(localStorage.getItem(SAVE_KEY));
      if(!parsed || !parsed.players) return;
      state=parsed; pendingProperty=null; extraTurn=false;
      state.phase='roll';
      els.setupModal.classList.remove('show');
      log('Game tersimpan dilanjutkan.');
      renderAll();
    }catch(e){ console.warn(e); }
  }

  function renderAll(){ renderBoard(); renderSidebar(); renderControls(); save(); }

  function renderBoard(){
    if(!state) return;
    els.tokensLayer.innerHTML='';
    const groups={};
    state.players.forEach(p=>{ if(!p.active)return; (groups[p.pos] ||= []).push(p); });
    Object.entries(groups).forEach(([pos,players])=>{
      players.forEach((p,idx)=>{
        const base=posPx[Number(pos)];
        const count=players.length;
        const angle=(Math.PI*2*idx)/Math.max(count,1)-Math.PI/2;
        const radius=count>1?12:0;
        const dx=Math.cos(angle)*radius, dy=Math.sin(angle)*radius;
        const t=document.createElement('div');
        t.className='token'+(p.id===currentPlayer()?.id?' active-turn':'');
        t.style.background=p.color;
        t.style.left=`calc(${base.x}% + ${dx}px)`;
        t.style.top=`calc(${base.y}% + ${dy}px)`;
        t.textContent=p.token;
        t.title=`${p.name} — ${spaces[p.pos].name}`;
        els.tokensLayer.appendChild(t);
      });
    });

    els.ownershipLayer.innerHTML='';
    Object.entries(state.owners).forEach(([spaceIndex,playerId])=>{
      const p=state.players.find(x=>x.id===Number(playerId)); if(!p) return;
      const base=posPx[Number(spaceIndex)];
      const d=document.createElement('div'); d.className='owner-dot'; d.style.background=p.color;
      d.style.left=`calc(${base.x}% + 19px)`; d.style.top=`calc(${base.y}% - 17px)`;
      d.title=`Milik ${p.name}`; els.ownershipLayer.appendChild(d);
    });
    els.turnBadge.textContent = currentPlayer()? `${currentPlayer().token} ${currentPlayer().name} • ${spaces[currentPlayer().pos].name}`:'Siap bermain';
  }

  function renderSidebar(){
    if(!state) return;
    const p=currentPlayer();
    els.turnName.textContent=p?.name||'—';
    els.roundPill.textContent=`Ronde ${state.round}/${state.maxRounds}`;
    els.playersList.innerHTML='';
    state.players.forEach(pl=>{
      const row=document.createElement('div');
      row.className='player-row'+(pl.id===p?.id?' current':'')+(!pl.active?' out':'');
      row.innerHTML=`<div class="player-icon" style="background:${pl.color}">${pl.token}</div>
      <div class="player-meta"><strong>${escapeHtml(pl.name)}${!pl.active?' — bangkrut':''}</strong><span>${pl.properties.length} properti • ${spaces[pl.pos].name}</span></div>
      <div class="player-money"><strong>${money(pl.cash)}</strong><span>tunai</span></div>`;
      els.playersList.appendChild(row);
    });
    els.die1.textContent=DIE[(state.lastDice?.[0]||1)-1]; els.die2.textContent=DIE[(state.lastDice?.[1]||1)-1];
    els.diceTotal.textContent=state.phase==='roll'?'—':(state.lastDice?.reduce((a,b)=>a+b,0)||'—');
    renderLog();
  }

  function renderLog(){
    if(!state) return;
    els.activityLog.innerHTML = state.log.length? state.log.slice(0,8).map(x=>`<div class="log-item">${x.message}</div>`).join(''):'<div class="log-item">Belum ada aktivitas.</div>';
  }

  function renderControls(){
    if(!state) return;
    const p=currentPlayer();
    els.rollBtn.disabled = state.phase!=='roll' || !p?.active;
    els.endTurnBtn.classList.toggle('hidden',state.phase!=='done');
    els.propertyActions.classList.toggle('hidden',state.phase!=='buy');
    if(state.phase==='roll') els.statusText.textContent=`${p.name}, kocok dua dadu untuk bergerak.`;
    if(state.phase==='buy' && pendingProperty){ const s=spaces[pendingProperty]; els.buyBtn.textContent=`Beli ${money(s.price)}`; }
  }

  async function rollDice(){
    if(!state || state.phase!=='roll') return;
    state.phase='moving'; renderControls();
    els.die1.classList.add('rolling'); els.die2.classList.add('rolling');
    let a=1,b=1;
    for(let i=0;i<10;i++){
      a=randomInt(1,6); b=randomInt(1,6); els.die1.textContent=DIE[a-1]; els.die2.textContent=DIE[b-1]; els.diceTotal.textContent=a+b;
      await wait(70);
    }
    els.die1.classList.remove('rolling'); els.die2.classList.remove('rolling');
    state.lastDice=[a,b]; extraTurn=a===b;
    const p=currentPlayer();
    log(`<strong>${escapeHtml(p.name)}</strong> mendapat ${a}+${b} = <strong>${a+b}</strong>${extraTurn?' (kembar!)':''}.`);
    await movePlayer(p,a+b);
    await resolveSpace(p);
    renderAll();
  }

  async function movePlayer(p,steps){
    for(let i=0;i<steps;i++){
      const old=p.pos; p.pos=(p.pos+1)%spaces.length;
      if(old===spaces.length-1 && p.pos===0){ p.cash+=200; log(`<strong>${escapeHtml(p.name)}</strong> melewati GO dan menerima ${money(200)}.`); }
      renderBoard(); await wait(145);
    }
  }

  async function resolveSpace(p){
    const s=spaces[p.pos];
    els.statusText.textContent=`Mendarat di ${s.name}.`;
    if(s.type==='property'){
      const ownerId=state.owners[p.pos];
      if(ownerId===undefined){
        if(p.cash>=s.price){ pendingProperty=p.pos; state.phase='buy'; els.statusText.textContent=`${s.name} belum dimiliki. Harga ${money(s.price)} • sewa ${money(s.rent)}.`; }
        else{ state.phase='done'; els.statusText.textContent=`Uang tidak cukup untuk membeli ${s.name}.`; }
      }else if(Number(ownerId)===p.id){
        state.phase='done'; els.statusText.textContent=`${s.name} adalah milikmu.`;
      }else{
        const owner=state.players.find(x=>x.id===Number(ownerId));
        p.cash-=s.rent; owner.cash+=s.rent;
        log(`<strong>${escapeHtml(p.name)}</strong> membayar sewa ${money(s.rent)} kepada <strong>${escapeHtml(owner.name)}</strong> di ${s.name}.`);
        handleBankruptcy(p);
        state.phase='done';
      }
    }else if(s.type==='chance'){
      state.phase='event'; drawChance(p);
    }else if(s.type==='quiz'){
      state.phase='event'; drawQuiz(p);
    }else if(s.type==='goto'){
      els.statusText.textContent='Ayo berkunjung! Pergi langsung ke Toraja.';
      log(`<strong>${escapeHtml(p.name)}</strong> diajak berkunjung langsung ke Toraja.`);
      p.pos=23; renderBoard(); await wait(320); await resolveSpace(p);
    }else{
      state.phase='done';
      if(s.type==='go') els.statusText.textContent='Berada di GO. Siap melanjutkan perjalanan.';
      if(s.type==='parking') els.statusText.textContent='Parkir Gratis — istirahat sejenak tanpa biaya.';
      if(s.type==='visit') els.statusText.textContent='Hanya Kunjungan — tidak ada biaya.';
    }
  }

  function buyProperty(){
    if(state.phase!=='buy' || pendingProperty===null) return;
    const p=currentPlayer(), s=spaces[pendingProperty];
    if(p.cash<s.price){ state.phase='done'; pendingProperty=null; renderAll(); return; }
    p.cash-=s.price; p.properties.push(pendingProperty); state.owners[pendingProperty]=p.id;
    log(`<strong>${escapeHtml(p.name)}</strong> membeli <strong>${s.name}</strong> seharga ${money(s.price)}.`);
    els.statusText.textContent=`${s.name} sekarang milik ${p.name}.`;
    pendingProperty=null; state.phase='done'; renderAll();
  }

  function skipProperty(){
    if(state.phase!=='buy') return;
    const s=spaces[pendingProperty];
    log(`<strong>${escapeHtml(currentPlayer().name)}</strong> melewati kesempatan membeli ${s.name}.`);
    pendingProperty=null; state.phase='done'; renderAll();
  }

  function nextDeckIndex(kind){
    const isQuiz=kind==='quiz';
    const order=isQuiz?state.quizOrder:state.chanceOrder;
    const cursorKey=isQuiz?'quizCursor':'chanceCursor';
    if(state[cursorKey]>=order.length){
      const fresh=shuffle([...order]);
      if(isQuiz) state.quizOrder=fresh; else state.chanceOrder=fresh;
      state[cursorKey]=0;
    }
    const updatedOrder=isQuiz?state.quizOrder:state.chanceOrder;
    return updatedOrder[state[cursorKey]++];
  }

  function drawChance(p){
    const idx=nextDeckIndex('chance'), card=chanceCards[idx];
    p.cash+=card.amount;
    log(`<strong>${escapeHtml(p.name)}</strong> mendapat kartu Keberuntungan: +${money(card.amount)}.`);
    els.eventContent.innerHTML=`<div class="event-layout">
      <img class="card-art" src="${card.image}" alt="Kartu ${escapeHtml(card.title)}">
      <div class="event-copy"><span class="eyebrow">KARTU KEBERUNTUNGAN</span><h2>${escapeHtml(card.title)}</h2><p>${escapeHtml(card.text)}</p><div class="reward-box">✨ Dapat ${money(card.amount)}</div><button class="primary-btn wide" id="chanceContinue">Lanjut</button></div>
    </div>`;
    showEvent();
    $('chanceContinue').addEventListener('click',closeEventAfterAction);
  }

  function drawQuiz(p){
    const idx=nextDeckIndex('quiz'), quiz=quizzes[idx];
    els.eventContent.innerHTML=`<div class="event-layout">
      <img class="card-art" src="${quiz.image}" alt="Kartu Dana Budaya nomor ${idx+1}">
      <div class="event-copy"><span class="eyebrow">DANA BUDAYA • KUIS MATEMATIKA</span><h2>Tantangan Budaya</h2><p>${escapeHtml(quiz.q)}</p>
      <div class="quiz-options">${quiz.options.map((o,i)=>`<button class="quiz-option" data-opt="${i}"><strong>${String.fromCharCode(65+i)}.</strong> ${escapeHtml(o)}</button>`).join('')}</div>
      <div id="quizFeedback"></div></div>
    </div>`;
    showEvent();
    els.eventContent.querySelectorAll('.quiz-option').forEach(btn=>btn.addEventListener('click',()=>answerQuiz(p,quiz,Number(btn.dataset.opt))));
  }

  function answerQuiz(p,quiz,choice){
    const buttons=[...els.eventContent.querySelectorAll('.quiz-option')];
    buttons.forEach(b=>b.disabled=true);
    const correct=choice===quiz.answer;
    buttons[quiz.answer].classList.add('correct');
    if(!correct) buttons[choice].classList.add('wrong');
    let delta=0, bonus=0;
    if(correct){
      delta=2000; p.cash+=delta;
      if(Math.random()<.2){ bonus=1000; p.cash+=bonus; }
      log(`<strong>${escapeHtml(p.name)}</strong> menjawab Dana Budaya dengan benar: +${money(delta)}${bonus?` + bonus ${money(bonus)}`:''}.`);
    }else{
      delta=-1000; p.cash+=delta;
      log(`<strong>${escapeHtml(p.name)}</strong> menjawab Dana Budaya kurang tepat: −${money(Math.abs(delta))}.`);
      handleBankruptcy(p);
    }
    const fb=$('quizFeedback');
    fb.innerHTML=`<div class="feedback"><strong>${correct?'✅ Benar!':'❌ Belum tepat.'}</strong><br>${correct?`Kamu mendapat ${money(2000)}${bonus?` + bonus ${money(1000)}!`:'.'}`:`Jawaban yang benar: ${escapeHtml(quiz.options[quiz.answer])}. Uang berkurang ${money(1000)}.`}</div><button class="primary-btn wide" id="quizContinue" style="margin-top:10px">Lanjut</button>`;
    $('quizContinue').addEventListener('click',closeEventAfterAction);
    renderSidebar(); renderBoard(); save();
  }

  function showEvent(){ els.eventCloseBtn.classList.add('hidden'); els.eventModal.classList.add('show'); }
  function closeEventAfterAction(){ els.eventModal.classList.remove('show'); state.phase='done'; renderAll(); }

  function handleBankruptcy(p){
    if(p.cash>=0 || !p.active) return false;
    p.active=false;
    p.properties.forEach(idx=>delete state.owners[idx]);
    p.properties=[];
    log(`<strong>${escapeHtml(p.name)}</strong> bangkrut dan keluar dari permainan.`);
    const active=state.players.filter(x=>x.active);
    if(active.length<=1){ setTimeout(()=>endGame(),250); return true; }
    return true;
  }

  function endTurn(){
    if(!state || state.phase!=='done') return;
    if(extraTurn && currentPlayer().active){
      extraTurn=false; state.phase='roll'; els.statusText.textContent='Dadu kembar! Kamu mendapat satu giliran tambahan.';
      log(`<strong>${escapeHtml(currentPlayer().name)}</strong> mendapat giliran tambahan karena dadu kembar.`);
      renderAll(); return;
    }
    let next=state.currentIndex;
    let wrapped=false;
    do{
      next=(next+1)%state.players.length;
      if(next===0) wrapped=true;
    }while(!state.players[next].active && next!==state.currentIndex);
    if(wrapped){ state.round++; }
    if(state.round>state.maxRounds){ endGame(); return; }
    state.currentIndex=next; state.phase='roll'; pendingProperty=null;
    renderAll();
  }

  function playerNetWorth(p){
    return p.cash + p.properties.reduce((sum,idx)=>sum+(spaces[idx].price||0),0);
  }

  function endGame(){
    if(!state) return;
    state.phase='end';
    const ranking=[...state.players].sort((a,b)=>playerNetWorth(b)-playerNetWorth(a));
    const winner=ranking[0];
    els.winnerTitle.textContent=`${winner.token} ${winner.name} Menang!`;
    els.rankingList.innerHTML=ranking.map((p,i)=>`<div class="rank-row"><div class="rank-num">${i+1}</div><div class="rank-meta"><strong>${escapeHtml(p.name)}</strong><span>${money(p.cash)} tunai + ${p.properties.length} properti</span></div><div class="rank-value">${money(playerNetWorth(p))}</div></div>`).join('');
    els.winnerModal.classList.add('show');
    localStorage.removeItem(SAVE_KEY);
    renderControls();
  }

  function resetToSetup(){
    state=null; pendingProperty=null; extraTurn=false;
    localStorage.removeItem(SAVE_KEY);
    els.winnerModal.classList.remove('show'); els.setupModal.classList.add('show');
    inputCount=2; renderPlayerInputs();
  }

  function escapeHtml(str){ return String(str).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function wait(ms){ return new Promise(r=>setTimeout(r,ms)); }

  // Events
  els.addPlayerBtn.addEventListener('click',()=>{ if(inputCount<6){ inputCount++; renderPlayerInputs(); } });
  els.startBtn.addEventListener('click',newGame);
  els.resumeBtn.addEventListener('click',resumeGame);
  els.rollBtn.addEventListener('click',rollDice);
  els.buyBtn.addEventListener('click',buyProperty);
  els.skipBuyBtn.addEventListener('click',skipProperty);
  els.endTurnBtn.addEventListener('click',endTurn);
  els.rulesBtn.addEventListener('click',()=>els.rulesModal.classList.add('show'));
  els.rulesCloseBtn.addEventListener('click',()=>els.rulesModal.classList.remove('show'));
  els.rulesOkBtn.addEventListener('click',()=>els.rulesModal.classList.remove('show'));
  els.endGameBtn.addEventListener('click',()=>{ if(state && confirm('Akhiri game sekarang dan hitung pemenang?')) endGame(); });
  els.playAgainBtn.addEventListener('click',resetToSetup);
  els.fullscreenBtn.addEventListener('click',async()=>{ try{ if(!document.fullscreenElement) await document.documentElement.requestFullscreen(); else await document.exitFullscreen(); }catch(e){} });
  window.addEventListener('beforeunload',save);

  renderPlayerInputs();
  if(localStorage.getItem(SAVE_KEY)) els.resumeBtn.classList.remove('hidden');
})();
