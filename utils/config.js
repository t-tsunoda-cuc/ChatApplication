require('dotenv').config()

let PORT = process.env.PORT || 3000
let MONGODB_URI = process.env.MONGODB_CONNECTION_STRING_PRODUCTION

module.exports = {
  MONGODB_URI,
  PORT
}