const { host, port, db } = require('../../config/redis')
const kue   = require('kue'),
      queue = kue.createQueue({
        redis: {
          host,
          port,
          db,
        }
      })

kue.app.set('title', "HomeKey - Jobs")

module.exports = queue
