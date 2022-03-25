const localStrat = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

// calls the User Schema from models folder
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    // The local  strategy authenticates users using a username and password and then accepts those credentials and returns a user
    new localStrat({ usernameField: "email" }, (email, password, done) => {
      // find user based  on email since all emails are unique
      User.findOne({
        email,
      }).then((user) => {
        // if the user is not found then they will get a message letting them know
        if (!user) {
          return done(null, false, {
            message: "Email not found. Please register.",
          });
        }

        //bcrypt compares the hashed password with the user password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            // if there is a match it returns a user that matches the criteria
            return done(null, user);
          } else {
            // if it doesn't match it send a message letting the use know
            return done(null, false, {
              message: "Password entered is incorrect",
            });
          }
        });
      });
    })
  );
  //  serializeUser() sets an id as the cookie in the user’s browser
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  // deserializeUser() uses the id to look up the user returns the user object with data.
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
