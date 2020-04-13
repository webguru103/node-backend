'use strict';

const { errorHandler } = require('../utils')

const { Home, Builder, Keycode, Community, Scan,
  KeycodeBatch, Sequelize } = require('../models');
const { Op } = Sequelize

const optionsFor = async ({pageNumber, pageSize, sort, where}) => {
  const count = await Home.count({where})
  const limit = pageSize
  const pages = Math.ceil(count / limit)
  const offset = limit * (pageNumber - 1)

  let order
  switch (true) {
    case /status/.test(sort):
      order = [[Keycode, ...sort.split(':')]]
      break;
    case /builder/.test(sort):
      order = [[Builder, 'companyName', sort.split(':')[1]]]
      break;
    default:
      order = [sort.split(':')]
      break;
  }

  return { offset, limit, order, pages, count }
}

module.exports.getHomesWithKeycodes = async ({
  pageNumber,
  pageSize,
  sort
}) => {
  try {
    const include = [
      { model: Builder, required: false },
      { model: Community, required: false },
      { model: Keycode, required: false, include:[KeycodeBatch,Scan] },
    ]
    const where = {keycodeId: {[Op.ne]: null}}
    const { count, pages, ...options } = await optionsFor({pageNumber, pageSize, sort, where})

    const keycodeHomes = await (pageNumber <= pages ? Home.findAll({
      where,
      include,
      ...options
    }) : [])

    return { count, keycodeHomes }
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports.getQueuedHomes = async ({
  pageNumber,
  pageSize,
  sort
}) => {
  const where = {keycodeId: null}
  const include = [
    { model: Builder, required: true },
    Community
  ]
  const { count, pages, ...options } = await optionsFor({pageNumber, pageSize, sort, where})
  const homes = await (pageNumber <= pages ? Home.findAll({
    where,
    include,
    ...options
  }) : [])

  return { count, homes }
}

module.exports.getHomes = async ({
  pageNumber,
  pageSize,
  sort
}) => {
  const include = [Builder, Community]
  const where = {}
  const { count, pages, ...options } = await optionsFor({pageNumber, pageSize, sort, where})

  const homes = await (pageNumber <= pages ?  Home.findAll({
    where,
    include,
    ...options
  }) : [])

  return { count, homes }
}

module.exports.getHome = async ({id}) => Home.findOne({where: { id }, include: [Builder, Community]}).catch(errors => errors)

const createHome = async ({
  address1,
  address2,
  city,
  state,
  zipCode,
  communityId,
  keycodeId,
  builderId,
  homeType,
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
}) => {
  const _home = Home.build({
    address1,
    address2,
    city,
    state,
    zipCode,
    homeType,
    builderId,
    communityId,
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
  })
  return _home.save().then(home => home).catch(errorHandler)
}
module.exports.createHome = createHome
module.exports.createHomes = ({homes}) => Promise.all(homes.map(home => createHome(home)))

module.exports.updateHome = async ({
  id,
  fields,
  home: {
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
  }
}) => {
  const home = await Home.findById(id)
  const _fields = fields || []
  return home.update({
    address1,
    address2,
    city,
    state,
    zipCode,
    homeType,
    builderId,
    communityId,
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
  }, {fields: _fields}).catch(errorHandler)
}

module.exports.getByKeycodeId = async({
  keycodeId
}) => {
  if (!keycodeId) return null
  const home = await Home.findOne({ where: { keycodeId } })

  return home
}

module.exports.getByKeycodeIds = async({
  keycodeIds
}) =>
  Home.findAll({where: {keycodeId: keycodeIds}})

module.exports.getStatistics = async () => {
  try {
    const unassignedHomeCount = await Home.count({where: { keycodeId: null }})

    return ({
      unassignedHomeCount,
    })
  } catch (error) {
    errorHandler(error)
  }
}
