const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'user'],
    required: true,
    default:'superadmin'
  },
  email:{
    type:String,
    
  },
  specialId: {
    type: String,
    unique: true,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  lastLogin: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('User', userSchema);
