'use strict';

const db = require('../data-access');
const { keycodeSerializer, homeSerializer, communitySerializer,
  builderSerializer, keycodeBatchSerializer } = require('../serializers');

const serialize = (home) => {
  const keycode = home.Keycode
  const keycodeBatch = keycode.KeycodeBatch
  const scans = keycode.Scans
  const community = home.Community
  const builder = home.Builder
  return {
    home: homeSerializer(home),
    keycode: keycodeSerializer(keycode, { totalScans: scans.length }),
    community: communitySerializer(community),
    builder: builderSerializer(builder),
    keycodeBatch: keycodeBatch ? keycodeBatchSerializer(keycodeBatch) : {},
  }
}

module.exports.getAll = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.per) || 10
    const sort = req.query.sort || "id:desc"
    const { count, keycodeHomes: _keycodeHomes } = await db.homes.getHomesWithKeycodes({pageNumber, pageSize, sort})

    const keycodeHomes = _keycodeHomes.map(serialize)

    return res.status(200).send({ count, keycodeHomes })
  } catch(error) {
    res.status(500).send({
      error: `Server Error: ${error}`,
      trace: error.stack,
    })
  }
}
