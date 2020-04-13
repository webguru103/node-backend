'use strict';

const stateAbbreviations = require('../utils').states;

module.exports = (sequelize, Sequelize) => {

  const Builder = sequelize.define('Builder', {
    companyName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    mainContactName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    mainContactPhone: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    mainContactEmail: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true
      }
    },
    address1: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address2: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    zipCode: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        is: [/^\d{5}(\-\d{4})?$/]
      }
    },
    companyPhone: {
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
    }
  }, { tableName: 'builders' });

  Builder.associate = (models) => {
    models.Builder.belongsToMany(models.Community, { through: models.CommunityBuilder, foreignKey: 'builderId', otherKey: 'communityId'})
    models.Builder.hasMany(models.Home, { foreignKey: 'builderId' })
  };

  return Builder
}
