'use strict';

const pkg = require('./package.json')
const worker = require('commander')
const queue = require('./app/jobs/queue')

worker.version(pkg.version)
  .option('-c, --concurrency <concurrency>', 'Number of active jobs at once', parseInt)
  .parse(process.argv)

const { concurrency: _concurrency } = worker
const concurrency = _concurrency || 1

console.log(`Starting Queue Worker:\t(pid:${process.pid}\tppid:${process.ppid}\tconcurrency:${concurrency})`)

const { generateKeycodeSVG, generateKeycodePNG } = require('./app/jobs/generateKeycode');

queue.process('generateKeycodeSVG', concurrency, (job, done) => {
  const { keycodeId, keycodeBatchId } = job.data
  generateKeycodeSVG(keycodeId, keycodeBatchId, done);
});

queue.process('generateKeycodePNG', concurrency, (job, done) => {
  const { keycodeId, keycodeBatchId } = job.data
  generateKeycodePNG(keycodeId, keycodeBatchId, done)
})

// Event handling
queue.on('job error', (err, message) => {
  console.error('Job ERROR:', JSON.stringify(err), message);
}).on('job complete', (result) => {
  console.log('Job completed with data ', result);
}).on('job failed attempt', (errorMessage, doneAttempts) => {
  console.warn('Job failed (' + doneAttempts + ') : ', errorMessage);
}).on('job failed', (errorMessage) => {
  console.warn('Job failed (final): ', errorMessage);
}).on('job progress', (progress, data) => {
  console.log('\r  job #' + job.id + ' ' + progress + '% complete with data ', data );
});

process.once('SIGINT', (sig) => {
  queue.shutdown(5000, (err) => {
    console.log( 'SIGINT: Kue shutdown: ', err||'' );
    process.exit(0);
  });
});
process.once('SIGTERM', (sig) => {
  queue.shutdown(5000, (err) => {
    console.log( 'SIGTERM: Kue shutdown: ', err||'' );
    process.exit(0);
  });
});
