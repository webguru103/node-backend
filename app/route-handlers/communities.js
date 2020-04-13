'use strict';

const db = require('../data-access');
const { errorHandler } = require('../utils')
const { communitySerializer, builderSerializer } = require('../serializers');

module.exports.create = async (req, res) => {
  // console.warn("body", req.body)
  try {
    const { name, crossStreets, city, state, zipCode } = req.body.community;
    console.warn('rh xst.', name, crossStreets, city, state, zipCode)
    const { community: _community, builders: _builders, errors }  = 
      await db.communities.createCommunity({ name, crossStreets, city, state, zipCode })

    if (!errors) {
      const community = communitySerializer(_community)
      const builders = _builders.map(builder => builderSerializer(builder, {}))
      return res.status(201).send({community, builders})
    } else {
      return res.status(422).send({errors})
    }
  } catch (error) {
    errorHandler(error)
    res.status(500).send({ error })
  }
}

module.exports.update = async (req, res) => {
  try {
    const fields = Object.keys(req.body.community)
    const id = parseInt(req.params.id)
    const { name, crossStreets, city, state, zipCode, builderIds } = req.body.community;
    const results = await db.communities.updateCommunity({id, fields, community: {
      name, crossStreets, city, state, zipCode, builderIds
    }})

    if (!results.errors) {
      const { community: _community, builders: _builders } = results
    
      const builders = _builders.map(builder => builderSerializer(builder, {}))
      const community = communitySerializer(_community, { builders })
      return res.status(200).send({community})
    } else {
      const { errors } = results;
      return res.status(422).send({errors})
    }
  } catch (error) {
    errorHandler(error)
    res.status(500).send({ error })
  }
}

module.exports.getAll = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.per) || 10
    const { count, communities: _communities } = await db.communities.getCommunities({ pageNumber, pageSize })

    const __communities = _communities.map(async community => {
      const { homesCount, activatedHomes } = await db.communities.getCommunityMetadata({community})
      const builders = await community.Builders.map(builder => builderSerializer(builder))
      return communitySerializer(community, { homesCount, activatedHomes, builders})
    })
    return Promise.all(__communities).then(communities => {
      res.status(200).send({ count, communities })
    })
  } catch (error) {
    errorHandler(error)
    res.status(500).send({ error })
  }
}

module.exports.getOne = async (req, res) => {
  const id = parseInt(req.params.id)
  const _community = await db.communities.getCommunity({id})

  if (!_community) return res.status(404).send({community: null})

  const community = communitySerializer(_community)

  return res.status(200).send({community})
}
