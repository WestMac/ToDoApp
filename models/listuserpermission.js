'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class listUserPermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.toDoList.belongsToMany(models.User, {through: listUserPermission})
      models.User.belongsToMany(models.toDoList, {through: listUserPermission})
    }
  };
  listUserPermission.init({
    UserId: DataTypes.INTEGER,
    toDoListId: DataTypes.INTEGER,
    isAuthor: DataTypes.BOOLEAN,
    isEditor: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'listUserPermission',
  });
  return listUserPermission;
};