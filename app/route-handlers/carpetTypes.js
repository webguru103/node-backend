'use strict';

const db = require('../data-access');
const { carpetTypeSerializer } = require('../serializers');

module.exports.getAll = async (req, res) => {
  const { count, carpetTypes: _carpetTypes } = await db.carpetTypes.getTypes();
  const carpetTypes = _carpetTypes.map(type => carpetTypeSerializer(type));

  return res.status(200).send({ count, carpetTypes });
}

module.exports.getAllByIds = async (req, res) => {
  const ids = req.body.ids;
  const { count, carpetTypes: _carpetTypes } = await db.carpetTypes.getTypesByIds(ids);
  const carpetTypes = _carpetTypes.map(type => carpetTypeSerializer(type));

  return res.status(200).send({ count, carpetTypes });
}

module.exports.getById = async (req, res) => {
  const id = req.params.id;
  const { carpetType: _carpetType } = await db.carpetTypes.getType(id);
  const carpetType = carpetTypeSerializer(_carpetType);

  return res.status(200).send({ carpetType });
}
