import * as fs from "fs";
import { BOARD_SIZE } from "./constants";
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

const isSolved = (board: number[]) => {
  const b = [...board];
  const blankIndex = b.indexOf(0);
  const x = blankIndex % 3;
  const y = Math.floor(blankIndex / 3);
  const d = Math.abs(x - 1) + Math.abs(y - 1);

  let count = 0;
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = i + 1; j < BOARD_SIZE; j++) {
      if (goal[i] === b[j]) {
        const tmp = b[j];
        b[j] = b[i];
        b[i] = tmp;
        count++;
        continue;
      }
    }
    if (b.toString() === goal.toString()) break;
  }

  return count % 2 === d % 2;
};

const genarateRandomBoard = () => {
  while (true) {
    const board: number[] = Array(BOARD_SIZE).fill(0);
    const used: boolean[] = Array(BOARD_SIZE).fill(false);
    for (let i = 0; i < BOARD_SIZE; i++) {
      let r: number;
      do {
        r = Math.floor(Math.random() * BOARD_SIZE);
      } while (used[r]);
      board[i] = r;
      used[r] = true;
    }
    if (isSolved(board)) return board;
  }
};

const inits = Array(100)
  .fill(null)
  .map(() => genarateRandomBoard());

const results: number[][] = Array(5);
const timeResults: number[] = Array(5);

for (let i = 0; i < 6; i++) {
  const result: number[] = [];

  const startTime = Date.now();

  switch (i) {
    case 0:
      console.log("DFS");
      for (const init of inits) result.push(dfs(init, goal));
      break;
    case 1:
      console.log("BFS");
      for (const init of inits) result.push(bfs(init, goal));
      break;
    case 2:
      console.log("A* (Fair)");
      for (const init of inits)
        result.push(astar(init, goal, EvalFuncs.EVAL_FAIR));
      break;
    case 3:
      console.log("A* (Weak)");
      for (const init of inits)
        result.push(astar(init, goal, EvalFuncs.EVAL_WEAK));
      break;
    case 4:
      console.log("A* (Bad)");
      for (const init of inits)
        result.push(astar(init, goal, EvalFuncs.EVAL_BAD));
      break;
    case 5:
      console.log("A* (New)");
      for (const init of inits)
        result.push(astar(init, goal, EvalFuncs.EVAL_NEW));
      break;
  }

  const endTime = Date.now();

  const time = (endTime - startTime) / 1000;

  console.log("処理時間", time, "秒");
  results[i] = result;
  timeResults[i] = time;
}

fs.writeFileSync("results.csv", results.map((r) => r.join(",")).join("\n"));
fs.writeFileSync("times.csv", timeResults.join("\n"));
