import { nbrs } from '../utils/utils.js';

export function dijkstra(grid, start, end) {
  const visited = [];
  start.dist = 0;
  const open = [start];
  const closed = new Set();
  
  while (open.length) {
    open.sort((a,b) => a.dist - b.dist);
    const cur = open.shift();
    if (closed.has(cur) || cur.wall) continue;
    
    closed.add(cur); 
    visited.push(cur);
    if (cur === end) return visited;
    
    for (const nb of nbrs(cur, grid)) {
      if (closed.has(nb) || nb.wall) continue;
      const d = cur.dist + nb.w;
      if (!open.includes(nb)) open.push(nb);
      else if (d >= nb.dist) continue;
      
      nb.prev = cur; 
      nb.dist = d;
    }
  }
  return visited;
}
