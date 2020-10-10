const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Campground = require("./models/campground.js");
const seedDB = require("./seeds");
const bodyParser = require("body-parser");
const Comment = require("./models/comment");
const passport = require("passport");
const User = require("./models/user");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const PORT = process.env.PORT || 3001;
const commentRoutes = require("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
const indexRoutes = require("./routes/index");
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

mongoose
  .connect(
    "mongodb://localhost:27017/yelp_camp",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("We are Connected baby!");
  });
//seedDB();
// ===========
// PASSPORT CONFIGURATION
// ===========
app.use(
  require("express-session")({
    secret: "Zied is the best",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=============================

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(PORT, () => {
  console.log("YelpCamp server Started!");
});
