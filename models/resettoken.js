'use strict';
const jwt = require('jsonwebtoken');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class resetToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    createToken(id) {
      return jwt.sign({
        id: this.id,
        exp: Math.floor(Date.now() / 1000) + (60 * 5),
        iss: 'toDoApp'
      }, process.env.JWT_RESET)
    }
    
    static associate(models) {
      resetToken.belongsTo(models.User)
    }
  };
  resetToken.init({
    UserId: {
     type: DataTypes.INTEGER,
     allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expires: {
      type:DataTypes.DATE,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'resetToken',
  });
  return resetToken;
};