import { messageCreators } from '../messages.js';
import { CommandHandler } from '../types/command.js';
import { handleConnectionCreation } from '../utils.js';

export const nowPlayingCommandRegExp = /^!(nowplaying|np) *$/g;

export const nowPlayingCommandHandler: CommandHandler =
  handleConnectionCreation((msg, connection) => {
    const track = connection.player.getCurrentTrack();
    connection.sendMessage(
      track
        ? messageCreators.currentlyPlaying(track.getTitle())
        : messageCreators.currentlyNotPlaying(),
    );
  });

export const nowPlayingCommand = <const>[
  nowPlayingCommandRegExp,
  nowPlayingCommandHandler,
];
