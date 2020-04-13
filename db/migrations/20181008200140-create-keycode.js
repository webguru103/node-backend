'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('keycodes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uid: {
        allowNull: false,
        type: 'BIGSERIAL' // PostgreSQL only
      },
      keycodeBatchId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'keycodeBatches',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.STRING
      },
      svgS3Bucket: {
        type: Sequelize.STRING
      },
      svgS3Key: {
        type: Sequelize.STRING
      },
      installedAt: {
        type: Sequelize.DATE
      },
      activatedAt: {
        type: Sequelize.DATE
      },
      readyToShipAt: {
        type: Sequelize.DATE
      },
      assignedAt: {
        type: Sequelize.DATE
      },
      unassignedAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    }).then(() => {
      return queryInterface.addIndex('keycodes', {
        unique: true,
        fields: ['uid'],
      });
    }).then((result) => {
      return queryInterface.sequelize.query("ALTER SEQUENCE keycodes_uid_seq RESTART WITH 1000000000000001;");
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex('keycodes', ['uid']).then(result => {
      return queryInterface.dropTable('keycodes');
    })
  }
};