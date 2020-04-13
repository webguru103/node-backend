'use strict';
module.exports = (sequelize, DataTypes) => {
  const CarpetType = sequelize.define('CarpetType', {
    name: DataTypes.STRING
  }, { tableName: 'carpetTypes' });
  CarpetType.associate = function(models) {
    // associations can be defined here
  };
  return CarpetType;
};