'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'phone', { type: Sequelize.STRING });
    await queryInterface.addColumn('users', 'code', { type: Sequelize.STRING });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'phone');
    await queryInterface.removeColumn('users', 'code');
  }
};
