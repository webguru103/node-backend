'use strict';

const { HomeSystem, HomeSystemItem, Item, ItemType, ItemCategory } = require('../models');
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
    return {item, itemType: item.itemType, category};
  } catch (error) {
    console.log(error);
    return null;
  }
}
const getItems = (items) => Promise.all(items.map(item => getItemByID(item.itemId)));
const getItemsBySystem = async (homeSystemId) => {
  try {
    const systemItems = await HomeSystemItem.findAll({ where: { homeSystemId } });
    const count = systemItems.length;
    const items = await getItems(systemItems);
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
const deleteItemsBySystem = async (homeSystemId) => {
  try {
    const homeSystemItems = await HomeSystemItem.findAll({ where: { homeSystemId } });
    await deleteItems(homeSystemItems);
    return { message: 'Removed the related-Items' };
  } catch (error) {
    console.log(error);
    return null;
  }
}

const getSystemsWithItemsCount = async (system, systemId) => {
  try {
    const systemItems = await HomeSystemItem.findAll({ where: { homeSystemId: systemId } });
    const itemCount = systemItems.length;
    return {system, itemCount};
  } catch (error) {
    console.log(error);
    return null;
  }
}
const getSystemsByHome = (systems) => Promise.all(systems.map(system => getSystemsWithItemsCount(system, system.id)));

module.exports.getAll = async () => {
  try {
    const systems = await HomeSystem.findAll();
    const count = systems.length;
    return { count, systems };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getAllByHome = async (homeId) => {
  try {
    const systems = await HomeSystem.findAll({ where: { homeId } });
    const count = systems.length;
    const _systems = await getSystemsByHome(systems);
    return { count, systems: _systems };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getAllByType = async (typeId) => {
  try {
    const systems = await HomeSystem.findAll({ where: { systemTypeId: typeId } });
    const count = systems.length;
    return { count, systems };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getById = async (id) => {
  try {
    const system = await HomeSystem.findById(id);
    const item = await getItemsBySystem(id);
    return { system, item };
  } catch (error) {
    console.log(error);
    return null;
  }
};

const createSystem = async (homeSystem) => {
  const {
    name, homeId, systemTypeId, imageUrl
  } = homeSystem;
  const systemFields = {
    name, homeId, systemTypeId, imageUrl
  };
  const availableFields = {};
  Object.keys(systemFields).forEach((field) => {
    if (systemFields[field]) {
      availableFields[field] = systemFields[field];
    }
  });
  try {
    const _system = await HomeSystem.create(availableFields);
    return { system: _system };
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports.createSystem = createSystem;
module.exports.createSystems = ({systems}) => Promise.all(systems.map(system => createSystem(system)))

module.exports.updateSystem = async ({id, system}) => {
  const {
    name, homeId, systemTypeId, imageUrl
  } = system;
  const systemFields = {
    name, homeId, systemTypeId, imageUrl
  };
  const fields = Object.keys(systemFields);
  try {
    const _homeSystem = await HomeSystem.findById(id)
    const updatedSystem = await _homeSystem.update(systemFields, { fields });
    return { system: updatedSystem };
  } catch (error) {
    console.log(error);
    return null;
  }
}

const deleteSystem = async (id) => {
  try {
    const _homeSystem = await HomeSystem.findById(id);
    await deleteItemsBySystem(id);
    await _homeSystem.destroy({ force: true });
    return { message: 'Removed successfully!' };
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports.deleteSystem = deleteSystem;
module.exports.deleteSystems = ({systems}) => Promise.all(systems.map(system => deleteSystem(system.id)));
