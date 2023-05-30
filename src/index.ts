import { client } from './client.js';
import { token, pathToFfmpeg } from './config.js';
import { mainHandler } from './main-handler.js';
import ffmpeg from 'fluent-ffmpeg';

if (pathToFfmpeg) {
  ffmpeg.setFfmpegPath(pathToFfmpeg);
}

client.once('ready', (c) => {
  console.log("HOLY SHIT IT'S JOHN LEMON!");
  console.timeEnd('start');
});

client.on('messageCreate', mainHandler);

void client.login(token);
console.time('start');
