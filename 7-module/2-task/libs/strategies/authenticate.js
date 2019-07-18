const User = require('../../models/User');
const mongoose = require('mongoose');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) return done(null, false, 'Не указан email');

  User.findOne({email}).then(async (user) => {
    if (!user) {
      const newUser = await new User({
        email: email,
        displayName: displayName,
      });

      await newUser.save();
      return done(null, newUser, 'new user created');
    }

    done(null, user, 'user found');
  }).catch((error) => {
    return done(error, false, 'Некорректный email.');
  });
};
