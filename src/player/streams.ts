import stream from 'stream';

export class StreamAccumulator extends stream.Writable {
  private downloadOffset = 0;

  private buffer: Buffer;

  constructor({ bufferSize }: { bufferSize: number }) {
    super();
    this.buffer = Buffer.alloc(bufferSize);
  }

  _write(
    chunk: unknown,
    encoding: BufferEncoding,
    cb: (error?: Error | null | undefined) => void,
  ): void {
    if (!(chunk instanceof Buffer)) return;
    chunk.copy(this.buffer, this.downloadOffset);
    this.downloadOffset += chunk.length;
    cb();
  }

  getReadStream() {
    return new ReadableBuffer({
      getBuffer: () => this.buffer,
      getDownloadOffset: () => this.downloadOffset,
    });
  }
}

export class ReadableBuffer extends stream.Readable {
  private offset = 0;

  private getBuffer?: () => Buffer;

  private getDownloadOffset?: () => number;

  constructor({
    getBuffer,
    getDownloadOffset,
  }: {
    getBuffer: () => Buffer;
    getDownloadOffset: () => number;
  }) {
    super();
    this.getBuffer = getBuffer;
    this.getDownloadOffset = getDownloadOffset;
  }

  _read(s: number): void {
    const push = () => {
      const buffer = this.getBuffer?.();
      if (!buffer || !this.getDownloadOffset || this.offset >= buffer.length) {
        this.push(null);
      } else if (this.offset < this.getDownloadOffset()) {
        this.push(
          buffer.subarray(
            this.offset,
            (this.offset = Math.min(this.offset + s, this.getDownloadOffset())),
          ),
        );
      } else {
        setTimeout(() => {
          push();
        }, 50);
      }
    };
    push();
  }

  _destroy(
    error: Error | null,
    cb: (error?: Error | null | undefined) => void,
  ): void {
    delete this.getBuffer;
    delete this.getDownloadOffset;
    while (this.read());
    cb(error);
  }
}
