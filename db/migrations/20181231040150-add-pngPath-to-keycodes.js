'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('keycodes', 'pngS3Key', {
      type: Sequelize.STRING
    });
    await queryInterface.renameColumn('keycodes', 'svgS3Bucket', 's3Bucket')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('keycodes', 'pngS3Key');
    await queryInterface.renameColumn('keycodes', 's3Bucket', 'svgS3Bucket');
  }
};
