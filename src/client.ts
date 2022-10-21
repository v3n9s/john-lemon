import { Client, GatewayIntentBits, IntentsBitField } from 'discord.js';

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildVoiceStates,
  ],
});
