const express = require('express')
const router = express.Router()

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const Lodgings = require('../controllers/lodgings')
const { lodgingHandler } = require('../middlewares/auth')

router.post('/', Lodgings.createLodging)

router.get('/', Lodgings.getLodgings)

router.get('/:id', Lodgings.getLodgingById)

router.put('/:id', lodgingHandler, Lodgings.updateLodging)

router.patch('/:id', lodgingHandler, upload.single('imgUrl'), Lodgings.updateImageLodging)

router.delete('/:id', lodgingHandler, Lodgings.deleteLodging)

module.exports = router