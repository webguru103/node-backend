'use strict';

const db = require('../data-access');
const { homeSerializer, builderSerializer } = require('../serializers');

const serialize = (home) => {
  const builder = home.Builder
  return {
    home: homeSerializer(home),
    builder: builderSerializer(builder)
  }
}

module.exports.getAll = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.per) || 10
    const sort = req.query.sort || "id:desc"
    const { count, homes: _homes } = await db.homes.getQueuedHomes({pageNumber, pageSize, sort})
    const homes = _homes.map(serialize)

    return res.status(200).send({ count, homes })
  } catch(error) {
    res.status(500).send({
      error: `Server Error: ${error}`,
      trace: error.stack,
    })
  }
}
