'use strict';
const {
  Model
} = require('sequelize');

const { createPassword } = require('../helpers/bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Lodging, {
        foreignKey: 'authorId'
      })
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Username is required.'
        },
        notEmpty: {
          msg: 'Username is required.'
        }
      },
      unique: {
        msg: "Username already exists."
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Email is required.'
        },
        notEmpty: {
          msg: 'Email is required.'
        },
        isEmail: {
          msg: 'Email is not valid.'
        }
      },
      unique: {
        msg: "Email already exists."
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password is required.'
        },
        notEmpty: {
          msg: 'Password is required.'
        },
        len: {
          args: [5],
          msg: "Password must be at least 5 characters."
        }
      }
    },
    role: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((user, _) => {
    user.role = user.role === "admin" ? user.role : "staff",
    user.password = createPassword(user.password)
  })
  
  return User;
};