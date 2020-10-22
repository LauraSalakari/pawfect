const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    user: { //this is the key name in the evnt model
          type: mongoose.Schema.Types.ObjectId, 
          ref: "User"//refers to the collection name
    },
    attendEvent: {
      type: [ mongoose.Schema.Types.ObjectId ], 
      ref: "User",
      //unique: true // to only register once
    },
    eventPicture: {
      type: String
    }, 

    description: {
      type: String
      // required: true
    }
  },
  {
    timestamps: true,
  }
);

const EventModel = mongoose.model('Event', eventSchema);


module.exports = EventModel;