let allData=[], gameData=[], i=0, score=0, time=60, timer, mode='train';

const moduleNames={
 'AFR':'Africa',
 'EURW':'Western Europe',
 'EURO':'Eastern Europe',
 'AM':'America',
 'AUS':'Oceania',
 'ASIA':'Asia'
};

fetch('iata.json').then(r=>r.json()).then(d=>{
 allData=d;
 const mods=[...new Set(d.map(x=>x.module))];
 const c=document.getElementById('modules');
 mods.forEach(m=>{
  c.innerHTML+=`<label><input type="checkbox" value="${m}" checked> ${moduleNames[m]}</label><br>`;
 });
});

function setMode(m){
 mode=m;
 document.getElementById('modules').style.display = m==='exam' ? 'none':'block';
}

function startGame(){
 const checked=[...document.querySelectorAll('input:checked')].map(x=>x.value);
 gameData = mode==='exam' ? allData.slice() : allData.filter(x=>checked.includes(x.module));
 gameData.sort(()=>Math.random()-0.5);
 document.getElementById('start').classList.add('hidden');
 document.getElementById('game').classList.remove('hidden');
 timer=setInterval(tick,1000);
 show();
}

function tick(){
 time--;
 document.getElementById('timer').innerText=`Time: ${time}s | Score: ${score}`;
 if(time<=0){ end(); }
}

function show(){
 if(i>=gameData.length){i=0;}
 document.getElementById('code').innerText=gameData[i].code;
}

function good(){
 score++;
 i++;
 show();
}

function skip(){
 document.getElementById('game').classList.add('hidden');
 const h=document.getElementById('hint');
 h.innerHTML=`${gameData[i].city}, ${gameData[i].country}<br><small>tap to continue</small>`;
 h.classList.remove('hidden');
}

function next(){
 document.getElementById('hint').classList.add('hidden');
 document.getElementById('game').classList.remove('hidden');
 i++;
 show();
}

function end(){
 clearInterval(timer);
 document.getElementById('game').classList.add('hidden');
 document.getElementById('end').classList.remove('hidden');
 document.getElementById('score').innerText=`Final score: ${score}`;
}
