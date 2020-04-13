
const db = require('../models')
const { Keycode, KeycodeBatch } = db

module.exports.getStatus = async ({id}) => {
  const _keycodeBatch = await KeycodeBatch.findById(id)
  const allKeycodesCount = await Keycode.count({where: {keycodeBatchId: id}})
  const blankKeycodesCount = await Keycode.count({where: { keycodeBatchId: id, status: 'blank'}})

  return {
    allKeycodesCount,
    blankKeycodesCount,
    id: _keycodeBatch.id,
    batchNumber: _keycodeBatch.batchNumber,
    status: (blankKeycodesCount > 0 ? "generation_in_progress" : "generation_complete"),
  }
}
