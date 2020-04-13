'use strict';

const {
  Item,
  ItemType,
  ItemCategory,
  RoomItem,
  OutdoorItem,
  HomeSystemItem
} = require('../models');
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

const deleteRelatedItem = async (item) => {
  try {
    await item.destroy({ force: true })
    return {message: 'Removed'};
  } catch (error) {
    console.log(error);
    return null;
  }
  
}

const deleteRelatedItems = (items) => Promise.all(items.map(item => deleteRelatedItem(item)));

const deleteRoomItemsByItem = async (itemId) => {
  try {
    const roomItems = await RoomItem.findAll({ where: { itemId } });
    await deleteRelatedItems(roomItems);
    return { message: 'Removed the related-Items' };
  } catch (error) {
    console.log(error);
    return null;
  }
}
const deleteOutdoorItemsByItem = async (itemId) => {
  try {
    const outdooritems = await OutdoorItem.findAll({ where: { itemId } });
    await deleteRelatedItems(outdooritems);
    return { message: 'Removed the related-Items' };
  } catch (error) {
    console.log(error);
    return null;
  }
}
const deleteSystemItemsByItem = async (itemId) => {
  try {
    const systemItems = await HomeSystemItem.findAll({ where: { itemId } });
    await deleteRelatedItems(systemItems);
    return { message: 'Removed the related-Items' };
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports.getItems = async () => {
  try {
    const items = await Item.findAll();
    const count = items.length;
    return { count, items };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getItemsByType = async (itemTypeId) => {
  try {
    const items = await Item.findAll({ where: { itemTypeId } });
    const count = items.length;
    return { count, items };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getItem = async (id) => {
  try {
    const item = await Item.findById(id);
    return { item };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.createItem = async (item) => {
  const {
    name, brand, collection, model, modelNumber, colorCode,
    serialNumber, imageUrl, length, width, height, size,
    ownersManualUrl, energyGuideUrl, warrantyUrl,
    itemTypeId, colorFamilyId, colorMfg, colorSwatchUrl,
    materialTypeId, carpetTypeId, vinylFloorTypeId,
    colorFinishId, paintTypeId, sheenTypeId,
    constructionTypeId, speciesTypeId, groutColor
  } = item;
  const itemFields = {
    name, brand, collection, model, modelNumber, colorCode,
    serialNumber, imageUrl, length, width, height, size,
    ownersManualUrl, energyGuideUrl, warrantyUrl,
    itemTypeId, colorFamilyId, colorMfg, colorSwatchUrl,
    materialTypeId, carpetTypeId, vinylFloorTypeId,
    colorFinishId, paintTypeId, sheenTypeId,
    constructionTypeId, speciesTypeId, groutColor
  }
  const availableFields = {};
  Object.keys(itemFields).forEach((field) => {
    if (itemFields[field]) {
      availableFields[field] = itemFields[field];
    }
  });
  try {
    const _item = await Item.create(availableFields);
    const _category = await getItemCategory(_item.itemTypeId);
    const itemType = await ItemType.findById(_item.itemTypeId);
    return { item: _item, category: _category, itemType };
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports.updateItem = async ({id, item}) => {
  const {
    name, brand, collection, model, modelNumber, colorCode,
    serialNumber, imageUrl, length, width, height, size,
    ownersManualUrl, energyGuideUrl, warrantyUrl,
    itemTypeId, colorFamilyId, colorMfg, colorSwatchUrl,
    materialTypeId, carpetTypeId, vinylFloorTypeId,
    colorFinishId, paintTypeId, sheenTypeId,
    constructionTypeId, speciesTypeId, groutColor
  } = item;
  const itemFields = {
    name, brand, collection, model, modelNumber, colorCode,
    serialNumber, imageUrl, length, width, height, size,
    ownersManualUrl, energyGuideUrl, warrantyUrl,
    itemTypeId, colorFamilyId, colorMfg, colorSwatchUrl,
    materialTypeId, carpetTypeId, vinylFloorTypeId,
    colorFinishId, paintTypeId, sheenTypeId,
    constructionTypeId, speciesTypeId, groutColor
  }
  const fields = Object.keys(itemFields);
  try {
    const _item = await Item.findById(id)
    const updatedItem = await _item.update(itemFields, { fields });
    const _category = await getItemCategory(updatedItem.itemTypeId);
    const itemType = await ItemType.findById(updatedItem.itemTypeId);
    return { item: updatedItem, category: _category, itemType };
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports.deleteItem = async (id) => {
  try {
    const _item = await Item.findById(id);
    await deleteRoomItemsByItem(id);
    await deleteOutdoorItemsByItem(id);
    await deleteSystemItemsByItem(id);
    await _item.destroy({ force: true });
    return { message: 'Removed successfully!' };
  } catch (error) {
    console.log(error);
    return null;
  }
}
