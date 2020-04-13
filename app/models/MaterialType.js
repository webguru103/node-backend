'use strict';
module.exports = (sequelize, DataTypes) => {
  const MaterialType = sequelize.define('MaterialType', {
    name: DataTypes.STRING,
    itemCategoryId: DataTypes.INTEGER
  }, { tableName: 'materialTypes' });
  MaterialType.associate = function(models) {
    // associations can be defined here
  };
  return MaterialType;
};