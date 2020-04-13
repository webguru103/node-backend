const db = require('../models')
const appVersion = require('../../package')['version']

module.exports.healthCheck = async (req, res) => {
    const connected = await db.sequelize.authenticate().then(() => true).catch(() => false)
    const status = connected ? 200 : 500
    const body = `app:${appVersion}\ndb:${connected}`
    return res
        .status(status)
        .set({'Content-Length': body.length})
        .send(body)
}
