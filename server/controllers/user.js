const { comparePassword } = require('../helpers/bcrypt')
const { createToken } = require('../helpers/jwt')
const { User } = require('../models/index')

class Users {
  static async createUser(req, res, next) {
    try {
      const newUser = await User.create(req.body)
      
      delete newUser.dataValues.id
      delete newUser.dataValues.email
      delete newUser.dataValues.password
      delete newUser.dataValues.role

      res.status(201).json(newUser)
    } catch (error) {
      next(error)
    }
  }

  static async loginUser(req, res, next) {
    try {
      const { username, password } = req.body
      if(!username || !password) throw { name: 'ValidationError' }

      const user = await User.findOne({
        where: {
          username: username
        }
      })
      if(!user) throw { name: 'InvalidLogin' }

      const isLogin = comparePassword(password, user.password)
      if(!isLogin) throw { name: 'InvalidLogin' }

      const token = createToken({
        id: user.id
      })

      res.status(200).json({ access_token: token })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = Users