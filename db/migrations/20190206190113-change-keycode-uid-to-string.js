'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex('keycodes', ['uid']).then(
      () => queryInterface.changeColumn('keycodes', 'uid', {type: Sequelize.STRING})
    ).then(
      () => queryInterface.addIndex('keycodes', { unique: true, fields: ['uid'] })
    );
  },

  down: (queryInterface, Sequelize) => {
    throw new Error("Can't reverse this migration.");
  }
};
