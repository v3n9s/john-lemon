import { CommandHandler } from '../types/command.js';
import { handleConnectionCreation } from '../utils.js';

export const leaveCommandRegExp = /^!leave *$/g;

export const leaveCommandHandler: CommandHandler = handleConnectionCreation(
  (msg, connection) => {
    connection.destroy();
  },
);

export const leaveCommand = [leaveCommandRegExp, leaveCommandHandler] as const;
