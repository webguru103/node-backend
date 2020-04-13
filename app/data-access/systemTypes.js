'use strict';

const { SystemType } = require('../models');
const { errorHandler } = require('../utils');

module.exports.getSystemTypes = async () => {
  try {
    const systemTypes = await SystemType.findAll();
    const count = systemTypes.length;
    return { count, systemTypes };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getSystemTypesByIds = async (systemTypeIds) => {
  try {
    const systemTypes = await SystemType.findAll({ where: { id: systemTypeIds } });
    const count = systemTypes.length;
    return { count, systemTypes };
  } catch (error) {
    console.log(error);
    return null;
  }
};
