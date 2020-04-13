'use strict';

const stateAbbreviations = require('../utils').states;

const keyCodeStatuses = ['blank', 'unassigned', 'assigned', 'ready_to_ship', 'installed', 'activated'];

module.exports = (sequelize, Sequelize) => {
  const Keycode = sequelize.define('Keycode', {
    uid: Sequelize.STRING,
    keycodeBatchId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    s3Bucket: Sequelize.STRING,
    svgS3Key: Sequelize.STRING,
    svgLocation: {
      type: Sequelize.VIRTUAL(Sequelize.STRING, ['svgS3Key','s3Bucket']),
      get: function() {
        const bucket = this.get('s3Bucket')
        const key = this.get('svgS3Key')
        return (key && bucket ? `https://s3.amazonaws.com/${bucket}/${key}` : null)
      }
    },
    pngS3Key: Sequelize.STRING,
    pngLocation: {
      type: Sequelize.VIRTUAL(Sequelize.STRING, ['pngS3Key','s3Bucket']),
      get: function() {
        const bucket = this.get('s3Bucket')
        const key = this.get('pngS3Key')
        return (key && bucket ? `https://s3.amazonaws.com/${bucket}/${key}` : null)
      }
    },

    // statuses and timestamps
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'blank',
      validate: {
        isIn: [keyCodeStatuses],
      }
    },
    unassignedAt: Sequelize.DATE,
    assignedAt: Sequelize.DATE,
    installedAt: Sequelize.DATE,
    activatedAt: Sequelize.DATE,
    readyToShipAt: Sequelize.DATE
  }, {
    tableName: 'keycodes'
  });

  Keycode.associate = (models) => {
    models.Keycode.hasOne(models.Home, { foreignKey: 'keycodeId' })
    models.Keycode.hasMany(models.Scan, { foreignKey: 'keycodeId' })
    models.Keycode.belongsTo(models.KeycodeBatch, { foreignKey: 'keycodeBatchId' })
  }

  return Keycode
}

module.exports.keyCodeStatuses = keyCodeStatuses;
