'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('toDoItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      toDoListId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'toDoLists',
          key:'id'
        },
        onUpdate:'cascade',
        onDelete:'cascade',
      },
      text: {
        allowNull:false,
        type: Sequelize.STRING
      },
      isCompleted: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('toDoItems');
  }
};