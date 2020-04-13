'use strict';

const { Room, RoomItem, Item, ItemType, ItemCategory } = require('../models');
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
const getItemsByRoom = async (roomId) => {
  try {
    const roomItems = await RoomItem.findAll({ where: { roomId } });
    const count = roomItems.length;
    const items = await getItems(roomItems);
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
const deleteItemsByRoom = async (roomId) => {
  try {
    const roomItems = await RoomItem.findAll({ where: { roomId } });
    await deleteItems(roomItems);
    return { message: 'Removed the related-Items' };
  } catch (error) {
    console.log(error);
    return null;
  }
}

const getRoomsWithItemsCount = async (room, roomId) => {
  try {
    const roomItems = await RoomItem.findAll({ where: { roomId } });
    const itemCount = roomItems.length;
    return {room, itemCount};
  } catch (error) {
    console.log(error);
    return null;
  }
}
const getRoomsByHome = (rooms) => Promise.all(rooms.map(room => getRoomsWithItemsCount(room, room.id)));

module.exports.getRooms = async () => {
  try {
    const rooms = await Room.findAll();
    const count = rooms.length;
    return { count, rooms };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getRoomsByHome = async (homeId) => {
  try {
    const rooms = await Room.findAll({ where: { homeId } });
    const count = rooms.length;
    const _rooms = await getRoomsByHome(rooms);
    return { count, rooms: _rooms };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getRoomsByType = async (roomTypeId) => {
  try {
    const rooms = await Room.findAll({ where: { roomTypeId } });
    const count = rooms.length;
    return { count, rooms };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getRoom = async (id) => {
  try {
    const room = await Room.findById(id);
    const item = await getItemsByRoom(id);
    return { room, item };
  } catch (error) {
    console.log(error);
    return null;
  }
};

const createRoom = async (room) => {
  const {
    name, homeId, roomTypeId, level, width, height, squareFeet, imageUrl
  } = room;
  const roomFields = {
    name, homeId, roomTypeId, level, width, height, squareFeet, imageUrl
  }
  const availableFields = {};
  Object.keys(roomFields).forEach((field) => {
    if (roomFields[field]) {
      availableFields[field] = roomFields[field];
    }
  });
  try {
    const _room = await Room.create(availableFields);
    return { room: _room };
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports.createRoom = createRoom;
module.exports.createRooms = ({rooms}) => Promise.all(rooms.map(room => createRoom(room)))

module.exports.updateRoom = async ({_roomId, room}) => {
  const {
    name, homeId, roomTypeId, level, width, height, squareFeet, imageUrl
  } = room;
  const roomFields = {
    name,
    homeId,
    roomTypeId,
    level,
    width,
    height,
    squareFeet,
    imageUrl
  }
  const fields = Object.keys(roomFields);
  try {
    const _room = await Room.findById(_roomId)
    const updatedRoom = await _room.update(roomFields, { fields });
    return { room: updatedRoom };
  } catch (error) {
    console.log(error);
    return null;
  }
}

const deleteRoom = async (id) => {
  try {
    const _room = await Room.findById(id);
    await deleteItemsByRoom(id);
    await _room.destroy({ force: true });
    return { message: 'Removed successfully!' };
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports.deleteRoom = deleteRoom;
module.exports.deleteRooms = ({rooms}) => Promise.all(rooms.map(room => deleteRoom(room.id)));
