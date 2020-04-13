'use strict';

if (!global._babelPolyfill) require('babel-polyfill')

const appPath = process.env.NODE_ENV === 'production' ? './build' : './app'

require('app-module-path').addPath(__dirname + appPath);
require('app-module-path').addPath(__dirname);

require('dotenv').config()

// Background workers
const { spawn } = require('child_process')
const workerCount = process.env.BACKGROUND_WORKER_COUNT || 1
const _ = require('underscore')

const workers = _.times(parseInt(workerCount), (i) => {
  const worker = spawn('node', ['worker.js',
    '-c', (process.env.BACKGROUND_JOB_CONCURRENCY || 1),
  ])
  worker.stdout.on('data', (data) => console.log(data.toString('utf8')))
  worker.stderr.on('data', (data) => console.error(data.toString('utf8')))
  worker.on('close', (code) => {
    console.log(`Worker process exited with code ${code}`);
  });
  return worker
})

process.once('SIGINT', (_sig) => {
  workers.forEach(worker => worker.kill('SIGINT'))
  setTimeout(() => process.exit(0), 1000)
})
process.once('SIGTERM', (_sig) => {
  workers.forEach(worker => worker.kill('SIGTERM'))
  setTimeout(() => process.exit(0), 1000)
})

const app = require(appPath);

// Background Job Dashboard
const queueDashboard = require('kue/lib/http')
const basicAuth = require('express-basic-auth')
const basicAuthMiddleware = basicAuth({users: { 'admin': process.env.BASIC_AUTH_PASSWORD}, challenge: true, realm: "api-dashboard"})
app.use((req, res, next) => {
  const regex = new RegExp('^\/queue')
  const test = regex.test(req.path)
  if (test) {
    basicAuthMiddleware(req, res, next);
  } else {
    next()
  }
});
app.use('/queue', queueDashboard)

// App listen
const port = process.env.PORT || 3000
console.log("EXPRESS: Listening on Port ", port)
app.listen(port);
