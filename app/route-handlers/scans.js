'use strict';

const db = require('../data-access');
const { scanSerializer, deviceSerializer, homeSerializer, keycodeSerializer,
  communitySerializer, builderSerializer } = require('../serializers');

module.exports.createAdmin = async (req, res) => {
  const { scan: scanFields } = req.body
  const { assign } = scanFields

  const scanAction = assign ? "assign" : "identify"
  const fields = Object.assign({}, scanFields, {scanAction})
  const { scan: _scan, device: _device, home: _home, keycode: _keycode,
    builder: _builder, community: _community, result } = assign ?
    await db.scans.createAdminScanAndAssignKeycode(fields) :
    await db.scans.createAdminScan(fields)
  
  const errors = _scan.errors || _device && _device.errors ||
                _home && _home.errors || _keycode && _keycode.errors
  if (!errors) {
    const scan = scanSerializer(_scan)
    const device = deviceSerializer(_device)
    const home = _home && homeSerializer(_home)
    const keycode = _keycode && keycodeSerializer(_keycode)
    const builder = _builder && builderSerializer(_builder)
    const community = _community && communitySerializer(_community)
    return res.status(201).send({
      scan, home, device, keycode, community, builder, result
    })
  } else {
    return res.status(422).send({errors})
  }
}

const serialize = (scans) => scans.map(scan => ({
  scan: scanSerializer(scan),
  device: (scan.Device && deviceSerializer(scan.Device))
}))

const getScans = async (req, res, isKeycode) => {
  try {
    const pageNumber = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.per) || 10
    const filter = { pageNumber, pageSize };

    if (isKeycode) {
      const uid = parseInt(req.params.keycodeUID)
      const { keycode } = await db.keycodes.getOne({uid})
      filter.keycodeId = keycode.id
    }
    const _scans = await db.scans.getAdminScans(filter)
    const scans = serialize(_scans)

    return res.status(200).send({scans})
  } catch (error) {
    console.error("ERROR:", error)
    res.status(500).send({
      error: `Server Error: ${error}`,
      trace: error.stack,
    })
  }
}

module.exports.getAdminScans = async (req, res) => {
  await getScans(req, res, false)
}

module.exports.getKeycodeScanAdmin = async (req, res) => {
  const isKeycode = !isNaN(req.params.keycodeUID)
  await getScans(req, res, isKeycode)
}
