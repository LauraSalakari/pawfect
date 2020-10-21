const express = require("express");
const moment = require("moment");
const router = express.Router();
var bcrypt = require("bcryptjs");

const UserModel = require("../model/User.model");
const EventModel = require("../model/Event.model");



router.get("/create-event", (req, res) => {
  res.render("create-event.hbs");
});

router.get("/events", (req, res) => {

  EventModel.find({ date: { $gte: new Date() } }, null, {
    sort: { date: "asc" },
  })
    .then((eventsData) => {
      // console.log("req.session.loggedInUser._id is: ", req.session.loggedInUser._id)
      // console.log("eventsData[0].user is: ", eventsData[0].user);

      let events = [];
      for (let eventData of eventsData) {
        // eventData.time = moment(eventData.date).format('HH:mm');
        eventData.datePretty = moment(eventData.date).format('YYYY-MM-DD');
        events.push(eventData);
      }

      console.log(events);
      
      res.render("events.hbs", { events: events });

    })
    .catch((err) => {
      console.log(err);
      res.status(500).render("auth/signin.hbs", {
        //redirect to somewhereelse
        message: "Fail to fetch user information",
      });
    });
});

router.post("/create-event", (req, res) => {
  const { title, location, date, time, type, description, eventPicture } = req.body;
  console.log(req.body)

  if (!title || !location || !date || !time || !type) {
    res.status(500).render("create-event.hbs", {
      message: "Please fill in all the fields!",
    });
    return;
  }

  let dateReg = new RegExp(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/);
  if (!dateReg.test(date)) {
    res.status(500).render("auth/create-event.hbs", {
      message: "Please enter a valid date",
    });
    return;
  }

  //take the ID number of the currently logged in user
  let newUser = req.session.loggedInUser._id;
console.log('time is :', time)
  EventModel.create({
    ...req.body,
    user: newUser,
    attendEvent: newUser
    // attendEvent: [ mongoose.Schema.Types.ObjectId ]
  })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log("Failled to create event in DB", err);
    });

  //res.render("create-event.hbs");
});




//EDIT EVENT

// GET route to show the form to update a single event.
router.get("/event/:id/edit", (req, res, next) => {
  const { id } = req.params;

  // findById method will obtain the information of the event to show in the update form view
  EventModel.findById(id).then((event) => {
    // console.log(event);
    // event.date = event.date.toString('YYYY-MM-DD');
    event.datePretty = moment(event.date).format('YYYY-MM-DD');
    // console.log(event.date)
    res.render("event-update-form.hbs", { event });
  });
});

// POST route to update the event element with the info updated in the form view
router.post("/event/:id/edit", (req, res, next) => {
  const { id } = req.params;

  // findByIdAndUpdate will use the information passed from the request body (create event form) to update the event
  EventModel.findByIdAndUpdate(id, { $set: req.body })
    .then((event) => {
      res.redirect("/events");
    })
    .catch((err) => {
      console.log("There is an error", err);
      res.redirect("/events/{{ event._id }}/edit");
    });
});

//DELETE EVENT
router.post("/event/:id/delete", (req, res, next) => {
  const { id } = req.params;

  EventModel.findByIdAndDelete(id)
    .then((event) => {
      console.log(`Event ${event.title} deleted`);
      res.redirect("/events");
    })
    .catch((err) => console.log("event not deleted", err));
});

//EVENT DETAILS
router.get("/event-details/:id", (req, res) => {
  const { id } = req.params;

  EventModel.findById(id)
    .populate("user")
    .then((eventsData) => {
      // console.log("THIS IS EVENT DATA", eventsData);
      // console.log(`THIS IS ${eventsData.user} DETAILS`);
      //console.log(req.session.loggedInUser._id === eventsData.user._id)
      //console.log(eventsData)
    console.log(eventsData);
      let creator = null;
      if (req.session.loggedInUser && eventsData.user) {
        creator = (JSON.stringify(req.session.loggedInUser._id) ===
        JSON.stringify(eventsData.user._id))
      }
      
      
        // eventsData.time = moment(eventsData.time).format('HH:mm');
        eventsData.datePretty = moment(eventsData.date).format('YYYY-MM-DD');
       

      let attendee = false; 

      for (let i = 0; i < eventsData.attendEvent.length; i++){
        if (JSON.stringify(eventsData.attendEvent[i]) === JSON.stringify(req.session.loggedInUser._id)) {
          attendee = true; 
          break
        }
      }
      res.render("event-details.hbs", { eventsData, user: creator, attendee});      // if (
      //   JSON.stringify(req.session.loggedInUser._id) ===
      //   JSON.stringify(eventsData.user._id)
      // ) {
      //   res.render("event-details.hbs", { eventsData, user: true});
      // } else {
      //   res.render("event-details.hbs", { eventsData });
      // }
    })
    .catch((err) => {
      console.log("There is an error", err);
    });
});


//REGISTER TO AN EVENT 
router.get("/event-registration/:id", (req, res, next) => {
  const { id } = req.params;

  EventModel.findByIdAndUpdate(id, {$push: { attendEvent: req.session.loggedInUser._id }})
  .then((event) => {
    
    // event.time = moment(event.date).format('HH:mm');
    event.datePretty = moment(event.date).format('YYYY-MM-DD');

    console.log("Registered to Event: ", event);
    res.render("event-registration.hbs", { event });
  })
  .catch((err) => {
    console.log("There is an error", err);
    res.redirect("/events", { registrationMessage: "Sorry, we were anable to register you for the event. You may tray later." });
  });
}); 






//CANCEL event registration ROUTE
router.get("/event-cancel-registration/:id", (req, res, next) => {
  const { id } = req.params;
  let userId = req.session.loggedInUser._id

  EventModel.findById(id)
  .then((data) => {
    let eventData = JSON.parse(JSON.stringify(data.attendEvent))
    // console.log("eventData 1 is:", eventData)

    let index = eventData.indexOf(userId)
    // console.log("index", index)
    eventData.splice(index, 1)
    // console.log("eventData is:", eventData)

    data.time = moment(data.date).format('HH:mm');
    data.datePretty = moment(data.date).format('YYYY-MM-DD');

    EventModel.findByIdAndUpdate(id, {$set: {attendEvent: eventData}})
    .then(() => {
      res.render("event-cancel-registration.hbs", { data })
    })
  })
  .catch((err) => {
    console.log(err)
  })

}); 

module.exports = router;
