const R = require('ramda')
const AWS = require('aws-sdk')
const moment = require('moment')
const Sequelize = require('sequelize')

const models = require('../models')
const { errorHandler, ms } = require('../utils')

const queue = require('../jobs/queue')

const { Keycode, KeycodeBatch, Home, Scan } = models
const ttlValue = process.env.JOB_TTL_VALUE || 60

const Op = Sequelize.Op

const MAX_INT = 18446744073709551615
const randomNumber = () => (Math.floor(Math.random() * MAX_INT) + 1).toString()

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const s3 = new AWS.S3();

const enqueueGenerateSVG = process.env.NODE_ENV === 'test' ?
  () => console.log("BACKGROUND JOBS STUBBED FOR TESTS!") :
  ({keycodeId, keycodeBatchId}) => queue.create('generateKeycodeSVG', {
      title: `Generate SVG for Keycode #${keycodeId}`,
      keycodeId: keycodeId,
      keycodebatchid: keycodeBatchId
    })
    .attempts(5)
    .backoff({delay: ms(5), type:'fixed'})
    .ttl(ms(ttlValue))
    .save()

const batchesToday = () => KeycodeBatch.findAndCountAll({
  where: { batchNumber: { [models.sequelize.Op.like]: (todayString() + "%") }}
})
module.exports.batchesToday = batchesToday

const todayString = () => moment().format('MMDDYYYY')

const nextBatchId = async () => {
  const result = (await batchesToday()).count
  return (result + 1).toString().padStart(2,0)
}
module.exports.nextBatchId = nextBatchId

const nextBatchNumber = async () => {
  const nextId = await nextBatchId()
  return `${todayString()}-${nextId}`
}
module.exports.nextBatchNumber = nextBatchNumber

const createKeycodeBatch = async () => {
  const batchNumber = await nextBatchNumber()
  return KeycodeBatch.create({batchNumber})
}
module.exports.createKeycodeBatch = createKeycodeBatch

module.exports.create = async ({howMany}) => {
  try {
    const keycodeBatch = await createKeycodeBatch()
    const keycodes = await Promise.all(
      R.times(async () => {
        let uid = randomNumber()
        let uidTaken = await Keycode.findOne({where: {uid}})
        while (uidTaken) {
          uid = randomNumber()
          uidTaken = await Keycode.findOne({where: {uid}})
        }
        return Keycode.create({ keycodebatchid: keycodeBatch.id, uid })
      }, parseInt(howMany))
    )
    keycodes.forEach((keycode) => enqueueGenerateSVG({keycodeId: keycode.id, keycodebatchid: keycode.keycodeBatchId}))
    return { keycodes, keycodeBatch }
  } catch (errors) { errorHandler(errors) }
}

module.exports.getKeycodes = async ({
  pageNumber,
  pageSize,
  status
}) => {
  try {
    const where = R.isEmpty(status) ? {} : { where: {status: {[Op.or]: status}}};
    const count = await Keycode.count(where)
    const limit = pageSize
    const pages = Math.ceil(count / limit)
    const offset = limit * (pageNumber - 1)
    const order = [['id', 'DESC']]
    const include = [Scan]
    const filter = Object.assign({}, { offset, limit, order, include }, where);
    const keycodeBatches = await KeycodeBatch.findAll()
    const keycodes = pageNumber <= pages ? await Keycode.findAll(filter) : []
    const keycodeIds = keycodes.map(keycode => keycode.id)
    const homes = await Home.findAll({where: { id: keycodeIds }})

    return {
      count,
      keycodes,
      homes,
      keycodeBatches,
    }

  } catch(errors) { errorHandler(errors) }
}

module.exports.getOne = async ({uid}) => {
  try {
    const keycode = await Keycode.findOne({where: { uid: uid.toString() }, include: ['KeycodeBatch']})
    
    return { keycode }
  } catch (error) { errorHandler(error) }
}

const mapStatusToTimeField = (status) => {
  const mapping = {
    assigned: "assignedAt",
    ready_to_ship: "readyToShipAt",
    installed: "installedAt",
    activated: "activatedAt",
    unassigned: "unassignedAt",
  }
  return mapping[status]
}

module.exports.update = async ({
  uid,
  fields,
  keycode: {
    status
  }
}) => {
  try {
    if (!fields.includes('status')) return null
    const _keycode = await Keycode.findOne({where: { uid: uid.toString() }})
    const timeField = mapStatusToTimeField(status)

    const now = new Date()

    const keycode = await _keycode.update({ status, [timeField]: now}, { fields: ['status', timeField]}).catch(errorHandler)

    return keycode
  } catch (error) { errorHandler(error) }
}

module.exports.getStatistics = async () => {
  try {
    const unassignedKeycodeCount = await Keycode.count({where: { status: 'unassigned' }})
    const installedKeycodeCount = await Keycode.count({where: { status: 'installed' }})
    const activatedKeycodeCount = await Keycode.count({where: { status: 'activated' }})

    return ({
      unassignedKeycodeCount,
      installedKeycodeCount,
      activatedKeycodeCount,
    })
  } catch (error) {
    errorHandler(error)
  }
}

module.exports.getImage = async ({uid,ext}) => {
  const keycode = await Keycode.findOne({where: {uid: uid.toString()}})
  const Key = keycode[ext + 's3key'] // either pngs3key or svgs3key
  const Bucket = process.env.AWS_S3_BUCKET_NAME

  const imageObj = await s3.getObject({Bucket, Key}).promise();

  return imageObj
}

