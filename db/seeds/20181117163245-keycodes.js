'use strict';

const _ = require('lodash')
const moment = require('moment')
const {KeycodeBatch} = require('../../app/models');

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const keycodeBatch = await KeycodeBatch.create({
      batchNumber: '000000-00',
    })

    const daysAgo = _.times(30)
    const createdAt = moment().subtract(_.sample(daysAgo), 'days').format()
    const updatedAt = createdAt

    const insert = _.times(500, () => {
      const status = _.sample([
        'blank', 'unassigned', 'assigned', 'ready_to_ship', 'installed', 'activated'
      ])
      let unassignedAt; let assignedAt; let installedAt; let activatedAt; let readyToShipAt;
      switch (status) {
        case 'blank':
          break;
        case 'unassigned':
          unassignedAt = _.sample([
            moment().subtract(_.sample(daysAgo), 'days').format(),
            null
          ])
          break;
        case 'assigned':
          assignedAt = moment().subtract(_.sample(daysAgo), 'days').format()
          break;
        case 'ready_to_ship':
          assignedAt = moment().subtract(_.sample(daysAgo), 'days').format()
          readyToShipAt = moment().subtract(_.sample(daysAgo), 'days').format()
          break;
        case 'installed':
          assignedAt = moment().subtract(_.sample(daysAgo), 'days').format()
          readyToShipAt = moment().subtract(_.sample(daysAgo), 'days').format()
          installedAt = moment().subtract(_.sample(daysAgo), 'days').format()
          break;
        case 'activated':
          assignedAt = moment().subtract(_.sample(daysAgo), 'days').format()
          readyToShipAt = moment().subtract(_.sample(daysAgo), 'days').format()
          installedAt = moment().subtract(_.sample(daysAgo), 'days').format()
          activatedAt = moment().subtract(_.sample(daysAgo), 'days').format()
          break;
        default:
          break;
      }
      return {
        keycodeBatchId: keycodeBatch.id,
        unassignedAt,
        assignedAt,
        installedAt,
        activatedAt,
        readyToShipAt,
        status,
        createdAt,
        updatedAt,
      }
    })

    return queryInterface.bulkInsert('keycodes', insert, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('keycodes', null, {})
      .then(() => queryInterface.bulkDelete('keycode_batches', null, {}));
  }
};
