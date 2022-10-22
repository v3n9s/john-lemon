import { messageCreators } from '../messages';
import { CommandHandler } from '../types/command';
import { handleConnectionCreation } from '../utils';

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

export const nowPlayingCommand = [
  nowPlayingCommandRegExp,
  nowPlayingCommandHandler,
] as const;
