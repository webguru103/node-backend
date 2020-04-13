'use strict';

const { Outdoor, OutdoorItem, Item, ItemType, ItemCategory } = require('../models');
const { errorHandler } = require('../utils');

const getItemCategory = async (typeId) => {
  try {
    const itemType = await ItemType.findById(typeId);
    const category = await ItemCategory.findById(itemType.itemCategoryId);
    return category;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const getItemByID = async (id) => {
  try {
    const include = [ItemType];
    const where = {id: id};
    const item = await Item.findOne({where, include});
    const category = await getItemCategory(item.itemTypeId);
    return {item, itemType: item.ItemType, category};
  } catch (error) {
    console.log(error);
    return null;
  }
}

const getItems = (items) => Promise.all(items.map(item => getItemByID(item.itemId)));
const getItemsByOutdoor = async (outdoorId) => {
  try {
    const outdoorItems = await OutdoorItem.findAll({ where: { outdoorId } });
    const count = outdoorItems.length;
    const items = await getItems(outdoorItems);
    return { count, items };
  } catch (error) {
    console.log(error);
    return null;
  }
}

const deleteItem = async (item) => {
  try {
    await item.destroy({ force: true })
    return {message: 'Removed'};
  } catch (error) {
    console.log(error);
    return null;
  }
}

const deleteItems = (items) => Promise.all(items.map(item => deleteItem(item)));
const deleteItemsByOutdoor = async (outdoorId) => {
  try {
    const outdoorItems = await OutdoorItem.findAll({ where: { outdoorId } });
    await deleteItems(outdoorItems);
    return { message: 'Removed the related-Items' };
  } catch (error) {
    console.log(error);
    return null;
  }
}

const getOutdoorsWithItemsCount = async (outdoor, outdoorId) => {
  try {
    const outdoorItems = await OutdoorItem.findAll({ where: { outdoorId } });
    const itemCount = outdoorItems.length;
    return {outdoor, itemCount};
  } catch (error) {
    console.log(error);
    return null;
  }
}
const getOutdoorsByHome = (outdoors) => Promise.all(outdoors.map(outdoor => getOutdoorsWithItemsCount(outdoor, outdoor.id)));

module.exports.getAll = async () => {
  try {
    const outdoors = await Outdoor.findAll();
    const count = outdoors.length;
    return { count, outdoors };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getAllByHome = async (homeId) => {
  try {
    const outdoors = await Outdoor.findAll({ where: { homeId } });
    const count = outdoors.length;
    const _outdoors = await getOutdoorsByHome(outdoors);
    return { count, outdoors: _outdoors };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getAllByType = async (typeId) => {
  try {
    const outdoors = await Outdoor.findAll({ where: { outdoorTypeId: typeId } });
    const count = outdoors.length;
    return { count, outdoors };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getById = async (id) => {
  try {
    const outdoor = await Outdoor.findById(id);
    const item = await getItemsByOutdoor(id);
    return { outdoor, item };
  } catch (error) {
    console.log(error);
    return null;
  }
};

const createOutdoor = async (outdoor) => {
  const {
    name, homeId, outdoorTypeId, imageUrl
  } = outdoor;
  const outdoorFields = {
    name, homeId, outdoorTypeId, imageUrl
  };
  const availableFields = {};
  Object.keys(outdoorFields).forEach((field) => {
    if (outdoorFields[field]) {
      availableFields[field] = outdoorFields[field];
    }
  });
  try {
    const _outdoor = await Outdoor.create(availableFields);
    return { outdoor: _outdoor };
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports.createOutdoor = createOutdoor;
module.exports.createOutdoors = ({outdoors}) => Promise.all(outdoors.map(outdoor => createOutdoor(outdoor)));

module.exports.updateOutdoor = async ({id, outdoor}) => {
  const {
    name, homeId, outdoorTypeId, imageUrl
  } = outdoor;
  const outdoorFields = {
    name, homeId, outdoorTypeId, imageUrl
  }
  const fields = Object.keys(outdoorFields);
  try {
    const _outdoor = await Outdoor.findById(id)
    const updatedOutdoor = await _outdoor.update(outdoorFields, { fields });
    return { outdoor: updatedOutdoor };
  } catch (error) {
    console.log(error);
    return null;
  }
}

const deleteOutdoor = async (id) => {
  try {
    const _outdoor = await Outdoor.findById(id);
    await deleteItemsByOutdoor(id);
    await _outdoor.destroy({ force: true });
    return { message: 'Removed successfully!' };
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports.deleteOutdoor = deleteOutdoor;
module.exports.deleteOutdoors = ({outdoors}) => Promise.all(outdoors.map(outdoor => deleteOutdoor(outdoor.id)));
