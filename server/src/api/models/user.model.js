const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Each email must be unique
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
   otp: { type: String },
  isVerified: { type: Boolean, default: false }
  
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});



const User = mongoose.model('User', userSchema);

module.exports = User;