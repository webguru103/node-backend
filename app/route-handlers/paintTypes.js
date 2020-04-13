'use strict';

const db = require('../data-access');
const { paintTypeSerializer } = require('../serializers');

module.exports.getAll = async (req, res) => {
  const { count, paintTypes: _paintTypes } = await db.paintTypes.getTypes();
  const paintTypes = _paintTypes.map(type => paintTypeSerializer(type));

  return res.status(200).send({ count, paintTypes });
}

module.exports.getAllByIds = async (req, res) => {
  const ids = req.body.ids;
  const { count, paintTypes: _paintTypes } = await db.paintTypes.getTypesByIds(ids);
  const paintTypes = _paintTypes.map(type => paintTypeSerializer(type));

  return res.status(200).send({ count, paintTypes });
}

module.exports.getById = async (req, res) => {
  const id = req.params.id;
  const { paintType: _paintType } = await db.paintTypes.getType(id);
  const paintType = paintTypeSerializer(_paintType);

  return res.status(200).send({ paintType });
}
