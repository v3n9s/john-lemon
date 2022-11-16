import stream from 'stream';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import { StreamAccumulator } from './streams';

export class Track {
  static async create({ url }: { url: string }): Promise<Track> {
    return new this({ info: await ytdl.getInfo(url) });
  }

  info: ytdl.videoInfo;

  private format: ytdl.videoFormat;

  private streamAccumulator: StreamAccumulator;

  private needToDownload = true;

  constructor({ info }: { info: ytdl.videoInfo }) {
    this.info = info;
    this.format = ytdl.chooseFormat(this.info.formats, {
      filter: 'audioonly',
      quality: 'highestaudio',
    });
    this.streamAccumulator = new StreamAccumulator({
      bufferSize: +this.format.contentLength,
    });
  }

  getTitle() {
    return this.info.videoDetails.title;
  }

  private download() {
    if (!this.needToDownload) return;
    this.needToDownload = false;
    ytdl
      .downloadFromInfo(this.info, { format: this.format })
      .pipe(this.streamAccumulator);
  }

  getReadStream(timeOffset = 0) {
    this.download();
    const readStream = this.streamAccumulator.getReadStream();
    return <stream.PassThrough>ffmpeg()
      .format(this.format.container)
      .input(readStream)
      .seekInput(timeOffset)
      .once('error', (e) => {
        if (
          e instanceof Error &&
          e.message === 'Output stream error: Premature close'
        ) {
          console.log('expected ffmpeg error', e.message);
        } else {
          console.log('unexpected ffmpeg error', e);
        }
      })
      .pipe()
      .once('close', () => {
        readStream.unpipe();
        readStream.destroy();
      });
  }
}
