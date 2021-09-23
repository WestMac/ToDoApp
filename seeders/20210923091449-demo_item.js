'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   return queryInterface.bulkInsert('toDoItems',
   [
     { toDoListId: '1', text: 'item1', isCompleted: false, createdAt: new Date(), updatedAt: new Date() },
     { toDoListId: '1', text: 'item2', isCompleted: false, createdAt: new Date(), updatedAt: new Date() },
     { toDoListId: '1', text: 'item3', isCompleted: false, createdAt: new Date(), updatedAt: new Date() },
     { toDoListId: '2', text: 'item1list2', isCompleted: false, createdAt: new Date(), updatedAt: new Date() }
   ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('toDoItems', null, {})
  }
};
