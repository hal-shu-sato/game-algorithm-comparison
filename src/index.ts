import * as fs from "fs";
import astar, { EvalFuncs } from "./game-algorithm/astar";
import bfs from "./game-algorithm/bfs";
import dfs from "./game-algorithm/dfs";

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

const genarateRandomBoard = () => {
  const board: number[] = Array(9).fill(0);
  const used: boolean[] = Array(9).fill(false);
  for (let i = 0; i < 9; i++) {
    let r: number;
    do {
      r = Math.floor(Math.random() * 9);
    } while (used[r]);
    board[i] = r;
    used[r] = true;
  }
  return board;
};

const inits = Array(10)
  .fill(null)
  .map(() => genarateRandomBoard());

for (let i = 0; i < 5; i++) {
  const startTime = Date.now();

  switch (i) {
    case 0:
      console.log("DFS");
      for (const init of inits) dfs(init, goal);
      break;
    case 1:
      console.log("BFS");
      for (const init of inits) bfs(init, goal);
      break;
    case 2:
      console.log("A* (Fair)");
      for (const init of inits) astar(init, goal, EvalFuncs.EVAL_FAIR);
      break;
    case 3:
      console.log("A* (Weak)");
      for (const init of inits) astar(init, goal, EvalFuncs.EVAL_WEAK);
      break;
    case 4:
      console.log("A* (Bad)");
      for (const init of inits) astar(init, goal, EvalFuncs.EVAL_BAD);
      break;
  }

  const endTime = Date.now();

  console.log("処理時間", (endTime - startTime) / 1000, "秒");
}
