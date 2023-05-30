import discord from 'discord.js';
import * as discordVoice from '@discordjs/voice';
import { Player } from './player.js';
import { messageCreators } from '../messages.js';

export class Connection {
  voiceConnection: discordVoice.VoiceConnection;
  textChannel: discord.GuildTextBasedChannel;
  voiceChannel: discord.VoiceBasedChannel;
  player: Player;

  constructor({
    guild,
    textChannel,
    voiceChannel,
  }: {
    guild: discord.Guild;
    textChannel: discord.GuildTextBasedChannel;
    voiceChannel: discord.VoiceBasedChannel;
  }) {
    this.voiceConnection = discordVoice.joinVoiceChannel({
      guildId: guild.id,
      channelId: voiceChannel.id,
      adapterCreator: guild.voiceAdapterCreator,
    });
    this.textChannel = textChannel;
    this.voiceChannel = voiceChannel;
    this.player = new Player();
    this.voiceConnection.subscribe(this.player);
    this.voiceConnection.once('disconnected', () => {
      this.destroy();
    });
  }

  sendMessage(msg: string) {
    this.textChannel.send(`Holy Shit! ${msg}`).catch((e) => {
      console.error('Error occured when sending message: ', e);
    });
  }

  destroy() {
    this.sendMessage(messageCreators.leave(this.voiceChannel.name));
    this.player.skip(0, Infinity);
    this.player.stop(true);
    this.voiceConnection.destroy();
    connections.remove(this);
  }
}

class Connections {
  private connections: Record<string, Connection> = {};

  get(guildId: string) {
    return this.connections[guildId];
  }

  getCreateIfNotExist({
    guild,
    textChannel,
    voiceChannel,
  }: {
    guild: discord.Guild;
    textChannel: discord.GuildTextBasedChannel;
    voiceChannel: discord.VoiceBasedChannel;
  }) {
    return (
      this.connections[guild.id] ||
      (this.connections[guild.id] = new Connection({
        guild,
        textChannel,
        voiceChannel,
      }))
    );
  }

  remove(connection: Connection) {
    delete this.connections[connection.textChannel.guildId];
  }
}

export const connections = new Connections();
