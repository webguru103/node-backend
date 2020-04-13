'use strict';
module.exports = (sequelize, DataTypes) => {
  const ColorFamily = sequelize.define('ColorFamily', {
    name: DataTypes.STRING,
    itemCategoryId: DataTypes.INTEGER
  }, { tableName: 'colorFamilies' });
  ColorFamily.associate = function(models) {
    // associations can be defined here
  };
  return ColorFamily;
};