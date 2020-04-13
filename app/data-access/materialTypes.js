'use strict';

const { MaterialType } = require('../models');
const { errorHandler } = require('../utils');

module.exports.getTypes = async () => {
  try {
    const materialTypes = await MaterialType.findAll();
    const count = materialTypes.length;
    return { count, materialTypes };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getTypesByIds = async (ids) => {
  try {
    const materialTypes = await MaterialType.findAll({ where: { id: ids } });
    const count = materialTypes.length;
    return { count, materialTypes };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getTypesByItemType = async (itemTypeId) => {
  try {
    const materialTypes = await MaterialType.findAll({ where: { itemCategoryId: itemTypeId } });
    const count = materialTypes.length;
    return { count, materialTypes };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getType = async (id) => {
  try {
    const materialType = await MaterialType.findById(id);
    return { materialType };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.createType = async ({ name, itemTypeId }) => {
  try {
    const materialType = await MaterialType.create({ name, itemCategoryId: itemTypeId });
    return { materialType };
  } catch (error) {
    console.log(error);
    return null;
  }
}
