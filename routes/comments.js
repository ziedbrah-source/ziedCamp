var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
const comment = require("../models/comment");
var Comment = require("../models/comment");

router.get("/new", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect(campgrounds);
    } else {
      console.log(campground);
      res.render("comments/new", {
        campground: campground,
      });
    }
  });
});
router.post("/", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log("We didn't added the comment");
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        comment.author.id = req.user._id;
        comment.author.username = req.user.username;
        comment.save();
        campground.comments.push(comment);
        campground.save();
        res.redirect("/campgrounds/" + req.params.id);
      });
    }
  });
});

////===============
/// edit / update route!
/// ===============

router.get("/:comment_id/edit", checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      req.flash("error", "Comment not Found!");
      res.redirect("back");
    } else {
      res.render("comments/edit", {
        comment: foundComment,
        campground_id: req.params.id,
      });
    }
  });
});

router.put("/:comment_id/", checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, updatedComment) => {
      if (err) {
        res.redirect("back");
      } else {
        req.flash("success", "Comment Updated");
        res.redirect("/campgrounds/" + req.params.id);
      }
    }
  );
});
router.delete("/:comment_id", checkCommentOwnership, (req, res) => {
  Comment.findByIdAndDelete(req.params.comment_id, (err) => {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("Success", "Comment Deleted.");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

function checkCommentOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (foundComment.author.id.equals(req.user._id)) {
        next();
      } else {
        req.flash("error", "You do not have permission to do that.");
        res.redirect("back");
      }
    });
  } else {
    req.flash("error", "you must be logged in to do that.");
    res.redirect("back");
  }
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "you must be logged in to do that.");
  res.redirect("/login");
}
module.exports = router;
