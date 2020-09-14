const mongoose = require('mongoose')

const chatRoomSchema = new mongoose.Schema({
  message: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatMessage'
    }
  ],
  user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
})

module.exports = mongoose.model('ChatRoom',chatRoomSchema)