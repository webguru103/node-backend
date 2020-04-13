'use strict';

const { SheenType } = require('../models');
const { errorHandler } = require('../utils');

module.exports.getTypes = async () => {
  try {
    const sheenTypes = await SheenType.findAll();
    const count = sheenTypes.length;
    return { count, sheenTypes };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getTypesByIds = async (ids) => {
  try {
    const sheenTypes = await SheenType.findAll({ where: { id: ids } });
    const count = sheenTypes.length;
    return { count, sheenTypes };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getType = async (id) => {
  try {
    const sheenType = await SheenType.findById(id);
    return { sheenType };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.createType = async ({ name }) => {
  try {
    const sheenType = await SheenType.create({ name });
    return { sheenType };
  } catch (error) {
    console.log(error);
    return null;
  }
}
