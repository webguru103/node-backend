'use strict';

const { OutdoorItem } = require('../models');
const { errorHandler } = require('../utils');

module.exports.getAll = async () => {
  try {
    const outdoorItems = await OutdoorItem.findAll();
    const count = outdoorItems.length;
    return { count, outdoorItems };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getAllByOutdoor = async (outdoorId) => {
  try {
    const outdoorItems = await OutdoorItem.findAll({ where: { outdoorId } });
    const count = outdoorItems.length;
    return { count, outdoorItems };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getAllByItem = async (itemId) => {
  try {
    const outdoorItems = await OutdoorItem.findAll({ where: { itemId } });
    const count = outdoorItems.length;
    return { count, outdoorItems };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getById = async (id) => {
  try {
    const outdoorItem = await OutdoorItem.findById(id);
    return { outdoorItem };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.createOutdoorItem = async (outdoorItem) => {
  const {
    itemId, outdoorId
  } = outdoorItem;
  const itemFields = {
    itemId, outdoorId
  };
  const availableFields = {};
  Object.keys(itemFields).forEach((field) => {
    if (itemFields[field]) {
      availableFields[field] = itemFields[field];
    }
  });
  try {
    const _outdoorItem = await OutdoorItem.create(availableFields);
    return { outdoorItem: _outdoorItem };
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports.updateOutdoorItem = async ({id, outdoorItem}) => {
  const {
    itemId, outdoorId
  } = outdoorItem;
  const itemFields = {
    itemId, outdoorId
  };
  const fields = Object.keys(itemFields);
  try {
    const _outdoorItem = await OutdoorItem.findById(id)
    const item = await _outdoorItem.update(itemFields, { fields });
    return { outdoorItem: item };
  } catch (error) {
    console.log(error);
    return null;
  }
}

const deleteOutdoorItem = async (id) => {
  try {
    const _outdooritem = await OutdoorItem.findById(id)
    await _outdooritem.destroy({ force: true });
    return { message: 'Removed successfully!' };
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports.deleteOutdoorItem = deleteOutdoorItem;

const deleteAll = (items) => Promise.all(items.map(item => deleteOutdoorItem(item.id)));

module.exports.deleteOutdoorItembyItem = async (itemId, outdoorId) => {
  try {
    const _outdoorItems = await OutdoorItem.findAll({ where: { itemId, outdoorId } });
    await deleteAll(_outdoorItems);
    return { message: 'Removed successfully!' };
  } catch (error) {
    console.log(error);
    return null;
  }
}
