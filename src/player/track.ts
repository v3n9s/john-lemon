import stream from 'stream';
import ytdl from 'ytdl-core';
import { Buffer } from 'buffer';
import ffmpeg from 'fluent-ffmpeg';

export class Track {
  static async create({ url }: { url: string }): Promise<Track> {
    return new this({ info: await ytdl.getInfo(url) });
  }

  info: ytdl.videoInfo;

  private buffer: Buffer;

  private format: ytdl.videoFormat;

  private downloadOffset: number;

  private needToDownload: boolean;

  constructor({ info }: { info: ytdl.videoInfo }) {
    this.info = info;
    this.format = ytdl.chooseFormat(this.info.formats, {
      filter: 'audioonly',
      quality: 'highestaudio',
    });
    this.needToDownload = true;
    this.downloadOffset = 0;
    this.buffer = Buffer.alloc(+this.format.contentLength);
  }

  getTitle() {
    return this.info.videoDetails.title;
  }

  private downloadTrackBuffer() {
    if (!this.needToDownload) return;
    this.needToDownload = false;
    return new Promise<void>((res) => {
      ytdl
        .downloadFromInfo(this.info, { format: this.format })
        .on('data', (chunk) => {
          if (!(chunk instanceof Buffer)) return;
          chunk.copy(this.buffer, this.downloadOffset);
          this.downloadOffset += chunk.length;
        })
        .on('end', () => {
          res();
        });
    });
  }

  getTrackReadStream({
    timeOffset = 0,
    bitrate = (this.format.audioBitrate = 64),
  }: {
    timeOffset?: number | undefined;
    bitrate?: number | undefined;
  } = {}) {
    this.downloadTrackBuffer();
    return (<stream.PassThrough>ffmpeg()
      .format(this.format.container)
      .input(new TrackBufferReadStream(this.buffer, () => this.downloadOffset))
      .seekInput(timeOffset)
      .audioBitrate(bitrate)
      .pipe()).pipe(new stream.PassThrough());
  }
}

class TrackBufferReadStream extends stream.Readable {
  private buffer: Buffer;

  private offset: number;

  private getDownloadOffset: () => number;

  constructor(buffer: Buffer, getDownloadOffset: () => number) {
    super();
    this.buffer = buffer;
    this.offset = 0;
    this.getDownloadOffset = getDownloadOffset;
  }

  _read(s: number): void {
    const push = () => {
      if (this.offset + s < this.getDownloadOffset()) {
        this.push(this.buffer.subarray(this.offset, this.offset + s));
        this.offset += s;
      } else {
        setTimeout(() => {
          push();
        }, 50);
      }
    };
    push();
  }
}
