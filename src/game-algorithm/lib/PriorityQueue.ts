type entry = { value: number; depth: number; score: number };

export class PriorityQueue {
  private heap: entry[];
  private heapSize = 0;

  constructor(private maxSize: number) {
    this.heap = new Array(maxSize);
  }

  private memcpy(dst: entry, src: entry) {
    dst.value = src.value;
    dst.depth = src.depth;
    dst.score = src.score;
  }

  private downHeap(n: number) {
    while (true) {
      const tmp: entry = { value: 0, depth: 0, score: 0 };
      let c = 2 * n + 1;
      if (c >= this.heapSize) break;
      if (c + 1 < this.heapSize && this.heap[c].score > this.heap[c + 1].score)
        c++;
      if (this.heap[n].score <= this.heap[c].score) break;
      this.memcpy(tmp, this.heap[n]);
      this.memcpy(this.heap[n], this.heap[c]);
      this.memcpy(this.heap[c], tmp);
      n = c;
    }
  }

  private upHeap(n: number) {
    while (true) {
      const tmp: entry = { value: 0, depth: 0, score: 0 };
      const p = Math.floor((n - 1) / 2);
      if (p < 0 || this.heap[p].score <= this.heap[n].score) break;
      this.memcpy(tmp, this.heap[n]);
      this.memcpy(this.heap[n], this.heap[p]);
      this.memcpy(this.heap[p], tmp);
      n = p;
    }
  }

  get size() {
    return this.heapSize;
  }

  push(value: number, depth: number, score: number) {
    if (this.size >= this.maxSize) {
      throw new Error("Priority queue overflow");
    }
    this.heap[this.heapSize] = {
      value: value,
      depth: depth,
      score: score,
    };
    this.upHeap(this.heapSize);
    this.heapSize++;
  }

  removeMin() {
    if (this.size <= 0) {
      throw new Error("Priority queue underflow");
    }
    const value = this.heap[0].value;
    const depth = this.heap[0].depth;
    this.memcpy(this.heap[0], this.heap[--this.heapSize]);
    this.downHeap(0);
    return { value, depth };
  }
}
