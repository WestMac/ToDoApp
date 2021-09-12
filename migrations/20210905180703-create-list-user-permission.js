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
        references: {
          model: 'User',
          key:'id'
        }
      },
      toDoListId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'toDoList',
          key: 'id',
        }
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