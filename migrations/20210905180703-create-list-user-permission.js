'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('listUserPermissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER,
        primaryKey:false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate:'cascade',
        onDelete:'cascade',
      },
      toDoListId: {
        type: Sequelize.INTEGER,
        primaryKey:false,
        references: {
          model: 'toDoLists',
          key: 'id',
        },
        onUpdate:'cascade',
        onDelete:'cascade',
      },
      isAuthor: {
        type: Sequelize.BOOLEAN
      },
      isEditor: {
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
    await queryInterface.dropTable('listUserPermissions');
  }
};