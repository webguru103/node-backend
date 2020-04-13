'use strict';
module.exports = (sequelize, DataTypes) => {
  const FeaturedProductList = sequelize.define('FeaturedProductList', {
    featuredProductId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER
  }, { tableName: 'featuredProductLists' });
  FeaturedProductList.associate = function(models) {
    models.FeaturedProductList.belongsTo(models.Product, { foreignKey: 'productId', allowNull: true })
  };
  return FeaturedProductList;
};
