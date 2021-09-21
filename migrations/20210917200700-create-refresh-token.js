'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('refreshTokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      UserIp: {
        allowNull: false,
        type: Sequelize.INET
      },
      UserBrowser: {
        allowNull: false,
        type: Sequelize.STRING
      },
      revoked: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      token: {
        allowNull: false,
        type: Sequelize.STRING
      },
      expires: {
        allowNull: false,
        type: Sequelize.DATE
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
    await queryInterface.dropTable('refreshTokens');
  }
};