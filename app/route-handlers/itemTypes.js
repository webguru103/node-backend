'use strict';

const db = require('../data-access');
const { itemTypeSerializer } = require('../serializers');

module.exports.getAll = async (req, res) => {
  const { count, itemTypes: _itemTypes } = await db.itemTypes.getTypes();
  const itemTypes = _itemTypes.map(itemType => itemTypeSerializer(itemType));

  return res.status(200).send({ count, itemTypes });
}

module.exports.getAllByIds = async (req, res) => {
  const ids = req.body.ids;
  const { count, itemTypes: _itemTypes } = await db.itemTypes.getTypesByIds(ids);
  const itemTypes = _itemTypes.map(itemType => itemTypeSerializer(itemType));

  return res.status(200).send({ count, itemTypes });
}

module.exports.getAllByItemCategory = async (req, res) => {
  const id = req.query.itemcategory;
  const { count, itemTypes: _itemTypes } = await db.itemTypes.getTypesByItemCategory(id);
  const itemTypes = _itemTypes.map(itemType => itemTypeSerializer(itemType));

  return res.status(200).send({ count, itemTypes });
}

module.exports.getAllBySuperCategory = async (req, res) => {
  const id = req.query.supercategory;
  const { count, itemTypes: _itemTypes } = await db.itemTypes.getTypesBySuperCategory(id);
  const itemTypes = _itemTypes.map(itemType => itemTypeSerializer(itemType));

  return res.status(200).send({ count, itemTypes });
}
