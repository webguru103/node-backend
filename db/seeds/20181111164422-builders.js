'use strict';

const _ = require('lodash')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    const createdAt = new Date();
    const updatedAt = createdAt;

    const insert = _.times(10, () => {
      return ({
        companyName: faker.company.companyName(),
        companyPhone: faker.phone.phoneNumber(),
        mainContactName: faker.name.findName(),
        mainContactEmail: faker.internet.email(),
        mainContactPhone: faker.phone.phoneNumber(),
        address1: faker.address.streetAddress(),
        address2: faker.address.secondaryAddress(),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        zipCode: faker.address.zipCode(),
        createdAt,
        updatedAt,
      })
    })
    return queryInterface.bulkInsert('builders', insert, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('builders', null, {});
  }
};
