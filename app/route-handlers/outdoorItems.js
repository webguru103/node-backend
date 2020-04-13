'use strict';

const db = require('../data-access');
const { outdoorItemSerializer } = require('../serializers');

module.exports.getAll = async (req, res) => {
  const { count, outdoorItems } = await db.outdoorItems.getAll();
  const _outdoorItems = outdoorItems.map(item => outdoorItemSerializer(item));

  return res.status(200).send({ count, outdoorItems: _outdoorItems });
}

module.exports.getAllByItem = async (req, res) => {
  const itemId = req.query.itemId;
  const { count, outdoorItems } = await db.outdoorItems.getAllByItem(itemId);
  const _outdoorItems = outdoorItems.map(item => outdoorItemSerializer(item));

  return res.status(200).send({ count, outdoorItems: _outdoorItems });
}

module.exports.getAllByOutdoor = async (req, res) => {
  const outdoorId = req.query.outdoorId;
  const { count, outdoorItems } = await db.outdoorItems.getAllByOutdoor(outdoorId);
  const _outdoorItems = outdoorItems.map(item => outdoorItemSerializer(item));

  return res.status(200).send({ count, outdoorItems: _outdoorItems });
}

module.exports.getById = async (req, res) => {
  const id = req.params.id;
  const { outdoorItem } = await db.outdoorItems.getById(id);
  const _outdoorItem = outdoorItemSerializer(outdoorItem);

  return res.status(200).send({ outdoorItem: _outdoorItem });
}

module.exports.create = async (req, res) => {
  const _outdoorItem = req.body.outdoorItem;
  const { outdoorItem } = await db.outdoorItems.createOutdoorItem(_outdoorItem);
  return res.status(200).send({ outdoorItem: outdoorItemSerializer(outdoorItem) });
}

module.exports.update = async (req, res) => {
  const _outdoorItem = req.body.outdoorItem;
  const { id } = req.params;
  const { outdoorItem } = await db.outdoorItems.updateOutdoorItem({ id, outdoorItem: _outdoorItem });
  return res.status(200).send({ outdoorItem: outdoorItemSerializer(outdoorItem) });
}

module.exports.delete = async (req, res) => {
  const { id } = req.params;
  const { message } = await db.outdoorItems.deleteOutdoorItem(id);
  return res.status(200).send({ message });
}

module.exports.deleteByItem = async (req, res) => {
  const { itemId, outdoorId } = req.body.item;
  const { message } = await db.outdoorItems.deleteOutdoorItembyItem(itemId, outdoorId);
  return res.status(200).send({ message });
}
