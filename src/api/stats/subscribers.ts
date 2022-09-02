import express from 'express';
import { getSubscribers } from './utils/subscriberUtils';
import {
  SubscriberGoal,
  SubscriberResponse,
} from './interfaces/subscriberResponseObject';

const router = express.Router();

router.get<{}, SubscriberResponse.RootObj>('/', async (req, res) => {
  const data = await getSubscribers();
  res.json(data.data);
});

router.get<{}, number>('/total', async (req, res) => {
  const cache = await getSubscribers();
  res.json(cache.data.total);
});

router.get<{}, SubscriberGoal>('/goal', async (req, res) => {
  const cache = await getSubscribers();
  const goalArray = [5, 10, 20, 50, 100, 250, 500, 1000, 2000].filter(
    (c) => cache.data.total < c,
  );

  res.json({ total: cache.data.total, goal: goalArray[0] });
});

export default router;
