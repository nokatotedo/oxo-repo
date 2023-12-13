const express = require('express')
const router = express.Router()
const Types = require('../controllers/types')
const { adminHandler } = require('../middlewares/auth')

router.post('/', adminHandler, Types.createType)

router.get('/', Types.getTypes)

router.put('/:id', adminHandler, Types.updateType)

router.delete('/:id', adminHandler, Types.deleteType)

module.exports = router