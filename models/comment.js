const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comment_text: {
    type: String,
  },
  comment_time: {
    type: Date
  },
  likes: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('Comment',commentSchema)
