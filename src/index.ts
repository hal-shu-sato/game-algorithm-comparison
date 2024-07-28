import * as fs from "fs";
import dfs from "./game-algorithm/dfs";
import bfs from "./game-algorithm/bfs";
import astar, { EvalFuncs } from "./game-algorithm/astar";

const goal = [1, 2, 3, 8, 0, 4, 7, 6, 5];

const path = process.argv[2];
if (path) {
  const data = fs.readFileSync(path, "utf-8");

  for (let i = 0; i < 5; i++) {
    const init = data.split(" ").map((x) => parseInt(x));

    const startTime = Date.now();

    switch (i) {
      case 0:
        console.log("DFS");
        dfs(init, goal);
        break;
      case 1:
        console.log("BFS");
        bfs(init, goal);
        break;
      case 2:
        console.log("A* (Fair)");
        astar(init, goal, EvalFuncs.EVAL_FAIR);
        break;
      case 3:
        console.log("A* (Weak)");
        astar(init, goal, EvalFuncs.EVAL_WEAK);
        break;
      case 4:
        console.log("A* (Bad)");
        astar(init, goal, EvalFuncs.EVAL_BAD);
        break;
    }

    const endTime = Date.now();

    console.log("処理時間", (endTime - startTime) / 1000, "秒");
  }

  process.exit(0);
}
