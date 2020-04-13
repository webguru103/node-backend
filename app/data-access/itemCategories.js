'use strict';

const { ItemCategory } = require('../models');
const { errorHandler } = require('../utils');

module.exports.getCategories = async () => {
  try {
    const itemCategories = await ItemCategory.findAll();
    const count = itemCategories.length;
    return { count, itemCategories };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getCategoriesByIds = async (ids) => {
  try {
    const itemCategories = await ItemCategory.findAll({ where: { id: ids } });
    const count = itemCategories.length;
    return { count, itemCategories };
  } catch (error) {
    console.log(error);
    return null;
  }
};
