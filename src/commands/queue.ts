import { messageCreators } from '../messages';
import { CommandHandler } from '../types/command';
import { handleConnectionCreation } from '../utils';

export const queueCommandRegExp = /^!(queue|q) *$/g;

export const queueCommandHandler: CommandHandler = handleConnectionCreation(
  (msg, connection) => {
    const tracks = connection.player.getQueue();
    connection.sendMessage(
      tracks.length
        ? messageCreators.queue(tracks)
        : messageCreators.queueEmpty(),
    );
  },
);

export const queueCommand = [queueCommandRegExp, queueCommandHandler] as const;
