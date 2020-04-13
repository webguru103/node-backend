'use strict';
module.exports = (sequelize, DataTypes) => {
  const SuperCategory = sequelize.define('SuperCategory', {
    name: DataTypes.STRING
  }, { tableName: 'superCategories' });
  SuperCategory.associate = function(models) {
    // associations can be defined here
  };
  return SuperCategory;
};