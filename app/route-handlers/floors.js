'use strict';

const db = require('../data-access');

module.exports.getFloors = async (req, res) => {
  const homeId = req.query.home;
  const { floorItems } = await db.floors.getItemsByHome(homeId);

  return res.status(200).send({ floorItems });
}

module.exports.getFloorTypes = async (req, res) => {
  const { mainCategories, subCategories } = await db.floors.getFloorTypes();
  
  return res.status(200).send({ mainCategories, subCategories });
}
