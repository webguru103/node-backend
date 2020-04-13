'use strict';

const _ = require('lodash');
const faker = require('faker');
const {Builder, Community} = require('../../app/models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const builders = await Builder.findAll()
    const communities = await Community.findAll()
    const createdAt = new Date();
    const updatedAt = createdAt;

    const insert = communities.map(community => {
      return {
        createdAt,
        updatedAt,
        communityId: community.id,
        builderId: _.sample(builders).id
      }
    })

    return queryInterface.bulkInsert('community_builders', insert, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('community_builders', null, {});
  }
};
