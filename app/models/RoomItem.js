'use strict';
module.exports = (sequelize, DataTypes) => {
  const RoomItem = sequelize.define('RoomItem', {
    itemId: DataTypes.INTEGER,
    roomId: DataTypes.INTEGER
  }, { tableName: 'roomItems' });
  RoomItem.associate = function(models) {
    // associations can be defined here
  };
  return RoomItem;
};