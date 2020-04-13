'use strict';
module.exports = (sequelize, DataTypes) => {
  const Scan = sequelize.define('Scan', {
    scanType: DataTypes.STRING,
    scanAction: DataTypes.STRING,
    keycodeId: DataTypes.INTEGER,
    deviceId: DataTypes.INTEGER,
  }, { tableName: 'scans' })
  Scan.associate = function(models) {
    models.Scan.belongsTo(models.Device, { foreignKey: 'deviceId', allowNull: true })
    models.Scan.belongsTo(models.Keycode, { foreignKey: 'keycodeId', allowNull: true })
  };
  return Scan;
};