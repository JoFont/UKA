const router = require('express').Router();


router.get('/', (req, res, next) => {
  res.render('index', { title: 'Hello World!' });
});

module.exports = router;
