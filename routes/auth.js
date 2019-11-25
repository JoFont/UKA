const router = require('express').Router();
const passport = require('passport');
const User = require('./../models/User');

// Sign In
router.get('/sign-in', (req, res, next) => {
  res.render('auth/sign-in');
});

router.post('/sign-in/local', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/sign-in'
}));

// Sign in with Google
router.get('/sign-in/google', passport.authenticate('google', { scope: ['profile'] }));
// router.get('/sign-in/google/redirect', passport.authenticate('google', { scope: ['profile'] }));

// Sign up
router.get('/sign-up', (req, res, next) => {
  res.render('auth/sign-up');
});

router.post('/sign-up/local', passport.authenticate('local', {
  successRedirect: '/auth/verify-email',
  failureRedirect: '/sign-up'
}));


// CONFIRM EMAIL
router.get('/confirm/:token', (req, res, next) => {
  User.findOneAndUpdate({"auth.verificationToken": req.params.token}, {"auth.verified": true})
  .then(user => {
    res.redirect('/auth/verified')
  })
  .catch(err => console.log(err));
});


router.get('/verify-email', (req, res, next) => {
  res.render('auth/verify-email');
});


module.exports = router;
