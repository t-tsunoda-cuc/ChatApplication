const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  project_name: {
    type: String,
  },
  slides: [
    {
      type: String
    }
  ],
  likes: {
    type: Number,
  },
  comments:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
})

module.exports = mongoose.model('Project',projectSchema)