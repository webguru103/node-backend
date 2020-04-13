'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex('homes', {fields: ['keycodeId'], unique: true, name: 'homes_keycodeId_unique'});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex('homes', 'homes_keycodeId_unique')
  }
};
