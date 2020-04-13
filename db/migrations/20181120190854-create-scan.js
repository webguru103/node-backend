'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('scans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      scanType: {
        type: Sequelize.STRING
      },
      scanAction: {
        type: Sequelize.STRING
      },
      keycodeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'keycodes',
          key: 'id'
        }
      },
      deviceId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'devices',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('scans');
  }
};