'use strict';

const { ColorFamily, ItemType } = require('../models');
const { errorHandler } = require('../utils');

module.exports.getAll = async () => {
  try {
    const colorFamilies = await ColorFamily.findAll({
      order: [
        ['id', 'ASC']
      ]
    });
    const count = colorFamilies.length;
    return { count, colorFamilies };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getAllByIds = async (ids) => {
  try {
    const colorFamilies = await ColorFamily.findAll({ where: { id: ids } });
    const count = colorFamilies.length;
    return { count, colorFamilies };
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getAllByItemType = async (itemTypeId) => {
  try {
    const colorFamilies = await ColorFamily.findAll({
      where: { itemCategoryId: itemTypeId },
      order: [
        ['id', 'ASC']
      ]
    });
    const count = colorFamilies.length;
    return { count, colorFamilies };
  } catch (error) {
    console.log(error);
    return null;
  }
};
module.exports.getAllByItemType = getAllByItemType;

module.exports.getAllByType = async (typeId) => {
  try {
    const itemType = await ItemType.findById(typeId);
    const { colorFamilies } = await getAllByItemType(itemType.itemCategoryId);
    const count = colorFamilies.length;
    return { count, colorFamilies };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getById = async (id) => {
  try {
    const colorFamily = await ColorFamily.findById(id);
    return { colorFamily };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.create = async ({ name, itemTypeId }) => {
  try {
    const colorFamily = await ColorFamily.create({ name, itemTypeId });
    return { colorFamily };
  } catch (error) {
    console.log(error);
    return null;
  }
}
