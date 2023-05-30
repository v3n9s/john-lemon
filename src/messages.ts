import { Track } from './player/track.js';

export const messageCreators = {
  currentlyPlaying: (trackTitle: string) =>
    `*Currently playing* **| ${trackTitle} |**`,
  currentlyNotPlaying: () => '*Currently **not playing** anything*',
  pause: (trackTitle: string) => `*Track* **| ${trackTitle} |** *paused*`,
  unpause: (trackTitle: string) => `*Track* **| ${trackTitle} |** *unpaused*`,
  addedToQueue: (name: string) => `**| ${name} |** *added to queue*`,
  queue: (tracks: Track[], page: number) => {
    const itemsPerPage = 10;
    const pages = Math.ceil(tracks.length / itemsPerPage);
    const startIndex = page * itemsPerPage;
    return `\n*Queue*\n${tracks
      .slice(startIndex, startIndex + itemsPerPage)
      .map((track, i) => `*${startIndex + i + 1}.* **${track.getTitle()}**`)
      .join('\n')}\n**Page** \`${page + 1}\` of \`${pages}\``;
  },
  queueEmpty: () => `**Queue** *is empty*`,
  leave: (channelName: string) =>
    `*leaving channel **${channelName}**, I don't need **you** anyway*`,
  skipRange: (start: number, end: number) =>
    `**skipping** *tracks from* \`${start}\` *to* \`${end}\``,
  skipSeveral: (amount: number) => `**skipping** \`${amount}\` *tracks*`,
  skipCurrent: () => `**skipping** \`current\` track`,
  seek: (time: string) => `**seeking** to \`${time}\``,
};
