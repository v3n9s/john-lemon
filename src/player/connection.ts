import * as discord from 'discord.js';
import * as discordVoice from '@discordjs/voice';
import { setTimeout as delay } from 'timers/promises';
import { Player } from './player';

export type Instance = {
  voiceConnection: discordVoice.VoiceConnection;
  textChannel: discord.GuildTextBasedChannel;
  sendMessage: (text: string) => Promise<void>;
  voiceChannel: discord.VoiceBasedChannel;
  player: Player;
};

export class Connection {
  private static connections: Record<string, Instance> = {};

  static get(guildId: string) {
    return this.connections[guildId];
  }

  static getCreateIfNotExist({
    guild,
    textChannel,
    voiceChannel,
  }: {
    guild: discord.Guild;
    textChannel: discord.GuildTextBasedChannel;
    voiceChannel: discord.VoiceBasedChannel;
  }) {
    let connection = this.connections[guild.id];
    if (connection) {
      return connection;
    }
    connection = this.connections[guild.id] = {
      voiceConnection: discordVoice.joinVoiceChannel({
        guildId: guild.id,
        channelId: voiceChannel.id,
        adapterCreator: guild.voiceAdapterCreator,
      }),
      textChannel,
      async sendMessage(msg) {
        await this.textChannel.send(`Holy Shit! ${msg}`);
      },
      voiceChannel,
      player: new Player(),
    };
    connection.voiceConnection.subscribe(connection.player.discordPlayer);
    return connection;
  }

  static async destroy(connection: Instance) {
    connection.player.pause();
    await delay(500);
    connection.voiceConnection.destroy();
    delete this.connections[connection.textChannel.guildId];
  }
}
