import { messageCreators } from '../messages.js';
import { CommandHandler } from '../types/command.js';
import { handleConnectionCreation } from '../utils.js';

export const skipCommandRegexp = /^!skip */g;

export const skipCommandHandler: CommandHandler = handleConnectionCreation(
  (msg, connection) => {
    const args = msg.content
      .replace(skipCommandRegexp, '')
      .trim()
      .split(/ +/g)
      .map((v) => +v)
      .filter((v, i) => i < 2);

    if (args.some((v) => Number.isNaN(v))) {
      connection.sendMessage('you must specify numbers as arguments');
      return;
    }

    const end = args.pop();
    const start = args.pop();
    if (start !== undefined && start > 1 && end !== undefined) {
      connection.sendMessage(messageCreators.skipRange(start, end));
      connection.player.skip(start - 1, end);
    } else if (end !== undefined && end > 1) {
      connection.sendMessage(messageCreators.skipSeveral(end));
      connection.player.skip(0, end);
    } else {
      connection.sendMessage(messageCreators.skipCurrent());
      connection.player.skip(0, 1);
    }
  },
);

export const skipCommand = [skipCommandRegexp, skipCommandHandler] as const;
