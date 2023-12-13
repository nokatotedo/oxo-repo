const { uploadImage } = require('../helpers/cloudinary')
const { User, Lodging } = require('../models/index')

class Lodgings {
  static async createLodging(req, res, next) {
    try {
      req.body.authorId = req.user.id
      const newLodging = await Lodging.create(req.body)
      res.status(201).json(newLodging)
    } catch (error) {
      next(error)
    }
  }

  static async getLodgings(_, res, next) {
    try {
      const lodgings = await Lodging.findAll({
        include: {
          model: User,
          attributes: { exclude: ['password', 'email'] }
        },
        order: [
          ["id", 'ASC']
        ]
      })
      res.status(200).json(lodgings)
    } catch (error) {
      next(error)
    }
  }

  static async getLodgingById(req, res, next) {
    try {
      const { id } = req.params
      if(!id || isNaN(id)) throw { name: 'InvalidParams' }

      const lodging = await Lodging.findOne({
        where: {
          id: +id
        },
        include: {
          model: User,
          attributes: { exclude: ['password', 'email'] }
        }
      })
      if(!lodging) throw { name: 'NotFound' }

      res.status(200).json(lodging)
    } catch (error) {
      next(error)
    }
  }

  static async updateLodging(req, res, next) {
    try {
      const { id } = req.params
      if(!id || isNaN(id)) throw { name: 'InvalidParams' }

      req.body.authorId = req.user.id
      const updateLodging = await Lodging.update(req.body, {
        where: {
          id: +id
        }
      })
      if(updateLodging[0] === 0) throw { name: 'NotFound' }

      const lodging = await Lodging.findOne({
        where: {
          id: +id
        }
      })

      res.status(200).json(lodging)
    } catch (error) {
      next(error)
    }
  }

  static async deleteLodging(req, res, next) {
    try {
      const { id } = req.params
      if(!id || isNaN(id)) throw { name: 'InvalidParams' }

      const lodging = await Lodging.findOne({
        where: {
          id: +id
        }
      })
      if(!lodging) throw { name: 'NotFound' }

      await Lodging.destroy({
        where: {
          id: +id
        }
      })

      res.status(200).json(lodging)
    } catch (error) {
      next(error)
    }
  }

  static async updateImageLodging(req, res, next) {
    try {
      const { id } = req.params
      if(!id || isNaN(id)) throw { name: 'InvalidParams' }
      
      const lodging = await Lodging.findOne({
        where: {
          id: +id
        }
      })
      if(!lodging) throw { name: 'NotFound' }

      if(!req.file) throw { name: 'ValidationError' }

      const imgUrl = await uploadImage(req.file.mimetype, req.file.buffer.toString('base64'), lodging.id, lodging.updatedAt)

      await Lodging.update({ imgUrl: imgUrl.url }, {
        where: {
          id: +id
        }
      })

      res.status(200).json({ message: `Image of ${lodging.name} success to update`})
    } catch (error) {
      next(error)
    }
  }
}

module.exports = Lodgings