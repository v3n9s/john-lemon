import { Track } from './player/track';

export const messageCreators = {
  currentlyPlaying: (trackTitle: string) =>
    `*Currently playing* **| ${trackTitle} |**`,
  currentlyNotPlaying: () => '*Currently **not playing** anything*',
  pause: (trackTitle: string) => `*Track* **| ${trackTitle} |** *paused*`,
  unpause: (trackTitle: string) => `*Track* **| ${trackTitle} |** *unpaused*`,
  addedToQueue: (name: string) => `**| ${name} |** *added to queue*`,
  queue: (tracks: Track[]) =>
    `\n*Queue*\n${tracks
      .map((track, i) => `*${i + 1}.* **${track.getTitle()}**`)
      .join('\n')}`,
  queueEmpty: () => `**Queue** *is empty*`,
  leave: (channelName: string) =>
    `*leaving channel **${channelName}**, I don't need **you** anyway*`,
  skipRange: (start: number, end: number) =>
    `**skipping** *tracks from* \`${start}\` *to* \`${end}\``,
  skipSeveral: (amount: number) => `**skipping** \`${amount}\` *tracks*`,
  skipCurrent: () => `**skipping** \`current\` track`,
  seek: (time: string) => `seek to ${time}`,
};
