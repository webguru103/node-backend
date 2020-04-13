'use strict';
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    name: DataTypes.STRING,
    brand: DataTypes.STRING,
    collection: DataTypes.STRING,
    model: DataTypes.STRING,
    modelNumber: DataTypes.STRING,
    colorCode: DataTypes.STRING,
    serialNumber: DataTypes.STRING,
    length: DataTypes.STRING,
    width: DataTypes.STRING,
    height: DataTypes.STRING,
    ownersManualUrl: DataTypes.STRING,
    energyGuideUrl: DataTypes.STRING,
    warrantyUrl: DataTypes.STRING,
    itemTypeId: DataTypes.INTEGER,
    colorFamilyId: DataTypes.INTEGER,
    colorMfg: DataTypes.STRING,
    colorSwatchUrl: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    size: DataTypes.STRING,
    materialTypeId: DataTypes.INTEGER,
    carpetTypeId: DataTypes.INTEGER,
    vinylFloorTypeId: DataTypes.INTEGER,
    colorFinishId: DataTypes.INTEGER,
    paintTypeId: DataTypes.INTEGER,
    sheenTypeId: DataTypes.INTEGER,
    constructionTypeId: DataTypes.INTEGER,
    speciesTypeId: DataTypes.INTEGER,
    groutColor: DataTypes.INTEGER
  }, { tableName: 'items' });
  Item.associate = function(models) {
    // associations can be defined here
    models.Item.belongsTo(models.ItemType, { foreignKey: 'itemTypeId', allowNull: true })
  };
  return Item;
};