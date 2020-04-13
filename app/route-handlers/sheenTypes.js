'use strict';

const db = require('../data-access');
const { sheenTypeSerializer } = require('../serializers');

module.exports.getAll = async (req, res) => {
  const { count, sheenTypes: _sheenTypes } = await db.sheenTypes.getTypes();
  const sheenTypes = _sheenTypes.map(type => sheenTypeSerializer(type));

  return res.status(200).send({ count, sheenTypes });
}

module.exports.getAllByIds = async (req, res) => {
  const ids = req.body.ids;
  const { count, sheenTypes: _sheenTypes } = await db.sheenTypes.getTypesByIds(ids);
  const sheenTypes = _sheenTypes.map(type => sheenTypeSerializer(type));

  return res.status(200).send({ count, sheenTypes });
}

module.exports.getById = async (req, res) => {
  const id = req.params.id;
  const { sheenType: _sheenType } = await db.sheenTypes.getType(id);
  const sheenType = sheenTypeSerializer(_sheenType);

  return res.status(200).send({ sheenType });
}
