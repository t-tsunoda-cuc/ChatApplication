const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const socketIO = require('socket.io')

const PORT = config.PORT
const server = http.createServer(app)
const io = socketIO(server)

// 接続時の処理
io.on('connection', socket => {
  console.log('connection')

  // メッセージ受信時の処理
  socket.on('new message', chatId => {
    console.log(chatId)
    io.emit('spread message', chatId)
  })
  // チャット削除受信時の処理
  socket.on('delete chat', chatElement => {
    console.log(chatElement)
    io.emit('delete chat', chatElement)
  })

  // 新規ユーザー受信時の処理
  socket.on('new user', _id => {
    io.emit('new user', _id)
  })
  // ユーザー削除受信時の処理
  socket.on('delete user', _id => {
    io.emit('delete user', _id)
  })

  // 切断時の処理
  socket.on('disconnect',() => {
    console.log('disconnect')
  })
})

server.listen(PORT,() => {
  console.log(`Server now running on port ${PORT}`)
})

module.exports = io
