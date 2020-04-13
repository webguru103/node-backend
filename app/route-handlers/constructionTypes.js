'use strict';

const db = require('../data-access');
const { constructionTypeSerializer } = require('../serializers');

module.exports.getAll = async (req, res) => {
  const { count, constructionTypes: _constructionTypes } = await db.constructionTypes.getTypes();
  const constructionTypes = _constructionTypes.map(type => constructionTypeSerializer(type));

  return res.status(200).send({ count, constructionTypes });
}

module.exports.getAllByIds = async (req, res) => {
  const ids = req.body.ids;
  const { count, constructionTypes: _constructionTypes } = await db.constructionTypes.getTypesByIds(ids);
  const constructionTypes = _constructionTypes.map(type => constructionTypeSerializer(type));

  return res.status(200).send({ count, constructionTypes });
}

module.exports.getById = async (req, res) => {
  const id = req.params.id;
  const { constructionType: _constructionType } = await db.constructionTypes.getType(id);
  const constructionType = constructionTypeSerializer(_constructionType);

  return res.status(200).send({ constructionType });
}
