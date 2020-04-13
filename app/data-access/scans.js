const moment = require('moment')
const db = require('../models')
const { errorHandler } = require('../utils')
const { Scan, Keycode, Device, Home, Sequelize } = db
const { Op } = Sequelize

module.exports.getAdminScans = async ({
  pageNumber,
  pageSize,
  keycodeId
}) => {
  try {
    const where = { scanType: 'admin' }
    if (keycodeId) { where.keycodeId = keycodeId }
    const count = await Scan.count({where})
    const limit = pageSize
    const pages = Math.ceil(count / limit)
    const offset = limit * (pageNumber - 1)
    const order = [['id','DESC']]

    if (pageNumber > pages) return []
    return Scan.findAll({offset, limit, order, where, include: ['Keycode','Device']})
  } catch (error) { errorHandler(error) }
}

const createAdminScan = async (data) => {
  try {
    const { deviceType, deviceOS, appVersion, userId } = data
    const [device, created] = await Device.findOrCreate({
      where: {
        deviceOS,
        appVersion,
        deviceType,
        userId,
        // TODO: create a composite index for this query.
      }, defaults: { appType: 'admin' }
    });

    const { uid, scanAction } = data
    const keycode = typeof uid === 'string' && await Keycode.findOne({where: {uid}, include: ['Home']})

    const home = keycode && await Home.findOne({where: {keycodeId: keycode.id}, include: ['Community', 'Builder']})
    const community = home && home.Community
    const builder = home && home.Builder
    const scan = await Scan.create({
      scanType: "admin",
      scanAction: (scanAction || "identify"),
      deviceId: device.id,
      keycodeId: (keycode && keycode.id),
    })
    if (keycode) {
      const code = home ? "home_assigned" : "no_home_assigned"
      const result = { status: "success", code }
      return {keycode, scan, device, home, builder, community, result}
    } else {
      const result = { status: "error", code: "keycode_not_found" } 
      return {keycode, scan, device, home, builder, community, result}
    }
  } catch (error) {
    console.log("Errors:", error)
    errorHandler(error)
  }
}
module.exports.createAdminScan = createAdminScan

module.exports.createAdminScanAndAssignKeycode = async (data) => {
  try {
    const { device, scan, keycode, home: _home, builder: _builder, community: _community, result: _result } = await createAdminScan(
      Object.assign({}, data, {scanaction: "assign"})
    )
    
    if (keycode) {
      if (_home) {
        const result = { status: "error", code: "already_assigned" }
        return { device, scan, keycode, home: _home, community: _community, builder: _builder, result }
      } else {
        const home = await Home.findOne({where: {keycodeId: { [Op.eq]: null }}, include: ['Builder', 'Community']})
        if (home) {
          const builder = home && home.Builder
          const community = home && home.Community

          // assign the keycode to the home
          await home.update({keycodeId: keycode.id})

          // update the keycode to reflect that it is assigned
          const assignedAt = new Date()
          const status = 'assigned'
          await keycode.update({assignedAt: assignedAt, status})

          // respond that the home was assigned a keycode
          const result = { status: "success", code: "home_assign_success" }
          return {device, scan, keycode, home, builder, community, result}
        } else {
          const result = { status: "error", code: "no_homes_available" }
          return { device, scan, keycode, builder: null, community: null, home: null, result }
        }
      }
    } else {
      return { device, scan, keycode: null, home: null, builder: null, community: null, result: _result }
    }
  } catch (error) {
    console.log("Errors:", error)
    errorHandler(error)
  }
}

module.exports.getStatistics = async () => {
  try {
    const beginningOfYear = moment().startOf('Year').toDate()
    const yearToDateScanCount = await Scan.count({
      where: {
        createdAt: { [Op.gt]: beginningOfYear }
      }
    })
    const beginningOfMonth = moment().startOf('Month')
    const monthToDateScanCount = await Scan.count({
      where: {
        createdAt: { [Op.gt]: beginningOfMonth }
      }
    })
    const beginningOfLastMonth = moment().startOf('Month').subtract(1, 'Month').toDate()
    const lastMonthScans = await Scan.count({
      where: {
        createdAt: {
          [Op.gt]: beginningOfLastMonth,
          [Op.lt]: beginningOfMonth,
        }
      }
    })
    const beginningOfMonthBeforeLast = moment().startOf('Month').subtract(2, 'Months').toDate()
    const monthBeforeScans = await Scan.count({
      where: {
        createdAt: {
          [Op.gt]: beginningOfMonthBeforeLast,
          [Op.lt]: beginningOfLastMonth,
        }
      }
    })

    const monthOverMonthScanIncrease = monthBeforeScans > 0 ?
            ((lastMonthScans - monthBeforeScans) / monthBeforeScans) : 0

    return ({
      yearToDateScanCount,
      monthOverMonthScanIncrease,
      monthToDateScanCount,
    })
  } catch (error) {
    errorHandler(error)
  }
}
