'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeSystem = sequelize.define('HomeSystem', {
    name: DataTypes.STRING,
    homeId: DataTypes.INTEGER,
    systemTypeId: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING
  }, { tableName: 'homeSystems' });
  HomeSystem.associate = function(models) {
    // associations can be defined here
  };
  return HomeSystem;
};