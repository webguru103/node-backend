'use strict';

const db = require('../data-access');
const { itemCategorySerializer } = require('../serializers');

module.exports.getAll = async (req, res) => {
  const { count, itemCategories: _itemCategories } = await db.itemCategories.getCategories();
  const itemCategories = _itemCategories.map(category => itemCategorySerializer(category));

  return res.status(200).send({ count, itemCategories });
}

module.exports.getAllByIds = async (req, res) => {
  const ids = req.body.ids;
  const { count, itemCategories: _itemCategories } = await db.itemCategories.getCategoriesByIds(ids);
  const itemCategories = _itemCategories.map(category => itemCategorySerializer(category));

  return res.status(200).send({ count, itemCategories });
}

module.exports.getAllByType = async (req, res) => {
  const type = req.query.type;
  const { count, itemCategories: _itemCategories } = await db.itemCategories.getCategories();
  const itemCategories = _itemCategories.map(category => itemCategorySerializer(category));
  let categoriesByType = [];
  if (type === 'rooms' || type === 'outdoors') {
    categoriesByType = [
      "Appliances", "Lighting/Electric", "Plumbing Fixtures", "Plumbing", "Cabinets",
      "Countertops", "Doors", "Windows", "Pool and Spa"
    ];
  } else if (type === 'homeSystems') {
    categoriesByType = [
      "HVAC", "Water", "Security", "Fire", "Entertainment", "Solar"
    ];
  } else {
    categoriesByType = [
      "Appliances", "Lighting/Electric", "Plumbing Fixtures", "Plumbing", "Cabinets",
      "Countertops", "Doors", "Windows", "Pool and Spa",
      "HVAC", "Water", "Security", "Fire", "Entertainment", "Solar"
    ];
  }
  const filteredCategories = itemCategories.filter(category => categoriesByType.includes(category.name));

  return res.status(200).send({ count, itemCategories: filteredCategories });
}
