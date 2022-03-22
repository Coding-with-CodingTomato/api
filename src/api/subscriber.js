const express = require('express');
const axios = require('axios');
const config = require('../config');

const twitchHeaders = {
  headers: {
    Authorization: `Bearer ${config.twitchToken}`,
    'Client-Id': config.twitchClientId,
  },
};

const apiBaseUrl = 'https://api.twitch.tv/helix';
const router = express.Router();
const refreshTimeout = 1000 * 60 * 2;
const cache = { data: {}, total: 0, lastRefresh: 0 };
let lastRefresh = 0;

const getSubscribers = async () => {
  if (Date.now() > lastRefresh + refreshTimeout) {
    try {
      const response = await axios.get(`${apiBaseUrl}/subscriptions?first=100&broadcaster_id=${config.twitchUserId}`, twitchHeaders);

      const totalCount = response.data.total;
      let localCount = response.data.data.length;
      let lastCursor = response.data.pagination.cursor;
      let tempData = response.data.data;

      while (localCount < totalCount) {
        // eslint-disable-next-line no-await-in-loop
        const nextResponse = await axios.get(`${apiBaseUrl}/subscriptions?first=100&after=${lastCursor}&broadcaster_id=${config.twitchUserId}`, twitchHeaders);
        localCount += nextResponse.data.data.length;
        lastCursor = nextResponse.data.pagination.cursor;
        tempData = tempData.concat(nextResponse.data.data);
      }

      lastRefresh = Date.now();

      cache.data = tempData;
      cache.lastRefresh = lastRefresh;
      cache.total = totalCount;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error.message);
    }
  }

  return cache;
};

router.get('/', async (req, res) => {
  const subs = await getSubscribers();
  res.json(subs);
});

router.get('/total', async (req, res) => {
  const subs = await getSubscribers();
  res.json(subs.data.length);
});

router.get('/goal', async (req, res) => {
  const subs = await getSubscribers();
  const goalArray = [10, 20, 50, 100, 250, 500, 1000, 2000].filter(
    (c) => subs.data.length < c
  );

  res.json({ total: subs.data.length, goal: goalArray[0] });
});

module.exports = router;
