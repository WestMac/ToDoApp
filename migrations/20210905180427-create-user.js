'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            args: true,
            msg: "Wrong email"
          },
          notNull: {
            args: true,
            msg: "Wrong email"
          },
          isEmail: { 
            args: true,
            msg: "Wrong email"
          }
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true,
        validate: {
          len: { 
            args: [8,256],
            msg: "Password has to be at least 8 characters long"
        },
      },
    },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    }, { transaction });
    
    await queryInterface.addIndex('Users', ['id','username'], { transaction })
    await transaction.commit();
  } catch (err) { 
    await transaction.rollback();
    console.log('errr')
  }
     
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};