'use strict';

const { PaintType } = require('../models');
const { errorHandler } = require('../utils');

module.exports.getTypes = async () => {
  try {
    const paintTypes = await PaintType.findAll();
    const count = paintTypes.length;
    return { count, paintTypes };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getTypesByIds = async (ids) => {
  try {
    const paintTypes = await PaintType.findAll({ where: { id: ids } });
    const count = paintTypes.length;
    return { count, paintTypes };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getType = async (id) => {
  try {
    const paintType = await PaintType.findById(id);
    return { paintType };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.createType = async ({ name }) => {
  try {
    const paintType = await PaintType.create({ name });
    return { paintType };
  } catch (error) {
    console.log(error);
    return null;
  }
}
