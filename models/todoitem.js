'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class toDoItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      toDoItem.belongsTo(models.toDoList, {
        as: 'toDoItem'
      })
    }
  };
  toDoItem.init({
    toDoListId: DataTypes.INTEGER,
    text: DataTypes.STRING,
    isCompleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'toDoItem',
  });
  return toDoItem;
};