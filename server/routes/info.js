const { Router } = require('express');

const router = new Router();

router.get('/', (req, res) => {
  res.json({ environment: process.env.NODE_ENV });
});

module.exports = router;
