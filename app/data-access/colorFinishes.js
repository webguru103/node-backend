'use strict';

const { ColorFinish, ItemType } = require('../models');
const { errorHandler } = require('../utils');

module.exports.getAll = async () => {
  try {
    const colorFinishes = await ColorFinish.findAll();
    const count = colorFinishes.length;
    return { count, colorFinishes };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getAllByIds = async (ids) => {
  try {
    const colorFinishes = await ColorFinish.findAll({ where: { id: ids } });
    const count = colorFinishes.length;
    return { count, colorFinishes };
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getAllByItemType = async (itemTypeId) => {
  try {
    const colorFinishes = await ColorFinish.findAll({ where: { itemCategoryId: itemTypeId } });
    const count = colorFinishes.length;
    return { count, colorFinishes };
  } catch (error) {
    console.log(error);
    return null;
  }
};
module.exports.getAllByItemType = getAllByItemType;

module.exports.getAllByType = async (typeId) => {
  try {
    const itemType = await ItemType.findById(typeId);
    const { colorFinishes } = await getAllByItemType(itemType.itemCategoryId);
    const count = colorFinishes.length;
    return { count, colorFinishes };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.get = async (id) => {
  try {
    const colorFinish = await ColorFinish.findById(id);
    return { colorFinish };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.create = async ({ name, itemTypeId }) => {
  try {
    const colorFinish = await ColorFinish.create({ name, itemTypeId });
    return { colorFinish };
  } catch (error) {
    console.log(error);
    return null;
  }
}
