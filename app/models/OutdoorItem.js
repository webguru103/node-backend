'use strict';
module.exports = (sequelize, DataTypes) => {
  const OutdoorItem = sequelize.define('OutdoorItem', {
    itemId: DataTypes.INTEGER,
    outdoorId: DataTypes.INTEGER
  }, { tableName: 'outdoorItems' });
  OutdoorItem.associate = function(models) {
    // associations can be defined here
  };
  return OutdoorItem;
};