'use strict';
module.exports = (sequelize, DataTypes) => {
  const ColorFinishes = sequelize.define('ColorFinish', {
    name: DataTypes.STRING,
    itemCategoryId: DataTypes.INTEGER
  }, { tableName: 'colorFinishes' });
  ColorFinishes.associate = function(models) {
    // associations can be defined here
  };
  return ColorFinishes;
};