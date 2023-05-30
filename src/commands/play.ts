import { messageCreators } from '../messages.js';
import { CommandHandler } from '../types/command.js';
import {
  handleConnectionCreation,
  isValidYoutubeLink,
  isYoutubePlaylistLink,
} from '../utils.js';

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

export const playCommand = [playCommandRegexp, playCommandHandler] as const;
