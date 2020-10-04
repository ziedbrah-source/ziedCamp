var express = require("express");
var router = express.Router();
var User = require("../models/user");
const passport = require("passport");

router.get("/", (req, res) => {
  res.render("home");
});

// AUTH ROUTES //
router.get("/register", (req, res) => {
  res.render("register", {
    currentUser: req.user,
  });
});
router.post("/register", function (req, res) {
  // console.log(req.body.username);
  // console.log(req.body.password);
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    function (err, user) {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("register");
      }
      passport.authenticate("local")(req, res, function () {
        req.flash("success", "Welcome to ziedCamp " + user.username);
        res.redirect("/campgrounds");
      });
    }
  );
});
router.get("/login", (req, res) => {
  res.render("login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  function (req, res) {
    console.log("i'm here");
  }
);
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "LOGGED YOU OUT.");
  res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "you must be logged in to do that.");
  res.redirect("/login");
}

module.exports = router;
