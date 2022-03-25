const asyncWrap = require("../middleware/async");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const passport = require("passport");

exports.register = asyncWrap(async (req, res, next) => {
  // i destructure the request body
  const { firstName, lastName, email, password, password2 } = req.body;
  let errors = [];

  // if the user is missing an input then they get a notification telling them to input all fields
  if (!(firstName || lastName || email || password || password2)) {
    errors.push({ msg: "Please enter input for all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords entered do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      firstName,
      lastName,
      email,
      password,
      password2,
    });
  } else {
    // here find one looks through all the emails and checks if the email is already in the database
    // if it is then they get a message that an account with that email already exists
    User.findOne({ email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email is already registered to an account" });
        res.render("register", {
          errors,
          firstName,
          lastName,
          email,
          password,
          password2,
        });
      } else {
        //here I am created the user with all the inputted information
        const newUser = new User({
          firstName,
          lastName,
          email,
          password,
          password2,
        });
        // Here the password is hashed and saved for the user and then the user is redirected to the log in page
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered. Please log in"
                );
                res.redirect("/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

exports.login = asyncWrap(async (req, res, next) => {
  // passport.authenticate(), specifies the 'local' strategy
  //to authenticate usernames and passwords in the Node application
  passport.authenticate("local", {
    // if it successfully authenticates then I get redirected to the main comics page
    successRedirect: "/comics",
    //if it fails then it stays on the login page
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

// exports.protectRoute = asyncWrap(async (req, res, next) => {

// });

exports.logout = asyncWrap(async (req, res, next) => {
  req.logout();
  req.flash("success_msg", "You have successfully logged out");
  res.redirect("/login");
});

// exports.authorization = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res
//         .status(403)
//         .send(
//           `User role ${req.user.role} is not authorized to access this route`
//         );
//     }
//     next();
//   };
// }
