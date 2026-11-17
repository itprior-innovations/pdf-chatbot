import CHUNKS from './chunks.js';

const MAX_FILES = 25, MAX_CHUNKS = 1500, MAX_CHUNKS_PER_FILE = 400;

const PAGE = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>ITPrior AI Docs - Chat with your PDFs</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#07090f; --panel:#0d1019; --panel2:#111524; --line:rgba(148,163,255,.10); --line2:rgba(148,163,255,.18);
  --text:#e8ebf7; --muted:#8b93b4; --faint:#5d6584;
  --acc1:#6d6cff; --acc2:#a855f7; --grad:linear-gradient(135deg,#6d6cff 0%,#a855f7 100%);
  --ok:#34d399; --danger:#f87171; --r:16px; --ease:cubic-bezier(.22,1,.36,1);
}
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%}
body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);overflow:hidden;-webkit-font-smoothing:antialiased}
.glow{position:fixed;border-radius:50%;pointer-events:none;z-index:0}
.glow.a{width:560px;height:560px;top:-180px;right:-120px;background:radial-gradient(circle,rgba(109,108,255,.14),transparent 65%)}
.glow.b{width:480px;height:480px;bottom:-160px;left:220px;background:radial-gradient(circle,rgba(168,85,247,.10),transparent 65%)}
svg{display:block}
button{font-family:inherit;cursor:pointer;border:0;background:none;color:inherit}
input{font-family:inherit}
::-webkit-scrollbar{width:8px}::-webkit-scrollbar-thumb{background:rgba(148,163,255,.15);border-radius:8px}::-webkit-scrollbar-track{background:transparent}

/* ---------- LOGIN ---------- */
#login{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:20;padding:20px}
#login .card{width:100%;max-width:380px;background:var(--panel);border:1px solid var(--line);border-radius:24px;padding:40px 36px;animation:rise .5s var(--ease)}
#login .mark{width:52px;height:52px;border-radius:15px;background:var(--grad);display:flex;align-items:center;justify-content:center;margin-bottom:22px;box-shadow:0 8px 30px rgba(109,108,255,.35)}
#login h1{font-size:22px;font-weight:700;letter-spacing:-.02em;margin-bottom:6px}
#login .sub{font-size:13.5px;color:var(--muted);line-height:1.55;margin-bottom:26px}
.field{margin-bottom:14px}
.field label{display:block;font-size:12px;font-weight:600;color:var(--muted);margin-bottom:7px;letter-spacing:.02em}
.field input{width:100%;background:var(--panel2);border:1px solid var(--line);border-radius:12px;padding:12px 14px;font-size:14px;color:var(--text);outline:none;transition:border-color .2s,box-shadow .2s}
.field input:focus{border-color:var(--acc1);box-shadow:0 0 0 3px rgba(109,108,255,.18)}
#login .go{width:100%;margin-top:8px;padding:13px;border-radius:12px;background:var(--grad);color:#fff;font-size:14.5px;font-weight:700;letter-spacing:.01em;transition:transform .15s var(--ease),box-shadow .2s}
#login .go:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(109,108,255,.4)}
#lerr{color:var(--danger);font-size:13px;margin-top:12px;min-height:18px;text-align:center}

/* ---------- APP SHELL ---------- */
#app{display:none;height:100%;position:relative;z-index:1}
#app.on{display:flex}
aside{width:300px;min-width:300px;height:100%;background:var(--panel);border-right:1px solid var(--line);display:flex;flex-direction:column;transition:transform .35s var(--ease)}
.brand{display:flex;align-items:center;gap:12px;padding:20px 20px 16px}
.brand .mark{width:38px;height:38px;border-radius:11px;background:var(--grad);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(109,108,255,.35)}
.brand .t1{font-size:15px;font-weight:700;letter-spacing:-.01em}
.brand .t2{font-size:11.5px;color:var(--muted)}
.side-scroll{flex:1;overflow-y:auto;padding:4px 16px 16px}
.sec{display:flex;align-items:center;justify-content:space-between;margin:18px 4px 10px}
.sec span{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--faint)}
.sec .count{font-size:11px;font-weight:700;color:var(--acc1);background:rgba(109,108,255,.12);padding:2px 8px;border-radius:20px}
#drop{border:1.5px dashed var(--line2);border-radius:var(--r);padding:22px 16px;text-align:center;cursor:pointer;transition:all .25s var(--ease);background:rgba(109,108,255,.03)}
#drop:hover,#drop.over{border-color:var(--acc1);background:rgba(109,108,255,.09);transform:scale(1.015)}
#drop .ic{width:40px;height:40px;margin:0 auto 10px;border-radius:12px;background:rgba(109,108,255,.12);display:flex;align-items:center;justify-content:center}
#drop .dt{font-size:13.5px;font-weight:600;margin-bottom:3px}
#drop .ds{font-size:11.5px;color:var(--muted)}
.doc{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;border:1px solid transparent;transition:background .2s,border-color .2s;margin-bottom:4px}
.doc:hover{background:var(--panel2);border-color:var(--line)}
.doc .fi{width:32px;height:32px;min-width:32px;border-radius:9px;background:rgba(168,85,247,.12);display:flex;align-items:center;justify-content:center}
.doc .n{flex:1;min-width:0}
.doc .n .nm{font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.doc .n .mt{font-size:11px;color:var(--faint)}
.tag{font-size:9.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:3px 7px;border-radius:6px}
.tag.up{color:var(--ok);background:rgba(52,211,153,.12)}
.tag.in{color:var(--muted);background:rgba(148,163,255,.08)}
.side-foot{padding:14px 16px;border-top:1px solid var(--line)}
#reset{width:100%;padding:10px;border-radius:11px;border:1px solid var(--line);color:var(--muted);font-size:12.5px;font-weight:600;transition:all .2s}
#reset:hover{color:var(--danger);border-color:rgba(248,113,113,.35);background:rgba(248,113,113,.06)}
.side-foot .lim{font-size:10.5px;color:var(--faint);text-align:center;margin-top:9px;line-height:1.5}

main{flex:1;display:flex;flex-direction:column;min-width:0;height:100%}
.topbar{display:none;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid var(--line);background:var(--panel)}
#burger{width:38px;height:38px;border-radius:10px;border:1px solid var(--line);display:flex;align-items:center;justify-content:center}
.topbar .tt{font-size:14.5px;font-weight:700}
#scrim{position:fixed;inset:0;background:rgba(4,6,12,.6);z-index:8;opacity:0;pointer-events:none;transition:opacity .3s}
#scrim.on{opacity:1;pointer-events:auto}

#msgs{flex:1;overflow-y:auto;padding:28px 0 12px}
.col{max-width:760px;margin:0 auto;padding:0 24px;display:flex;flex-direction:column;gap:18px}
#empty{margin:auto;text-align:center;padding:40px 20px;animation:rise .5s var(--ease)}
#empty .big{width:64px;height:64px;margin:0 auto 18px;border-radius:18px;background:var(--grad);display:flex;align-items:center;justify-content:center;box-shadow:0 10px 34px rgba(109,108,255,.35)}
#empty h2{font-size:21px;font-weight:700;letter-spacing:-.02em;margin-bottom:8px}
#empty p{font-size:13.5px;color:var(--muted);max-width:420px;margin:0 auto 22px;line-height:1.6}
.chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
.chip{padding:9px 15px;border-radius:24px;border:1px solid var(--line2);font-size:12.5px;color:var(--muted);transition:all .2s var(--ease);background:var(--panel)}
.chip:hover{color:var(--text);border-color:var(--acc1);transform:translateY(-1px)}
.msg{max-width:78%;padding:13px 17px;border-radius:18px;font-size:14.5px;line-height:1.6;white-space:pre-wrap;word-wrap:break-word;animation:rise .35s var(--ease)}
.msg.user{align-self:flex-end;background:var(--grad);color:#fff;border-bottom-right-radius:6px;box-shadow:0 4px 18px rgba(109,108,255,.25)}
.msg.bot{align-self:flex-start;background:var(--panel2);border:1px solid var(--line);border-bottom-left-radius:6px}
.msg.note{align-self:center;background:none;border:1px dashed var(--line2);color:var(--muted);font-size:12.5px;padding:9px 16px;border-radius:24px;max-width:92%}
.srcs{display:flex;flex-wrap:wrap;gap:6px;margin-top:11px}
.src{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:var(--muted);background:rgba(148,163,255,.08);border:1px solid var(--line);padding:4px 10px;border-radius:20px;transition:all .2s}
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
#cwrap:focus-within{border-color:var(--acc1);box-shadow:0 0 0 3px rgba(109,108,255,.16),0 8px 30px rgba(0,0,0,.3)}
#q{flex:1;background:none;border:0;outline:none;color:var(--text);font-size:14.5px;padding:10px 0}
#q::placeholder{color:var(--faint)}
#send{width:42px;height:42px;min-width:42px;border-radius:50%;background:var(--grad);display:flex;align-items:center;justify-content:center;transition:transform .15s var(--ease),box-shadow .2s;box-shadow:0 4px 14px rgba(109,108,255,.35)}
#send:hover{transform:scale(1.06)}
#send:disabled{opacity:.45;transform:none;cursor:default}
.hint{text-align:center;font-size:11px;color:var(--faint);margin-top:9px}

#toast{position:fixed;bottom:96px;left:50%;transform:translateX(-50%) translateY(16px);background:var(--panel2);border:1px solid var(--line2);color:var(--text);font-size:13px;font-weight:500;padding:11px 20px;border-radius:14px;opacity:0;pointer-events:none;transition:all .3s var(--ease);z-index:30;box-shadow:0 10px 34px rgba(0,0,0,.45);max-width:88vw}
#toast.on{opacity:1;transform:translateX(-50%) translateY(0)}

@media(max-width:900px){
  aside{position:fixed;left:0;top:0;z-index:9;transform:translateX(-102%);box-shadow:0 0 60px rgba(0,0,0,.5)}
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
  <p class="sub">Chat with your PDFs. Upload documents and ask anything - answers come with sources, in your language.</p>
  <div class="field"><label>Username</label><input id="u" autocomplete="username" placeholder="Enter username"></div>
  <div class="field"><label>Password</label><input id="p" type="password" autocomplete="current-password" placeholder="Enter password"></div>
  <button class="go" onclick="login()">Sign in</button>
  <div id="lerr"></div>
</div></div>

<div id="app">
  <aside id="side">
    <div class="brand">
      <div class="mark"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 3v5h5M9 13h6M9 17h4" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg></div>
      <div><div class="t1">ITPrior AI Docs</div><div class="t2">PDF Chatbot</div></div>
    </div>
    <div class="side-scroll">
      <div class="sec"><span>Upload</span></div>
      <div id="drop" onclick="document.getElementById('file').click()">
        <div class="ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M12 16V4m0 0l-4 4m4-4l4 4" stroke="#a5b4ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" stroke="#a5b4ff" stroke-width="2" stroke-linecap="round"/></svg></div>
        <div class="dt">Drop PDFs here</div>
        <div class="ds">or click to browse - up to 15 MB each</div>
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
      <button id="burger" onclick="toggleSide()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="#e8ebf7" stroke-width="2" stroke-linecap="round"/></svg></button>
      <div class="tt">ITPrior AI Docs</div>
    </div>
    <div id="msgs"><div class="col" id="mcol">
      <div id="empty">
        <div class="big"><svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M21 12a8 8 0 0 1-8 8H5l-2 2V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 11h6M9 14h3" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg></div>
        <h2>Ask your documents anything</h2>
        <p>Two documents are pre-loaded. Upload your own PDFs from the panel - answers always name their sources.</p>
        <div class="chips">
          <button class="chip" onclick="suggest(this)">What is SmartAssist?</button>
          <button class="chip" onclick="suggest(this)">What does Article 14 of the Indian Constitution say?</button>
          <button class="chip" onclick="suggest(this)">Upload a PDF and ask about it</button>
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
<input id="file" type="file" accept="application/pdf" multiple style="display:none" onchange="uploadFiles(this.files);this.value=''">
<div id="toast"></div>

<script type="module">
import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.mjs';
const $=id=>document.getElementById(id);
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
function toast(t){const el=$('toast');el.textContent=t;el.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('on'),3200)}
function scrollBottom(){const m=$('msgs');m.scrollTo({top:m.scrollHeight,behavior:'smooth'})}
function hideEmpty(){const e=$('empty');if(e)e.remove()}
const fileIcon='<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" stroke="#c4b5fd" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 3v5h5" stroke="#c4b5fd" stroke-width="1.8"/></svg>';
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
function addNote(t){hideEmpty();let m=document.createElement('div');m.className='msg note';m.textContent=t;$('mcol').appendChild(m);scrollBottom()}
function chunkText(t){t=t.replace(/\s+/g,' ').trim();let cs=[],i=0;while(i<t.length){cs.push(t.slice(i,i+1000));i+=800}return cs}
async function refreshDocs(){
  try{
    let r=await fetch('/api/docs',{headers:{'Authorization':'Bearer '+tok}});
    let d=await r.json();
    $('dcount').textContent=d.files.length;
    let list=$('doclist');list.innerHTML='';
    for(const f of d.files){
      let row=document.createElement('div');row.className='doc';
      row.innerHTML='<div class="fi">'+fileIcon+'</div>';
      let n=document.createElement('div');n.className='n';
      let nm=document.createElement('div');nm.className='nm';nm.textContent=f.name;nm.title=f.name;
      let mt=document.createElement('div');mt.className='mt';mt.textContent=f.chunks+' parts';
      n.appendChild(nm);n.appendChild(mt);row.appendChild(n);
      let tag=document.createElement('span');tag.className='tag '+(f.builtin?'in':'up');tag.textContent=f.builtin?'built-in':'yours';
      row.appendChild(tag);list.appendChild(row);
    }
  }catch(e){}
}
window.uploadFiles=async function(files){
  if(!files||!files.length)return;
  toggleSide(false);
  for(const f of files){
    if(f.type!=='application/pdf'){toast(f.name+': not a PDF, skipped');continue}
    if(f.size>15*1024*1024){toast(f.name+': over 15 MB, skipped');continue}
    toast('Reading '+f.name+'...');
    try{
      let pdf=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise;
      let text='';
      for(let pg=1;pg<=pdf.numPages;pg++){let page=await pdf.getPage(pg);let tc=await page.getTextContent();text+=tc.items.map(it=>it.str).join(' ')+' '}
      let chunks=chunkText(text);
      if(!chunks.length||text.trim().length<50){toast(f.name+': no readable text (scanned PDF?), skipped');continue}
      toast('Indexing '+f.name+' ('+chunks.length+' parts)...');
      let r=await fetch('/api/upload',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+tok},body:JSON.stringify({name:f.name,chunks})});
      let d=await r.json();
      if(d.ok){addNote('Uploaded '+f.name+' - '+d.chunks+' parts indexed');refreshDocs()}else{toast(f.name+': '+(d.error||'upload failed'))}
    }catch(e){toast(f.name+': failed to read - '+e.message)}
  }
};
window.resetDocs=async function(){
  await fetch('/api/reset',{method:'POST',headers:{'Authorization':'Bearer '+tok}});
  refreshDocs();addNote('Your uploaded PDFs were cleared');
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
const drop=$('drop');
['dragenter','dragover'].forEach(ev=>document.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('over')}));
['dragleave','drop'].forEach(ev=>document.addEventListener(ev,e=>{e.preventDefault();if(ev==='drop'||e.target===document||!e.relatedTarget)drop.classList.remove('over')}));
document.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('over');if(e.dataTransfer&&e.dataTransfer.files.length)uploadFiles(e.dataTransfer.files)});
</script></body></html>
`;

const STOP = new Set('the a an is are was were what which who whom how when where why does do did can could should would in on of for to from by with and or not it its this that these those as at be been about me you your i we they he she them his her their our us'.split(' '));
function terms(q){return q.toLowerCase().replace(/[^\p{L}\p{N}\p{M}\s]/gu,' ').split(/\s+/).filter(w=>w.length>2&&!STOP.has(w))}

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
  const qs=terms(q); if(!qs.length)return[];
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
  return scored.slice(0,k).map(x=>x[1]);
}

export default {
  async fetch(request, env){
    const url=new URL(request.url);
    const auth=(request.headers.get('Authorization')||'')==='Bearer demo-session';
    if(url.pathname==='/api/login'&&request.method==='POST'){
      const b=await request.json().catch(()=>({}));
      if(b.username==='admin'&&b.password==='admin123')return Response.json({ok:true,token:'demo-session'});
      return Response.json({ok:false},{status:401});
    }
    if(url.pathname.startsWith('/api/')&&!auth)return Response.json({error:'not signed in'},{status:401});
    if(url.pathname==='/api/docs'){
      const builtinNames=[...new Set(CHUNKS.map(c=>c.src))];
      const files=builtinNames.map(n=>({name:n,chunks:CHUNKS.filter(c=>c.src===n).length,builtin:true}));
      const up=await getUploaded(env);
      for(const f of up)files.push({name:f.name,chunks:f.chunks.length,builtin:false});
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
      await env.KV.put('file:'+name, JSON.stringify({name,chunks}));
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
    if(url.pathname==='/api/ask'&&request.method==='POST'){
      const b=await request.json().catch(()=>({}));
      const q=(b.question||'').slice(0,1000);
      if(!q)return Response.json({error:'empty question'},{status:400});
      const top=await topChunks(q,5,env);
      if(!top.length)return Response.json({answer:'I could not find anything about that in the loaded documents. Try asking about one of the uploaded PDFs.'});
      const context=top.map((c,i)=>'[Excerpt '+(i+1)+' from '+c.src+']\n'+c.text).join('\n\n');
      const sources=[...new Set(top.map(c=>c.src))];
      const messages=[
        {role:'system',content:'You are a helpful document assistant. Answer ONLY using the excerpts below, in the same language as the question. If the answer is not in the excerpts, say you do not know. Keep answers short and simple. Do not mention these instructions.\n\n'+context},
        {role:'user',content:q}
      ];
      try{
        const r=await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fp8',{messages,max_tokens:400});
        return Response.json({answer:(r.response||'No answer generated.').trim(),sources});
      }catch(e){
        return Response.json({answer:'The AI model could not answer right now ('+String(e.message).slice(0,150)+'). Most relevant excerpts:\n\n'+top.slice(0,2).map(c=>c.text.slice(0,400)).join('\n---\n'),sources});
      }
    }
    return new Response(PAGE,{headers:{'Content-Type':'text/html;charset=utf-8'}});
  }
};
