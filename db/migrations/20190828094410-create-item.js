'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      brand: {
        type: Sequelize.STRING
      },
      collection: {
        type: Sequelize.STRING
      },
      model: {
        type: Sequelize.STRING
      },
      modelNumber: {
        type: Sequelize.STRING
      },
      colorCode: {
        type: Sequelize.STRING
      },
      serialNumber: {
        type: Sequelize.STRING
      },
      length: {
        type: Sequelize.STRING
      },
      width: {
        type: Sequelize.STRING
      },
      height: {
        type: Sequelize.STRING
      },
      ownesManualUrl: {
        type: Sequelize.STRING
      },
      energyGuideUrl: {
        type: Sequelize.STRING
      },
      warrantyUrl: {
        type: Sequelize.STRING
      },
      itemTypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'itemTypes',
          key: 'id'
        }
      },
      colorFamilyId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'colorFamilies',
          key: 'id'
        }
      },
      colorMfg: {
        type: Sequelize.STRING
      },
      colorSwatchUrl: {
        type: Sequelize.STRING
      },
      imageUrl: {
        type: Sequelize.STRING
      },
      size: {
        type: Sequelize.STRING
      },
      materialTypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'materialTypes',
          key: 'id'
        }
      },
      carpetTypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'carpetTypes',
          key: 'id'
        }
      },
      vinylFloorTypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'vinylFloorTypes',
          key: 'id'
        }
      },
      colorFinishId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'colorFinishes',
          key: 'id'
        }
      },
      paintTypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'paintTypes',
          key: 'id'
        }
      },
      sheenTypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'sheenTypes',
          key: 'id'
        }
      },
      constructIionTypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'constructionTypes',
          key: 'id'
        }
      },
      speciesTypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'speciesTypes',
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
    return queryInterface.dropTable('items');
  }
};