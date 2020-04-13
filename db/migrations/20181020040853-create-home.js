'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('homes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      keycodeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'keycodes',
          key: 'id'
        }
      },
      builderId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'builders',
          key: 'id'
        }
      },
      communityId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'communities',
          key: 'id'
        }
      },
      address1: {
        type: Sequelize.STRING
      },
      address2: {
        type: Sequelize.STRING
      },
      zipCode: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      homeType: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('homes');
  }
};
