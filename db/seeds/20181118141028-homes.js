'use strict';

const _ = require('lodash');
const faker = require('faker');
const {Builder, Community, Keycode} = require('../../app/models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const createdAt = new Date();
    const updatedAt = createdAt;
    const keycodes = await Keycode.findAll({
      where: {
        status: { [Sequelize.Op.in]: ['assigned', 'ready_to_ship', 'installed', 'activated'] }
      }
    })
    const builders = await Builder.findAll()
    const communities = await Community.findAll()
    const homeTypes = [
      "apartment", "condo", "duplex", "townhome", "loft", "single_family", "modular", "mobile"
    ]

    const insert = _.times(500, () => {
      const keycode = _.sample(_.times(20).map(() => null).concat(keycodes))
      const keycodeId = keycode && keycode.id
      return ({
        address1: faker.address.streetAddress(),
        address2: faker.address.secondaryAddress(),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        zipCode: faker.address.zipCode(),
        builderId: _.sample(builders).id,
        communityId: _.sample(communities).id,
        homeType: _.sample(homeTypes),
        // keycodeId,
        createdAt,
        updatedAt,
      })
    })

    return queryInterface.bulkInsert('homes', insert, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('homes', null, {});
  }
};
