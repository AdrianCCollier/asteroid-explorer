const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Create the model from the schema and export it
const User = mongoose.model('User', userSchema)
module.exports = User
