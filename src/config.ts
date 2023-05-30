import 'dotenv/config';
import pathToStaticFfmpeg from 'ffmpeg-static';

export const token = process.env.DISCORD_BOT_TOKEN as string;

export const pathToFfmpeg = pathToStaticFfmpeg as unknown as string;

if (typeof token !== 'string' || token.length === 0) {
  throw new Error(
    'Invalid token, please specify DISCORD_BOT_TOKEN env variable',
  );
}

if (!pathToFfmpeg) {
  throw new Error('FFMPEG not found');
}
