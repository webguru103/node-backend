'use strict';
module.exports = (sequelize, DataTypes) => {
  const ConstructionType = sequelize.define('ConstructionType', {
    name: DataTypes.STRING
  }, { tableName: 'constructionTypes' });
  ConstructionType.associate = function(models) {
    // associations can be defined here
  };
  return ConstructionType;
};