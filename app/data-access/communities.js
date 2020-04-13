'use strict';

const { errorHandler } = require('../utils')

const { Community, Builder, Home, Keycode, Sequelize } = require('../models');

module.exports.getCommunityMetadata = async ({community}) => {
  const homesCount = await Home.count({where: { communityId: community.id }})
  const activatedHomes = await Home.count({
    where: { communityId: community.id },
    include: [{model: Keycode, required: true, where: { status: "activated" }}]
  })
  return { homesCount, activatedHomes }
}

module.exports.getCommunities = async ({
  pageNumber,
  pageSize
}) => {
  try {
    const count = await Community.count()
    const limit = pageSize
    const pages = Math.ceil(count / limit)
    const offset = limit * (pageNumber - 1)
    const order = [['id','DESC']]
    const include = [{ model: Builder }]

    const communities = (
      pageNumber <= pages ?
        await Community.findAll({ offset, limit, order, include }) : []
    )
    return { count, communities }
  } catch (error) {
    errorHandler(error)
  }
}

module.exports.getCommunity = async ({id}) => Community.findById(id).catch(errors => errors)

module.exports.createCommunity = async ({
  name,
  crossStreets,
  city,
  state,
  zipCode,
  builderIds,
}) => {
  console.warn('da xst.', name, crossStreets, city, state, zipCode)
  const _community = Community.build({
    name,
    crossStreets,
    city,
    state,
    zipCode,
  })
  return _community.save()
    .then(async (community) => {
      const builders = await Builder.findAll({
        where: { id: builderIds }
      })
      await community.setBuilders(builders)
      return { community, builders }
    })
    .catch(errorHandler)
    .then(result => result)
}

module.exports.updateCommunity = async ({
  id,
  fields,
  community: {
    name,
    crossStreets,
    city,
    state,
    zipCode,
    builderIds,
  }
}) => {
  try {
    const _community = await Community.findById(id)
    const _fields = fields || []
    const community = await _community.update({
      name,
      crossStreets,
      city,
      state,
      zipCode
    }, {fields: _fields})
    const builders = await Builder.findAll({
      where: { id: builderIds }
    })
    await community.setBuilders(builders)

    return { community, builders }
  } catch (error) {
    errorHandler(error)
    return { errors: error.errors.map(e => e.message) }
  }
}
