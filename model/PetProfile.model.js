const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const petProfileSchema = new Schema({
  name: {
    type: Schema.Types.String
  }, 
  description: {
    type: Schema.Types.String
  }, 
  birthYear: {
    type: Schema.Types.Number
  },
  user: { //this is the key name in the evnt model
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User"//refers to the collection name
  },
  petPicture: {
    type: String
  }, 
}, { timestamps: true } //find out when booking happened
);

module.exports = mongoose.model('PetProfile', petProfileSchema);

// module.exports = buildSchema(
//   type Booking{
//     _id: ID!
//     event: Event! 
//     user: User!
//     createdAt; String!
//     updatedAt: String!
//   }
// )