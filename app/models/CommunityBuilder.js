'use strict';

module.exports = (sequelize, Sequelize) => {
  const CommunityBuilder = sequelize.define(
    'CommunityBuilder',
    {},
    { tableName: 'communityBuilders' });

  CommunityBuilder.associate = (models) => {
    models.CommunityBuilder.belongsTo(models.Community, { foreignKey: 'communityId' })
    models.CommunityBuilder.belongsTo(models.Builder, { foreignKey: 'builderId' })
  };

  return CommunityBuilder
}
