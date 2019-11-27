const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcryptjs = require('bcryptjs');
const nodemailer = require('./mailer');
const fs = require('fs');
const handlebars = require('handlebars');
const User = require('../models/User');

//attach the plugin to the nodemailer transporter


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

const renderTemplate = (path, data) => {
  const source = fs.readFileSync(path, 'utf8');
  const template = handlebars.compile(source);
  const result = template(data);
  return result;
}


passport.use('local', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  const user = await User.findOne({ email });
  const token = generateId(32);
  if (user) {
    try {
      const passMatch = await bcryptjs.compare(password, user.auth.passHash);
      if (passMatch && user.auth.verified) {
        done(null, user);
      } else if (passMatch && !user.auth.verified) {
        done(new Error("Please Verify your account."))
      } else {
        done(new Error("Password doesn't match"))
      }
    } catch (error) {
      done(error);
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

      // TODO: I WAS HERE
      const htmlEmail = renderTemplate(__dirname + "/mail/verify-email.hbs", {newUser, token});
      nodemailer.sendMail({
        from: `"Ultimate Kitchen Assistant" <${process.env.EMAIL_USER}>`,
        to: `${email}`, 
        subject: 'UKA - Confirm Your Email', 
        text: `Welcome to UKA. Go to 
        http://localhost:3000/auth/confirm/${token} 
        to confirm your email address`,
        html: htmlEmail
      });
      
      done(null, newUser);
    } catch (err) {
      done(err);
    }
  }
}));

passport.use("google", new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/sign-in/google/redirect"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOne({ email: profile.emails[0].value });

    if (user) {
      done(null, user);
    } else {
      const newUser = await User.create({
        displayName: profile.displayName,
        email: profile.emails[0].value,
        photoUrl: profile.photos[0].value,
        auth: {
          method: "google",
          uid: profile.id
        }
      });
      done(null, newUser);
    }
  } catch (error) {
    done(error);
  }
}));
