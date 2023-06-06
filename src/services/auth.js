import passport from 'passport';
import ROLES_LIST from '../utils/userRoles.util';

const GoogleStrategy = require('passport-google-oauth2').Strategy;
require('dotenv').config();

const userRole = 'customer';

const newRole = ROLES_LIST[userRole];

const { GOOGLE_CLIENT_ID } = process.env;
const { GOOGLE_CLIENT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const db = require('../Database/models');

const User = db.users;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.CALLBACK_URL}/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ where: { email: profile.email } })
        .then(user => {
          if (user) {
            return done(null, user);
          }
          const newUser = {
            fullname: profile.displayName,
            email: profile.email,
            password: bcrypt.hashSync(profile.id, 10),
            role: JSON.stringify(newRole),
          };
          User.create(newUser)
            .then(createdUser => done(null, createdUser))
            .catch(err => done(err, null));
        })
        .catch(err => done(err, null));
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => {
      if (!user) {
        return done('User not found', null);
      }
      done(null, user);
    })
    .catch(err => {
      done(err, null);
    });
});
