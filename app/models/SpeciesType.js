'use strict';
module.exports = (sequelize, DataTypes) => {
  const SpeciesType = sequelize.define('SpeciesType', {
    name: DataTypes.STRING
  }, { tableName: 'speciesTypes' });
  SpeciesType.associate = function(models) {
    // associations can be defined here
  };
  return SpeciesType;
};