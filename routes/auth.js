const router = require('express').Router();
const passport = require('passport');
const User = require('./../models/User');

//! SIGN IN
// Sign In Local
router.get('/sign-in', (req, res, next) => {
  res.render('auth/sign-in');
});

router.post('/sign-in/local', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/sign-in'
}));

// Sign in with Google
router.get('/sign-in/google', passport.authenticate('google', {
  scope: ['profile']
}));

router.get('/sign-in/google/redirect', passport.authenticate('google', { failureRedirect: '/sign-in' }), (req, res, next) => {
  res.redirect("/");
});




//! SIGN UP
// Sign up Local
router.get('/sign-up', (req, res, next) => {
  res.render('auth/sign-up');
});

router.post('/sign-up/local', passport.authenticate('local', {
  successRedirect: '/auth/verify-email',
  failureRedirect: '/sign-up'
}));

// Verify Email
router.get('/verify-email', (req, res, next) => {
  res.render('auth/verify-email');
});

router.get('/confirm/:token', (req, res, next) => {
  User.findOneAndUpdate({"auth.verificationToken": req.params.token}, {"auth.verified": true})
  .then(user => {
    res.redirect(`/user/${user._id}/complete-profile`);
  })
  .catch(err => console.log(err));
});

// Complete Profile



//! SIGN OUT
router.post("/sign-out", (req, res, next) => {
  // TODO: SIGN USER OUT
});


module.exports = router;
