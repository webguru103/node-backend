'use strict';

const { __, all, contains, isEmpty } = require('ramda');
const db = require('../data-access');
const { keycodeSerializer, keycodeBatchSerializer, homeSerializer } = require('../serializers');
const { Scan } = require('../models');
const { keyCodeStatuses } = require('../models/Keycode');

module.exports.create = async (req, res) => {
  try {
    const { howMany } = req.body.keycodes

    const { keycodes: _keycodes, keycodeBatch: _keycodeBatch } = await db.keycodes.create({howMany})

    if (!_keycodes.errors) {
      const keycodes = _keycodes.map(keycode => keycodeSerializer(keycode))
      const keycodeBatch = keycodeBatchSerializer(_keycodeBatch)
      return res.status(201).send({keycodes, keycodeBatch})
    } else {
      const { errors } = _keycodes
      return res.status(422).send({errors})
    }
  } catch(error) {
    res.status(500).send({errors: [`Server Error: ${error}`]})
  }
}

module.exports.getAll = async (req, res) => {
  const pageNumber = parseInt(req.query.page) || 1
  const pageSize = parseInt(req.query.per) || 10
  const status = req.query.status ? (req.query.status).split(",") : [];

  if (!isEmpty(status) && !all(contains(__, keyCodeStatuses), status))
    return res.status(400).send({errors: [`Keycode status should be one of the followings: ${keyCodeStatuses}`]});

  const { count, keycodes: _keycodes, keycodeBatches: _keycodeBatches } = await db.keycodes.getKeycodes({ pageNumber, pageSize, status });
  const _homes = await db.homes.getByKeycodeIds({keycodeIds: _keycodes.map(keycode => keycode.id)})
  const keycodes = _keycodes.map(keycode => keycodeSerializer(keycode, {totalScans: keycode.Scans.length}))
  const homes = _homes.map(home => homeSerializer(home))
  const keycodeBatches = _keycodeBatches.map(keycodeBatch => keycodeBatchSerializer(keycodeBatch))

  return res.status(200).send({count, keycodes, keycodeBatches, homes})
}

module.exports.getOne = async (req, res) => {
  const { uid } = req.params
  const { keycode: _keycode } = await db.keycodes.getOne({uid})
  const _home = _keycode ? await db.homes.getByKeycodeId({keycodeId: _keycode.id}) : null
  
  const keycode = _keycode ? keycodeSerializer(_keycode) : null
  const home = _home ? homeSerializer(_home) : null

  return res.status(200).send({keycode, home})
}

module.exports.update = async (req, res) => {
  const fields = Object.keys(req.body.keycode)
  const { uid } = req.params

  const { status } = req.body.keycode;
  const _keycode = await db.keycodes.update({uid, fields, keycode: { status }})
  
  if (!_keycode.errors) {
    const keycode = keycodeSerializer(_keycode)
    return res.status(200).send({keycode})
  } else {
    const { errors } = _keycode;
    return res.status(422).send({errors})
  }
}

module.exports.getImage = async (req, res) => {
  try {
    const { uid, ext } = req.params
    const { Body: body, ContentLength: length } = await db.keycodes.getImage({uid,ext})
    const contentType = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`
    if (req.query.data) {
      const buffer = new Buffer(body)
      const dataUrl = `data:${contentType};base64,${buffer.toString('base64')}`
      res.status(200).send({ uid, dataUrl })
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename=${uid}.${ext}`,
        'Content-Length': length
      });
    }
    res.end(body)
  } catch (error) {
    res.status(500).send({errors: [`Server Error: ${error}`]})
  }
}
