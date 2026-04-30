# PathFinder — Algorithm Visualizer

> Interactive visualization of classic pathfinding algorithms on a dynamic grid.
> Built as a portfolio/resume project demonstrating DSA knowledge.

## 🔗 Live Demo
[Deploy on GitHub Pages or Vercel]

## 📁 Project Structure

```
pathfinding-visualizer/
├── index.html                     # Main entry point & UI
├── README.md
└── src/
    ├── algorithms/
    │   ├── index.js               # Algorithm registry & metadata
    │   ├── astar.js               # A* Search (heuristic + optimal)
    │   ├── dijkstra.js            # Dijkstra's (weighted + optimal)
    │   ├── bfs.js                 # Breadth-First Search (unweighted)
    │   └── dfs.js                 # Depth-First Search (exploration)
    └── utils/
        └── gridUtils.js           # Grid creation, reset, maze gen
```

## ⚙️ Algorithms Implemented

| Algorithm   | Optimal? | Weighted? | Time Complexity   | Space  |
|-------------|----------|-----------|-------------------|--------|
| A*          | ✅ Yes   | ✅ Yes    | O(E log V)        | O(V)   |
| Dijkstra's  | ✅ Yes   | ✅ Yes    | O((V+E) log V)    | O(V)   |
| BFS         | ✅ Yes   | ❌ No     | O(V + E)          | O(V)   |
| DFS         | ❌ No    | ❌ No     | O(V + E)          | O(V)   |

## 🎮 Features

- **4 algorithms** with animated step-by-step visualization
- **Interactive grid** — click/drag to draw walls, drag start/end nodes
- **Maze generator** — recursive division algorithm
- **Random walls** — stochastic wall placement
- **Weighted nodes** — toggle weighted mode (Dijkstra/A* only)
- **Speed control** — 5 speed levels from slow to instant
- **Live stats** — visited count, path length, compute time, efficiency %
- **Canvas-based rendering** — smooth 60fps animations

## 🚀 Getting Started

```bash
# Serve locally (any static server)
npx serve .
# or
python -m http.server 8080
```

Then open `http://localhost:8080`

## 🛠️ Tech Stack

- Vanilla JavaScript (ES Modules)
- HTML5 Canvas API
- CSS Custom Properties + Google Fonts
- No build tools, no dependencies

## 💡 Key Concepts Demonstrated

- Graph traversal (BFS, DFS)
- Greedy algorithms (Dijkstra's)
- Heuristic search (A* with Manhattan distance)
- Priority queue simulation
- Recursive backtracking (maze generation)
- Canvas API animation timing

## 👤 Author

**Kartik** — B.Tech CSE (Data Science), Bennett University  
GitHub: [github.com/Kaartikkkk](https://github.com/Kaartikkkk)
