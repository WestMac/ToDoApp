'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class toDoList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      toDoList.belongsTo(models.User),
      toDoList.hasMany(models.toDoItem, 
        {
        as: 'toDoItem',
        foreignKey: 'toDoListId',
        onDelete:'cascade',
        onUpdate: 'cascade',
        hooks:true
      })
    }
  };
  toDoList.init({
    UserId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'toDoList',
  });
  return toDoList;
};