import { nbrs } from '../utils/utils.js';

export function dijkstra(grid, start, end) {
  const visited = [];
  start.dist = 0;
  const all = grid.flat();
  while (all.filter(n=>!n.vis).length) {
    const unvis = all.filter(n=>!n.vis).sort((a,b)=>a.dist-b.dist);
    const cur = unvis[0];
    if (!cur || cur.wall || cur.dist===Infinity) return visited;
    cur.vis = true; visited.push(cur);
    if (cur === end) return visited;
    for (const nb of nbrs(cur, grid)) {
      const d = cur.dist + nb.w;
      if (d < nb.dist) { nb.dist = d; nb.prev = cur; }
    }
  }
  return visited;
}
