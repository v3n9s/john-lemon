import { messageCreators } from '../messages';
import { CommandHandler } from '../types/command';
import { handleConnectionCreation } from '../utils';

export const seekCommandRegExp = /^!seek +/g;

export const seekCommandHandler: CommandHandler = handleConnectionCreation(
  async (msg, connection) => {
    const time = +msg.content.replaceAll(seekCommandRegExp, '');
    if (Number.isNaN(time)) return;
    await connection.sendMessage(messageCreators.seek(''));
    connection.player.seek(time);
  },
);

export const seekCommand = [seekCommandRegExp, seekCommandHandler] as const;
