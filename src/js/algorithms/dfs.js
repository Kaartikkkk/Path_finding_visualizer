import { nbrs } from '../utils/utils.js';

export function dfs(grid, start, end) {
  const visited = [];
  const stack = [start];
  const closed = new Set();
  
  while (stack.length) {
    const cur = stack.pop();
    if (closed.has(cur) || cur.wall) continue;
    
    closed.add(cur);
    visited.push(cur);
    if (cur === end) return visited;
    
    for (const nb of nbrs(cur, grid)) {
      if (!closed.has(nb) && !nb.wall) {
        nb.prev = cur;
        stack.push(nb);
      }
    }
  }
  return visited;
}
