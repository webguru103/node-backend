'use strict';

const db = require('../data-access');

module.exports.getAll = async (req, res) => {
  const {
    monthToDateScanCount,
    monthOverMonthScanIncrease,
    yearToDateScanCount,
  } = await db.scans.getStatistics()

  const {
    unassignedKeycodeCount,
    installedKeycodeCount,
    activatedKeycodeCount,
  } = await db.keycodes.getStatistics()

  const {
    unassignedHomeCount
  } = await db.homes.getStatistics()

  return res.status(200).send({
    statistics: {
      // Scans
      monthToDateScanCount,
      monthOverMonthScanIncrease,
      yearToDateScanCount,
      // Unassigned Keycodes/Homes
      unassignedKeycodeCount,
      unassignedHomeCount,
      // Installed/Assigned Keycodes
      installedKeycodeCount,
      activatedKeycodeCount,
    }
  })
}
