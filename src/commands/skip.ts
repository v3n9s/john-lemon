import { messageCreators } from '../messages';
import { CommandHandler } from '../types/command';
import { handleConnectionCreation } from '../utils';

export const skipCommandRegexp = /^!skip */g;

export const skipCommandHandler: CommandHandler = handleConnectionCreation(
  (msg, connection) => {
    const args = msg.content
      .replaceAll(skipCommandRegexp, '')
      .trim()
      .split(' ')
      .filter((v) => v !== '')
      .map((v) => +v)
      .filter((v, i) => i < 2);

    if (args.some((v) => Number.isNaN(v))) {
      connection.sendMessage('you must specify numbers as arguments');
      return;
    }

    const end = args.pop();
    const start = args.pop();
    if (start !== undefined && end !== undefined) {
      connection.sendMessage(messageCreators.skipRange(start, end));
      connection.player.skip(start, end + 1);
    } else if (start === undefined && end !== undefined && end > 1) {
      connection.sendMessage(messageCreators.skipSeveral(end));
      connection.player.skip(0, end - 1);
    } else {
      connection.sendMessage(messageCreators.skipCurrent());
      connection.player.skip(0, 0);
    }
  },
);

export const skipCommand = <const>[skipCommandRegexp, skipCommandHandler];
