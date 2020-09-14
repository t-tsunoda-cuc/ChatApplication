const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  user_name: {
    type: String,
  },
  user_icon: {
    type: String,
  },
  user_isTeacher: {
    type: Boolean,
  }
})

module.exports = mongoose.model('User',userSchema)