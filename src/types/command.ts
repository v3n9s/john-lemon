import { Message } from 'discord.js';

export type CommandHandler = (msg: Message<true>) => void;
