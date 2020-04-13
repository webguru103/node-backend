'use strict';

const { VinylFloorType } = require('../models');
const { errorHandler } = require('../utils');

module.exports.getTypes = async () => {
  try {
    const floorTypes = await VinylFloorType.findAll();
    const count = floorTypes.length;
    return { count, floorTypes };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getTypesByIds = async (ids) => {
  try {
    const floorTypes = await VinylFloorType.findAll({ where: { id: ids } });
    const count = floorTypes.length;
    return { count, floorTypes };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getType = async (id) => {
  try {
    const floorType = await VinylFloorType.findById(id);
    return { floorType };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.createType = async ({ name }) => {
  try {
    const floorType = await VinylFloorType.create({ name });
    return { floorType };
  } catch (error) {
    console.log(error);
    return null;
  }
}
