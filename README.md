# PathFinder — Algorithm Visualizer

> Interactive visualization of classic pathfinding algorithms on a dynamic grid.
> Built as a portfolio/resume project demonstrating DSA knowledge.

## 🔗 Live Demo
[Deploy on GitHub Pages or Vercel]

---

## 📖 Comprehensive User Guide: How the Project Works

This project is designed to help you visualize how different graph traversal and pathfinding algorithms work in real-time. Here is a step-by-step guide on how to use the visualizer and what happens under the hood.

### Step 1: Understand the Grid
The main area of the application is a grid representing a map or a graph. 
- **Green Node (▶)**: This is the **Start Node**. The algorithm begins searching from here.
- **Red Node (⬤)**: This is the **End Node** (Target). The goal of the algorithm is to find a path to this node.
- **Empty Cells**: These are walkable paths with a standard cost of `1`.

### Step 2: Choose an Algorithm
On the left sidebar, you can select which algorithm you want to visualize:
- **A* Search**: The "smartest" algorithm. It uses a heuristic (Manhattan distance) to guess which direction the target is in. It guarantees the shortest path and is usually the fastest optimal algorithm.
- **Dijkstra's Algorithm**: Guarantees the shortest path and respects "Weights" (difficult terrain), but it explores in all directions equally like a circle expanding, making it slower than A*.
- **Breadth-First Search (BFS)**: Explores all neighbors level-by-level. It guarantees the shortest path on unweighted grids but does not take weights into account.
- **Depth-First Search (DFS)**: A "blind" search that goes as deep as possible in one direction before turning back. It does **not** guarantee the shortest path.

### Step 3: Draw Your Environment (Walls and Weights)
You can customize the grid to test the algorithms in different scenarios.
- **Draw Walls (🧱)**: Click the "Wall" mode, then click and drag on the grid to draw impenetrable walls (black squares). Algorithms cannot pass through walls; they must path around them.
- **Draw Weights (⚖)**: Click the "Weight" mode, then click and drag to draw weights (blue squares with a 'W'). A weight represents a "difficult" terrain (cost of 3 instead of 1). 
  - *Note: Only A* and Dijkstra take weights into account! BFS and DFS will ignore them.*
- **Drag Nodes**: You can click and drag the Start (Green) and End (Red) nodes to reposition them anywhere on the grid.

### Step 4: Adjust Speed
Before running, you can use the **Speed** slider to control how fast the algorithm animates. Set it to "Slow" if you want to carefully watch how it explores, or "Fast"/"Instant" to quickly see the result.

### Step 5: Visualize!
Click the **▶ Visualize** button. You will see two phases:
1. **Exploration Phase (Blue Nodes)**: The algorithm searches the grid, visiting nodes one by one. The blue area represents the "visited" nodes.
2. **Path Reconstruction (Yellow Path)**: Once the End Node is found, the algorithm traces back the exact shortest path it found and highlights it in glowing yellow.

### Step 6: Review the Results
Check the **Results** panel at the bottom of the sidebar:
- **Visited**: How many nodes the algorithm had to explore. (Lower is better/more efficient).
- **Path Len**: The length of the final path found.
- **Compute**: How long it took the algorithm to calculate the path in milliseconds.
- **Efficiency**: The ratio of path length to visited nodes.

---

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
- CSS Custom Properties + Google Fonts + Glassmorphism
- No build tools, no dependencies

## 👤 Author
**Kartik** — B.Tech CSE (Data Science), Bennett University  
GitHub: [github.com/Kaartikkkk](https://github.com/Kaartikkkk)
