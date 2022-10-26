import * as discordVoice from '@discordjs/voice';
import ytpl from 'ytpl';
import { Connection } from './connection';
import { Queue } from './queue';
import { Track } from './track';

export class Player extends discordVoice.AudioPlayer {
  private queue: Queue;

  constructor() {
    super();
    this.queue = new Queue();

    this.on(discordVoice.AudioPlayerStatus.Idle, () => {
      this.queue.skip(0, 1);
      this.playIfFree();
    });
  }

  playIfFree(connection?: Connection) {
    if (this.state.status !== 'idle') return;
    const track = this.queue.get(0);
    if (!track) return;
    if (connection?.voiceConnection.state.status === 'disconnected') {
      connection.voiceConnection.rejoin();
    }
    this.playTrack({ track });
  }

  playTrack({
    timeOffset = 0,
    bitrate = 0,
    track,
  }: {
    timeOffset?: number;
    bitrate?: number;
    track: Track;
  }) {
    this.pause();
    const resource = discordVoice.createAudioResource(
      track.getTrackReadStream({ timeOffset, bitrate }),
      {
        inlineVolume: true,
      },
    );
    resource.volume?.setVolume(0.25);

    this.play(resource);
  }

  async addTracks<arr extends string[], R extends { [k in keyof arr]: Track }>(
    ...urls: arr
  ) {
    const tracks = await Promise.all(urls.map((url) => Track.create({ url })));
    this.queue.push(...tracks);
    return <R>tracks;
  }

  async addPlaylist(url: string) {
    const playlist = await ytpl(url);
    await this.addTracks(...playlist.items.map(({ shortUrl }) => shortUrl));
    return playlist;
  }

  skip(start: number, end: number) {
    this.queue.skip(start, end);
    if (start === 0) {
      const track = this.queue.get(0);
      if (track) {
        this.playTrack({ track });
      } else {
        this.stop();
      }
    }
  }

  getCurrentTrack() {
    return this.queue.get(0);
  }

  getQueue() {
    return this.queue.getAll();
  }

  seek(offset: number) {
    const currentTrack = this.queue.get(0);
    if (currentTrack) {
      this.playTrack({ timeOffset: offset, track: currentTrack });
    }
  }
}
