'use strict';
module.exports = (sequelize, DataTypes) => {
  const SheenType = sequelize.define('SheenType', {
    name: DataTypes.STRING
  }, { tableName: 'sheenTypes' });
  SheenType.associate = function(models) {
    // associations can be defined here
  };
  return SheenType;
};