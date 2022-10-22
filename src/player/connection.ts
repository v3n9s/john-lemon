import * as discord from 'discord.js';
import * as discordVoice from '@discordjs/voice';
import { setTimeout as delay } from 'timers/promises';
import { Player } from './player';

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
  }

  async sendMessage(msg: string) {
    await this.textChannel.send(`Holy Shit! ${msg}`);
  }

  async destroy() {
    this.player.pause();
    await delay(500);
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
