import { messageCreators } from '../messages.js';
import { CommandHandler } from '../types/command.js';
import { handleConnectionCreation } from '../utils.js';

export const pauseCommandRegexp = /^!pause *$/g;

export const pauseCommandHandler: CommandHandler = handleConnectionCreation(
  (msg, connection) => {
    const currentTrack = connection.player.getCurrentTrack();
    if (currentTrack) {
      connection.sendMessage(messageCreators.pause(currentTrack.getTitle()));
      connection.player.pause();
    } else {
      connection.sendMessage(messageCreators.currentlyNotPlaying());
    }
  },
);

export const pauseCommand = <const>[pauseCommandRegexp, pauseCommandHandler];

export const unpauseCommandRegexp = /^!unpause *$/g;

export const unpauseCommandHandler: CommandHandler = handleConnectionCreation(
  (msg, connection) => {
    const currentTrack = connection.player.getCurrentTrack();
    if (currentTrack) {
      connection.sendMessage(messageCreators.unpause(currentTrack.getTitle()));
      connection.player.unpause();
    } else {
      connection.sendMessage(messageCreators.currentlyNotPlaying());
    }
  },
);

export const unpauseCommand = <const>[
  unpauseCommandRegexp,
  unpauseCommandHandler,
];
