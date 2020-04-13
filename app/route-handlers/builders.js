'use strict';

const db = require('../data-access');
const { builderSerializer, communitySerializer } = require('../serializers');
const { Home, Keycode } = require('../models');
const { errorHandler } = require('../utils')

module.exports.create = async (req, res) => {
  const {
    companyName, companyPhone, mainContactName, mainContactEmail, mainContactPhone,
    address1, address2, city, state, zipCode, communityIds
  } = req.body.builder
  const { builder: _builder, communities: _communities, errors } = await db.builders.createBuilder({
    companyName, companyPhone, mainContactName, mainContactEmail, mainContactPhone,
    address1, address2, city, state, zipCode, communityIds
  })
  if (!errors) {
    const builder = builderSerializer(_builder, {communityIds})
    const communities = _communities.map(community => communitySerializer(community, {}))

    return res.status(201).send({builder, communities})
  } else {
    return res.status(422).send({errors})
  }
}

module.exports.update = async (req, res) => {
  const fields = Object.keys(req.body.builder)
  const id = parseInt(req.params.id)
  const {
    companyName, companyPhone, mainContactName, mainContactEmail, mainContactPhone,
    address1, address2, city, state, zipCode, communityIds
  } = req.body.builder;
  const { builder: _builder, communities: _communities, errors } = await db.builders.updateBuilder({id, fields, builder: {
    companyName, companyPhone, mainContactName, mainContactEmail, mainContactPhone,
    address1, address2, city, state, zipCode, communityIds
  }})
  
  if (!errors) {
    const builder = builderSerializer(_builder, {communityIds})
    const communities = _communities.map(community => communitySerializer(community, {}))
    return res.status(200).send({builder, communities})
  } else {
    return res.status(422).send({errors})
  }
}

module.exports.getAll = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.per) || 10
    const sort = req.query.sort || 'id:desc'
    const { count, builders: _builders } = await db.builders.getBuilders({ pageNumber, pageSize, sort })

    const __builders = _builders.map(async builder => {
      const { homesCount, activatedHomes} = await db.builders.getBuilderMetadata({builder})
      const communities = await builder.Communities.map(community => communitySerializer(community))
      return builderSerializer(builder, { homesCount, activatedHomes, communities })
    })

    return Promise.all(__builders).then(builders => {
      res.status(200).send({ count, builders })
    })
  } catch (error) {
    errorHandler(error)
    res.status(500).send({ error })
  }
}

module.exports.getOne = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const _builder = await db.builders.getBuilder({id})

    if (!_builder) return res.status(404).send({builder: null})

    const builder = builderSerializer(_builder)

    return res.status(200).send({builder})
  } catch (error) {
    errorHandler(error)
    res.status(500).send({ error })
  }
}
