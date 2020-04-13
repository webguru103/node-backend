'use strict';

const _ = require('lodash')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    const createdAt = new Date()
    const updatedAt = createdAt

    const insert = _.times(30, () => {
      return ({
        name: faker.company.companyName(),
        crossStreets: [faker.address.streetName(), faker.address.streetName()].join(' & '),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        zipCode: faker.address.zipCode(),
        createdAt,
        updatedAt,
      })
    });

    return queryInterface.bulkInsert('communities', insert, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('communities', null, {});
  }
};
