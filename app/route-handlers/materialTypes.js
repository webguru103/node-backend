'use strict';

const db = require('../data-access');
const { materialTypeSerializer } = require('../serializers');

module.exports.getAll = async (req, res) => {
  const { count, materialTypes: _materialTypes } = await db.materialTypes.getTypes();
  const materialTypes = _materialTypes.map(type => materialTypeSerializer(type));

  return res.status(200).send({ count, materialTypes });
}

module.exports.getAllByIds = async (req, res) => {
  const ids = req.body.ids;
  const { count, materialTypes: _materialTypes } = await db.materialTypes.getTypesByIds(ids);
  const materialTypes = _materialTypes.map(type => materialTypeSerializer(type));

  return res.status(200).send({ count, materialTypes });
}

module.exports.getAllByItemType = async (req, res) => {
  const itemTypeId = req.query.itemType;
  const { count, materialTypes: _materialTypes } = await db.materialTypes.getTypesByItemType(itemTypeId);
  const materialTypes = _materialTypes.map(type => materialTypeSerializer(type));

  return res.status(200).send({ count, materialTypes });
}

module.exports.getById = async (req, res) => {
  const id = req.params.id;
  const { materialType: _materialType } = await db.materialTypes.getType(id);
  const materialType = materialTypeSerializer(_materialType);

  return res.status(200).send({ materialType });
}
