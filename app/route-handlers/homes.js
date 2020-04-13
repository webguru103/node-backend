'use strict';

const R = require('ramda')
const db = require('../data-access');
const { homeSerializer, builderSerializer, communitySerializer } = require('../serializers');
const { errorHandler } = require('../utils');

module.exports.create = async (req, res) => {
  const { home: __home, homes: __homes } = req.body
  if (__home) {
    const { address1, address2, city, state, zipCode, communityId,
      builderId, homeType } = __home;
    const _home = await db.homes.createHome({
      address1,
      address2,
      city,
      state,
      zipCode,
      communityId,
      builderId,
      homeType
    })

    if (!_home.errors) {
      const home = homeSerializer(_home)
      return res.status(201).send({home})
    } else {
      const { errors } = _home;
      return res.status(422).send({errors})
    }
  } else if (__homes) {
    const _homes = await db.homes.createHomes({homes: __homes})
    const errorsExist = R.any(home => !!home.errors)(_homes)
    if (!errorsExist) {
      const homes = _homes.map(home => homeSerializer(home))
      return res.status(201).send({homes})
    } else {
      return res.status(422).send({homes: _homes})
    }
  }
}

module.exports.update = async (req, res) => {
  const fields = Object.keys(req.body.home)
  const id = parseInt(req.params.id)
  const {
    address1,
    address2,
    city,
    state,
    zipCode,
    communityId,
    builderId,
    homeType,
    keycodeId,
    beds,
    baths,
    garages,
    squareFeet,
    modelName,
    yearBuilt,
    lot,
    lotSize,
    parcelNumber,
    imageUrl,
    floorPlanUrl,
    lotPlanUrl
  } = req.body.home;
  const _home = await db.homes.updateHome({id, fields, home: {
    address1,
    address2,
    city,
    state,
    zipCode,
    communityId,
    builderId,
    homeType,
    keycodeId,
    beds,
    baths,
    garages,
    squareFeet,
    modelName,
    yearBuilt,
    lot,
    lotSize,
    parcelNumber,
    imageUrl,
    floorPlanUrl,
    lotPlanUrl
  }})
  
  if (!_home.errors) {
    const home = homeSerializer(_home)
    return res.status(200).send({home})
  } else {
    const { errors } = _home;
    return res.status(422).send({errors})
  }
}

module.exports.getAll = async (req, res) => {
  const pageNumber = parseInt(req.query.page) || 1
  const pageSize = parseInt(req.query.per) || 10
  const sort = req.query.sort || "id:desc"
  const { count, homes: _homes } = await db.homes.getHomes({ pageNumber, pageSize, sort })
  const homes = _homes.map(home => (
    {
      home: homeSerializer(home),
      builder: builderSerializer(home.Builder),
      community: communitySerializer(home.Community)
    }
  ))

  return res.status(200).send({ count, homes })
}

module.exports.getOne = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const _home = await db.homes.getHome({id})

    if (!_home) return res.status(404).send({home: null})

    const home = homeSerializer(_home)

    return res.status(200).send({
      home,
      builder: _home.Builder && builderSerializer(_home.Builder),
      community: _home.Community && communitySerializer(_home.Community)
    })
  } catch (error) {
    errorHandler(error)
    res.status(500).send({ error })
  }
}
