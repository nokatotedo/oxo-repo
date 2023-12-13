const express = require('express')
const router = express.Router()
const Pub = require('../controllers/pub')

router.get('/lodgings/', Pub.getLodgings)

router.get('/lodgings/:id', Pub.getLodgingById)

module.exports = router