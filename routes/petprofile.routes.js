const express = require("express");
const router = express.Router();
var bcrypt = require("bcryptjs");
const uploader = require('../configs/cloudinary.config');
const UserModel = require("../model/User.model");
const EventModel = require("../model/Event.model");
const PetProfileModel = require("../model/PetProfile.model");

//PET PROFILES

router.get("/petprofile/create", (req, res) => {
    res.render("pet-profile-edit.hbs", { isEdit: false });
});

router.post("/petprofile/create", uploader.single("imageUrl"), (req, res) => {
  
  const { name, birthYear } = req.body;

  console.log('file is: ', req.file);
  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }

  if (!name || !birthYear) {
    res.status(500).render("pet-profile-details.hbs", {
      message: "Please fill in all the fields!",
    });
    return;
  }

  PetProfileModel.create({
    name,
    birthYear,
    user: req.session.loggedInUser._id,
    petPicture: req.file.path
  })
    .then((event) => {
      //console.log(event);
      // res.redirect("/petprofile/" + event._id);
      res.redirect("/profile");
    })
    .catch((err) => {
      console.log("Failled to create pet profile in DB", err);
    });

});

router.get("/petprofile/:id", (req, res) => {
  const { id } = req.params;

  PetProfileModel.findById(id)
    .then((petProfileData) => {

      // console.log("THIS IS EVENT DATA", eventsData);
      // console.log(`THIS IS ${eventsData.user} DETAILS`);
      //console.log(req.session.loggedInUser._id === eventsData.user._id)
      //console.log(eventsData)
      if (req.session.loggedInUser && (
        JSON.stringify(req.session.loggedInUser._id) ===
        JSON.stringify(petProfileData.user._id)
      )) {
        res.render("pet-profile-details.hbs", { petProfileData, user: true});
      } else {
        res.render("pet-profile-details.hbs", { petProfileData });
      }
    })
    .catch((err) => {
      console.log("There is an error", err);
    });
});

router.get("/petprofile/:id/picture", (req, res) => {
  const { id } = req.params;

  PetProfileModel.findById(id)
    .then((petProfileData) => {

      res.write(petProfileData.petPicture.data);
      res.end();

    })
    .catch((err) => {
      console.log("There is an error", err);
    });
});


router.get("/petprofile/:id/edit", (req, res) => {
  const { id } = req.params;

  PetProfileModel.findById(id)
    .then((petProfileData) => {

      if (req.session.loggedInUser && (
        JSON.stringify(req.session.loggedInUser._id) ===
        JSON.stringify(petProfileData.user._id)
      )) {
        res.render("pet-profile-edit.hbs", { petProfileData, user: true, isEdit: true});
      } else {
        res.render("pet-profile-edit.hbs", { petProfileData });
      }
    })
    .catch((err) => {
      console.log("There is an error", err);
    });
});

router.post("/petprofile/:id/edit", uploader.single("imageUrl"), (req, res) => {
  const { id } = req.params;

  let edit = req.body;
  edit.petPicture = req.file.path;
  // findByIdAndUpdate will use the information passed from the request body (create event form) to update the event
  PetProfileModel.findByIdAndUpdate(id, { $set: edit })
    .then((resultPetProfile) => {

      // if (req.files && req.files.petPicture) {
      //   resultPetProfile.petPicture.data = req.files.petPicture.data;
      //   resultPetProfile.petPicture.contentType = req.files.petPicture.mimetype;
      //   resultPetProfile.save();
      // }

      res.redirect("/petprofile/" + id);
    })
    .catch((err) => {
      console.log("There is an error", err);
      res.redirect("/petprofile/{{ event._id }}/edit");
    });
});

module.exports = router;