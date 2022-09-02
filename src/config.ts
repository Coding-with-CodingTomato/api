require('dotenv').config();
import { readFileSync } from 'fs';

const readCodeFromFile = () => {
  const data = readFileSync('apiCode.txt');
  if (data) return data.toString();
  return '';
};

export const config = {
  apiPort: process.env.PORT || 5000,
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000',
  twitchUsername: process.env.TWITCH_USERNAME || '',
  twitchUserId: process.env.TWITCH_USER_ID || '',
  twitchApiBaseUrl: 'https://api.twitch.tv/helix',
  twitchAppClientId: process.env.TWITCH_APP_CLIENT_ID || '',
  twitchAppClientSecret: process.env.TWITCH_APP_CLIENT_SECRET || '',
  twitchAppCode: readCodeFromFile(),
};

export default config;
