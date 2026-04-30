import { nbrs } from '../utils/utils.js';

export function bfs(grid, start, end) {
  const visited = [];
  const queue = [start]; start.vis = true;
  while (queue.length) {
    const cur = queue.shift();
    if (cur === end) return visited;
    visited.push(cur);
    for (const nb of nbrs(cur, grid)) {
      if (!nb.vis && !nb.wall) { nb.vis = true; nb.prev = cur; queue.push(nb); }
    }
  }
  return visited;
}
