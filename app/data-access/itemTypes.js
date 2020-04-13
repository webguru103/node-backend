'use strict';

const { ItemType } = require('../models');
const { errorHandler } = require('../utils');

module.exports.getTypes = async () => {
  try {
    const itemTypes = await ItemType.findAll();
    const count = itemTypes.length;
    return { count, itemTypes };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getTypesByIds = async (ids) => {
  try {
    const itemTypes = await ItemType.findAll({ where: { id: ids } });
    const count = itemTypes.length;
    return { count, itemTypes };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getTypesByItemCategory = async (itemCategoryId) => {
  try {
    const itemTypes = await ItemType.findAll({ where: { itemCategoryId } });
    const count = itemTypes.length;
    return { count, itemTypes };
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports.getTypesBySuperCategory = async (superCategoryId) => {
  try {
    const itemTypes = await ItemType.findAll({ where: { superCategoryId } });
    const count = itemTypes.length;
    return { count, itemTypes };
  } catch (error) {
    console.log(error);
    return null;
  }
}
