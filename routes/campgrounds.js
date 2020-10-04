var express = require("express");
const { findById } = require("../models/campground");
var router = express.Router();
const Campground = require("../models/campground");

router.get("/", (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log("OOPS , There is an error");
      res.redirect("/");
    } else {
      res.render("campgrounds/index", {
        campgrounds: campgrounds,
      });
    }
  });
});
router.post("/", isLoggedIn, (req, res) => {
  const campgroundName = req.body.name;
  const campgroundImage = req.body.image;
  const campgroundDesc = req.body.description;
  const campgroundPrice = req.body.price;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };
  let campground = {
    name: campgroundName,
    image: campgroundImage,
    description: campgroundDesc,
    author: author,
    price: campgroundPrice,
  };
  Campground.create(campground, (err, newlyCreated) => {
    if (err) {
      console.log("There is an Error in Creating the Campground!");
    } else {
      console.log(newlyCreated);
    }
  });
  res.redirect("campgrounds");
});
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});
router.get("/:id/edit", checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.render("campgrounds/edit", {
        campground: foundCampground,
      });
    }
  });
});
//==============
// The PUT route for updating a campground.
//==============
router.put("/:id", checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    (err, updatedCampground) => {
      if (err) {
        res.redirect("/camprgounds");
      } else {
        res.redirect("/campgrounds/" + req.params.id);
      }
    }
  );
});
router.delete("/:id", checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.log("There is an error");
    } else {
      req.flash("success", "Campground removed");
      res.redirect("/campgrounds");
    }
  });
});
router.get("/:id", (req, res) => {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/show", {
          campground: foundCampground,
        });
      }
    });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "you must be logged in to do that.");
  res.redirect("/login");
}
/////// to check AUTHORIZATION ..
function checkCampgroundOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (foundCampground.author.id.equals(req.user.id)) {
        next();
      } else {
        req.flash("error", "You don't have permission to do that!");
        res.redirect("back");
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("back");
  }
}
module.exports = router;
