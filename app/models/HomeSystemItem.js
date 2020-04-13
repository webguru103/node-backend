'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeSystemItem = sequelize.define('HomeSystemItem', {
    itemId: DataTypes.INTEGER,
    homeSystemId: DataTypes.INTEGER
  }, { tableName: 'homeSystemItems' });
  HomeSystemItem.associate = function(models) {
    // associations can be defined here
  };
  return HomeSystemItem;
};