'use strict';

const db = require('../data-access');
const { systemItemSerializer } = require('../serializers');

module.exports.getAll = async (req, res) => {
  const { count, systemItems } = await db.systemItems.getAll();
  const _systemItems = systemItems.map(item => systemItemSerializer(item));

  return res.status(200).send({ count, systemItems: _systemItems });
}

module.exports.getAllByItem = async (req, res) => {
  const itemId = req.query.itemId;
  const { count, systemItems } = await db.systemItems.getAllByItem(itemId);
  const _systemItems = systemItems.map(item => systemItemSerializer(item));

  return res.status(200).send({ count, systemItems: _systemItems });
}

module.exports.getAllBySystem = async (req, res) => {
  const systemId = req.query.systemId;
  const { count, systemItems } = await db.systemItems.getAllBySystem(systemId);
  const _systemItems = systemItems.map(item => systemItemSerializer(item));

  return res.status(200).send({ count, systemItems: _systemItems });
}

module.exports.getById = async (req, res) => {
  const id = req.params.id;
  const { systemItem } = await db.systemItems.getById(id);
  const _systemItem = systemItemSerializer(systemItem);

  return res.status(200).send({ systemItem: _systemItem });
}

module.exports.create = async (req, res) => {
  const _systemItem = req.body.systemItem;
  const { systemItem } = await db.systemItems.createSystemItem(_systemItem);
  return res.status(200).send({ systemItem: systemItemSerializer(systemItem) });
}

module.exports.update = async (req, res) => {
  const _systemItem = req.body.systemItem;
  const id = req.params.id;
  const { systemItem } = await db.systemItems.updateSystemItem({ id, systemItem: _systemItem });
  return res.status(200).send({ systemItem: systemItemSerializer(systemItem) });
}

module.exports.delete = async (req, res) => {
  const id = req.params.id;
  const { message } = await db.systemItems.deleteSystemItem(id);
  return res.status(200).send({ message });
}
