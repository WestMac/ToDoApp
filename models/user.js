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
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};