import { messageCreators } from '../messages.js';
import { CommandHandler } from '../types/command.js';
import { handleConnectionCreation } from '../utils.js';

export const seekCommandRegExp = /^!seek +/g;

export const seekCommandHandler: CommandHandler = handleConnectionCreation(
  (msg, connection) => {
    const args = msg.content
      .replace(seekCommandRegExp, '')
      .split(':')
      .reverse()
      .map((v) => +v);
    if (args.some((v) => Number.isNaN(v))) return;
    const [s, m, h] = args;
    const time = (s ?? 0) + (m ?? 0) * 60 + (h ?? 0) * 3600;
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    connection.sendMessage(
      messageCreators.seek(
        (hours ? `${hours}:`.padStart(3, '0') : '') +
          `${minutes}:`.padStart(3, '0') +
          `${seconds}`.padStart(2, '0'),
      ),
    );
    connection.player.seek(time);
  },
);

export const seekCommand = <const>[seekCommandRegExp, seekCommandHandler];
