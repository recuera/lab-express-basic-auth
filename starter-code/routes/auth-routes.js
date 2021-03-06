const express = require("express");
const router = express.Router();

// User model
const User = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 2;

router.get("/signup", (req, res) => {
  console.log("signup");
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  console.log(req.body);
  let username = req.body.username;
  let password = req.body.password;

  if (username == "" || password == "") {
    console.log("EMPTY");
    res.render("auth/signup", {
      errorMessage: "Username or password can't be empty"
    });
    return;
  }

  User.findOne({ username: username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }
    let salt = bcrypt.genSaltSync(bcryptSalt);
    let hashPass = bcrypt.hashSync(password, salt);

    let newUser = User({
      username,
      password: hashPass
    });

    newUser.save(err => {
      res.redirect("/signup");
    });
  });
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username == "" || password == "") {
    res.render("auth/signup", {
      errorMessage: "Username or password can't be empty"
    });
    return;
  }

  User.findOne({ username: username }, (err, user) => {
    if (err || !user) {
      res.render("auth/login", {
        errorMessage: "The username doesn't exist"
      });
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect("/");
    } else {
      res.render("auth/login", {
        errorMessage: "Incorrect password"
      });
    }
  });
});



module.exports = router;
