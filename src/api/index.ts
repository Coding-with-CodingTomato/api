import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import auth from './auth';
import stats from './stats';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/auth', auth);
router.use('/stats', stats);

export default router;
