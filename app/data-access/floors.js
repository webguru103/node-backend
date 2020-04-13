'use strict';

const {
  ItemType,
  CarpetType,
  VinylFloorType,
  ConstructionType,
  Room,
  RoomItem,
  Outdoor,
  OutdoorItem,
  Item,
  Sequelize
} = require('../models');
const { Op } = Sequelize;
const { errorHandler } = require('../utils');
const { vinylFloorTypeSerializer, carpetTypeSerializer, constructionTypeSerializer } = require('../serializers');
const _ = require('lodash');

const floorCategories = [
  {itemCategoryId: 3, name: 'Wood Floor'}, 
  {itemCategoryId: 4, name: 'Vinyl Floor'},
  {itemCategoryId: 5, name: 'Carpet'},
  {itemCategoryId: 6, name: 'Tile Floor'},
  {itemCategoryId: 7, name: 'Wall'}
];

module.exports.getFloorTypes = async () => {
  try {
    const itemTypes = await ItemType.findAll({
      where: {
        superCategoryId: 1,
        itemCategoryId: {
          [Op.ne]: null
        }
      }
    });
    // Todo: Dynamic item category for main
    const mainCategories = [
      {itemCategoryId: 3, name: 'Wood Floor'}, 
      {itemCategoryId: 4, name: 'Vinyl Floor'},
      {itemCategoryId: 5, name: 'Carpet'},
      {itemCategoryId: 6, name: 'Tile Floor'},
      {itemCategoryId: 7, name: 'Wall'},
      {itemCategoryId: 22, name: 'Grout'}
    ];

    const _carpetTypes = await CarpetType.findAll();
    const _vinylFloorTypes = await VinylFloorType.findAll();
    const _constructionTypes = await ConstructionType.findAll();

    const subCategories = {
      3: {
        name: 'Wood Floor',
        categories: _constructionTypes.map(type => constructionTypeSerializer(type)),
        field: 'constructionTypeId',
        itemType: itemTypes.find(type => type.itemCategoryId === 3)
      },
      4: {
        name: 'Vinyl Floor',
        categories: _vinylFloorTypes.map(type => vinylFloorTypeSerializer(type)),
        field: 'vinylFloorTypeId',
        itemType: itemTypes.find(type => type.itemCategoryId === 4)
      },
      5: {
        name: 'Carpet',
        categories: _carpetTypes.map(type => carpetTypeSerializer(type)),
        field: 'carpetTypeId',
        itemType: itemTypes.find(type => type.itemCategoryId === 5)
      },
      6: {
        name: 'Tile Floor',
        field: 'tileFloorTypeId',
        itemType: itemTypes.find(type => type.itemCategoryId === 6)
      },
      7: {
        name: 'Wall',
        categories: itemTypes.filter(type => type.itemCategoryId === 7),
        field: 'itemTypeId'
      },
      22: {
        name: 'Grout',
        field: 'groutTypeId',
        itemType: itemTypes.find(type => type.itemCategoryId === 22)
      }
    };
    return { mainCategories, subCategories };
  } catch (error) {
    console.log(error);
    return null;
  }
}

const getItemWithRoom = async (id, roomId) => {
  try {
    const include = [ItemType];
    const where = {id};
    const item = await Item.findOne({where, include});
    const room = await Room.findById(roomId);
    const category = floorCategories.find(ca => item.ItemType && item.ItemType.itemCategoryId === ca.itemCategoryId);
    return {item, itemType: item.itemType, category, room};
  } catch (error) {
    console.log(error);
    return null;
  }
}
const getItemsWithRoom = (items) => Promise.all(items.map(item => getItemWithRoom(item.itemId, item.roomId)));
const getItemsByRooms = async (roomIds) => {
  try {
    const roomItems = await RoomItem.findAll({ where: { roomId: roomIds } });
    const count = roomItems.length;
    const items = await getItemsWithRoom(roomItems);
    return { count, items };
  } catch (error) {
    console.log(error);
    return null;
  }
}

const getItemWithOutdoor = async (id, outdoorId) => {
  try {
    const include = [ItemType];
    const where = {id: id};
    const item = await Item.findOne({where, include});
    const outdoor = await Outdoor.findById(outdoorId);
    const category = floorCategories.find(ca => item.ItemType && item.ItemType.itemCategoryId === ca.itemCategoryId);
    return {item, itemType: item.itemType, category, outdoor};
  } catch (error) {
    console.log(error);
    return null;
  }
}
const getItemsWithOutdoor = (items) => Promise.all(items.map(item => getItemWithOutdoor(item.itemId, item.outdoorId)));
const getItemsByOutdoors = async (outdoorIds) => {
  try {
    const outdoorItems = await OutdoorItem.findAll({ where: { outdoorId: outdoorIds } });
    const count = outdoorItems.length;
    const items = await getItemsWithOutdoor(outdoorItems);
    return { count, items };
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports.getItemsByHome = async (homeId) => {
  try {
    const rooms = await Room.findAll({ where: { homeId } });
    const outdoors = await Outdoor.findAll({ where: { homeId } });
    const itemTypes = await ItemType.findAll({
      where: {
        superCategoryId: 1,
        itemCategoryId: {
          [Op.ne]: null
        }
      }
    });
    const itemTypeIds = itemTypes.map(type => type.id);
    const roomIds = rooms.map(room => room.id);
    const outdoorIds = outdoors.map(outdoor => outdoor.id);
    const { items: roomItems } = await getItemsByRooms(roomIds);
    const { items: outdoorItems } = await getItemsByOutdoors(outdoorIds);
    const _items = _.concat(roomItems, outdoorItems);
    const _filteredItems = _items.filter(item => item && itemTypeIds.includes(item.item.itemTypeId));

    const groupedItems = _.groupBy(_filteredItems, item => item.item.id);
    const floorItemKeys = Object.keys(groupedItems);

    const floorItems = floorItemKeys.map(floor => {
      const filteredRoom = groupedItems[floor].filter(item => item.room);
      const filteredOutdoor = groupedItems[floor].filter(item => item.outdoor);
      const room = filteredRoom.map(item => item.room);
      const outdoor = filteredOutdoor.map(item => item.outdoor);
      return {
        id: floor,
        count: groupedItems[floor].length,
        item: groupedItems[floor][0].item,
        itemType: groupedItems[floor][0].item.ItemType,
        category: groupedItems[floor][0].category,
        room,
        outdoor
      }
    });

    return {floorItems}

  } catch (error) {
    console.log(error);
    return null;
  }
};
