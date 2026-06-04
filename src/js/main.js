import { S, SPEEDS, mkGrid, resetNodes, getPath, divMaze } from './utils/utils.js';
import { astar } from './algorithms/astar.js';
import { dijkstra } from './algorithms/dijkstra.js';
import { bfs } from './algorithms/bfs.js';
import { dfs } from './algorithms/dfs.js';

const ALGOS = {
  astar: {
    key:'astar', name:'A* Search',
    sub:'Heuristic-guided optimal search',
    optimal:true, weighted:true,
    time:'O(E log V)', space:'O(V)',
    desc:'Uses Manhattan distance heuristic to guide search. Fastest optimal algorithm for grid navigation.',
    color:'#00d4ff',
    fn: astar,
  },
  dijkstra: {
    key:'dijkstra', name:"Dijkstra's",
    sub:'Optimal weighted graph traversal',
    optimal:true, weighted:true,
    time:'O((V+E) log V)', space:'O(V)',
    desc:'Explores nodes by increasing cost. Guarantees shortest path and handles weighted edges perfectly.',
    color:'#f59e0b',
    fn: dijkstra,
  },
  bfs: {
    key:'bfs', name:'Breadth-First Search',
    sub:'Level-by-level unweighted search',
    optimal:true, weighted:false,
    time:'O(V + E)', space:'O(V)',
    desc:'Explores all neighbors level by level. Guarantees shortest path on unweighted grids.',
    color:'#10b981',
    fn: bfs,
  },
  dfs: {
    key:'dfs', name:'Depth-First Search',
    sub:'Deep exploration, no path guarantee',
    optimal:false, weighted:false,
    time:'O(V + E)', space:'O(V)',
    desc:'Goes as deep as possible before backtracking. Does NOT guarantee the shortest path.',
    color:'#ef4444',
    fn: dfs,
  },
};

const canvas = document.getElementById('gc');
const ctx = canvas.getContext('2d');

function computeSize() {
  const wrap = document.getElementById('gWrap');
  const W = wrap.clientWidth - 28, H = wrap.clientHeight - 28;
  const cs = S.cs;
  S.cols = Math.max(5, Math.floor(W/cs)); if(S.cols%2===0) S.cols--;
  S.rows = Math.max(5, Math.floor(H/cs)); if(S.rows%2===0) S.rows--;
  canvas.width = S.cols*cs; canvas.height = S.rows*cs;
}

function draw() {
  ctx.fillStyle='#080c12'; ctx.fillRect(0,0,canvas.width,canvas.height);
  const cs=S.cs;
  for(let r=0;r<S.rows;r++) for(let c=0;c<S.cols;c++) {
    drawCell(S.grid[r][c], c*cs, r*cs, cs);
  }
}

function drawCell(n, x, y, cs) {
  const pad=1;

  if (n.isStart) {
    ctx.fillStyle='#064e3b'; ctx.fillRect(x,y,cs,cs);
    ctx.shadowColor='#10b981'; ctx.shadowBlur=10;
    ctx.fillStyle='#10b981';
    const s=cs*.6; ctx.fillRect(x+(cs-s)/2,y+(cs-s)/2,s,s);
    ctx.shadowBlur=0;
    ctx.fillStyle='#ffffff'; ctx.font=`bold ${cs*.42}px sans-serif`;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('▶',x+cs/2,y+cs/2);
    return;
  }

  if (n.isEnd) {
    ctx.fillStyle='#7f1d1d'; ctx.fillRect(x,y,cs,cs);
    ctx.shadowColor='#ef4444'; ctx.shadowBlur=10;
    ctx.fillStyle='#ef4444';
    const s=cs*.6; ctx.fillRect(x+(cs-s)/2,y+(cs-s)/2,s,s);
    ctx.shadowBlur=0;
    ctx.fillStyle='#ffffff'; ctx.font=`bold ${cs*.42}px sans-serif`;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('⬤',x+cs/2,y+cs/2);
    return;
  }

  if (n.wall) {
    ctx.fillStyle='#475569'; ctx.fillRect(x,y,cs,cs);
    ctx.fillStyle='#cbd5e1'; ctx.fillRect(x+pad,y+pad,cs-pad*2,cs-pad*2);
    return;
  }

  if (n.path) {
    ctx.fillStyle='#ca8a04'; ctx.fillRect(x,y,cs,cs);
    ctx.shadowColor='#fef08a'; ctx.shadowBlur=8;
    ctx.fillStyle='#fef08a';
    const s=cs*.6; ctx.fillRect(x+(cs-s)/2,y+(cs-s)/2,s,s);
    ctx.shadowBlur=0;
    return;
  }

  if (n.vis) {
    ctx.fillStyle='#1d4ed8'; ctx.fillRect(x,y,cs,cs);
    ctx.fillStyle='#3b82f6'; ctx.fillRect(x+pad,y+pad,cs-pad*2,cs-pad*2);
    return;
  }

  if (n.w>1) {
    ctx.fillStyle='#9a3412'; ctx.fillRect(x,y,cs,cs);
    ctx.fillStyle='#f97316'; ctx.fillRect(x+pad,y+pad,cs-pad*2,cs-pad*2);
    ctx.fillStyle='#ffffff'; ctx.font=`bold ${cs*.45}px sans-serif`;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('W',x+cs/2,y+cs/2);
    return;
  }

  // Empty cells - made brighter so the grid is visible
  ctx.fillStyle='#1e293b'; ctx.fillRect(x,y,cs,cs);
  ctx.fillStyle='#0f172a'; ctx.fillRect(x+pad,y+pad,cs-pad*2,cs-pad*2);
}

function redraw(r,c) {
  const n=S.grid[r][c];
  drawCell(n, c*S.cs, r*S.cs, S.cs);
}

function buildAlgoList() {
  const el = document.getElementById('algoList');
  el.innerHTML='';
  Object.values(ALGOS).forEach(a=>{
    const d=document.createElement('div');
    d.className='algo-card'; d.id=`ac-${a.key}`;
    d.style.setProperty('--c',a.color);
    d.innerHTML=`
      <div class="algo-card-hdr">
        <span class="algo-name">${a.name}</span>
        <span class="badge ${a.optimal?'b-ok':'b-no'}">${a.optimal?'Optimal':'Sub-opt'}</span>
      </div>
      <div class="algo-sub">${a.sub}</div>`;
    d.onclick=()=>selectAlgo(a.key);
    el.appendChild(d);
  });
}

function selectAlgo(key) {
  S.algo=key;
  document.querySelectorAll('.algo-card').forEach(c=>c.classList.remove('active'));
  document.getElementById(`ac-${key}`).classList.add('active');
  const a=ALGOS[key];
  document.getElementById('ibName').textContent=a.name;
  document.getElementById('ibName').style.color=a.color;
  document.getElementById('ibTime').textContent=a.time;
  document.getElementById('ibSpace').textContent=a.space;
  const opt=document.getElementById('ibOpt');
  opt.textContent=a.optimal?'✓ Optimal':'✗ Not Optimal';
  opt.style.color=a.optimal?'#10b981':'#ef4444';
  document.getElementById('ibDesc').textContent=a.desc;
  
  // Update global accent color to match algorithm
  document.documentElement.style.setProperty('--accent', a.color);
  // Optional: update glow based on color
  const rgb = hexToRgb(a.color);
  if(rgb) document.documentElement.style.setProperty('--accent-dim', `rgba(${rgb.r},${rgb.g},${rgb.b},0.12)`);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}

function handleRun() {
  if (S.running) { stopAnim(); return; }
  clearPath(false);
  resetNodes();

  S.running=true;
  setStatus('running','Running '+ALGOS[S.algo].name+'…');
  const btn=document.getElementById('btnRun');
  btn.textContent='⏹  Stop'; btn.classList.add('stop');

  const start=S.grid[S.sr][S.sc], end=S.grid[S.er][S.ec];

  const t0=performance.now();
  const visited=ALGOS[S.algo].fn(S.grid,start,end);
  const dt=performance.now()-t0;

  const path=getPath(end);
  const found=path.length > 1 && path[0] === start;

  updateStats(visited.length, found?path.length:0, dt);

  animVisited(visited, ()=>{
    if(!S.running) return;
    if(found) {
      animPath(path, ()=>{
        setStatus('done',`Path found — ${path.length} nodes · ${visited.length} visited · ${dt.toFixed(1)}ms`);
        showToast('✓ Path found in '+path.length+' steps','ok');
        finishRun();
      });
    } else {
      setStatus('done','No path exists between start and end.');
      showToast('✗ No path found','err');
      finishRun();
    }
  });
}

function finishRun() {
  S.running=false;
  const btn=document.getElementById('btnRun');
  btn.textContent='▶ \u00A0Visualize'; btn.classList.remove('stop');
}

function stopAnim() {
  S.aids.forEach(id=>clearTimeout(id)); S.aids=[];
  S.running=false;
  const btn=document.getElementById('btnRun');
  btn.textContent='▶ \u00A0Visualize'; btn.classList.remove('stop');
  setStatus('ready','Stopped. Clear path and try again.');
}

function animVisited(nodes, cb) {
  const delay=SPEEDS[S.speed-1];
  nodes.forEach((n,i)=>{
    const id=setTimeout(()=>{
      if(!n.isStart&&!n.isEnd){ n.vis=true; redraw(n.r,n.c); }
      document.getElementById('stV').textContent=i+1;
      if(i===nodes.length-1) cb();
    },i*delay);
    S.aids.push(id);
  });
  if(!nodes.length) cb();
}

function animPath(path, cb) {
  path.forEach((n,i)=>{
    const id=setTimeout(()=>{
      if(!n.isStart&&!n.isEnd){ n.path=true; n.vis=false; redraw(n.r,n.c); }
      document.getElementById('stP').textContent=i+1;
      if(i===path.length-1) cb();
    },i*22);
    S.aids.push(id);
  });
}

function clearPath(redrawAll=true) {
  S.grid.forEach(row=>row.forEach(n=>{
    n.vis=false; n.path=false;
    n.dist=Infinity; n.f=Infinity; n.prev=null;
  }));
  updateStats(0,0,0);
  if(redrawAll) draw();
  setStatus('ready','Path cleared. Ready to run.');
}

function clearAll() {
  S.aids.forEach(id=>clearTimeout(id)); S.aids=[];
  S.running=false;
  const btn=document.getElementById('btnRun');
  btn.textContent='▶ \u00A0Visualize'; btn.classList.remove('stop');
  mkGrid(); updateStats(0,0,0); draw();
  setStatus('ready','Grid cleared. Ready.');
}

function makeMaze() {
  clearAll();
  const walls=[];
  divMaze(1,1,S.rows-2,S.cols-2,walls);
  walls.forEach(([r,c])=>{
    if(r>=0&&r<S.rows&&c>=0&&c<S.cols){
      const n=S.grid[r][c];
      if(!n.isStart&&!n.isEnd) n.wall=true;
    }
  });
  draw();
  showToast('⊞ Recursive maze generated','inf');
}

function randWalls() {
  clearAll();
  S.grid.forEach(row=>row.forEach(n=>{
    if(!n.isStart&&!n.isEnd&&Math.random()<0.3) n.wall=true;
  }));
  draw();
  showToast('⊠ Random walls placed','inf');
}

function setMode(m) {
  S.mode=m;
  document.querySelectorAll('.mode-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById(m==='wall'?'mWall':'mWeight').classList.add('active');
}

function setSpeed(v) {
  S.speed=parseInt(v);
  const labels=['Slow','Normal-slow','Normal','Fast','Instant'];
  document.getElementById('spLbl').textContent=labels[S.speed-1];
}

function getCell(e) {
  const rect=canvas.getBoundingClientRect();
  const x=e.clientX-rect.left, y=e.clientY-rect.top;
  const c=Math.floor(x/S.cs), r=Math.floor(y/S.cs);
  if(r<0||r>=S.rows||c<0||c>=S.cols) return null;
  return {r,c};
}

function toggle(r,c){
  const n=S.grid[r][c];
  if(n.isStart||n.isEnd) return;
  if(S.mode==='wall'){
    n.wall=!n.wall; n.w=1;
  } else {
    if(!n.wall) n.w=n.w>1?1:3;
  }
  redraw(r,c);
}

function updateStats(v,p,t) {
  document.getElementById('stV').textContent=v;
  document.getElementById('stP').textContent=p||'—';
  document.getElementById('stT').textContent=t?t.toFixed(1)+'ms':'0ms';
  document.getElementById('stE').textContent=v&&p?((p/v)*100).toFixed(0)+'%':'—';
}

function setStatus(type,msg){
  document.getElementById('sDot').className='sd '+type;
  document.getElementById('sMsg').textContent=msg;
}

function showToast(msg,type){
  const t=document.getElementById('toast');
  t.textContent=msg; t.className='toast '+type+' show';
  setTimeout(()=>t.classList.remove('show'),2800);
}

function init() {
  computeSize();
  S.sr=Math.floor(S.rows/2); S.sc=Math.floor(S.cols*.15);
  S.er=Math.floor(S.rows/2); S.ec=Math.floor(S.cols*.85);
  mkGrid();
  document.getElementById('iR').textContent=S.rows;
  document.getElementById('iC').textContent=S.cols;
  document.getElementById('iN').textContent=S.rows*S.cols;
  draw();
  buildAlgoList();
  selectAlgo('astar');

  // Tutorial logic
  if (localStorage.getItem('tutSeen') !== 'true') {
    setTimeout(() => {
      document.getElementById('tutModal').classList.add('show');
    }, 500);
  }
}

// Event Listeners
canvas.addEventListener('mousedown',e=>{
  if(S.running) return;
  S.mdown=true;
  const cell=getCell(e); if(!cell) return;
  const n=S.grid[cell.r][cell.c];
  if(n.isStart){S.drag='start';return;}
  if(n.isEnd){S.drag='end';return;}
  toggle(cell.r,cell.c);
});

canvas.addEventListener('mousemove',e=>{
  if(!S.mdown||S.running) return;
  const cell=getCell(e); if(!cell) return;

  if(S.drag==='start'){
    const n=S.grid[cell.r][cell.c];
    if(n.isEnd||n.wall) return;
    const pr=S.sr,pc=S.sc;
    S.sr=cell.r; S.sc=cell.c;
    redraw(pr,pc); redraw(cell.r,cell.c);
    return;
  }
  if(S.drag==='end'){
    const n=S.grid[cell.r][cell.c];
    if(n.isStart||n.wall) return;
    const pr=S.er,pc=S.ec;
    S.er=cell.r; S.ec=cell.c;
    redraw(pr,pc); redraw(cell.r,cell.c);
    return;
  }
  toggle(cell.r,cell.c);
});

canvas.addEventListener('mouseup',()=>{S.mdown=false;S.drag=null;});
canvas.addEventListener('mouseleave',()=>{S.mdown=false;S.drag=null;});

window.addEventListener('resize',()=>{
  computeSize();
  S.sr=Math.floor(S.rows/2); S.sc=Math.floor(S.cols*.15);
  S.er=Math.floor(S.rows/2); S.ec=Math.floor(S.cols*.85);
  mkGrid();
  document.getElementById('iR').textContent=S.rows;
  document.getElementById('iC').textContent=S.cols;
  document.getElementById('iN').textContent=S.rows*S.cols;
  draw();
});

// Expose globals for HTML onclick handlers
window.handleRun = handleRun;
window.clearPath = () => clearPath(true);
window.clearAll = clearAll;
window.makeMaze = makeMaze;
window.randWalls = randWalls;
window.setMode = setMode;
window.setSpeed = setSpeed;
window.closeTutorial = () => {
  document.getElementById('tutModal').classList.remove('show');
  localStorage.setItem('tutSeen', 'true');
};
window.openGuide = () => document.getElementById('guideModal').classList.add('show');
window.closeGuide = () => document.getElementById('guideModal').classList.remove('show');
window.openContact = () => document.getElementById('contactModal').classList.add('show');
window.closeContact = () => document.getElementById('contactModal').classList.remove('show');

document.getElementById('contactForm')?.addEventListener('submit', function(event) {
  event.preventDefault();
  const btn = document.querySelector('.btn-contact-submit');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  const serviceID = 'YOUR_SERVICE_ID'; // Replace with EmailJS Service ID
  const templateID = 'YOUR_TEMPLATE_ID'; // Replace with EmailJS Template ID

  const templateParams = {
    from_name: document.getElementById('senderName').value,
    from_email: document.getElementById('senderEmail').value,
    message: document.getElementById('senderMessage').value
  };

  emailjs.send(serviceID, templateID, templateParams)
    .then(() => {
      btn.textContent = 'Send Message';
      btn.disabled = false;
      document.getElementById('contactForm').reset();
      window.closeContact();
      showToast('✓ Message sent successfully!', 'ok');
    }, (err) => {
      btn.textContent = 'Send Message';
      btn.disabled = false;
      showToast('✗ Failed to send message.', 'err');
      console.error('EmailJS Error:', err);
    });
});

init();
