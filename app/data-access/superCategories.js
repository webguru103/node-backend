'use strict';

const { SuperCategory } = require('../models');
const { errorHandler } = require('../utils');

module.exports.getCategories = async () => {
  try {
    const superCategories = await SuperCategory.findAll();
    const count = superCategories.length;
    return { count, superCategories };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getCategoriesByIds = async (ids) => {
  try {
    const superCategories = await SuperCategory.findAll({ where: { id: ids } });
    const count = superCategories.length;
    return { count, superCategories };
  } catch (error) {
    console.log(error);
    return null;
  }
};
