import { Message } from 'discord.js';
import { Connection, Instance } from './player/connection';
import { CommandHandler } from './types/command';

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
    handler: (msg: Message<true>, connection: Instance) => void,
    voiceConnectionRequired = false,
  ): CommandHandler =>
  (msg: Message<true>) => {
    let connection: Instance | undefined;
    if (voiceConnectionRequired && msg.member?.voice.channel) {
      connection = Connection.getCreateIfNotExist({
        guild: msg.guild,
        textChannel: msg.channel,
        voiceChannel: msg.member.voice.channel,
      });
    } else if (!voiceConnectionRequired && msg.guildId) {
      connection = Connection.get(msg.guildId);
    }
    if (!connection) return;
    handler(msg, connection);
  };
