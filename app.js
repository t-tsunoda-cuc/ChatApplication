const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const middleware = require('./utils/middleware.js')
const commentRouter = require('./controllers/comments')
const projectRouter = require('./controllers/projects')
const userRouter = require('./controllers/users')
const chatRoomRouter = require('./controllers/chatRooms')
const chatMessageRouter = require('./controllers/chatMessages')
const config = require('./utils/config')

const app = express()
const mongoDBUri = config.MONGODB_URI
// 新しいバージョン
// MONGODB_CONNECTION_STRING_PRODUCTION = mongodb+srv://t-tsunoda:1234qwer@cluster0.bmhfy.mongodb.net/commentAPI?retryWrites=true&w=majority

mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
  .then(() => {
    console.log('app: Connected to DB Instance')
  })
  .catch((error) => {
    console.log('app: Error connecting to DB Instance', error.message)
  })
console.log('Application is running against the following environment:', process.env.NODE_ENV)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use('/api/comments/',commentRouter)
app.use('/api/projects/',projectRouter)
app.use('/api/users/',userRouter)
app.use('/api/chatRooms/',chatRoomRouter)
app.use('/api/chatMessages/',chatMessageRouter)
app.use(express.static(__dirname + '/public'))
app.use(middleware.errorHandler)

module.exports = app