const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcryptjs = require('bcryptjs');
const nodemailer = require('./mailer');
const User = require('../models/User');

// GENERATE RANDOM TOKEN
const generateId = length => {
  const characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
};

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
});

passport.use('local', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  const user = await User.findOne({ email });
  const token = generateId(32);
  if (user) {
    const passMatch = await bcryptjs.compare(password, user.passHash);
    if(passMatch && user.auth.verified) {
      done(null, user);
    } else if(passMatch && !user.auth.verified) {
      done(new Error("Please Verify your account."))
    } else {
      done(new Error("Password doesn't match"))
    }
  } else {
    try {
      const hash = await bcryptjs.hash(password, 10);
      const newUser = await User.create({
        email,
        photoUrl: `https://api.adorable.io/avatars/285/${hash}.png`,
        auth: {
          method: "local",
          passHash: hash,
          verified: false,
          verificationToken: token
        }
      });
      await nodemailer.sendMail({
        from: `"Ultimate Kitchen Assistant" <${process.env.EMAIL_USER}>`,
        to: `${email}`, 
        subject: 'UKA - Confirm Your Email', 
        text: `Welcome to UKA. Go to 
        http://localhost:3000/auth/confirm/${token} 
        to confirm your email address`,
        html: `
        <h1>Welcome to UKA</h1>
        <p>
          <a href="http://localhost:3000/auth/confirm/${token}/">
            Click here
          </a>
          to confirm your email address
        </p>
        `
      });
      done(null, newUser);
    } catch (err) {
      done(err);
    }
  }
}));

// passport.use("google", new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: "http://www.example.com/auth/google/callback"
// },
// function(accessToken, refreshToken, profile, cb) {
//   User.findOrCreate({ googleId: profile.id }, function (err, user) {
//     return cb(err, user);
//   });
// }
// ));