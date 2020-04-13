'use strict';

const { ItemConsumable } = require('../models');
const { errorHandler } = require('../utils');

module.exports.getAll = async () => {
  try {
    const itemConsumables = await ItemConsumable.findAll();
    const count = itemConsumables.length;
    return { count, itemConsumables };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getAllByIds = async (ids) => {
  try {
    const itemConsumables = await ItemConsumable.findAll({ where: { id: ids } });
    const count = itemConsumables.length;
    return { count, itemConsumables };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getAllByItemType = async (itemTypeId) => {
  try {
    const itemConsumables = await ItemConsumable.findAll({ where: { itemTypeId } });
    const count = itemConsumables.length;
    return { count, itemConsumables };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getOne = async (id) => {
  try {
    const itemConsumable = await ItemConsumable.findById(id);
    return { itemConsumable };
  } catch (error) {
    console.log(error);
    return null;
  }
};
