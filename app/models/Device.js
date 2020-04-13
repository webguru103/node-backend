'use strict';
module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define('Device', {
    appVersion: DataTypes.STRING,
    appType: DataTypes.STRING,
    deviceOS: DataTypes.STRING,
    deviceType: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  }, { tableName: 'devices' })
  Device.associate = (models) => {
    models.Device.belongsTo(models.User, { foreignKey: 'userId', allowNull: true })
    models.Device.hasMany(models.Scan, { foreignKey: 'deviceId' })
  };
  return Device;
};