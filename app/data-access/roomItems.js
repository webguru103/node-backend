'use strict';

const { RoomItem } = require('../models');
const { errorHandler } = require('../utils');

module.exports.getAll = async () => {
  try {
    const roomItems = await RoomItem.findAll();
    const count = roomItems.length;
    return { count, roomItems };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getAllByRoom = async (roomId) => {
  try {
    const roomItems = await RoomItem.findAll({ where: { roomId } });
    const count = roomItems.length;
    return { count, roomItems };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getAllByItem = async (itemId) => {
  try {
    const roomItems = await RoomItem.findAll({ where: { itemId } });
    const count = roomItems.length;
    return { count, roomItems };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getById = async (id) => {
  try {
    const roomItem = await RoomItem.findById(id);
    return { roomItem };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.createRoomItem = async (roomItem) => {
  const {
    itemId, roomId
  } = roomItem;
  const itemFields = {
    itemId, roomId
  };
  const availableFields = {};
  Object.keys(itemFields).forEach((field) => {
    if (itemFields[field]) {
      availableFields[field] = itemFields[field];
    }
  });
  try {
    const _roomItem = await RoomItem.create(availableFields);
    return { roomItem: _roomItem };
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports.updateRoomItem = async ({id, roomItem}) => {
  const {
    itemId, roomId
  } = roomItem;
  const itemFields = {
    itemId, roomId
  };
  const fields = Object.keys(itemFields);
  try {
    const _roomItem = await RoomItem.findById(id)
    const item = await _roomItem.update(itemFields, { fields });
    return { roomItem: item };
  } catch (error) {
    console.log(error);
    return null;
  }
}

const deleteRoomItem = async (id) => {
  try {
    const _roomItem = await RoomItem.findById(id)
    await _roomItem.destroy({ force: true });
    return { message: 'Removed successfully!' };
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports.deleteRoomItem = deleteRoomItem;

const deleteAll = (items) => Promise.all(items.map(item => deleteRoomItem(item.id)));
module.exports.deleteRoomItembyItem = async (itemId, roomId) => {
  try {
    const _roomItems = await RoomItem.findAll({ where: { itemId, roomId } });
    await deleteAll(_roomItems);
    return { message: 'Removed successfully!' };
  } catch (error) {
    console.log(error);
    return null;
  }
}
