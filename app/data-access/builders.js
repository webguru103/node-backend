'use strict';

const { errorHandler } = require('../utils')

const { Builder, Community, Home, Keycode, KeycodeBatch, Sequelize } = require('../models');

module.exports.getBuilderMetadata = async ({builder}) => {
  const homesCount = await Home.count({where: { builderId: builder.id }})
  const activatedHomes = await Home.count({
    where: { builderId: builder.id },
    include: [{model: Keycode, required: true, where: { status: "activated" }}]
  })
  return { homesCount, activatedHomes }
}

module.exports.getBuilders = async ({
  pageNumber,
  pageSize,
  sort
}) => {
  try {
    const count = await Builder.count()
    const limit = pageSize
    const pages = Math.ceil(count / limit)
    const offset = limit * (pageNumber - 1)
    const order = [sort.split(':')]
    const include = [{ model: Community }]

    const builders = (
      pageNumber <= pages ?
        await Builder.findAll({ offset, limit, order, include }) : []
    )
    return { count, builders }
  } catch (error) {
    errorHandler(error)
  }
}

module.exports.getBuilder = async ({id}) => Builder.findById(id).catch(errors => errors)

module.exports.createBuilder = async ({
  companyName,
  companyPhone,
  mainContactName,
  mainContactEmail,
  mainContactPhone,
  address1,
  address2,
  city,
  state,
  zipCode,
  communityIds,
}) => {
  const _builder = Builder.build({
    companyName,
    companyPhone,
    mainContactName,
    mainContactEmail,
    mainContactPhone,
    address1,
    address2,
    city,
    state,
    zipCode,
  })
  return _builder.save()
    .then(async (builder) => {
      const communities = await Community.findAll({
        where: { id: communityIds }
      })
      await builder.setCommunities(communities)
      return { builder, communities }
    })
    .catch(errorHandler)
    .then(result => result)
}

module.exports.updateBuilder = async ({
  id,
  fields,
  builder: {
    companyName,
    companyPhone,
    mainContactName,
    mainContactEmail,
    mainContactPhone,
    address1,
    address2,
    city,
    state,
    zipCode,
    communityIds,
  }
}) => {
  const builder = await Builder.findById(id)
  const _fields = fields || []
  return builder.update({
      companyName,
      companyPhone,
      mainContactName,
      mainContactEmail,
      mainContactPhone,
      address1,
      address2,
      city,
      state,
      zipCode,
    }, {fields: _fields})
    .then(async (builder) => {
      if (fields.includes('communityIds')) {
        await builder.setCommunities(communityIds)
      }
      const communities = await builder.getCommunities()
      return { builder, communities }
    })
    .catch(errorHandler)
    .then(result => result)
}
