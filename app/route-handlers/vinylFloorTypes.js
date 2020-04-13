'use strict';

const db = require('../data-access');
const { vinylFloorTypeSerializer } = require('../serializers');

module.exports.getAll = async (req, res) => {
  const { count, floorTypes: _floortypes } = await db.vinylFloorTypes.getTypes();
  const floortypes = _floortypes.map(type => vinylFloorTypeSerializer(type));

  return res.status(200).send({ count, floortypes });
}

module.exports.getAllByIds = async (req, res) => {
  const ids = req.body.ids;
  const { count, floorTypes: _floortypes } = await db.vinylFloorTypes.getTypesByIds(ids);
  const floortypes = _floortypes.map(type => vinylFloorTypeSerializer(type));

  return res.status(200).send({ count, floortypes });
}

module.exports.getById = async (req, res) => {
  const id = req.params.id;
  const { floorType: _floortype } = await db.vinylFloorTypes.getType(id);
  const floortype = vinylFloorTypeSerializer(_floortype);

  return res.status(200).send({ floortype });
}
