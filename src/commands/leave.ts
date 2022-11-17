import { CommandHandler } from '../types/command';
import { handleConnectionCreation } from '../utils';

export const leaveCommandRegExp = /^!leave *$/g;

export const leaveCommandHandler: CommandHandler = handleConnectionCreation(
  (msg, connection) => {
    connection.destroy();
  },
);

export const leaveCommand = <const>[leaveCommandRegExp, leaveCommandHandler];
