'use strict';

const db = require('../data-access');
const { itemConsumableSerializer } = require('../serializers');

module.exports.getAll = async (req, res) => {
  const { count, itemConsumables: _itemConsumables } = await db.itemConsumables.getAll();
  const itemConsumables = _itemConsumables.map(consumable => itemConsumableSerializer(consumable));

  return res.status(200).send({ count, itemConsumables });
}

module.exports.getAllByIds = async (req, res) => {
  const ids = req.body.ids;
  const { count, itemConsumables: _itemConsumables } = await db.itemConsumables.getAllByIds(ids);
  const itemConsumables = _itemConsumables.map(consumable => itemConsumableSerializer(consumable));

  return res.status(200).send({ count, itemConsumables });
}

module.exports.getAllByItemType = async (req, res) => {
  const itemTypeId = req.query.itemType;
  const { count, itemConsumables: _itemConsumables } = await db.itemConsumables.getAllByItemType(itemTypeId);
  const itemConsumables = _itemConsumables.map(consumable => itemConsumableSerializer(consumable));

  return res.status(200).send({ count, itemConsumables });
}

module.exports.getById = async (req, res) => {
  const id = req.params.id;
  const { itemConsumable } = await db.itemConsumables.getOne(id);
  const _itemConsumable = itemConsumableSerializer(itemConsumable);

  return res.status(200).send({ itemConsumable: _itemConsumable });
}
