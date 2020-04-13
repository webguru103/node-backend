'use strict';

const db = require('../data-access');
const { colorFinishSerializer } = require('../serializers');

module.exports.getAll = async (req, res) => {
  const { count, colorFinishes: _colorFinishes } = await db.colorFinishes.getAll();
  const colorFinishes = _colorFinishes.map(type => colorFinishSerializer(type));

  return res.status(200).send({ count, colorFinishes });
}

module.exports.getAllByIds = async (req, res) => {
  const ids = req.body.ids;
  const { count, colorFinishes: _colorFinishes } = await db.colorFinishes.getAllByIds(ids);
  const colorFinishes = _colorFinishes.map(type => colorFinishSerializer(type));

  return res.status(200).send({ count, colorFinishes });
}

module.exports.getAllByItemType = async (req, res) => {
  const itemTypeId = req.query.itemType;
  const { count, colorFinishes: _colorFinishes } = await db.colorFinishes.getAllByItemType(itemTypeId);
  const colorFinishes = _colorFinishes.map(type => colorFinishSerializer(type));

  return res.status(200).send({ count, colorFinishes });
}

module.exports.getAllByType = async (req, res) => {
  const itemTypeId = req.query.itemType;
  const { count, colorFinishes: _colorFinishes } = await db.colorFinishes.getAllByType(itemTypeId);
  const colorFinishes = _colorFinishes.map(type => colorFinishSerializer(type));

  return res.status(200).send({ count, colorFinishes });
}

module.exports.getById = async (req, res) => {
  const id = req.params.id;
  const { colorFinish } = await db.colorFinishes.get(id);
  const colorfinish = colorFinishSerializer(colorFinish);

  return res.status(200).send({ colorfinish });
}
