'use strict';
module.exports = (sequelize, DataTypes) => {
  const ToDosProduct = sequelize.define('ToDosProduct', {
    toDoId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
  }, { tableName: 'toDosProducts' });
  ToDosProduct.associate = function(models) {
    models.ToDosProduct.belongsTo(models.Product, { foreignKey: 'productId', allowNull: true })
    models.ToDosProduct.belongsTo(models.ToDo, { foreignKey: 'toDoId', allowNull: true })
  };
  return ToDosProduct;
};
