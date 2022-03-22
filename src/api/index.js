const express = require('express');

const subscriber = require('./subscriber');
const follower = require('./follower');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/subscriber', subscriber);
router.use('/follower', follower);

module.exports = router;
