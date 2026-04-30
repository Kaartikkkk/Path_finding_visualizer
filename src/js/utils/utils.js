export const S = {
  grid:[], rows:0, cols:0,
  sr:0, sc:0, er:0, ec:0,
  algo:'astar',
  running:false, mdown:false,
  drag:null, mode:'wall',
  speed:3, aids:[],
  cs:20,
};

export const SPEEDS = [90,42,18,7,1];

export function mkNode(r,c) {
  return {
    r,c,
    wall:false, vis:false, path:false,
    dist:Infinity, f:Infinity, prev:null, w:1,
    get isStart(){ return r===S.sr && c===S.sc; },
    get isEnd(){ return r===S.er && c===S.ec; },
  };
}

export function mkGrid() {
  S.grid = Array.from({length:S.rows},(_,r)=>Array.from({length:S.cols},(_,c)=>mkNode(r,c)));
}

export function resetNodes() {
  S.grid.forEach(row=>row.forEach(n=>{
    n.vis=false; n.path=false; n.dist=Infinity; n.f=Infinity; n.prev=null;
  }));
}

export function nbrs(node, grid) {
  const {r,c} = node, R=grid.length, C=grid[0].length, out=[];
  if (r>0) out.push(grid[r-1][c]);
  if (r<R-1) out.push(grid[r+1][c]);
  if (c>0) out.push(grid[r][c-1]);
  if (c<C-1) out.push(grid[r][c+1]);
  return out;
}

export function h(a,b) { return Math.abs(a.r-b.r)+Math.abs(a.c-b.c); }

export function getPath(end) {
  const p=[]; let cur=end;
  while (cur) { p.unshift(cur); cur=cur.prev; }
  return p;
}

export function divMaze(rs,cs,re,ce,walls) {
  if(re-rs<2||ce-cs<2) return;
  const horiz=(re-rs)>(ce-cs);
  if(horiz){
    const wr=rs+1+Math.floor(Math.random()*Math.floor((re-rs-1)/2))*2;
    const passC=cs+Math.floor(Math.random()*Math.floor((ce-cs)/2+1))*2;
    for(let c=cs-1;c<=ce+1;c++) if(c!==passC) walls.push([wr,c]);
    divMaze(rs,cs,wr-1,ce,walls); divMaze(wr+1,cs,re,ce,walls);
  } else {
    const wc=cs+1+Math.floor(Math.random()*Math.floor((ce-cs-1)/2))*2;
    const passR=rs+Math.floor(Math.random()*Math.floor((re-rs)/2+1))*2;
    for(let r=rs-1;r<=re+1;r++) if(r!==passR) walls.push([r,wc]);
    divMaze(rs,cs,re,wc-1,walls); divMaze(rs,wc+1,re,ce,walls);
  }
}
