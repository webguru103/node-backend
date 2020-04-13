'use strict';
const _ = require('lodash');

const { Room, RoomItem, Item } = require('../models');
const { errorHandler } = require('../utils');

const getItemByID = async (id, roomId) => {
  try {
    const item = await Item.findById(id);
    const room = await Room.findById(roomId);
    return {item, room};
  } catch (error) {
    console.log(error);
    return null;
  }
}
const getItems = (items) => Promise.all(items.map(item => getItemByID(item.itemId, item.roomId)));
const getItemsByRooms = async (roomIds) => {
  try {
    const roomItems = await RoomItem.findAll({ where: { roomId: roomIds } });
    const count = roomItems.length;
    const items = await getItems(roomItems);
    return { count, items };
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports.getItemsByHome = async (homeId) => {
  try {
    const rooms = await Room.findAll({ where: { homeId } });
    const roomIds = rooms.map(room => room.id);
    const { items } = await getItemsByRooms(roomIds);
    const _filteredByPaint = items.filter(item => !!item.item.paintTypeId );
    const groupByPaint = _.groupBy(_filteredByPaint, item => item.item.id);
    const paints = Object.keys(groupByPaint);
    const paintItems = paints.map(paint => ({
        id: paint,
        count: groupByPaint[paint].length,
        item: groupByPaint[paint][0].item,
        room: groupByPaint[paint].map(item => item.room)
    }));
    return { paintItems };

  } catch (error) {
    console.log(error);
    return null;
  }
};
