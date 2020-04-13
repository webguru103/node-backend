'use strict';
module.exports = (sequelize, DataTypes) => {
  const RoomType = sequelize.define('RoomType', {
    name: DataTypes.STRING
  }, { tableName: 'roomTypes' });
  RoomType.associate = function(models) {
    // associations can be defined here
  };
  return RoomType;
};