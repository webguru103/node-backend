'use strict';
module.exports = (sequelize, DataTypes) => {
  const ItemCategory = sequelize.define('ItemCategory', {
    name: DataTypes.STRING
  }, { tableName: 'itemCategories' });
  ItemCategory.associate = function(models) {
    // associations can be defined here
  };
  return ItemCategory;
};