'use strict';

const db = require('../data-access');
const { superCategorySerializer } = require('../serializers');

module.exports.getAll = async (req, res) => {
  const { count, superCategories: _superCategories } = await db.superCategories.getCategories();
  const superCategories = _superCategories.map(category => superCategorySerializer(category));

  return res.status(200).send({ count, superCategories });
}

module.exports.getAllByIds = async (req, res) => {
  const ids = req.body.ids;
  const { count, superCategories: _superCategories } = await db.superCategories.getCategoriesByIds(ids);
  const superCategories = _superCategories.map(category => superCategorySerializer(category));

  return res.status(200).send({ count, superCategories });
}
