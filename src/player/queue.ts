import { Track } from './track';

export class Queue {
  private queue: Track[];

  constructor() {
    this.queue = [];
  }

  get(index: number) {
    return this.queue[index];
  }

  getAll() {
    return this.queue;
  }

  push(...track: Track[]) {
    this.queue.push(...track);
  }

  skip(start: number, end: number) {
    this.queue.splice(start, end - start);
  }
}
