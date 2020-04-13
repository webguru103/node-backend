'use strict';
module.exports = (sequelize, DataTypes) => {
  const ItemType = sequelize.define('ItemType', {
    name: DataTypes.STRING,
    superCategoryId: DataTypes.INTEGER,
    itemCategoryId: DataTypes.INTEGER
  }, { tableName: 'itemTypes' });
  ItemType.associate = function(models) {
    // associations can be defined here
  };
  return ItemType;
};