'use strict';
module.exports = (sequelize, DataTypes) => {
  const VinylFloorType = sequelize.define('VinylFloorType', {
    name: DataTypes.STRING
  }, { tableName: 'vinylFloorTypes' });
  VinylFloorType.associate = function(models) {
    // associations can be defined here
  };
  return VinylFloorType;
};