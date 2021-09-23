'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('listUserPermissions',
    [
      {UserId: 1, toDoListId: 1, isAuthor: true, isEditor: true, createdAt: new Date(), updatedAt: new Date() },
      {UserId: 2, toDoListId: 1, isAuthor: false, isEditor: true, createdAt: new Date(), updatedAt: new Date() },
      {UserId: 2, toDoListId: 2, isAuthor: true, isEditor: true, createdAt: new Date(), updatedAt: new Date() }
    ] 
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('listUserPermissions', null, {} )
  }
};
