import express from 'express';
import { getFollowers } from './utils/followersUtils';
import {
  FollowerResponse,
  FollowerGoal,
} from './interfaces/followerResponseObject';

const router = express.Router();

router.get<{}, FollowerResponse.RootObj>('/', async (req, res) => {
  const data = await getFollowers();
  res.json(data.data);
});

router.get<{}, number>('/total', async (req, res) => {
  const cache = await getFollowers();
  res.json(cache.data.total);
});

router.get<{}, FollowerGoal>('/goal', async (req, res) => {
  const cache = await getFollowers();
  const goalArray = [250, 300, 400, 500, 750, 1000, 2000, 5000].filter(
    (c) => cache.data.total < c,
  );

  res.json({ total: cache.data.total, goal: goalArray[0] });
});

export default router;
