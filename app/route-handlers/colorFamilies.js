'use strict';

const db = require('../data-access');
const { colorFamilySerializer } = require('../serializers');

module.exports.getAll = async (req, res) => {
  const { count, colorFamilies: _colorFamilies } = await db.colorFamilies.getAll();
  const colorFamilies = _colorFamilies.map(type => colorFamilySerializer(type));

  return res.status(200).send({ count, colorFamilies });
}

module.exports.getAllByIds = async (req, res) => {
  const ids = req.body.ids;
  const { count, colorFamilies: _colorFamilies } = await db.colorFamilies.getAllByIds(ids);
  const colorFamilies = _colorFamilies.map(type => colorFamilySerializer(type));

  return res.status(200).send({ count, colorFamilies });
}

module.exports.getAllByItemType = async (req, res) => {
  const itemTypeId = req.query.itemType;
  const { count, colorFamilies: _colorFamilies } = await db.colorFamilies.getAllByItemType(itemTypeId);
  const colorFamilies = _colorFamilies.map(type => colorFamilySerializer(type));

  return res.status(200).send({ count, colorFamilies });
}

module.exports.getAllByType = async (req, res) => {
  const itemTypeId = req.query.itemType;
  const { count, colorFamilies: _colorFamilies } = await db.colorFamilies.getAllByType(itemTypeId);
  const colorFamilies = _colorFamilies.map(type => colorFamilySerializer(type));

  return res.status(200).send({ count, colorFamilies });
}

module.exports.getById = async (req, res) => {
  const id = req.params.id;
  const { colorFamily } = await db.colorFamilies.get(id);
  const colorfamily = colorFamilySerializer(colorFamily);

  return res.status(200).send({ colorfamily });
}
