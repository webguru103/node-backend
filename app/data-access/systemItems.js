'use strict';

const { HomeSystemItem } = require('../models');
const { errorHandler } = require('../utils');

module.exports.getAll = async () => {
  try {
    const systemItems = await HomeSystemItem.findAll();
    const count = systemItems.length;
    return { count, systemItems };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getAllBySystem = async (systemId) => {
  try {
    const systemItems = await HomeSystemItem.findAll({ where: { homeSystemId: systemId } });
    const count = systemItems.length;
    return { count, systemItems };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getAllByItem = async (itemId) => {
  try {
    const systemItems = await HomeSystemItem.findAll({ where: { itemId } });
    const count = systemItems.length;
    return { count, systemItems };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getById = async (id) => {
  try {
    const systemItem = await HomeSystemItem.findById(id);
    return { systemItem };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.createSystemItem = async (systemItem) => {
  const {
    itemId, homeSystemId
  } = systemItem;
  const itemFields = {
    itemId, homeSystemId
  };
  const availableFields = {};
  Object.keys(itemFields).forEach((field) => {
    if (itemFields[field]) {
      availableFields[field] = itemFields[field];
    }
  });
  try {
    const _systemItem = await HomeSystemItem.create(availableFields);
    return { systemItem: _systemItem };
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports.updateSystemItem = async ({id, item}) => {
  const {
    itemId, homeSystemId
  } = item;
  const itemFields = {
    itemId, homeSystemId
  };
  const fields = Object.keys(itemFields);
  try {
    const _item = await HomeSystemItem.findById(id)
    const systemItem = await _item.update(itemFields, { fields });
    return { systemItem };
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports.deleteSystemItem = async (id) => {
  try {
    const _systemItem = await HomeSystemItem.findById(id)
    await _systemItem.destroy({ force: true });
    return { message: 'Removed successfully!' };
  } catch (error) {
    console.log(error);
    return null;
  }
}
