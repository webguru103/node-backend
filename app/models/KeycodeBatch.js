'use strict';
module.exports = (sequelize, DataTypes) => {
  const KeycodeBatch = sequelize.define('KeycodeBatch', {
    batchNumber: DataTypes.STRING
  }, {tableName: "keycodeBatches"});
  KeycodeBatch.associate = function(models) {
    models.KeycodeBatch.hasMany(models.Keycode, {foreignKey: 'keycodeBatchId'})
  };
  return KeycodeBatch;
};