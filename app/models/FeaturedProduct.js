'use strict';
module.exports = (sequelize, DataTypes) => {
  const FeaturedProduct = sequelize.define('FeaturedProduct', {
    type: DataTypes.STRING,
    featuredProductListId: DataTypes.INTEGER,
    snippetBackgroundUrl: DataTypes.STRING,
    snippetButtonText: DataTypes.STRING,
    htmlContent: DataTypes.STRING,
  }, { tableName: 'featuredProducts' });
  FeaturedProduct.associate = function(models) {
  };
  return FeaturedProduct;
};
