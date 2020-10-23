const express = require("express");
const router = express.Router();
//npconst moment = require("moment");

const UserModel = require("../model/User.model");
var bcrypt = require("bcryptjs");
const PetProfileModel = require("../model/PetProfile.model");
const uploader = require('../configs/cloudinary.config');
const EventModel = require("../model/Event.model");
const moment = require("moment");

router.get("/profile", (req, res) => {
  let userData = req.session.loggedInUser;

  PetProfileModel.find({ user: userData._id })
    .then(async(petData) => {

      // await waits for promises to be resolved or rejected and returns the result
      // this makes it easier to control the flow of multiple asynchronous function
      let eventsData = await EventModel.find({ date: { $gte: new Date() }, attendEvent: userData._id }, null, {
        sort: { date: "asc" },
      });
  
      eventsData.forEach((elem) => {
        elem.time = moment(elem.createdAt).format('YYYY-MM-DD HH:mm');
      });
      
      console.log(userData);
      res.render("profiles/profile", { userData, myProfile: true, petData, eventsData });
    })
    .catch((err) => {
      console.log("failed to add pet", err);
    });
  // res.render("profiles/profile", { userData, myProfile:true });
});

router.get("/profile/edit", (req, res) => {
  let userData = req.session.loggedInUser;
  res.render("profiles/edit-profile", { userData });
});

router.get("/profile/:id", (req, res) => {
  let id = req.params.id;

  UserModel.findById(id)
    .then((userData) => {
      let myProfile = (id === req.session.loggedInUser._id);
      res.render("profiles/profile", { userData, myProfile: myProfile });
    })
    .catch((err) => {
      console.log("Failed to retrieve user information from database", err);
    });
});

router.get("/profile/edit/password", (req, res) => {
  res.render("profiles/edit-password");
});

router.get("/profile/:id/picture", (req, res) => {
  const { id } = req.params;
  UserModel.findById(id)
    .then((userData) => {
      if (userData.avatarPicture) {
        res.write(userData.avatarPicture.data);
      }
      res.end();
    })
    .catch((err) => {
      console.log("There is an error", err);
    });
});


router.post("/profile/edit", uploader.single("imageUrl"), (req, res) => {
  let userId = req.session.loggedInUser._id;

  // console.log('file is: ', req.file);
  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }
  UserModel.findByIdAndUpdate(userId, { $set: {...req.body, avatar: req.file.path} })
  .then((resultUser) => {

      // if (req.files && req.files.avatarPicture) {
      //   resultUser.avatarPicture.data = req.files.avatarPicture.data;
      //   resultUser.avatarPicture.contentType = req.files.avatarPicture.mimetype;
      //   resultUser.save();
      // }

      UserModel.findById(userId)
        .then((data) => {
          req.session.loggedInUser = data;
          // console.log(req.session.loggedInUser);
          res.redirect("/profile");
        })
        .catch((err) => { console.log("failed to update session info", err); });
    })
    .catch((err) => {
      console.log("failed to update profile in dtabase", err);
    });
});

router.post("/profiles/edit/password", (req, res) => {
  let { password, newPassword, confirmPassword } = req.body;
  let userId = req.session.loggedInUser._id;

  if (newPassword !== confirmPassword) {
    res.status(500).render("profile/edit-password", { message: "New password and confirmed password do not match" });
    return;
  }

  //SOMETHING IS BROKEN HERE!!!!!
  UserModel.findById(userId)
    .then((userData) => {
      bcrypt.compare(password, userData.password)
        .then((result) => {
          if (result) {
            bcrypt
              .genSalt(10)
              .then((salt) => {
                bcrypt
                  .hash(newPassword, salt)
                  .then((hashedPassword) => {
                    UserModel.findByIdAndUpdate(userId, { $set: { password: hashedPassword } })
                      .then(() => {
                        res.redirect("/profile");
                      })
                      .catch((err) => {
                        console.log("Failed to update password in database", err);
                      });
                  })
                  .catch(() => {
                    console.log("Failed to hash PW");
                  });
              })
              .catch(() => {
                console.log("Failed to generate salt");
              });
          }
          else {
            res.status(500).render("profile/edit-password", { message: "Old password does not match your user information" });
            return;
          }
        });
    })
    .catch((err) => {
      console.log("failed to validate password in database", err);
      res.status(500).render("profile/edit-password", { message: "Database connection failed. Please try again." });
      return;
    });
});

module.exports = router;