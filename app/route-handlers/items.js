'use strict';

const db = require('../data-access');
const { itemSerializer } = require('../serializers');

module.exports.getAll = async (req, res) => {
  const { count, items } = await db.items.getItems();
  const _items = items.map(item => itemSerializer(item));

  return res.status(200).send({ count, items: _items });
}

module.exports.getAllByType = async (req, res) => {
  const _itemTypeId = req.query.itemTypeId;
  const { count, items } = await db.items.getItemsByType(_itemTypeId);
  const _items = items.map(item => itemSerializer(item));

  return res.status(200).send({ count, items: _items });
}

module.exports.getById = async (req, res) => {
  const id = req.params.id;
  const { item } = await db.items.getItem(id);
  const _item = itemSerializer(item);

  return res.status(200).send({ item: _item });
}

module.exports.create = async (req, res) => {
  const _item = req.body.item;
  const { item, category, itemType } = await db.items.createItem(_item);
  return res.status(200).send({ item: itemSerializer(item), category, itemType });
}

module.exports.update = async (req, res) => {
  const _item = req.body.item;
  const id = req.params.id;
  const { item, category, itemType } = await db.items.updateItem({ id, item: _item });
  return res.status(200).send({ item: itemSerializer(item), category, itemType });
}

module.exports.delete = async (req, res) => {
  const id = req.params.id;
  const { message } = await db.items.deleteItem(id);
  return res.status(200).send({ message });
}
