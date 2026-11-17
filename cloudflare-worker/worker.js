import CHUNKS from './chunks.js';

const MAX_FILES = 25, MAX_CHUNKS = 1500, MAX_CHUNKS_PER_FILE = 400;


const PAGE = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ITPrior AI Docs - PDF Chatbot</title>
<style>
body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#0f172a;color:#e2e8f0;min-height:100vh;display:flex;flex-direction:column}
header{background:#1e293b;padding:14px 20px;border-bottom:1px solid #334155;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
header h1{margin:0;font-size:18px}header p{margin:0;font-size:12px;color:#94a3b8;flex:1}
#login{max-width:340px;margin:12vh auto;background:#1e293b;padding:28px;border-radius:12px;border:1px solid #334155}
#login h2{margin:0 0 6px;font-size:18px}#login p{color:#94a3b8;font-size:13px;margin:0 0 16px}
input,button{font-size:14px;padding:10px 12px;border-radius:8px;border:1px solid #475569;background:#0f172a;color:#e2e8f0;box-sizing:border-box}
#login input{width:100%;margin-bottom:10px}
#login button{width:100%}
button{background:#2563eb;border:0;cursor:pointer;font-weight:600}button:hover{background:#1d4ed8}button:disabled{opacity:.6}
#chat{display:none;flex:1;flex-direction:column;max-width:860px;width:100%;margin:0 auto;padding:16px;box-sizing:border-box}
#bar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px}
#bar .lbl{font-size:12px;color:#94a3b8}
#up{background:#059669;padding:8px 14px}#reset{background:#475569;padding:8px 14px}
#docs{font-size:12px;color:#94a3b8;margin-bottom:8px;line-height:1.6}
#docs b{color:#cbd5e1}
#msgs{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:10px;padding-bottom:12px;min-height:200px}
.msg{max-width:82%;padding:10px 14px;border-radius:12px;white-space:pre-wrap;line-height:1.45;font-size:14px}
.user{align-self:flex-end;background:#2563eb}
.bot{align-self:flex-start;background:#1e293b;border:1px solid #334155}
.src{font-size:11px;color:#64748b;margin-top:6px}
#form{display:flex;gap:8px}#q{flex:1}#send{width:auto;padding:10px 18px}
.err{color:#f87171;font-size:13px}
</style></head><body>
<header><h1>ITPrior AI Docs - PDF Chatbot</h1><p>Upload PDFs and ask questions about them. Pre-loaded: SmartAssist overview (English) and Constitution of India (Hindi edition)</p></header>
<div id="login"><h2>Sign in</h2><p>Demo login</p>
<input id="u" placeholder="Username" autocomplete="username"><input id="p" type="password" placeholder="Password" autocomplete="current-password">
<button onclick="login()">Sign in</button><div id="lerr" class="err"></div></div>
<div id="chat">
<div id="bar"><button id="up" onclick="document.getElementById('file').click()">+ Upload PDFs</button><input id="file" type="file" accept="application/pdf" multiple style="display:none" onchange="uploadFiles(this.files)"><button id="reset" onclick="resetDocs()">Clear my uploads</button><span class="lbl" id="stat"></span></div>
<div id="docs"></div>
<div id="msgs"></div>
<div id="form"><input id="q" placeholder="Ask about the documents..." onkeydown="if(event.key==='Enter')ask()"><button id="send" onclick="ask()">Ask</button></div></div>
<script type="module">
import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.mjs';
let tok=localStorage.getItem('t');
if(tok){showChat();refreshDocs()}
function showChat(){document.getElementById('login').style.display='none';document.getElementById('chat').style.display='flex'}
window.login=async function(){let r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:u.value,password:p.value})});
let d=await r.json();if(d.ok){tok=d.token;localStorage.setItem('t',tok);showChat();refreshDocs()}else{lerr.textContent='Wrong username or password'}}
function add(t,c,src){let m=document.createElement('div');m.className='msg '+c;m.textContent=t;if(src){let s=document.createElement('div');s.className='src';s.textContent=src;m.appendChild(s)}msgs.appendChild(m);m.scrollIntoView()}
function chunkText(t){t=t.replace(/\\s+/g,' ').trim();let cs=[],i=0;while(i<t.length){cs.push(t.slice(i,i+1000));i+=800}return cs}
window.uploadFiles=async function(files){
  for(const f of files){
    if(f.type!=='application/pdf'){add(f.name+': not a PDF, skipped','bot');continue}
    if(f.size>15*1024*1024){add(f.name+': over 15 MB, skipped','bot');continue}
    stat.textContent='Reading '+f.name+'...';
    try{
      let pdf=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise;
      let text='';for(let pg=1;pg<=pdf.numPages;pg++){let page=await pdf.getPage(pg);let tc=await page.getTextContent();text+=tc.items.map(it=>it.str).join(' ')+' '}
      let chunks=chunkText(text);
      if(!chunks.length||text.trim().length<50){add(f.name+': could not read text (scanned/image PDF?), skipped','bot');continue}
      stat.textContent='Indexing '+f.name+' ('+chunks.length+' parts)...';
      let r=await fetch('/api/upload',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+tok},body:JSON.stringify({name:f.name,chunks})});
      let d=await r.json();
      if(d.ok){add('Uploaded: '+f.name+' ('+d.chunks+' parts indexed, '+d.files+' files total)','bot')}else{add(f.name+': '+(d.error||'upload failed'),'bot')}
    }catch(e){add(f.name+': failed to read - '+e.message,'bot')}
  }
  stat.textContent='';refreshDocs();
}
window.resetDocs=async function(){await fetch('/api/reset',{method:'POST',headers:{'Authorization':'Bearer '+tok}});refreshDocs();add('Your uploaded PDFs were cleared.','bot')}
async function refreshDocs(){let r=await fetch('/api/docs',{headers:{'Authorization':'Bearer '+tok}});let d=await r.json();
docs.innerHTML='<b>Documents ('+d.total_chunks+' parts):</b> '+d.files.join(' &middot; ')}
window.ask=async function(){let question=q.value.trim();if(!question)return;q.value='';add(question,'user');let th=document.createElement('div');th.className='msg bot';th.textContent='Thinking...';msgs.appendChild(th);send.disabled=true;
try{let r=await fetch('/api/ask',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+tok},body:JSON.stringify({question})});
let d=await r.json();th.textContent=d.answer||('Error: '+(d.error||'unknown'));if(d.sources)th.appendChild(Object.assign(document.createElement('div'),{className:'src',textContent:d.sources}))}catch(e){th.textContent='Error: '+e.message}
send.disabled=false;q.focus()}
</script></body></html>`;

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
      const files=['SmartAssist_Test_Document.pdf','Constitution_of_India_Hindi.pdf'];
      const up=await getUploaded(env);
      const all=[...files,...up.map(f=>f.name)];
      const total=CHUNKS.length+up.reduce((n,f)=>n+f.chunks.length,0);
      return Response.json({files:all,total_chunks:total});
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
      const sources='Sources: '+[...new Set(top.map(c=>c.src))].join(', ');
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
