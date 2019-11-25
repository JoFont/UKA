const router = require('express').Router();


router.get('/', (req, res, next) => {
  res.render('recipes', { name: 'James Dean' });
});

module.exports = router;