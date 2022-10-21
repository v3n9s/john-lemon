import stream from 'stream';
import ytdl from 'ytdl-core';
import { Buffer } from 'buffer';
import ffmpeg from 'fluent-ffmpeg';

export class Track {
  static async create({ url }: { url: string }): Promise<Track> {
    return new this({ info: await ytdl.getInfo(url) });
  }

  info: ytdl.videoInfo;

  private buffer?: Buffer;

  private format: ytdl.videoFormat;

  constructor({ info }: { info: ytdl.videoInfo }) {
    this.info = info;
    this.format = ytdl.chooseFormat(this.info.formats, {
      filter: 'audioonly',
      quality: 'highestaudio',
    });
  }

  getTitle() {
    return this.info.videoDetails.title;
  }

  private getTrackBuffer() {
    const trackBuffersArr: Buffer[] = [];

    return new Promise<Buffer>((res) => {
      ytdl
        .downloadFromInfo(this.info, { format: this.format })
        .on('data', (chunk) => {
          if (!(chunk instanceof Buffer)) return;
          trackBuffersArr.push(chunk);
        })
        .on('end', () => {
          res(Buffer.concat(trackBuffersArr));
        });
    });
  }

  async getTrackReadStream({
    timeOffset = 0,
    bitrate = (this.format.audioBitrate = 64),
  }: {
    timeOffset?: number;
    bitrate?: number;
  } = {}) {
    const trackReadableStream = stream.Readable.from(
      this.buffer || (await this.getTrackBuffer()),
    );
    return trackReadableStream;
    // return <stream.PassThrough>ffmpeg()
    //   .on('error', (err) => {
    //     if (err) console.log(err);
    //   })
    //   .format(this.format.container)
    //   .input(trackReadableStream)
    //   .seekInput(timeOffset)
    //   .audioBitrate(bitrate)
    //   .pipe();
  }
}
