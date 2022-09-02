import express from 'express';
import follows from './followers';
import subscribers from './subscribers';

const router = express.Router();

router.use('/follows', follows);
router.use('/subscribers', subscribers);

export default router;
