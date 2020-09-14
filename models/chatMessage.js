const mongoose = require('mongoose')

const chatMessageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  message_text: {
    type: String,
  },
  message_time: {
    type: Date
  }
})

module.exports = mongoose.model('ChatMessage',chatMessageSchema)