const { Lodging } = require('../models/index')
const { Op } = require('sequelize')

class Pub {
  static async getLodgings(req, res, next) {
    try {
      const page = Number(req.query.page) || 1

      const limit = 5
      const offset = (page * limit) - limit

      const query = {
        order: [
          ["createdAt", 'ASC'],
          ["id", 'ASC']
        ],
        where: {},
        limit,
        offset
      }

      if(req.query.name) {
        query.where.name = {
          [Op.iLike]: `%${req.query.name}%`
        }
      }

      if(req.query.typeId) {
        query.where.typeId = Number(req.query.typeId) || 1
      }

      if(req.query.sort?.toLowerCase() === 'desc') {
        query.order[0][1] = 'desc'
      }

      const lodgings = await Lodging.findAll(query)

      res.status(200).json({
        page,
        count: lodgings.length,
        lodgings
      })
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
        }
      })
      if(!lodging) throw { name: 'NotFound' }

      res.status(200).json(lodging)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = Pub