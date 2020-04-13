'use strict';

const db = require('../data-access');
const { speciesTypeSerializer } = require('../serializers');

module.exports.getAll = async (req, res) => {
  const { count, speciesTypes: _speciesTypes } = await db.speciesTypes.getTypes();
  const speciesTypes = _speciesTypes.map(type => speciesTypeSerializer(type));

  return res.status(200).send({ count, speciesTypes });
}

module.exports.getAllByIds = async (req, res) => {
  const ids = req.body.ids;
  const { count, speciesTypes: _speciesTypes } = await db.speciesTypes.getTypesByIds(ids);
  const speciesTypes = _speciesTypes.map(type => speciesTypeSerializer(type));

  return res.status(200).send({ count, speciesTypes });
}

module.exports.getById = async (req, res) => {
  const id = req.params.id;
  const { speciesType: _speciesType } = await db.speciesTypes.getType(id);
  const speciesType = speciesTypeSerializer(_speciesType);

  return res.status(200).send({ speciesType });
}
