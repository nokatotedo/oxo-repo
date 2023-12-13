function errorHandler(error, _, res, __) {
  switch(error.name) {
    case "SequelizeUniqueConstraintError":
    case "SequelizeValidationError": {
      res.status(400).json({ message: error.errors[0].message })
      break
    }
    
    case "SequelizeForeignKeyConstraintError": {
      if(error.table === 'Lodgings') {
        res.status(400).json({ message: 'Invalid TypeId/AuthorId' })
      } else if(error.table === 'Types') {
        res.status(400).json({ message: 'You need to delete lodgings related to this type.' })
      }
      break
    }

    case "NotFound": {
      res.status(404).json({ message: 'Error Not Found' })
      break
    }
    
    case "InvalidParams": {
      res.status(400).json({ message: 'Invalid Params' })
      break
    }

    case "ValidationError": {
      res.status(400).json({ message: 'Validation Error' })
      break
    }

    case "InvalidLogin": {
      res.status(401).json({ message: 'Invalid Username/Password' })
      break
    }

    case "InvalidToken": {
      res.status(401).json({ message: 'Invalid Token' })
      break
    }

    case "Forbidden": {
      res.status(403).json({ message: 'Forbidden' })
      break
    }

    case "JsonWebTokenError": {
      res.status(401).json({ message: 'Invalid Token' })
      break
    }

    case "SyntaxError": {
      res.status(401).json({ message: 'Invalid Token' })
      break
    }

    default: {
      res.status(500).json({ message: 'Internal Server Error' })
      break
    }
  }
}

module.exports = errorHandler