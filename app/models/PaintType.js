'use strict';
module.exports = (sequelize, DataTypes) => {
  const PaintType = sequelize.define('PaintType', {
    name: DataTypes.STRING
  }, { tableName: 'paintTypes' });
  PaintType.associate = function(models) {
    // associations can be defined here
  };
  return PaintType;
};