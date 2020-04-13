'use strict';

const { RoomType } = require('../models');
const { errorHandler } = require('../utils');

module.exports.getRoomTypes = async () => {
  try {
    const roomTypes = await RoomType.findAll();
    const count = roomTypes.length;
    return { count, roomTypes };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getRoomTypesByIds = async (roomTypeIds) => {
  try {
    const roomTypes = await RoomType.findAll({ where: { id: roomTypeIds } });
    const count = roomTypes.length;
    return { count, roomTypes };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getType = async (id) => {
  try {
    const roomType = await RoomType.findById(id);
    return { roomType };
  } catch (error) {
    console.log(error);
    return null;
  }
};
