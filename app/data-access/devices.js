'use strict';

const {Device} = require('../models');

module.exports.findByUserId = (userId) => new Promise((resolve, reject) => {
  Device.findOne({where: {userId}}).then(device => {
    if (!device) reject({error: `Device with userId: ${userId} not found`});
    else resolve(device);
  })
});
