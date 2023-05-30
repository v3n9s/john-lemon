import { Message } from 'discord.js';
import { connections, Connection } from './player/connection.js';
import { CommandHandler } from './types/command.js';

export const isValidYoutubeLink = (url: string) =>
  !!url.match(
    /^https:\/\/(www\.)?((music\.youtube\.com)|(youtube\.com)|(youtu\.be))\//g,
  );

export const isYoutubePlaylistLink = (href: string) => {
  const url = new URL(href);
  return (
    isValidYoutubeLink(href) &&
    url.pathname === '/playlist' &&
    !!url.searchParams.get('list')
  );
};

export const handleConnectionCreation =
  (
    handler: (msg: Message<true>, connection: Connection) => void,
    voiceConnectionRequired = false,
  ): CommandHandler =>
  (msg: Message<true>) => {
    let connection: Connection | undefined;
    if (voiceConnectionRequired && msg.member?.voice.channel) {
      connection = connections.getCreateIfNotExist({
        guild: msg.guild,
        textChannel: msg.channel,
        voiceChannel: msg.member.voice.channel,
      });
    } else if (!voiceConnectionRequired && msg.guildId) {
      connection = connections.get(msg.guildId);
    }
    if (!connection) return;
    handler(msg, connection);
  };
