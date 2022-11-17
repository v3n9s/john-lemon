import { messageCreators } from '../messages';
import { CommandHandler } from '../types/command';
import { handleConnectionCreation } from '../utils';

export const queueCommandRegExp = /^!(queue|q) */g;

export const queueCommandHandler: CommandHandler = handleConnectionCreation(
  (msg, connection) => {
    const arg = msg.content.replace(queueCommandRegExp, '');
    const page = arg.length === 0 ? 0 : +arg - 1;
    if (Number.isNaN(page)) {
      connection.sendMessage('Page must be number');
      return;
    }

    const tracks = connection.player.getQueue();
    connection.sendMessage(
      tracks.length
        ? messageCreators.queue(tracks, page)
        : messageCreators.queueEmpty(),
    );
  },
);

export const queueCommand = <const>[queueCommandRegExp, queueCommandHandler];
