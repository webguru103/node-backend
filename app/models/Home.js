'use strict';

const stateAbbreviations = require('../utils').states;

module.exports = (sequelize, Sequelize) => {
  const Home = sequelize.define('Home', {
    fullAddress: {
      type: Sequelize.VIRTUAL(Sequelize.STRING, ['address1','address2','zipCode','city','state']),
      get: function() {
        const address1 = this.get('address1')
        const address2 = this.get('address2')
        const city = this.get('city')
        const state = this.get('state')
        const zipCode = this.get('zipCode')
        return `${address1}${(address2 ? ", " + address2 : "")}, ${city}, ${state} ${zipCode}`
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
    communityId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    builderId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    keycodeId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    homeType: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isIn: [["apartment", "condo", "duplex", "townhome", "loft", "single_family", "modular", "mobile"]]
      }
    },
    beds: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    baths: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    garages: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    squareFeet: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    modelName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    yearBuilt: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    lot: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    lotSize: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    parcelNumber: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    imageUrl: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    floorPlanUrl: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    lotPlanUrl: {
      type: Sequelize.STRING,
      allowNull: true,
    }
  }, { tableName: 'homes' });

  Home.associate = (models) => {
    models.Home.belongsTo(models.Keycode, { foreignKey: 'keycodeId', allowNull: true })
    models.Home.belongsTo(models.Builder, { foreignKey: 'builderId', allowNull: false })
    models.Home.belongsTo(models.Community, { foreignKey: 'communityId', allowNull: true })
  }

  return Home
}
