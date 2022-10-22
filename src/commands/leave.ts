import { messageCreators } from '../messages';
import { CommandHandler } from '../types/command';
import { handleConnectionCreation } from '../utils';

export const leaveCommandRegExp = /^!leave *$/g;

export const leaveCommandHandler: CommandHandler = handleConnectionCreation(
  async (msg, connection) => {
    await connection.sendMessage(
      messageCreators.leave(connection.voiceChannel.name),
    );
    connection.destroy();
  },
);

export const leaveCommand = [leaveCommandRegExp, leaveCommandHandler] as const;
