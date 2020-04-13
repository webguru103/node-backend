'use strict';

const db = require('../data-access');

module.exports.getStatus = async (req, res) => {
  const { id } = req.params
  const keycodeBatch = await db.keycodeBatches.getStatus({id})

  return res.status(200).send({keycodeBatch})
}