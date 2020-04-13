'use strict';

const { CarpetType } = require('../models');
const { errorHandler } = require('../utils');

module.exports.getTypes = async () => {
  try {
    const carpetTypes = await CarpetType.findAll();
    const count = carpetTypes.length;
    return { count, carpetTypes };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getTypesByIds = async (ids) => {
  try {
    const carpetTypes = await CarpetType.findAll({ where: { id: ids } });
    const count = carpetTypes.length;
    return { count, carpetTypes };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getType = async (id) => {
  try {
    const carpetType = await CarpetType.findById(id);
    return { carpetType };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.createType = async ({ name }) => {
  try {
    const carpetType = await CarpetType.create({ name });
    return { carpetType };
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports.updateType = async ({ id, name }) => {
  try {
    const _carpetType = await CarpetType.findById(id)
    const carpetType = await _carpetType.update({ name }, { fields: ['name'] });
    return { carpetType };
  } catch (error) {
    console.log(error);
    return null;
  }
}
