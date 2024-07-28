type entry = { value: number; next: entry };

export class HashTable {
  private table: entry[];

  constructor(private tableSize: number) {
    this.table = Array(tableSize).fill(null);
  }

  private hash(i: number) {
    return i % this.tableSize;
  }

  insert(value: number) {
    const hash = this.hash(value);
    const p: entry = {
      value: value,
      next: this.table[hash],
    };
    this.table[hash] = p;
  }

  search(value: number) {
    const hash = this.hash(value);
    for (let p = this.table[hash]; p !== null; p = p.next)
      if (p.value === value) return true;
    return false;
  }

  clear() {
    for (let i = 0; i < this.tableSize; i++) {
      while (this.table[i] !== null) {
        const p = this.table[i];
        this.table[i] = p.next;
      }
    }
  }
}
