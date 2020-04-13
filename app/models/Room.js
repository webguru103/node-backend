'use strict';
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    name: DataTypes.STRING,
    homeId: DataTypes.INTEGER,
    roomTypeId: DataTypes.INTEGER,
    level: DataTypes.STRING,
    width: DataTypes.STRING,
    height: DataTypes.STRING,
    squareFeet: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING
  }, { tableName: 'rooms' });
  Room.associate = function(models) {
    // associations can be defined here
  };
  return Room;
};