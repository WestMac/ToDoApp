'use strict';
const jwt = require('jsonwebtoken');

require('dotenv').config();
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
   signToken() {
      return jwt.sign({
        id: this.id,
        username: this.username,
        exp: Math.floor(Date.now() / 1000) + (60 * 5),
        premium: true,
        iss: 'toDoApp'
      }, process.env.JWT_SECRET)
    }
    static associate(models) {
      User.hasMany(models.toDoList, {
        as: 'toDoList',
        foreignKey: 'UserId',
        onDelete:'cascade',
        onUpdate: 'cascade',
        hooks:true
      })
      User.hasMany(models.refreshToken, {
        as: 'refreshToken',
        foreignKey: 'UserId',
        onDelete: 'cascade',
        onUpdate: 'cascade',
        hooks: true
      })
      // define association here
    }
  };
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^\w{3,}$/,
        notEmpty:true,
        notNull:true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          args: true,
          msg: "Email Cannot be empty"
        },
        notNull: {
          args: true,
          msg: "Email Cannot be empty"
        },
        isEmail: { 
          args: true,
          msg: "elo elo zly imejl"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        len: { 
          args: [8,256],
          msg: "Password has to be at least 8 characters long"
      },
    },
  },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};