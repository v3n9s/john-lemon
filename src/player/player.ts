import * as discordVoice from '@discordjs/voice';
import ytpl from 'ytpl';
import { Instance } from './connection';
import { Queue } from './queue';
import { Track } from './track';

export class Player {
  discordPlayer: discordVoice.AudioPlayer;

  queue: Queue;

  constructor() {
    this.discordPlayer = discordVoice.createAudioPlayer();
    this.queue = new Queue();

    this.discordPlayer.on('stateChange', (oldState, newState) => {
      if (newState.status === 'idle') {
        this.queue.skip(0, 1);
        this.playIfFree();
      }
    });
  }

  pause() {
    this.discordPlayer.pause();
  }

  unpause() {
    this.discordPlayer.unpause();
  }

  playIfFree(connection?: Instance) {
    if (this.discordPlayer.state.status !== 'idle') return;
    const track = this.queue.get(0);
    if (!track) return;
    if (connection?.voiceConnection.state.status === 'disconnected') {
      connection.voiceConnection.rejoin();
    }
    this.play({ track });
  }

  play({
    timeOffset = 0,
    bitrate = 0,
    track,
  }: {
    timeOffset?: number;
    bitrate?: number;
    track: Track;
  }) {
    const resource = discordVoice.createAudioResource(
      track.getTrackReadStream({ timeOffset, bitrate }),
      {
        inlineVolume: true,
      },
    );
    resource.volume?.setVolume(0.25);

    this.discordPlayer.play(resource);
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
      this.discordPlayer.stop();
    }
  }

  seek(offset: number) {
    const currentTrack = this.queue.get(0);
    if (currentTrack) {
      this.play({ timeOffset: offset, track: currentTrack });
    }
  }
}
