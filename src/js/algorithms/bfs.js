import { nbrs } from '../utils/utils.js';

export function bfs(grid, start, end) {
  const visited = [];
  const queue = [start];
  const closed = new Set([start]);
  
  while (queue.length) {
    const cur = queue.shift();
    visited.push(cur);
    if (cur === end) return visited;
    
    for (const nb of nbrs(cur, grid)) {
      if (!closed.has(nb) && !nb.wall) {
        closed.add(nb);
        nb.prev = cur;
        queue.push(nb);
      }
    }
  }
  return visited;
}
