'use strict';
const bcrypt = require('bcrypt')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
   
    return queryInterface.bulkInsert('Users', 
    [
      { username: 'test', password: bcrypt.hashSync('test', Number(process.env.SALT)), email: 'test@test.com', createdAt: new Date(), updatedAt: new Date() },
      { username: 'editor', password: bcrypt.hashSync('editor', Number(process.env.SALT)) , email: 'editor@editor.com', createdAt: new Date(), updatedAt: new Date() }
    ]
      );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};


