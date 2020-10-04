const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");

var data = [
  {
    name: "Hotel 1",
    image:
      "https://assets.simpleviewinc.com/simpleview/image/fetch/q_60/https://assets.simpleviewinc.com/simpleview/image/upload/crm/poconos/Keen-Lake-PMVB-Tent-Camping_4801BD24-F9D4-475A-A3190D54D81DC960_22da476f-7a03-4535-992f7dc93de87398.jpg",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    name: "Hotel 2",
    image:
      "https://assets.simpleviewinc.com/simpleview/image/fetch/q_60/https://assets.simpleviewinc.com/simpleview/image/upload/crm/poconos/Keen-Lake-PMVB-Tent-Camping_4801BD24-F9D4-475A-A3190D54D81DC960_22da476f-7a03-4535-992f7dc93de87398.jpg",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    name: "Hotel 3",
    image:
      "https://assets.simpleviewinc.com/simpleview/image/fetch/q_60/https://assets.simpleviewinc.com/simpleview/image/upload/crm/poconos/Keen-Lake-PMVB-Tent-Camping_4801BD24-F9D4-475A-A3190D54D81DC960_22da476f-7a03-4535-992f7dc93de87398.jpg",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
];

function seedDB() {
  Campground.remove({}, (err) => {
    if (err) {
      console.log("There is an Error");
    } else {
      console.log("CAMPGROUND removed");
    }
    data.forEach((seed) => {
      Campground.create(seed, (err, campground) => {
        if (err) {
          console.log("ERROR #!");
        } else {
          console.log(campground);
          Comment.create(
            {
              text: "this place is Great!, But no INTERNET",
              author: "Homer",
            },
            (err, comment) => {
              if (err) {
                console.log(err);
              } else {
                campground.comments.push(comment);
                campground.save();
                console.log("Created new comment");
              }
            }
          );
        }
      });
    });
  });
}
module.exports = seedDB;
