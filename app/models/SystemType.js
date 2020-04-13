'use strict';
module.exports = (sequelize, DataTypes) => {
  const SystemType = sequelize.define('SystemType', {
    name: DataTypes.STRING
  }, { tableName: 'systemTypes' });
  SystemType.associate = function(models) {
    // associations can be defined here
  };
  return SystemType;
};