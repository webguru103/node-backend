'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('homes', 'beds', { type: Sequelize.INTEGER });
    await queryInterface.addColumn('homes', 'baths', { type: Sequelize.INTEGER });
    await queryInterface.addColumn('homes', 'garages', { type: Sequelize.INTEGER });
    await queryInterface.addColumn('homes', 'squareFeet', { type: Sequelize.STRING(20) });
    await queryInterface.addColumn('homes', 'modelName', { type: Sequelize.STRING(50) });
    await queryInterface.addColumn('homes', 'yearBuilt', { type: Sequelize.STRING(5) });
    await queryInterface.addColumn('homes', 'lot', { type: Sequelize.STRING(20) });
    await queryInterface.addColumn('homes', 'lotSize', { type: Sequelize.STRING(20) });
    await queryInterface.addColumn('homes', 'parcelNumber', { type: Sequelize.STRING(20) });
    await queryInterface.addColumn('homes', 'imageUrl', { type: Sequelize.STRING });
    await queryInterface.addColumn('homes', 'floorPlanUrl', { type: Sequelize.STRING });
    await queryInterface.addColumn('homes', 'lotPlanUrl', { type: Sequelize.STRING });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('homes', 'beds');
    await queryInterface.removeColumn('homes', 'baths');
    await queryInterface.removeColumn('homes', 'garages');
    await queryInterface.removeColumn('homes', 'squareFeet');
    await queryInterface.removeColumn('homes', 'modelName');
    await queryInterface.removeColumn('homes', 'yearBuilt');
    await queryInterface.removeColumn('homes', 'lot');
    await queryInterface.removeColumn('homes', 'lotSize');
    await queryInterface.removeColumn('homes', 'parcelNumber');
    await queryInterface.removeColumn('homes', 'imageUrl');
    await queryInterface.removeColumn('homes', 'floorPlanUrl');
    await queryInterface.removeColumn('homes', 'lotPlanUrl');
  },
};
