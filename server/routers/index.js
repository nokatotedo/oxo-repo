const express = require('express')
const router = express.Router()

const lodgings = require('./lodgings')
const types = require('./types')
const pub = require('./pub')

const error = require('../middlewares/error')
const { authHandler, adminHandler } = require('../middlewares/auth')

const Users = require('../controllers/user')

router.post('/login', Users.loginUser)
router.use('/pub', pub)

router.use(authHandler)
router.post('/register', adminHandler, Users.createUser)
router.use('/lodgings', lodgings)
router.use('/types', types)

router.use(error)

module.exports = router