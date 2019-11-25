const router = require('express').Router();


router.get('/sign-up', (req, res, next) => {
  res.render('auth');
});

router.post('/sign-up', (req, res, next) => {
  res.render('auth');
});

module.exports = router;
