'use strict';
module.exports = (sequelize, DataTypes) => {
  const ToDo = sequelize.define('ToDo', {
    leadTime: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
  }, { tableName: 'toDos' });
  ToDo.associate = function(models) {
  };
  return ToDo;
};
