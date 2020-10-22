const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String
    }, 
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;