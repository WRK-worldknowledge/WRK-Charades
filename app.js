
let allData=[], gameData=[], i=0, score=0, time=60, timer, mode='train', gameType='code-to-city';

let lastActionTime = 0;
const ACTION_DELAY = 500; // voorkomt dubbele acties

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
  c.innerHTML+=`<label><input type="checkbox" value="${m}" checked> ${moduleNames[m]||m}</label><br>`;
 });
});

function setMode(m){
 mode=m;
 document.getElementById('modules').style.display = m==='exam' ? 'none':'block';
}

function setGameType(t){
 gameType=t;
}

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

function good(){
 score++;
 i++;
 show();
}

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
 window.addEventListener("deviceorientation", handleTilt, true);
}

let readyForNext = true;

let tiltState = "neutral"; 
// states: neutral → forward → back

let tiltState = "neutral";

function handleTilt(e){
 const beta = e.beta;
 if(beta === null) return;

 const FORWARD_THRESHOLD = -16;   // goed
 const BACK_THRESHOLD = 12;        // skip (minder streng)
 const NEUTRAL_MIN = -7;
 const NEUTRAL_MAX = 7;

 // Reset alleen bij echte neutraalstand
 if(beta > NEUTRAL_MIN && beta < NEUTRAL_MAX){
   tiltState = "neutral";
   return;
 }

 // Voorover = goed
 if(beta < FORWARD_THRESHOLD && tiltState === "neutral"){
   tiltState = "forward";
   good();
 }

 // Achterover = skip
 else if(beta > BACK_THRESHOLD && tiltState === "neutral"){
   tiltState = "back";
   skip();
 }
}
function resetGame(){
 clearInterval(timer);

 // Reset state
 i = 0;
 score = 0;
 time = 60;
 tiltState = "neutral";

 // UI reset
 document.getElementById('end').classList.add('hidden');
 document.getElementById('game').classList.add('hidden');
 document.getElementById('hint').classList.add('hidden');
 document.getElementById('start').classList.remove('hidden');

 document.getElementById('timer').innerText = "";
 document.getElementById('code').innerText = "";
}
