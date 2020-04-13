'use strict';

const db = require('../data-access');
const { outdoorTypeSerializer } = require('../serializers');

module.exports.getAll = async (req, res) => {
  const { count, outdoorTypes: _outdoorTypes } = await db.outdoorTypes.getOutdoorTypes();
  const outdoorTypes = _outdoorTypes.map(outdoorType => outdoorTypeSerializer(outdoorType));

  return res.status(200).send({ count, outdoorTypes });
}

module.exports.getAllByIds = async (req, res) => {
  const ids = req.body.ids;
  const { count, outdoorTypes: _outdoorTypes } = await db.outdoorTypes.getOutdoorTypesByIds(ids);
  const outdoorTypes = _outdoorTypes.map(outdoorType => outdoorTypeSerializer(outdoorType));

  return res.status(200).send({ count, outdoorTypes });
}
