import express from 'express';
import { config } from '../../config';
import { writeFile } from 'fs/promises';
import axios from 'axios';

const router = express.Router();

const twitchLoginLink = `https://id.twitch.tv/oauth2/authorize?client_id=${config.twitchAppClientId}&scope=channel%3Aread%3Asubscriptions&response_type=code&redirect_uri=http://localhost:5001/api/v1/auth/redirect`;

router.get<{}, string>('/', (req, res) => {
  res.send(`<a href="${twitchLoginLink}">Login with Twitch</a>`);
});

router.get<{}, string>('/redirect', async (req, res) => {
  const code = req.query.code;

  if (code !== undefined) {
    try {
      const params = new URLSearchParams();
      params.append('client_id', config.twitchAppClientId);
      params.append('client_secret', config.twitchAppClientSecret);
      params.append('code', code.toString());
      params.append('grant_type', 'authorization_code');
      params.append(
        'redirect_uri',
        `${config.apiBaseUrl}/api/v1/auth/redirect`,
      );

      const response = await axios.post(
        'https://id.twitch.tv/oauth2/token',
        params,
      );

      if (response.data.access_token) {
        await writeFile('apiCode.txt', response.data.access_token);
        return res.sendStatus(200);
      }

      return res.sendStatus(401);
    } catch (error) {
      console.error(error);
      return res.sendStatus(500);
    }
  }

  return res.sendStatus(400);
});

export default router;
