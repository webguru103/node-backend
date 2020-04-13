'use strict';

const db = require('../data-access');
const { roomTypeSerializer } = require('../serializers');

module.exports.getAll = async (req, res) => {
  const { count, roomTypes: _roomTypes } = await db.roomTypes.getRoomTypes();
  const roomTypes = _roomTypes.map(roomType => roomTypeSerializer(roomType));

  return res.status(200).send({ count, roomTypes });
}

module.exports.getAllByIds = async (req, res) => {
  const ids = req.body.ids;
  const { count, roomTypes: _roomTypes } = await db.roomTypes.getRoomTypesByIds(ids);
  const roomTypes = _roomTypes.map(roomType => roomTypeSerializer(roomType));

  return res.status(200).send({ count, roomTypes });
}
