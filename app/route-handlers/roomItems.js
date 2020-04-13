'use strict';

const db = require('../data-access');
const { roomItemSerializer } = require('../serializers');

module.exports.getAll = async (req, res) => {
  const { count, roomItems } = await db.roomItems.getAll();
  const _roomItems = roomItems.map(item => roomItemSerializer(item));

  return res.status(200).send({ count, roomItems: _roomItems });
}

module.exports.getAllByItem = async (req, res) => {
  const itemId = req.query.itemId;
  const { count, roomItems } = await db.roomItems.getAllByItem(itemId);
  const _roomItems = roomItems.map(item => roomItemSerializer(item));

  return res.status(200).send({ count, roomItems: _roomItems });
}

module.exports.getAllByRoom = async (req, res) => {
  const roomId = req.query.roomId;
  const { count, roomItems } = await db.roomItems.getAllByRoom(roomId);
  const _roomItems = roomItems.map(item => roomItemSerializer(item));

  return res.status(200).send({ count, roomItems: _roomItems });
}

module.exports.getById = async (req, res) => {
  const id = req.params.id;
  const { roomItem } = await db.roomItems.getById(id);
  const _roomItem = roomItemSerializer(roomItem);

  return res.status(200).send({ roomItem: _roomItem });
}

module.exports.create = async (req, res) => {
  const _roomItem = req.body.roomItem;
  const { roomItem } = await db.roomItems.createRoomItem(_roomItem);
  return res.status(200).send({ roomItem: roomItemSerializer(roomItem) });
}

module.exports.update = async (req, res) => {
  const _roomItem = req.body.roomItem;
  const id = req.params.id;
  const { roomItem } = await db.roomItems.updateRoomItem({ id, roomItem: _roomItem });
  return res.status(200).send({ roomItem: roomItemSerializer(roomItem) });
}

module.exports.delete = async (req, res) => {
  const id = req.params.id;
  const { message } = await db.roomItems.deleteRoomItem(id);
  return res.status(200).send({ message });
}

module.exports.deleteByItem = async (req, res) => {
  const { itemId, roomId } = req.body.item;
  const { message } = await db.roomItems.deleteRoomItembyItem(itemId, roomId);
  return res.status(200).send({ message });
}
