const express = require('express');
const router  = express.Router();

router.get('/', (req, res, next) => {
  res.render('../views/index.hbs');
});

module.exports = router;