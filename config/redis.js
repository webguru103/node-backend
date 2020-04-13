const { hostname, port, pathname } = require('url').parse(process.env.REDIS_URL || "redis://127.0.0.1:6379/0");
const database = pathname && pathname.replace('/', '') || 0
console.log("REDIS URL:", process.env.REDIS_URL)
console.log("REDIS HOSTNAME:", hostname)
console.log("REDIS PORT:", port)
console.log("REDIS DB:", database)

const connectionConfig = {
  pkg: 'ioredis',
  host: hostname,
  password: "",
  database,
  port,
}

module.exports = connectionConfig
