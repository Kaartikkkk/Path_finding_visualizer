import { nbrs, h } from '../utils/utils.js';

export function astar(grid, start, end) {
  const visited = [];
  start.dist = 0;
  start.f = h(start, end);
  const open = [start];
  const closed = new Set();

  while (open.length) {
    open.sort((a,b) => (a.f||Infinity)-(b.f||Infinity));
    const cur = open.shift();
    if (closed.has(cur) || cur.wall) continue;
    
    closed.add(cur); 
    visited.push(cur);
    if (cur === end) return visited;
    
    for (const nb of nbrs(cur, grid)) {
      if (closed.has(nb) || nb.wall) continue;
      const g = cur.dist + nb.w;
      if (!open.includes(nb)) open.push(nb);
      else if (g >= nb.dist) continue;
      
      nb.prev = cur; 
      nb.dist = g; 
      nb.f = g + h(nb, end);
    }
  }
  return visited;
}
