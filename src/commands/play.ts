import { messageCreators } from '../messages';
import { CommandHandler } from '../types/command';
import {
  handleConnectionCreation,
  isValidYoutubeLink,
  isYoutubePlaylistLink,
} from '../utils';

export const playCommandRegexp = /^!(play|p) +/g;

export const playCommandHandler: CommandHandler = handleConnectionCreation(
  async (msg, connection) => {
    const url = msg.content.replace(playCommandRegexp, '');

    if (!isValidYoutubeLink(url)) {
      connection.sendMessage('wrong url format');
      return;
    }

    let resourceName: string;
    if (isYoutubePlaylistLink(url)) {
      const playlist = await connection.player.addPlaylist(url);
      resourceName = playlist.title;
    } else {
      const [track] = await connection.player.addTracks(url);
      resourceName = track.getTitle();
    }
    connection.sendMessage(messageCreators.addedToQueue(resourceName));
    connection.player.playIfFree(connection);
  },
  true,
);

export const playCommand = <const>[playCommandRegexp, playCommandHandler];
