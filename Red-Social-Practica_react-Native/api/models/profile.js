const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProfileSchema = new Schema({
  nameProfile: {
    type: String,
    required: false,
   
  },
  surname: {
    type: String,
    required: false,
   
  },
  presentation: {
    type: String,
    required: false,
   
  },
  telephone: {
    type: String,
    required: false,
    
  }
});

module.exports = mongoose.model('Profile', ProfileSchema);