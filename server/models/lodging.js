'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lodging extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Lodging.belongsTo(models.User, {
        foreignKey: 'authorId'
      })
      Lodging.belongsTo(models.Type, {
        foreignKey: 'typeId'
      })
    }
  }
  Lodging.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Name is required."
        },
        notEmpty: {
          msg: "Name is required."
        }
      }
    },
    facility: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Facility is required."
        },
        notEmpty: {
          msg: "Facility is required."
        }
      }
    },
    roomCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Room capacity is required."
        },
        notEmpty: {
          msg: "Room capacity is required."
        }
      }
    },
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Image is required."
        },
        notEmpty: {
          msg: "Image is required."
        },
        isUrl: {
          msg: "Image must be an URL."
        }
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Location is required."
        },
        notEmpty: {
          msg: "Location is required."
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Price is required."
        },
        notEmpty: {
          msg: "Price is required."
        },
        min: {
          args: [100_000],
          msg: "Please input price greater than or equal Rp. 100.000,00."
        }
      }
    },
    typeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Type is required."
        },
        notEmpty: {
          msg: "Type is required."
        }
      }
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Author is required."
        },
        notEmpty: {
          msg: "Author is required."
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Lodging',
  });
  return Lodging;
};