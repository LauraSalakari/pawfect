const express = require("express");
const router = express.Router();
const moment = require("moment");
var bcrypt = require("bcryptjs");

const EventModel = require("../model/Event.model");
const UserModel = require("../model/User.model");

router.get("/api/events/:startDate/:endDate", (req, res) => {

  let startDate = new Date(req.params.startDate);
  let endDate = new Date(req.params.endDate);

  EventModel.find({ date: { $gte: startDate, $lt: endDate }  }, null, { sort: { 'date': 'asc' } })
    .then((eventsData) => {
      let responseData = [];
      for (let eventData of eventsData) {
        let dateAndTime = moment(eventData.date).format('YYYY-MM-DD');
        dateAndTime += ' ' + eventData.time;

        //dateAndTime = '2020-10-23 11:00';
        responseData.push({
          'id': eventData.id,
          'title': eventData.title,
          'start': dateAndTime,
          'location': eventData.location,
          'url': '/event-details/' + eventData.id,
          'created': eventData.createdAt,
          'update': eventData.updatedAt
        });
      }

      res.status(200)
        .type('application/json')
        .send(responseData);

    })
    .catch((e) => {
      console.log(e);
      res
        .status(500)
        .send(JSON.stringify({
          message: "Fail to fetch user information",
        }));
    });

});






module.exports = router;