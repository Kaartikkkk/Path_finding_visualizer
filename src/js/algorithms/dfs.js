import { nbrs } from '../utils/utils.js';

export function dfs(grid, start, end) {
  const visited = [];
  const stack = [start]; start.vis = true;
  while (stack.length) {
    const cur = stack.pop();
    if (cur === end) return visited;
    visited.push(cur);
    for (const nb of nbrs(cur, grid)) {
      if (!nb.vis && !nb.wall) { nb.vis = true; nb.prev = cur; stack.push(nb); }
    }
  }
  return visited;
}
