'use strict';

const db = require('../data-access');

module.exports.getPaints = async (req, res) => {
  const homeId = req.query.home;
  const { paintitems } = await db.paints.getItemsByHome(homeId);

  return res.status(200).send({ paintitems });
}
