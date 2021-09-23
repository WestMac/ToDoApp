'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   return queryInterface.bulkInsert('toDoLists',
   [
     {UserId:'1', name:'test', createdAt: new Date() , updatedAt: new Date() },
     {UserId:'1', name: 'none', createdAt: new Date() , updatedAt: new Date() },
     {UserId:'2', name: 'test2', createdAt: new Date() , updatedAt: new Date() }
   ]
   )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('toDoLists',  null , {} )
  }
};
