'use strict';
module.exports = (sequelize, DataTypes) => {
  const ItemConsumable = sequelize.define('ItemConsumable', {
    name: DataTypes.STRING,
    itemTypeId: DataTypes.INTEGER
  }, { tableName: 'itemConsumables' });
  ItemConsumable.associate = function(models) {
    // associations can be defined here
  };
  return ItemConsumable;
};