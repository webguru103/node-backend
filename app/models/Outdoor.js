'use strict';
module.exports = (sequelize, DataTypes) => {
  const Outdoor = sequelize.define('Outdoor', {
    name: DataTypes.STRING,
    outdoorTypeId: DataTypes.INTEGER,
    homeId: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING
  }, { tableName: 'outdoors' });
  Outdoor.associate = function(models) {
    // associations can be defined here
  };
  return Outdoor;
};