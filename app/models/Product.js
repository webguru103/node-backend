'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    itemId: DataTypes.INTEGER,
    amazonSKU: DataTypes.STRING,
    grouping: DataTypes.STRING,
    priority: DataTypes.INTEGER,
  }, { tableName: 'products' });
  Product.associate = function(models) {
    models.Product.belongsTo(models.Item, { foreignKey: 'itemId', allowNull: true })
  };
  return Product;
};
