export class Stack<T> {
  private stack: T[];
  private ptr = 0;

  constructor(private stackSize: number) {
    this.stack = new Array(stackSize);
    this.ptr = 0;
  }

  get size() {
    return this.ptr;
  }

  push(value: T) {
    if (this.size < this.stackSize) {
      this.stack[this.ptr++] = value;
    } else {
      throw new Error("Stack overflow");
    }
  }

  pop() {
    if (this.size > 0) {
      return this.stack[--this.ptr];
    }
    throw new Error("Stack underflow");
  }
}
