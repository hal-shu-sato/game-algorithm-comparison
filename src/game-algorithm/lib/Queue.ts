export class Queue<T> {
  private queue: T[];
  private head = 0;
  private tail = 0;

  constructor(private queueSize: number) {
    this.queue = new Array(queueSize);
  }

  get size(): number {
    return this.tail >= this.head
      ? this.tail - this.head
      : this.queueSize - (this.head - this.tail);
  }

  private next(i: number) {
    return (i + 1) % this.queueSize;
  }

  push(value: T) {
    if (this.next(this.tail) !== this.head) {
      this.queue[this.tail] = value;
      this.tail = this.next(this.tail);
    } else {
      throw new Error("Queue overflow");
    }
  }

  pop() {
    if (this.size <= 0) {
      throw new Error("Queue underflow");
    }
    const value = this.queue[this.head];
    this.head = this.next(this.head);
    return value;
  }
}
