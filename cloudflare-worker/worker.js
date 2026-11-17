import CHUNKS from './chunks.js';

const MAX_FILES = 25, MAX_CHUNKS = 4000, MAX_CHUNKS_PER_FILE = 900;

const PAGE = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>ITPrior AI Docs - Chat with your documents</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<style>
:root{
  --bg:#07090f; --panel:#0d1019; --panel2:#111524; --line:rgba(148,163,255,.10); --line2:rgba(148,163,255,.18);
  --text:#e8ebf7; --muted:#8b93b4; --faint:#5d6584; --input-bg:#111524;
  --acc1:#6d6cff; --acc2:#a855f7; --grad:linear-gradient(135deg,#6d6cff 0%,#a855f7 100%);
  --ok:#34d399; --danger:#f87171; --r:16px; --ease:cubic-bezier(.22,1,.36,1);
  --glow-a:rgba(109,108,255,.14); --glow-b:rgba(168,85,247,.10); --shadow:rgba(0,0,0,.45);
  color-scheme:dark;
}
[data-theme=light]{
  --bg:#f3f5fb; --panel:#ffffff; --panel2:#eef1f9; --line:rgba(20,24,60,.10); --line2:rgba(20,24,60,.16);
  --text:#141834; --muted:#5b6285; --faint:#8a90ad; --input-bg:#f6f8fd;
  --glow-a:rgba(109,108,255,.10); --glow-b:rgba(168,85,247,.08); --shadow:rgba(30,35,80,.14);
  color-scheme:light;
}
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%}
body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);overflow:hidden;-webkit-font-smoothing:antialiased;transition:background .3s,color .3s}
.glow{position:fixed;border-radius:50%;pointer-events:none;z-index:0}
.glow.a{width:560px;height:560px;top:-180px;right:-120px;background:radial-gradient(circle,var(--glow-a),transparent 65%)}
.glow.b{width:480px;height:480px;bottom:-160px;left:220px;background:radial-gradient(circle,var(--glow-b),transparent 65%)}
svg{display:block}
button{font-family:inherit;cursor:pointer;border:0;background:none;color:inherit}
input{font-family:inherit}
::-webkit-scrollbar{width:8px}::-webkit-scrollbar-thumb{background:rgba(128,134,180,.25);border-radius:8px}::-webkit-scrollbar-track{background:transparent}

/* ---------- LOGIN ---------- */
#login{position:fixed;inset:0;display:none;align-items:center;justify-content:center;z-index:20;padding:20px}
#login .card{width:100%;max-width:380px;background:var(--panel);border:1px solid var(--line);border-radius:24px;padding:40px 36px;animation:rise .5s var(--ease);box-shadow:0 20px 60px var(--shadow)}
#login .mark{width:52px;height:52px;border-radius:15px;background:var(--grad);display:flex;align-items:center;justify-content:center;margin-bottom:22px;box-shadow:0 8px 30px rgba(109,108,255,.35)}
#login h1{font-size:22px;font-weight:700;letter-spacing:-.02em;margin-bottom:6px}
#login .sub{font-size:13.5px;color:var(--muted);line-height:1.55;margin-bottom:26px}
.field{margin-bottom:14px}
.field label{display:block;font-size:12px;font-weight:600;color:var(--muted);margin-bottom:7px;letter-spacing:.02em}
.field input{width:100%;background:var(--input-bg);border:1px solid var(--line);border-radius:12px;padding:12px 14px;font-size:14px;color:var(--text);outline:none;transition:border-color .2s,box-shadow .2s}
.field input:focus{border-color:var(--acc1);box-shadow:0 0 0 3px rgba(109,108,255,.18)}
#login .go{width:100%;margin-top:8px;padding:13px;border-radius:12px;background:var(--grad);color:#fff;font-size:14.5px;font-weight:700;letter-spacing:.01em;transition:transform .15s var(--ease),box-shadow .2s}
#login .go:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(109,108,255,.4)}
#lerr{color:var(--danger);font-size:13px;margin-top:12px;min-height:18px;text-align:center}

/* ---------- APP SHELL ---------- */
#app{display:none;height:100%;position:relative;z-index:1}
#app.on{display:flex}
aside{width:300px;min-width:300px;height:100%;background:var(--panel);border-right:1px solid var(--line);display:flex;flex-direction:column;transition:transform .35s var(--ease),background .3s}
.brand{display:flex;align-items:center;gap:12px;padding:20px 20px 16px}
.brand .mark{width:38px;height:38px;border-radius:11px;background:var(--grad);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(109,108,255,.35)}
.brand .t1{font-size:15px;font-weight:700;letter-spacing:-.01em}
.brand .t2{font-size:11.5px;color:var(--muted)}
.brand .sp{flex:1}
#themeBtn{width:34px;height:34px;border-radius:10px;border:1px solid var(--line);display:flex;align-items:center;justify-content:center;transition:all .2s}
#themeBtn:hover{border-color:var(--acc1);background:rgba(109,108,255,.08)}
#themeBtn svg{stroke:var(--muted)}
.side-scroll{flex:1;overflow-y:auto;padding:4px 16px 16px}
.sec{display:flex;align-items:center;justify-content:space-between;margin:18px 4px 10px}
.sec span{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--faint)}
.sec .count{font-size:11px;font-weight:700;color:var(--acc1);background:rgba(109,108,255,.12);padding:2px 8px;border-radius:20px}
#drop{border:1.5px dashed var(--line2);border-radius:var(--r);padding:20px 14px;text-align:center;cursor:pointer;transition:all .25s var(--ease);background:rgba(109,108,255,.03)}
#drop:hover,#drop.over{border-color:var(--acc1);background:rgba(109,108,255,.09);transform:scale(1.015)}
#drop .ic{width:40px;height:40px;margin:0 auto 10px;border-radius:12px;background:rgba(109,108,255,.12);display:flex;align-items:center;justify-content:center}
#drop .dt{font-size:13.5px;font-weight:600;margin-bottom:3px}
#drop .ds{font-size:11.5px;color:var(--muted);line-height:1.5}
#drop .acts{display:flex;gap:8px;justify-content:center;margin-top:12px}
#drop .mini{font-size:11.5px;font-weight:600;color:var(--acc1);padding:6px 12px;border:1px solid rgba(109,108,255,.35);border-radius:18px;transition:all .2s}
#drop .mini:hover{background:rgba(109,108,255,.12)}
.doc{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;border:1px solid transparent;transition:background .2s,border-color .2s;margin-bottom:4px}
.doc:hover{background:var(--panel2);border-color:var(--line)}
.doc .fi{width:32px;height:32px;min-width:32px;border-radius:9px;background:rgba(168,85,247,.12);display:flex;align-items:center;justify-content:center;overflow:hidden}
.doc .fi img{width:100%;height:100%;object-fit:cover}
.doc .n{flex:1;min-width:0}
.doc .n .nm{font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.doc .n .mt{font-size:11px;color:var(--faint)}
.tag{font-size:9.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:3px 7px;border-radius:6px}
.tag.up{color:var(--ok);background:rgba(52,211,153,.12)}
.tag.in{color:var(--muted);background:rgba(128,134,180,.12)}
.side-foot{padding:14px 16px;border-top:1px solid var(--line)}
#reset{width:100%;padding:10px;border-radius:11px;border:1px solid var(--line);color:var(--muted);font-size:12.5px;font-weight:600;transition:all .2s}
#reset:hover{color:var(--danger);border-color:rgba(248,113,113,.35);background:rgba(248,113,113,.06)}
.side-foot .lim{font-size:10.5px;color:var(--faint);text-align:center;margin-top:9px;line-height:1.5}

main{flex:1;display:flex;flex-direction:column;min-width:0;height:100%}
.topbar{display:none;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid var(--line);background:var(--panel)}
#burger{width:38px;height:38px;border-radius:10px;border:1px solid var(--line);display:flex;align-items:center;justify-content:center}
#burger svg{stroke:var(--text)}
.topbar .tt{font-size:14.5px;font-weight:700;flex:1}
#scrim{position:fixed;inset:0;background:rgba(4,6,12,.6);z-index:8;opacity:0;pointer-events:none;transition:opacity .3s}
#scrim.on{opacity:1;pointer-events:auto}

#msgs{flex:1;overflow-y:auto;padding:28px 0 12px}
.col{max-width:760px;margin:0 auto;padding:0 24px;display:flex;flex-direction:column;gap:18px}
#empty{margin:auto;text-align:center;padding:40px 20px;animation:rise .5s var(--ease)}
#empty .big{width:64px;height:64px;margin:0 auto 18px;border-radius:18px;background:var(--grad);display:flex;align-items:center;justify-content:center;box-shadow:0 10px 34px rgba(109,108,255,.35)}
#empty h2{font-size:21px;font-weight:700;letter-spacing:-.02em;margin-bottom:8px}
#empty p{font-size:13.5px;color:var(--muted);max-width:440px;margin:0 auto 22px;line-height:1.6}
.chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
.chip{padding:9px 15px;border-radius:24px;border:1px solid var(--line2);font-size:12.5px;color:var(--muted);transition:all .2s var(--ease);background:var(--panel)}
.chip:hover{color:var(--text);border-color:var(--acc1);transform:translateY(-1px)}
.msg{max-width:78%;padding:13px 17px;border-radius:18px;font-size:14.5px;line-height:1.6;white-space:pre-wrap;word-wrap:break-word;animation:rise .35s var(--ease)}
.msg.user{align-self:flex-end;background:var(--grad);color:#fff;border-bottom-right-radius:6px;box-shadow:0 4px 18px rgba(109,108,255,.25)}
.msg.bot{align-self:flex-start;background:var(--panel2);border:1px solid var(--line);border-bottom-left-radius:6px}
.msg.note{align-self:center;background:none;border:1px dashed var(--line2);color:var(--muted);font-size:12.5px;padding:9px 16px;border-radius:24px;max-width:92%;text-align:center}
.msg .docimg{max-width:260px;width:100%;border-radius:12px;margin-top:10px;border:1px solid var(--line);display:block}
.srcs{display:flex;flex-wrap:wrap;gap:6px;margin-top:11px}
.src{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:var(--muted);background:rgba(128,134,180,.10);border:1px solid var(--line);padding:4px 10px;border-radius:20px;transition:all .2s}
.src:hover{color:var(--text);border-color:var(--line2)}
.src .dot{width:6px;height:6px;border-radius:50%;background:var(--grad)}
.dots{display:inline-flex;gap:5px;padding:6px 2px}
.dots i{width:7px;height:7px;border-radius:50%;background:var(--muted);animation:pulse 1.2s infinite}
.dots i:nth-child(2){animation-delay:.18s}.dots i:nth-child(3){animation-delay:.36s}
@keyframes pulse{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-4px)}}
@keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

#composer{padding:14px 0 20px}
#composer .col{flex-direction:row;align-items:flex-end;gap:10px}
#cwrap{flex:1;display:flex;align-items:center;background:var(--panel);border:1px solid var(--line2);border-radius:26px;padding:5px 6px 5px 20px;transition:border-color .2s,box-shadow .2s}
#cwrap:focus-within{border-color:var(--acc1);box-shadow:0 0 0 3px rgba(109,108,255,.16),0 8px 30px var(--shadow)}
#q{flex:1;background:none;border:0;outline:none;color:var(--text);font-size:14.5px;padding:10px 0}
#q::placeholder{color:var(--faint)}
#send{width:42px;height:42px;min-width:42px;border-radius:50%;background:var(--grad);display:flex;align-items:center;justify-content:center;transition:transform .15s var(--ease),box-shadow .2s;box-shadow:0 4px 14px rgba(109,108,255,.35)}
#send:hover{transform:scale(1.06)}
#send:disabled{opacity:.45;transform:none;cursor:default}
.hint{text-align:center;font-size:11px;color:var(--faint);margin-top:9px}

#toast{position:fixed;bottom:96px;left:50%;transform:translateX(-50%) translateY(16px);background:var(--panel2);border:1px solid var(--line2);color:var(--text);font-size:13px;font-weight:500;padding:11px 20px;border-radius:14px;opacity:0;pointer-events:none;transition:all .3s var(--ease);z-index:30;box-shadow:0 10px 34px var(--shadow);max-width:88vw}
#toast.on{opacity:1;transform:translateX(-50%) translateY(0)}

@media(max-width:900px){
  aside{position:fixed;left:0;top:0;z-index:9;transform:translateX(-102%);box-shadow:0 0 60px var(--shadow)}
  aside.open{transform:translateX(0)}
  .topbar{display:flex}
  .msg{max-width:88%}
  .col{padding:0 16px}
}
</style></head><body>
<div class="glow a"></div><div class="glow b"></div>

<div id="login"><div class="card">
  <div class="mark"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 3v5h5M9 13h6M9 17h4" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg></div>
  <h1>ITPrior AI Docs</h1>
  <p class="sub">Chat with your documents. Upload PDFs, Word, Excel, PowerPoint, text files or images - answers come with sources, in your language.</p>
  <div class="field"><label>Username</label><input id="u" autocomplete="username" placeholder="Enter username"></div>
  <div class="field"><label>Password</label><input id="p" type="password" autocomplete="current-password" placeholder="Enter password"></div>
  <button class="go" onclick="login()">Sign in</button>
  <div id="lerr"></div>
</div></div>

<div id="app">
  <aside id="side">
    <div class="brand">
      <div class="mark"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 3v5h5M9 13h6M9 17h4" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg></div>
      <div><div class="t1">ITPrior AI Docs</div><div class="t2">Universal document chat</div></div>
      <div class="sp"></div>
      <button id="themeBtn" onclick="toggleTheme()" aria-label="Toggle theme">
        <svg id="iconMoon" width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" stroke-width="2" stroke-linejoin="round"/></svg>
        <svg id="iconSun" width="17" height="17" viewBox="0 0 24 24" fill="none" style="display:none"><circle cx="12" cy="12" r="4.2" stroke-width="2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M19.1 4.9l-1.6 1.6M6.5 17.5l-1.6 1.6" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
    </div>
    <div class="side-scroll">
      <div class="sec"><span>Upload</span></div>
      <div id="drop" onclick="document.getElementById('file').click()">
        <div class="ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M12 16V4m0 0l-4 4m4-4l4 4" stroke="#a5b4ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" stroke="#a5b4ff" stroke-width="2" stroke-linecap="round"/></svg></div>
        <div class="dt">Drop files or a folder here</div>
        <div class="ds">PDF, Word, Excel, PowerPoint, text, images, zip - up to 15 MB each</div>
        <div class="acts">
          <span class="mini" onclick="event.stopPropagation();document.getElementById('file').click()">Choose files</span>
          <span class="mini" onclick="event.stopPropagation();document.getElementById('folder').click()">Choose folder</span>
        </div>
      </div>
      <div class="sec"><span>Documents</span><span class="count" id="dcount">0</span></div>
      <div id="doclist"></div>
    </div>
    <div class="side-foot">
      <button id="reset" onclick="resetDocs()">Clear my uploads</button>
      <div class="lim">Up to 25 files - answers include sources<br>English, Telugu &amp; Hindi supported</div>
    </div>
  </aside>
  <div id="scrim" onclick="toggleSide(false)"></div>

  <main>
    <div class="topbar">
      <button id="burger" onclick="toggleSide()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke-width="2" stroke-linecap="round"/></svg></button>
      <div class="tt">ITPrior AI Docs</div>
    </div>
    <div id="msgs"><div class="col" id="mcol">
      <div id="empty">
        <div class="big"><svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M21 12a8 8 0 0 1-8 8H5l-2 2V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 11h6M9 14h3" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg></div>
        <h2>Ask your documents anything</h2>
        <p>Two documents are pre-loaded. Upload PDFs, Office files, text or images - answers always name their sources.</p>
        <div class="chips">
          <button class="chip" onclick="suggest(this)">What is SmartAssist?</button>
          <button class="chip" onclick="suggest(this)">What does Article 14 of the Indian Constitution say?</button>
          <button class="chip" onclick="suggest(this)">What does the Preamble of the Constitution declare?</button>
        </div>
      </div>
    </div></div>
    <div id="composer"><div class="col">
      <div id="cwrap">
        <input id="q" placeholder="Ask about the documents..." autocomplete="off" onkeydown="if(event.key==='Enter')ask()">
        <button id="send" onclick="ask()" aria-label="Send"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 19V5m0 0l-6 6m6-6l6 6" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      </div>
    </div>
    <div class="hint">Answers are generated only from the loaded documents</div></div>
  </main>
</div>
<input id="file" type="file" multiple style="display:none" accept=".pdf,.docx,.xlsx,.xls,.csv,.pptx,.txt,.md,.json,.log,.png,.jpg,.jpeg,.webp,.gif,.zip" onchange="uploadFiles(this.files);this.value=''">
<input id="folder" type="file" multiple webkitdirectory style="display:none" onchange="uploadFiles(this.files);this.value=''">
<div id="toast"></div>

<script type="module">
let pdfjsLib=null;
async function loadPdfJs(){
  if(pdfjsLib)return pdfjsLib;
  const m=await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.min.mjs');
  m.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.mjs';
  pdfjsLib=m;return m;
}
const $=id=>document.getElementById(id);

/* theme */
function applyTheme(t){document.documentElement.setAttribute('data-theme',t);$('iconMoon').style.display=t==='dark'?'none':'block';$('iconSun').style.display=t==='dark'?'block':'none';localStorage.setItem('theme',t)}
window.toggleTheme=function(){applyTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark')};
applyTheme(localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'));

let tok=localStorage.getItem('t');
if(tok){enter()}else{$('login').style.display='flex'}
function enter(){$('login').style.display='none';$('app').classList.add('on');refreshDocs();setTimeout(()=>$('q').focus(),300)}
window.login=async function(){
  let r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:$('u').value,password:$('p').value})});
  let d=await r.json();
  if(d.ok){tok=d.token;localStorage.setItem('t',tok);enter()}else{$('lerr').textContent='Wrong username or password'}
};
$('p').addEventListener('keydown',e=>{if(e.key==='Enter')login()});
window.toggleSide=function(open){const s=$('side');const want=open===undefined?!s.classList.contains('open'):open;s.classList.toggle('open',want);$('scrim').classList.toggle('on',want)};
window.suggest=function(el){$('q').value=el.textContent;$('q').focus()};
let toastT;
function toast(t){const el=$('toast');el.textContent=t;el.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('on'),3400)}
function scrollBottom(){const m=$('msgs');m.scrollTo({top:m.scrollHeight,behavior:'smooth'})}
function hideEmpty(){const e=$('empty');if(e)e.remove()}
const fileIcon='<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" stroke="#a5b4ff" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 3v5h5" stroke="#a5b4ff" stroke-width="1.8"/></svg>';
const imgIcon='<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2.5" stroke="#a5b4ff" stroke-width="1.8"/><circle cx="9" cy="10" r="1.6" fill="#a5b4ff"/><path d="M4.5 18l4.2-4.2a1.5 1.5 0 0 1 2.1 0l5.2 5.2M14 16.2l2.1-2.1a1.5 1.5 0 0 1 2.1 0l1.8 1.8" stroke="#a5b4ff" stroke-width="1.6" stroke-linecap="round"/></svg>';
function addMsg(t,c,sources){
  hideEmpty();
  let m=document.createElement('div');m.className='msg '+c;
  m.appendChild(document.createTextNode(t));
  if(sources&&sources.length){
    let s=document.createElement('div');s.className='srcs';
    for(const name of sources){let chip=document.createElement('span');chip.className='src';chip.innerHTML='<span class="dot"></span>';chip.appendChild(document.createTextNode(name));s.appendChild(chip)}
    m.appendChild(s);
  }
  $('mcol').appendChild(m);scrollBottom();return m;
}
function addNote(t,imgName){
  hideEmpty();
  let m=document.createElement('div');m.className='msg note';m.textContent=t;
  if(imgName){let im=document.createElement('img');im.className='docimg';im.src='/api/image?tok='+encodeURIComponent(tok)+'&name='+encodeURIComponent(imgName);im.alt=imgName;m.appendChild(im)}
  $('mcol').appendChild(m);scrollBottom();
}
function chunkText(t){t=t.replace(/\\s+/g,' ').trim();let cs=[],i=0;while(i<t.length){cs.push(t.slice(i,i+1000));i+=800}return cs}
async function refreshDocs(){
  try{
    let r=await fetch('/api/docs',{headers:{'Authorization':'Bearer '+tok}});
    let d=await r.json();
    $('dcount').textContent=d.files.length;
    let list=$('doclist');list.innerHTML='';
    for(const f of d.files){
      let row=document.createElement('div');row.className='doc';
      let fi=document.createElement('div');fi.className='fi';
      if(f.image){let im=document.createElement('img');im.src='/api/image?tok='+encodeURIComponent(tok)+'&name='+encodeURIComponent(f.name);im.alt='';fi.appendChild(im)}else{fi.innerHTML=(f.kind==='image'?imgIcon:fileIcon)}
      row.appendChild(fi);
      let n=document.createElement('div');n.className='n';
      let nm=document.createElement('div');nm.className='nm';nm.textContent=f.name;nm.title=f.name;
      let mt=document.createElement('div');mt.className='mt';mt.textContent=f.chunks+' parts';
      n.appendChild(nm);n.appendChild(mt);row.appendChild(n);
      let tag=document.createElement('span');tag.className='tag '+(f.builtin?'in':'up');tag.textContent=f.builtin?'built-in':'yours';
      row.appendChild(tag);list.appendChild(row);
    }
  }catch(e){}
}

/* ------- universal text extraction ------- */
const ext=n=>(n.split('.').pop()||'').toLowerCase();
function xmlText(x){return x.replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"')}
async function extractPdf(f){
  let lib=await loadPdfJs();let pdf=await lib.getDocument({data:await f.arrayBuffer()}).promise;
  let text='';
  for(let pg=1;pg<=pdf.numPages;pg++){let page=await pdf.getPage(pg);let tc=await page.getTextContent();text+=tc.items.map(it=>it.str).join(' ')+' '}
  return text;
}
async function extractDocx(f){let r=await mammoth.extractRawText({arrayBuffer:await f.arrayBuffer()});return r.value}
async function extractExcel(f){let wb=XLSX.read(await f.arrayBuffer());let t='';for(const sn of wb.SheetNames){t+='Sheet: '+sn+'\\n'+XLSX.utils.sheet_to_csv(wb.Sheets[sn])+'\\n'}return t}
async function extractPptx(f){
  let zip=await JSZip.loadAsync(await f.arrayBuffer());let t='';
  const slides=Object.keys(zip.files).filter(p=>/^ppt\\/slides\\/slide\\d+\\.xml$/.test(p)).sort((a,b)=>parseInt(a.match(/slide(\\d+)/)[1])-parseInt(b.match(/slide(\\d+)/)[1]));
  for(const p of slides){t+='\\nSlide '+p.match(/slide(\\d+)/)[1]+': '+xmlText(await zip.file(p).async('string'))}
  return t;
}
async function extractZip(f){
  let zip=await JSZip.loadAsync(await f.arrayBuffer());let t='';let n=0;
  for(const p of Object.keys(zip.files)){
    if(zip.files[p].dir)continue;
    const e=ext(p);const base=p.split('/').pop();
    if(n>=10){t+='\\n(more files in zip not read - limit 10)';break}
    try{
      if(['txt','md','json','csv','log'].includes(e)){t+='\\n--- '+p+' ---\\n'+(await zip.file(p).async('string')).slice(0,20000);n++}
      else if(e==='pdf'){let lib=await loadPdfJs();let buf=await zip.file(p).async('arraybuffer');let pdf=await lib.getDocument({data:buf}).promise;let tx='';for(let pg=1;pg<=Math.min(pdf.numPages,30);pg++){let page=await pdf.getPage(pg);let tc=await page.getTextContent();tx+=tc.items.map(it=>it.str).join(' ')+' '}t+='\\n--- '+p+' ---\\n'+tx;n++}
      else if(e==='docx'){let buf=await zip.file(p).async('arraybuffer');let r=await mammoth.extractRawText({arrayBuffer:buf});t+='\\n--- '+p+' ---\\n'+r.value;n++}
    }catch(err){}
  }
  return t;
}
async function describeImage(f){
  const buf=new Uint8Array(await f.arrayBuffer());
  const r=await fetch('/api/vision',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+tok},body:JSON.stringify({image:Array.from(buf)})});
  const d=await r.json();
  if(d.text)return d.text;
  throw new Error(d.error||'could not read the image');
}
function readDataURL(f){return new Promise((res,rej)=>{let r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(f)})}

const TEXT_EXTS=['txt','md','json','log','csv','tsv','xml','html','js','py','yaml','yml'];
window.uploadFiles=async function(files){
  files=Array.from(files);
  if(!files||!files.length)return;
  toggleSide(false);
  for(const f of files){
    const name=f.webkitRelativePath||f._uploadPath||f.name;
    const e=ext(name);
    if(f.size>15*1024*1024){toast(name+': over 15 MB, skipped');continue}
    try{
      if(['png','jpg','jpeg','webp','gif'].includes(e)||f.type.startsWith('image/')){
        toast('Reading image '+name+'...');
        const desc=await describeImage(f);
        const dataUrl=await readDataURL(f);
        const chunks=chunkText('Image file "'+name+'". Contents: '+desc);
        toast('Indexing '+name+'...');
        let r=await fetch('/api/upload',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+tok},body:JSON.stringify({name:name,chunks,kind:'image',image:dataUrl.length<6*1024*1024?dataUrl:null})});
        let d=await r.json();
        if(d.ok){addNote('Uploaded image '+name+' - you can now ask about it',name);refreshDocs()}else{toast(name+': '+(d.error||'upload failed'))}
        continue;
      }
      toast('Reading '+name+'...');
      let text='';
      if(e==='pdf')text=await extractPdf(f);
      else if(e==='docx')text=await extractDocx(f);
      else if(['xlsx','xls'].includes(e))text=await extractExcel(f);
      else if(e==='pptx')text=await extractPptx(f);
      else if(e==='zip')text=await extractZip(f);
      else if(TEXT_EXTS.includes(e)||f.type.startsWith('text/'))text=await f.text();
      else if(e==='doc'||e==='ppt'){toast(name+': old Office format (.'+e+') not supported - save as .'+e+'x and retry');continue}
      else{toast(name+': this file type is not supported, skipped');continue}
      let chunks=chunkText(text);
      if(!chunks.length||!text.trim().length){toast(name+': no readable text found (scanned or empty?), skipped');continue}
      toast('Indexing '+name+' ('+chunks.length+' parts)...');
      let r=await fetch('/api/upload',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+tok},body:JSON.stringify({name:name,chunks,kind:e})});
      let d=await r.json();
      if(d.ok){addNote('Uploaded '+name+' - '+d.chunks+' parts indexed');refreshDocs()}else{toast(name+': '+(d.error||'upload failed'))}
    }catch(err){toast(name+': failed to read - '+err.message)}
  }
};
window.resetDocs=async function(){
  await fetch('/api/reset',{method:'POST',headers:{'Authorization':'Bearer '+tok}});
  refreshDocs();addNote('Your uploaded files were cleared');
};
window.ask=async function(){
  let question=$('q').value.trim();if(!question)return;
  $('q').value='';addMsg(question,'user');
  let th=document.createElement('div');th.className='msg bot';
  th.innerHTML='<span class="dots"><i></i><i></i><i></i></span>';
  $('mcol').appendChild(th);scrollBottom();$('send').disabled=true;
  try{
    let r=await fetch('/api/ask',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+tok},body:JSON.stringify({question})});
    let d=await r.json();
    th.textContent=d.answer||('Error: '+(d.error||'unknown'));
    if(d.sources&&d.sources.length){
      let s=document.createElement('div');s.className='srcs';
      for(const name of d.sources){let chip=document.createElement('span');chip.className='src';chip.innerHTML='<span class="dot"></span>';chip.appendChild(document.createTextNode(name));s.appendChild(chip)}
      th.appendChild(s);
    }
  }catch(e){th.textContent='Error: '+e.message}
  $('send').disabled=false;$('q').focus();scrollBottom();
};
/* drag & drop incl. folders */
const drop=$('drop');
['dragenter','dragover'].forEach(ev=>document.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('over')}));
['dragleave','drop'].forEach(ev=>document.addEventListener(ev,e=>{e.preventDefault();if(ev==='drop'||e.target===document||!e.relatedTarget)drop.classList.remove('over')}));
async function walkEntry(entry,out){
  if(entry.isFile){await new Promise(res=>entry.file(f=>{f._uploadPath=entry.fullPath.replace(/^[/]/,'');out.push(f);res()},res))}
  else if(entry.isDirectory){
    const reader=entry.createReader();let batch;
    do{batch=await new Promise(res=>reader.readEntries(res));for(const en of batch)await walkEntry(en,out)}while(batch.length);
  }
}
document.addEventListener('drop',async e=>{
  e.preventDefault();drop.classList.remove('over');
  const items=e.dataTransfer&&e.dataTransfer.items;
  if(items&&items.length&&items[0].webkitGetAsEntry){
    const out=[];
    for(const it of items){const en=it.webkitGetAsEntry&&it.webkitGetAsEntry();if(en)await walkEntry(en,out)}
    if(out.length){uploadFiles(out);return}
  }
  if(e.dataTransfer&&e.dataTransfer.files.length)uploadFiles(e.dataTransfer.files);
});
</script></body></html>`;

const STOP = new Set('the a an is are was were what which who whom how when where why does do did can could should would in on of for to from by with and or not it its this that these those as at be been about me you your i we they he she them his her their our us'.split(' '));
function terms(q){return q.toLowerCase().replace(/[^\p{L}\p{N}\p{M}\s]/gu,' ').split(/\s+/).filter(w=>(w.length>2||/\d/.test(w))&&!STOP.has(w))}

let IDF=null, DOCSET=null;
async function getUploaded(env){
  const idx = await env.KV.get('index', 'json') || [];
  const files = [];
  for (const name of idx){
    const f = await env.KV.get('file:'+name, 'json');
    if (f) files.push(f);
  }
  return files;
}
async function docset(env){
  const docs=[];
  for(const c of CHUNKS) docs.push(c);
  const files = await getUploaded(env);
  for(const f of files) for(const t of f.chunks) docs.push({src:f.name+' (uploaded)',text:t});
  return docs;
}
function buildIdf(docs){
  const df=new Map();
  for(const c of docs){const seen=new Set(terms(c.text));for(const w of seen)df.set(w,(df.get(w)||0)+1)}
  return df;
}
async function topChunks(q,k,env){
  const docs=await docset(env);
  const idf=buildIdf(docs);
  const qs=terms(q); if(!qs.length)return{chunks:[],best:0};
  const N=docs.length, scored=[];
  for(const c of docs){
    const words=c.text.toLowerCase().split(/[^\p{L}\p{N}\p{M}]+/u);
    let s=0;
    for(const w of qs){
      const df=idf.get(w)||0; if(!df)continue;
      const v=Math.log(N/df); let tf=0;
      for(const x of words){if(x===w)tf++}
      if(tf)s+=(1+Math.log(tf))*v;
    }
    if(s>0)scored.push([s,c]);
  }
  scored.sort((a,b)=>b[0]-a[0]);
  return {chunks:scored.slice(0,k).map(x=>x[1]),best:scored.length?scored[0][0]:0};
}

export default {
  async fetch(request, env){
    const url=new URL(request.url);
    const auth=(request.headers.get('Authorization')||'')==='Bearer demo-session'||url.searchParams.get('tok')==='demo-session';
    if(url.pathname==='/api/login'&&request.method==='POST'){
      const b=await request.json().catch(()=>({}));
      if(b.username==='admin'&&b.password==='admin123')return Response.json({ok:true,token:'demo-session'});
      return Response.json({ok:false},{status:401});
    }
    if(url.pathname.startsWith('/api/')&&!auth)return Response.json({error:'not signed in'},{status:401});
    if(url.pathname==='/api/docs'){
      const builtinNames=[...new Set(CHUNKS.map(c=>c.src))];
      const files=builtinNames.map(n=>({name:n,chunks:CHUNKS.filter(c=>c.src===n).length,builtin:true,kind:'pdf',image:false}));
      const up=await getUploaded(env);
      for(const f of up)files.push({name:f.name,chunks:f.chunks.length,builtin:false,kind:f.kind||'doc',image:!!f.image});
      const total=CHUNKS.length+up.reduce((n,f)=>n+f.chunks.length,0);
      return Response.json({files,total_chunks:total});
    }
    if(url.pathname==='/api/upload'&&request.method==='POST'){
      const b=await request.json().catch(()=>({}));
      if(!b.name||!Array.isArray(b.chunks)||!b.chunks.length)return Response.json({error:'no content'},{status:400});
      const idx=await env.KV.get('index','json')||[];
      if(idx.length>=MAX_FILES)return Response.json({error:'File limit reached ('+MAX_FILES+'). Clear uploads first.'},{status:400});
      let chunks=b.chunks.slice(0,MAX_CHUNKS_PER_FILE).map(t=>String(t).slice(0,1200));
      const up=await getUploaded(env);
      const total=up.reduce((n,f)=>n+f.chunks.length,0);
      if(total+chunks.length>MAX_CHUNKS)chunks=chunks.slice(0,Math.max(0,MAX_CHUNKS-total));
      if(!chunks.length)return Response.json({error:'Upload storage full ('+MAX_CHUNKS+' parts). Clear uploads first.'},{status:400});
      const name=String(b.name).slice(0,120);
      const kind=String(b.kind||'doc').slice(0,20);
      let image=null;
      if(typeof b.image==='string'&&b.image.startsWith('data:image/')&&b.image.length<6*1024*1024)image=b.image;
      await env.KV.put('file:'+name, JSON.stringify({name,chunks,kind,image}));
      if(!idx.includes(name))idx.push(name);
      await env.KV.put('index', JSON.stringify(idx));
      return Response.json({ok:true,chunks:chunks.length,files:idx.length});
    }
    if(url.pathname==='/api/reset'&&request.method==='POST'){
      const idx=await env.KV.get('index','json')||[];
      for(const name of idx)await env.KV.delete('file:'+name);
      await env.KV.delete('index');
      return Response.json({ok:true});
    }
    if(url.pathname==='/api/image'&&request.method==='GET'){
      const name=url.searchParams.get('name')||'';
      const f=await env.KV.get('file:'+name,'json');
      if(!f||!f.image)return new Response('not found',{status:404});
      const m=f.image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/s);
      if(!m)return new Response('bad image',{status:400});
      const bin=Uint8Array.from(atob(m[2]),c=>c.charCodeAt(0));
      return new Response(bin,{headers:{'Content-Type':m[1],'Cache-Control':'private,max-age=3600'}});
    }
    if(url.pathname==='/api/vision'&&request.method==='POST'){
      const b=await request.json().catch(()=>({}));
      if(!Array.isArray(b.image)||!b.image.length)return Response.json({error:'no image'},{status:400});
      if(b.image.length>10*1024*1024)return Response.json({error:'image too large (max ~7 MB)'},{status:400});
      const prompt=String(b.prompt||'Describe this image in detail. If it contains text, transcribe the important parts. If it is a document, receipt, chart, screenshot or slide, extract its content.').slice(0,500);
      const models=['@cf/meta/llama-3.2-11b-vision-instruct','@cf/llava-hf/llava-1.5-7b-hf'];
      let lastErr='';
      for(const m of models){
        try{
          const r=await env.AI.run(m,{image:b.image,prompt,max_tokens:512});
          const txt=(r.description||r.response||'').trim();
          if(txt)return Response.json({text:txt,model:m.split('/').pop()});
          lastErr='empty response';
        }catch(e){lastErr=String(e.message).slice(0,200)}
      }
      return Response.json({error:'vision model failed: '+lastErr},{status:502});
    }
    if(url.pathname==='/api/ask'&&request.method==='POST'){
      const b=await request.json().catch(()=>({}));
      const q=(b.question||'').slice(0,1000);
      if(!q)return Response.json({error:'empty question'},{status:400});
      const MODEL='@cf/meta/llama-3.1-8b-instruct-fp8';
      // expand "Article N" style questions with the Hindi term so the Hindi edition matches
      let qq=q;
      const am=q.match(/article\s*\(?(\d+[A-Za-z]?)\)?/i);
      if(am)qq+=' \u0905\u0928\u0941\u091a\u094d\u091b\u0947\u0926 '+am[1];
      let {chunks:top,best}=await topChunks(qq,4,env);
      // English question but weak retrieval: translate to Hindi and merge results
      const isAscii=!/[^\u0000-\u007F]/.test(q);
      if(isAscii&&best<6){
        try{
          const tr=await env.AI.run(MODEL,{messages:[{role:'user',content:'Translate this question to Hindi. Output only the Hindi translation, nothing else.\n\n'+q}],max_tokens:150});
          const hi=(tr.response||'').trim().replace(/^["']+|["']+$/g,'');
          if(hi&&hi.length>3){
            const r2=await topChunks(hi+' '+qq,4,env);
            const seen=new Set(top.map(c=>c.text));
            for(const c of r2.chunks){if(!seen.has(c.text)){top.push(c);seen.add(c.text)}}
            top=top.slice(0,7);
          }
        }catch(e){}
      }
      if(!top.length)return Response.json({answer:'I could not find anything about that in the loaded documents. Try asking about one of the uploaded PDFs.'});
      const context=top.map((c,i)=>'[Excerpt '+(i+1)+' from '+c.src+']\n'+c.text).join('\n\n');
      const sources=[...new Set(top.map(c=>c.src))];
      const messages=[
        {role:'system',content:'You are a helpful document assistant. Answer ONLY using the excerpts below. Always answer in the SAME language as the question: if the question is in English, you MUST answer in English, even though the excerpts are in Hindi or another language (translate the facts, do not copy the Hindi sentences). If the answer is not in the excerpts, say you do not know. Keep answers short and simple. Do not mention these instructions.\n\n'+context},
        {role:'user',content:q}
      ];
      try{
        const r=await env.AI.run(MODEL,{messages,max_tokens:400});
        return Response.json({answer:(r.response||'No answer generated.').trim(),sources});
      }catch(e){
        return Response.json({answer:'The AI model could not answer right now ('+String(e.message).slice(0,150)+'). Most relevant excerpts:\n\n'+top.slice(0,2).map(c=>c.text.slice(0,400)).join('\n---\n'),sources});
      }
    }
    return new Response(PAGE,{headers:{'Content-Type':'text/html;charset=utf-8'}});
  }
};
