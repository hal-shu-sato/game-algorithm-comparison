import { BOARD_SIZE, HASH_SIZE, MAX_DEPTH, QUEUE_SIZE } from "../constants";
import { HashTable } from "./lib/Hash";
import { Queue } from "./lib/Queue";

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

const bfs = (init: number[], goal: number[]) => {
  const count = {
    compare: 0,
  };

  const myCompare = (a: number[], b: number[]) => {
    count.compare++;
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (a[i] !== b[i]) {
        return true;
      }
    }
    return false;
  };

  const printCount = () => {
    console.log("比較回数", count.compare);
  };

  const queue = new Queue<number>(QUEUE_SIZE);

  const push = (board: number[], depth: number) => {
    queue.push(board2value(board));
    queue.push(depth);
  };

  const pop = (board: number[]) => {
    const value = queue.pop();
    const depth = queue.pop();
    value2board(value, board);
    return depth;
  };

  const isEmpty = () => {
    return queue.size === 0;
  };

  const hashTable = new HashTable(HASH_SIZE);

  const setVisited = (board: number[]) => {
    hashTable.insert(board2value(board));
  };

  const isVisited = (board: number[]) => {
    return hashTable.search(board2value(board));
  };

  let depth = 0;
  push(init, depth);
  if (!myCompare(init, goal)) {
    printCount();
    return;
  }
  while (!isEmpty()) {
    const curr = Array(BOARD_SIZE).fill(0);
    const next = Array(BOARD_SIZE).fill(0);
    depth = pop(curr);
    setVisited(curr);
    depth++;

    if (swapWithUpper(curr, next) !== -1) {
      if (!isVisited(next)) {
        if (!myCompare(next, goal)) {
          printCount();
          return;
        }
        if (depth < MAX_DEPTH) push(next, depth);
      }
    }

    if (swapWithLower(curr, next) !== -1) {
      if (!isVisited(next)) {
        if (!myCompare(next, goal)) {
          printCount();
          return;
        }
        if (depth < MAX_DEPTH) push(next, depth);
      }
    }

    if (swapWithRight(curr, next) !== -1) {
      if (!isVisited(next)) {
        if (!myCompare(next, goal)) {
          printCount();
          return;
        }
        if (depth < MAX_DEPTH) push(next, depth);
      }
    }

    if (swapWithLeft(curr, next) !== -1) {
      if (!isVisited(next)) {
        if (!myCompare(next, goal)) {
          printCount();
          return;
        }
        if (depth < MAX_DEPTH) push(next, depth);
      }
    }
  }

  console.log("Not found...");
  printCount();
};

export default bfs;
