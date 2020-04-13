'use strict';

const stateAbbreviations = require('../utils').states;

module.exports = (sequelize, Sequelize) => {
  const Community = sequelize.define('Community', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    crossStreets: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isIn: [stateAbbreviations],
      }
    },
    zipCode: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        is: [/^\d{5}(\-\d{4})?$/]
      }
    },
  }, { tableName: 'communities' });

  Community.associate = (models) => {
    models.Community.belongsToMany(models.Builder, {
      through: models.CommunityBuilder,
      foreignKey: 'communityId', otherKey: 'builderId'
    })
  };

  return Community
}
