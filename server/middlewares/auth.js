const { verifyToken } = require("../helpers/jwt")
const { Lodging, User } = require('../models/index')

async function authHandler(req, _, next) {
  try {
    const { authorization } = req.headers
    const token = authorization?.split(" ")
  
    if(!authorization) throw { name: 'InvalidToken' }
    if(token.length < 2) throw { name: 'InvalidToken' }
    if(token[0] !== "Bearer" || token[1] === 'undefined') throw { name: 'InvalidToken' }
  
    const id = verifyToken(token[1]).id
    const user = await User.findOne({
      where: {
        id: id
      }
    })
  
    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      phoneNumber: user.phoneNumber,
      address: user.address
    }
    
    next()
  } catch (error) {
    next(error)
  }
}

function adminHandler(req, _, next) {
  if(req.user.role !== "admin") throw { name: 'Forbidden' }

  next()
}

async function lodgingHandler(req, _, next) {
  try {
    const { id } = req.params
    if(req.user.role !== "admin") {
      const lodging = await Lodging.findOne({
        where: {
          id: +id
        }
      })
  
      if(lodging.authorId !== req.user.id) throw { name: 'Forbidden' }
    }
  
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  authHandler,
  adminHandler,
  lodgingHandler
}