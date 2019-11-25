const router = require('express').Router();


module.exports = router.get('/', (req, res, next) => {
  res.render('recipes', { name: 'James Dean' });
});
