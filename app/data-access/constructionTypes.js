'use strict';

const { ConstructionType } = require('../models');
const { errorHandler } = require('../utils');

module.exports.getTypes = async () => {
  try {
    const constructionTypes = await ConstructionType.findAll();
    const count = constructionTypes.length;
    return { count, constructionTypes };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getTypesByIds = async (ids) => {
  try {
    const constructionTypes = await ConstructionType.findAll({ where: { id: ids } });
    const count = constructionTypes.length;
    return { count, constructionTypes };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getType = async (id) => {
  try {
    const constructionType = await ConstructionType.findById(id);
    return { constructionType };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.createType = async ({ name }) => {
  try {
    const constructionType = await ConstructionType.create({ name });
    return { constructionType };
  } catch (error) {
    console.log(error);
    return null;
  }
}
