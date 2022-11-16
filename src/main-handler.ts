import discord from 'discord.js';
import { client } from './client';
import { nowPlayingCommand } from './commands/now-playing';
import { pauseCommand, unpauseCommand } from './commands/pause';
import { playCommand } from './commands/play';
import { queueCommand } from './commands/queue';
import { leaveCommand } from './commands/leave';
import { skipCommand } from './commands/skip';
import { CommandHandler } from './types/command';
import { seekCommand } from './commands/seek';

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
    commandHandler(<discord.Message<true>>msg);

    if (msg.deletable) {
      msg.delete().catch(() => {
        console.log('error occured while deleting message');
      });
    }
  }
};
