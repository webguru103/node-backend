'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('communityBuilders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('community_builders');
  }
};