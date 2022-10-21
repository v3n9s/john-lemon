import 'dotenv/config';

export const token = <string>process.env.DISCORD_BOT_TOKEN;

if (typeof token !== 'string' || token.length === 0) {
  throw new Error(
    'Invalid token, please specify DISCORD_BOT_TOKEN env variable',
  );
}
