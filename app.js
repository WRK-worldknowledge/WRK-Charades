
let allData=[], gameData=[], i=0, score=0, time=60, timer, mode='train', gameType='code-to-city';
let lastActionTime = 0;
const ACTION_DELAY = 1200;

const moduleNames={
 'AFR':'Africa','EURW':'Western Europe','EURO':'Eastern Europe',
 'AM':'America','AUS':'Oceania','ASIA':'Asia'
};

fetch('iata.json').then(r=>r.json()).then(d=>{
 allData=d;
 const mods=[...new Set(d.map(x=>x.module))];
 const c=document.getElementById('modules');
 mods.forEach(m=>{
  c.innerHTML+=`<label><input type="checkbox" value="${m}" checked> ${moduleNames[m]||m}</label><br>`;
 });
});

function setMode(m){
 mode=m;
 document.getElementById('modules').style.display = m==='exam' ? 'none':'block';
}

function setGameType(t){ gameType=t; }

function startGame(){
 const checked=[...document.querySelectorAll('#modules input:checked')].map(x=>x.value);
 gameData = mode==='exam' ? allData.slice() : allData.filter(x=>checked.includes(x.module));
 gameData.sort(()=>Math.random()-0.5);
 document.getElementById('start').classList.add('hidden');
 document.getElementById('game').classList.remove('hidden');
 score=0; i=0; time=60;
 timer=setInterval(tick,1000);
 initTilt();
 show();
}

function tick(){
 time--;
 document.getElementById('timer').innerText=`Time: ${time}s | Score: ${score}`;
 if(time<=0){ end(); }
}

function show(){
 if(i>=gameData.length){i=0;}
 const item=gameData[i];
 document.getElementById('code').innerText = (gameType==='city-to-code') ? item.city : item.code;
}

function good(){ score++; i++; show(); }

function skip(){
 const item=gameData[i];
 document.getElementById('game').classList.add('hidden');
 const h=document.getElementById('hint');
 let answer = (gameType==='city-to-code') ? item.code : item.city;
 h.innerHTML=`${answer} — ${item.country}<br><small>tap to continue</small>`;
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

// ---- Tilt controls ----
function initTilt(){
 if (typeof DeviceOrientationEvent !== "undefined" &&
     typeof DeviceOrientationEvent.requestPermission === "function") {
   DeviceOrientationEvent.requestPermission().catch(()=>{}).then(()=>{
     window.addEventListener("deviceorientation", handleTilt);
   });
 } else {
   window.addEventListener("deviceorientation", handleTilt);
 }
}

function handleTilt(e){
 const now = Date.now();
 if(now - lastActionTime < ACTION_DELAY) return;

 const beta = e.beta; // front/back tilt

 if(beta > 25){
   lastActionTime = now;
   good();
 }
 else if(beta < -25){
   lastActionTime = now;
   skip();
 }
}
