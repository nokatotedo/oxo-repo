const bcrypt = require('bcryptjs')

function createPassword(input) {
  return bcrypt.hashSync(input, 8)
}

function comparePassword(input, database) {
  return bcrypt.compareSync(input, database)
}

module.exports = {
  createPassword,
  comparePassword
}