'use strict';
const bcrypt = require('bcrypt')
const { User, refreshToken, Sequelize } = require("../models");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // let test = await bcrypt.hash('test', 10)
    // let editor = await bcrypt.hash('editor', 10)

    return queryInterface.bulkInsert('Users', 
    [
      { username: 'test', password: hashPassword('test'), email: 'test@test.com', createdAt: new Date(), updatedAt: new Date() },
      { username: 'editor', password: hashPassword('editor') , email: 'editor@editor.com', createdAt: new Date(), updatedAt: new Date() }
    ]
      );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};


function hashPassword(password) {
  let hash = bcrypt.hash(password, Number(process.env.SALT), async function (err, hash) {
    return hash
  })
  return hash
}