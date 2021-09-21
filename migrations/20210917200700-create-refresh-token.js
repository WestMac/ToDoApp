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
          model: 'User',
          key:'id'
        },
        onUpdate:'cascade',
        onDelete:'cascade',
      },
      UserIp: {
        allowNull: false,
        type: Sequelize.INTET
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