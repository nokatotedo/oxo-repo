const { Type } = require('../models/index')

class Types {
  static async createType(req, res, next) {
    try {
      const newType = await Type.create(req.body)
      res.status(201).json(newType)
    } catch (error) {
      next(error)
    }
  }

  static async getTypes(_, res, next) {
    try {
      const types = await Type.findAll({
        order: [
          ["id", 'ASC']
        ]
      })
      res.status(200).json(types)
    } catch (error) {
      next(error)
    }
  }

  static async updateType(req, res, next) {
    try {
      const { id } = req.params
      if(!id || isNaN(id)) throw { name: 'InvalidParams' }

      const updateType = await Type.update(req.body, {
        where: {
          id: +id
        }
      })
      if(updateType[0] === 0) throw { name: 'NotFound' }
      
      const type = await Type.findOne({
        where: {
          id: +id
        }
      })

      res.status(200).json(type)
    } catch (error) {
      next(error)
    }
  }

  static async deleteType(req, res, next) {
    try {
      const { id } = req.params
      if(!id || isNaN(id)) throw { name: 'InvalidParams' }

      const type = await Type.findOne({
        where: {
          id: +id
        }
      })
      if(!type) throw { name: 'NotFound' }

      await Type.destroy({
        where: {
          id: +id
        }
      })

      res.status(200).json(type)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = Types