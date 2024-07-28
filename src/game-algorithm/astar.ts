import { BOARD_SIZE, HASH_SIZE, HEAP_SIZE, MAX_DEPTH } from "../constants";
import { HashTable } from "./lib/Hash";
import { PriorityQueue } from "./lib/PriorityQueue";

export enum EvalFuncs {
  EVAL_FAIR,
  EVAL_WEAK,
  EVAL_BAD,
}

const fairEvaluator = (board: number[], goal: number[]) => {
  let score = 0;
  for (let i = 0; i < BOARD_SIZE; i++) {
    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = 0;
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[j] === i) {
        x1 = j % 3;
        y1 = Math.floor(j / 3);
      }
      if (goal[j] === i) {
        x2 = j % 3;
        y2 = Math.floor(j / 3);
      }
    }
    score += Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }
  return score;
};

const weakEvaluator = (board: number[], goal: number[]) => {
  let score = 0;
  for (let i = 0; i < BOARD_SIZE; i++) {
    if (board[i] !== 0 && board[i] !== goal[i]) score++;
  }
  return score;
};

const badEvaluator = (board: number[]) => {
  let diff = 0;
  diff += board[8] - board[0];
  diff += board[7] - board[1];
  diff += board[6] - board[2];
  diff += board[3] - board[5];
  return 16 - diff;
};

const score = (
  evalFunc: EvalFuncs,
  board: number[],
  goal: number[],
  depth: number,
) => {
  switch (evalFunc) {
    case EvalFuncs.EVAL_FAIR:
      return fairEvaluator(board, goal) + depth;
    case EvalFuncs.EVAL_WEAK:
      return weakEvaluator(board, goal) + depth;
    case EvalFuncs.EVAL_BAD:
      return badEvaluator(board) + depth;
  }
};

const memcpy = (dst: number[], src: number[], size: number) => {
  for (let i = 0; i < size; i++) dst[i] = src[i];
};

const swapWithUpper = (board: number[], next: number[]) => {
  let pos = -1;
  for (let i = 0; i < BOARD_SIZE; i++) if (board[i] === 0) pos = i;
  if (pos === -1) {
    throw new Error("Invalid board state");
  }
  if (pos === 0 || pos === 1 || pos === 2) {
    return -1;
  }
  memcpy(next, board, BOARD_SIZE);
  next[pos] = board[pos - 3];
  next[pos - 3] = board[pos];
  return 0;
};

const swapWithLower = (board: number[], next: number[]) => {
  let pos = -1;
  for (let i = 0; i < BOARD_SIZE; i++) if (board[i] === 0) pos = i;
  if (pos === -1) {
    throw new Error("Invalid board state");
  }
  if (pos === 6 || pos === 7 || pos === 8) {
    return -1;
  }
  memcpy(next, board, BOARD_SIZE);
  next[pos] = board[pos + 3];
  next[pos + 3] = board[pos];
  return 0;
};

const swapWithRight = (board: number[], next: number[]) => {
  let pos = -1;
  for (let i = 0; i < BOARD_SIZE; i++) if (board[i] === 0) pos = i;
  if (pos === -1) {
    throw new Error("Invalid board state");
  }
  if (pos === 2 || pos === 5 || pos === 8) {
    return -1;
  }
  memcpy(next, board, BOARD_SIZE);
  next[pos] = board[pos + 1];
  next[pos + 1] = board[pos];
  return 0;
};

const swapWithLeft = (board: number[], next: number[]) => {
  let pos = -1;
  for (let i = 0; i < BOARD_SIZE; i++) if (board[i] === 0) pos = i;
  if (pos === -1) {
    throw new Error("Invalid board state");
  }
  if (pos === 0 || pos === 3 || pos === 6) {
    return -1;
  }
  memcpy(next, board, BOARD_SIZE);
  next[pos] = board[pos - 1];
  next[pos - 1] = board[pos];
  return 0;
};

const board2value = (board: number[]) => {
  let digit = 1;
  let value = 0;
  for (let i = 0; i < BOARD_SIZE; i++) {
    value += board[BOARD_SIZE - i - 1] * digit;
    digit *= 10;
  }
  return value;
};

const value2board = (value: number, board: number[]) => {
  let digit = 1;
  for (let i = 0; i < BOARD_SIZE; i++) {
    board[BOARD_SIZE - i - 1] = Math.floor(value / digit) % 10;
    digit *= 10;
  }
};

const astar = (init: number[], goal: number[], evalFunc: EvalFuncs) => {
  const count = {
    compare: 0,
  };

  const myCompare = (a: number[], b: number[]) => {
    count.compare++;
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (a[i] !== b[i]) return true;
    }
    return false;
  };

  const printCount = () => {
    console.log("比較回数", count.compare);
  };

  const pq = new PriorityQueue(HEAP_SIZE);

  const push = (board: number[], goal: number[], depth: number) => {
    pq.push(board2value(board), depth, score(evalFunc, board, goal, depth));
  };

  const pop = (board: number[]) => {
    const { value, depth } = pq.removeMin();
    value2board(value, board);
    return depth;
  };

  const isEmpty = () => {
    return pq.size === 0;
  };

  const hashTable = new HashTable(HASH_SIZE);

  const setVisited = (board: number[]) => {
    hashTable.insert(board2value(board));
  };

  const isVisited = (board: number[]) => {
    return hashTable.search(board2value(board));
  };

  let depth = 0;
  push(init, goal, depth);
  if (!myCompare(init, goal)) {
    printCount();
    return;
  }
  while (!isEmpty()) {
    const curr = Array(BOARD_SIZE).fill(0);
    const next = Array(BOARD_SIZE).fill(0);
    depth = pop(curr);
    setVisited(curr);
    if (!myCompare(curr, goal)) {
      printCount();
      return;
    }
    depth++;

    if (swapWithUpper(curr, next) !== -1) {
      if (!isVisited(next) && depth < MAX_DEPTH)
        if (depth < MAX_DEPTH) push(next, goal, depth);
    }

    if (swapWithLower(curr, next) !== -1) {
      if (!isVisited(next) && depth < MAX_DEPTH)
        if (depth < MAX_DEPTH) push(next, goal, depth);
    }

    if (swapWithRight(curr, next) !== -1) {
      if (!isVisited(next) && depth < MAX_DEPTH)
        if (depth < MAX_DEPTH) push(next, goal, depth);
    }

    if (swapWithLeft(curr, next) !== -1) {
      if (!isVisited(next) && depth < MAX_DEPTH)
        if (depth < MAX_DEPTH) push(next, goal, depth);
    }
  }

  console.log("Not found...");
  printCount();
};

export default astar;
