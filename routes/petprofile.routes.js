const express = require("express");
const router = express.Router();
var bcrypt = require("bcryptjs");

const UserModel = require("../model/User.model");
const EventModel = require("../model/Event.model");
const PetProfileModel = require("../model/PetProfile.model");

//PET PROFILES

router.get("/petprofile/create", (req, res) => {
    res.render("pet-profile-edit.hbs", { isEdit: false });
});

router.post("/petprofile/create", (req, res) => {
  
  const { name, birthYear } = req.body;

  if (!name || !birthYear) {
    res.status(500).render("pet-profile-details.hbs", {
      message: "Please fill in all the fields!",
    });
    return;
  }

  PetProfileModel.create({
    name,
    birthYear,
    user: req.session.loggedInUser._id
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

router.post("/petprofile/:id/edit", (req, res) => {
  const { id } = req.params;

  // findByIdAndUpdate will use the information passed from the request body (create event form) to update the event
  PetProfileModel.findByIdAndUpdate(id, { $set: req.body })
    .then((resultPetProfile) => {

      if (req.files && req.files.petPicture) {
        resultPetProfile.petPicture.data = req.files.petPicture.data;
        resultPetProfile.petPicture.contentType = req.files.petPicture.mimetype;
        resultPetProfile.save();
      }

      res.redirect("/petprofile/" + id + '/edit');
    })
    .catch((err) => {
      console.log("There is an error", err);
      res.redirect("/petprofile/{{ event._id }}/edit");
    });
});

module.exports = router;









// //EDIT EVENT

// // GET route to show the form to update a single event.
// router.get("/event/:id/edit", (req, res, next) => {
//   const { id } = req.params;

//   // findById method will obtain the information of the event to show in the update form view
//   EventModel.findById(id).then((event) => {
//     // console.log(event.user);
//     res.render("event-update-form.hbs", { event });
//   });
// });

// // POST route to update the event element with the info updated in the form view
// router.post("/event/:id/edit", (req, res, next) => {
//   const { id } = req.params;

//   // findByIdAndUpdate will use the information passed from the request body (create event form) to update the event
//   EventModel.findByIdAndUpdate(id, { $set: req.body })
//     .then((event) => {
//       res.redirect("/events");
//     })
//     .catch((err) => {
//       console.log("There is an error", err);
//       res.redirect("/events/{{ event._id }}/edit");
//     });
// });

// //DELETE EVENT
// router.post("/event/:id/delete", (req, res, next) => {
//   const { id } = req.params;

//   EventModel.findByIdAndDelete(id)
//     .then((event) => {
//       console.log(`Event ${event.title} deleted`);
//       res.redirect("/events");
//     })
//     .catch((err) => console.log("event not deleted", err));
// });

// //EVENT DETAILS
// router.get("/event-details/:id", (req, res) => {
//   const { id } = req.params;

//   EventModel.findById(id)
//     .populate("user")
//     .then((eventsData) => {
//       // console.log("THIS IS EVENT DATA", eventsData);
//       // console.log(`THIS IS ${eventsData.user} DETAILS`);
//       //console.log(req.session.loggedInUser._id === eventsData.user._id)
//       //console.log(eventsData)
//       if (
//         JSON.stringify(req.session.loggedInUser._id) ===
//         JSON.stringify(eventsData.user._id)
//       ) {
//         res.render("event-details.hbs", { eventsData, user: true});
//       } else {
//         res.render("event-details.hbs", { eventsData });
//       }
//     })
//     .catch((err) => {
//       console.log("There is an error", err);
//     });
// });


// //REGISTER TO AN EVENT 
// router.get("/event-registration/:id", (req, res, next) => {
//   const { id } = req.params;

//   EventModel.findByIdAndUpdate(id, {$push: { attendEvent: req.session.loggedInUser._id }})
//   .then((event) => {

//     console.log("Registered to Event: ", event);
//     res.render("event-registration.hbs", { event });
//   })
//   .catch((err) => {
//     console.log("There is an error", err);
//     res.redirect("/events", { registrationMessage: "Sorry, we were anable to register you for the event. You may tray later." });
//   });
// }); 






// //CANCEL event registration ROUTE
// router.get("/event-cancel-registration/:id", (req, res, next) => {
//   const { id } = req.params;

// }); 

// module.exports = router;
