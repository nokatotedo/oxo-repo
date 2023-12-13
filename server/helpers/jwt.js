if(process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}
const jwt = require('jsonwebtoken')

function createToken(input) {
  return jwt.sign(input, process.env.JWT_SECRET)
}

function verifyToken(input) {
  return jwt.verify(input, process.env.JWT_SECRET)
}

module.exports = {
  createToken,
  verifyToken
}
