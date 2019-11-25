const router = require('express').Router();


router.get('/', (req, res, next) => {
  res.render('auth', { name: 'James Dean' });
});


module.exports = router;
