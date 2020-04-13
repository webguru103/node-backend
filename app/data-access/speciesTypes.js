'use strict';

const { SpeciesType } = require('../models');
const { errorHandler } = require('../utils');

module.exports.getTypes = async () => {
  try {
    const speciesTypes = await SpeciesType.findAll();
    const count = speciesTypes.length;
    return { count, speciesTypes };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getTypesByIds = async (ids) => {
  try {
    const speciesTypes = await SpeciesType.findAll({ where: { id: ids } });
    const count = speciesTypes.length;
    return { count, speciesTypes };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getType = async (id) => {
  try {
    const speciesType = await SpeciesType.findById(id);
    return { speciesType };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.createType = async ({ name }) => {
  try {
    const speciesType = await SpeciesType.create({ name });
    return { speciesType };
  } catch (error) {
    console.log(error);
    return null;
  }
}
