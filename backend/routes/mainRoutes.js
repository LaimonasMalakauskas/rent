const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Backend is working');
});

module.exports = router;