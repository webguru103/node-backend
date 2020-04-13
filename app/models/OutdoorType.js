'use strict';
module.exports = (sequelize, DataTypes) => {
  const OutdoorType = sequelize.define('OutdoorType', {
    name: DataTypes.STRING
  }, { tableName: 'outdoorTypes' });
  OutdoorType.associate = function(models) {
    // associations can be defined here
  };
  return OutdoorType;
};