'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const encryptedPassword = await bcrypt.hash('DELETEME', 10)
    const firstName = "Admin (DELETE ME)";
    const lastName = "User (DELETE ME)";
    const email = "admin@example.com";
    const createdAt = new Date();
    const updatedAt = createdAt;
    return queryInterface.bulkInsert('users', [{
      firstName,
      lastName,
      email,
      encryptedPassword,
      createdAt,
      updatedAt,
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
