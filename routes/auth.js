const router = require('express').Router();
const passport = require('passport');


// Sign In
router.get('/sign-in', (req, res, next) => {
  res.render('auth/sign-in');
});

router.post('/sign-in/local', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/sign-in'
}));


router.get('/sign-up', (req, res, next) => {
  res.render('auth/sign-up');
});

router.post('/sign-up/local', passport.authenticate('local', {
  successRedirect: '/auth/verify-email',
  failureRedirect: '/sign-up'
}));


router.get('/verify-email', (req, res, next) => {
  res.render('auth/verify-email');
});


module.exports = router;
