const router = require('express').Router();


router.get('/', (req, res, next) => {
  res.render('user', { name: 'James Dean' });
});

module.exports = router;
