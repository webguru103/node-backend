'use strict';

const db = require('../data-access');
const { systemTypeSerializer } = require('../serializers');

module.exports.getAll = async (req, res) => {
  const { count, systemTypes: _systemTypes } = await db.systemTypes.getSystemTypes();
  const systemTypes = _systemTypes.map(roomType => systemTypeSerializer(roomType));

  return res.status(200).send({ count, systemTypes });
}

module.exports.getAllByIds = async (req, res) => {
  const ids = req.body.ids;
  const { count, systemTypes: _systemTypes } = await db.systemTypes.getSystemTypesByIds(ids);
  const systemTypes = _systemTypes.map(systemtype => systemTypeSerializer(systemtype));

  return res.status(200).send({ count, systemTypes });
}
