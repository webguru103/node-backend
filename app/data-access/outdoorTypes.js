'use strict';

const { OutdoorType } = require('../models');
const { errorHandler } = require('../utils');

module.exports.getOutdoorTypes = async () => {
  try {
    const outdoorTypes = await OutdoorType.findAll();
    const count = outdoorTypes.length;
    return { count, outdoorTypes };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getOutdoorTypesByIds = async (outdoorTypeIds) => {
  try {
    const outdoorTypes = await OutdoorType.findAll({ where: { id: outdoorTypeIds } });
    const count = outdoorTypes.length;
    return { count, outdoorTypes };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getType = async (id) => {
  try {
    const outdoorType = await OutdoorType.findById(id);
    return { outdoorType };
  } catch (error) {
    console.log(error);
    return null;
  }
};
