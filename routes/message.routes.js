const express = require('express');
const router = express.Router();
const UserModel = require("../model/User.model");
const MessageModel = require("../model/Message.model");
const moment = require("moment");


router.get("/messages", (req, res) => {
  let received;
  let sent;
  let userId = req.session.loggedInUser._id;
  MessageModel.find({ recipient: userId }).sort({ createdAt: -1 })
    .populate("sender")
    .then((receivedData) => {
      receivedData.forEach((elem) => {
        elem.time = moment(elem.createdAt).format('YYYY-MM-DD HH:mm:ss');
      });
      MessageModel.find({ sender: userId }).sort({ createdAt: -1 })
        .populate("recipient")
        .then((sentData) => {
          sentData.forEach((elem) => {
            elem.time = moment(elem.createdAt).format('YYYY-MM-DD HH:mm:ss');
          });
          console.log(sentData);
          res.render("messages/messagelog.hbs", { received: receivedData, sent: sentData });
        })
        .catch((err) => {
          console.log("Failed to fetch sent messages", err);
        });
    })
    .catch((err) => {
      console.log("Failed to fetch received messages", err);
    });
});

router.get("/messages/send/:id", (req, res) => {
  let id = req.params.id;
  UserModel.findById(id)
    .then((data) => {
      res.render("messages/message.hbs", { data });
    })
    .catch((err) => {
      console.log("Failed to retrieve recipient information", err);
    });

});

router.post("/messages/send/:id", (req, res) => {
  let { content } = req.body;
  let recipientId = req.params.id;
  let userId = req.session.loggedInUser._id;

  MessageModel.create({
    recipient: recipientId,
    sender: userId,
    content
  })
    .then(() => {
      res.redirect("/messages");
    })
    .catch((err) => {
      console.log("Failed to send message", err);
    });
});

router.get("/messages/:id", (req, res) => {
  req.app.locals.notUser = false;
  MessageModel.findById(req.params.id)
    .populate("sender")
    .populate("recipient")
    .then((data) => {
      data.time = moment(data.createdAt).format('YYYY-MM-DD HH:mm:ss');
      if (req.session.loggedInUser._id != data.sender._id) {
        res.render("messages/messagedetails.hbs", { data, notProf: true });
      }
      else {
        res.render("messages/messagedetails.hbs", { data, notProf: false });
      }
    })
    .catch((err) => {
      console.log("Failed to retrieve message details", err);
    });
});


module.exports = router;