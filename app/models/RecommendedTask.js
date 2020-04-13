'use strict';
module.exports = (sequelize, DataTypes) => {
  const RecommendedTask = sequelize.define('RecommendedTask', {
    itemId: DataTypes.INTEGER,
    numberOfUnits: DataTypes.INTEGER,
    unitOfTime: DataTypes.INTEGER,
    toDoId: DataTypes.INTEGER,
  }, { tableName: 'recommendedTasks' });
  RecommendedTask.associate = function(models) {
    models.RecommendedTask.belongsTo(models.Item, { foreignKey: 'itemId', allowNull: true })
    models.RecommendedTask.belongsTo(models.ToDo, { foreignKey: 'toDoId', allowNull: true })
  };
  return RecommendedTask;
};
