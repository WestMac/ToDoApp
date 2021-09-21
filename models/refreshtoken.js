'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class refreshToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    
    static associate(models) {
      // define association here
      refreshToken.belongsTo(models.User)
    }
  };
  refreshToken.init({
    UserId: DataTypes.INTEGER,
    UserIp: DataTypes.INET,
    UserBrowser: DataTypes.STRING,
    revoked: DataTypes.BOOLEAN,
    token: DataTypes.STRING,
    expires: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'refreshToken',
  });
  return refreshToken;
};