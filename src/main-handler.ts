import discord from 'discord.js';
import { client } from './client.js';
import { nowPlayingCommand } from './commands/now-playing.js';
import { pauseCommand, unpauseCommand } from './commands/pause.js';
import { playCommand } from './commands/play.js';
import { queueCommand } from './commands/queue.js';
import { leaveCommand } from './commands/leave.js';
import { skipCommand } from './commands/skip.js';
import { CommandHandler } from './types/command.js';
import { seekCommand } from './commands/seek.js';

const getCommand = (command: string) => {
  return commands.find(([regexp]) => command.match(regexp))?.[1];
};

const commands: (readonly [RegExp, CommandHandler])[] = [
  playCommand,
  pauseCommand,
  unpauseCommand,
  skipCommand,
  nowPlayingCommand,
  queueCommand,
  leaveCommand,
  seekCommand,
];

export const mainHandler = (msg: discord.Message) => {
  if (!msg.content.startsWith('!') || msg.author.id === client.user?.id) return;

  const commandHandler = getCommand(msg.content);

  if (commandHandler && msg.guild) {
    commandHandler(msg as discord.Message<true>);

    if (msg.deletable) {
      msg.delete().catch(() => {
        console.log('error occured while deleting message');
      });
    }
  }
};
