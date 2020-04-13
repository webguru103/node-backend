
const path = require('path')
const { exec, spawn, spawnSync } = require('child_process')
const fs = require('fs')
const AWS = require('aws-sdk')
const db = require('../models')
const { ms, errorHandler } = require('../utils')
const queue = require('../jobs/queue')
const { Keycode, KeycodeBatch } = db
const ttlValue = process.env.JOB_TTL_VALUE || 60
const pngDensity = process.env.KEYCODE_PNG_DENSITY || 250

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const s3 = new AWS.S3();

// SVG Generation

const generateAndUploadSVG = async ({keycode, keycodeBatch}) => {
  try {
    await generateKeycodeSVG({keycode, keycodeBatch})
    if (process.env.AWS_S3_BUCKET_NAME) {
      await uploadToS3({type: 'svg', keycode, keycodeBatch})
    }
    return keycode
  } catch (errors) {
    throw new Error(errors)
  }
}


const pythonCommandArgs = ({keycode, keycodeBatch, type}) => {
  const { uid } = keycode
  const { batchNumber } = keycodeBatch
  return [ scriptPath,
    '--type', 'template0072style1',
    '--blueprint-file', `${nativeLibsPath}/blueprint_0072.json`,
    '--data', uid,
    '--native-libs-dir', nativeLibsPath,
    '--output-file', imagePath({uid,batchNumber,type}),
    '--border-color', '#11b3ff',
    '--data-colors', '#3f83c4',
    '--data-colors', '#11b3ff',
    '--data-colors', '#78cbf3',
    '--overlay-color', '#11b3ff',
  ]
}

const generateKeycodeSVG = ({keycode, keycodeBatch}) => new Promise((resolve,reject) => {
  const pythonCmdArgs = pythonCommandArgs({keycode, keycodeBatch, type: 'svg'})
  console.log("Python Command (SVG): ", pythonCmdArgs.join(' '))
  const python = spawn('python', pythonCmdArgs)
  python.stdout.on('data', data => console.log("Python (SVG) STDOUT: " + data))
  python.stderr.on('data', data => console.error("Python (SVG) STDERR: " + data))
  
  python.on('close', (code) => {
    console.log("Python (SVG) exited w/ code: " + code + " uid:" + keycode.uid)

    if (code === 0) {
      const { id, uid, keycodeBatchId } = keycode
      const { batchNumber } = keycodeBatch
      resolve({
        svgPath: imagePath({uid, batchNumber, type: 'svg'})
      })
    } else {
      reject("Keycode SVG generation failed with code: " + code)
    }
  })
})

module.exports.generateKeycodeSVG = async (keycodeId, keycodeBatchId, done) => {
  try {
    const keycode = await Keycode.findById(keycodeId)
    const keycodeBatch = await KeycodeBatch.findById(keycodeBatchId)
    const result = await generateAndUploadSVG({keycode, keycodebatch: keycodeBatch})
    enqueueGeneratePNG({keycodeId: keycode.id, keycodeBatchId: keycodeBatch.id})
    done(null, result)
  } catch (errors) {
    // console.error("INEXPORT:", errors)
    done(errors, null)
  }
  return
}

// PNG Generation
const enqueueGeneratePNG = process.env.NODE_ENV === 'test' ?
  () => console.log("BACKGROUND JOBS STUBBED FOR TESTS!") :
  ({keycodeId, keycodeBatchId}) => queue.create('generateKeycodePNG', {
      title: `Generate PNG for Keycode #${keycodeId}`,
      keycodeId: keycodeId,
      keycodeBatchId: keycodeBatchId
    })
    .delay(ms(10))
    .attempts(5)
    .backoff({delay: ms(5), type:'fixed'})
    .ttl(ms(ttlValue))
    .save()

const convertCommandArgs = ({keycode, keycodeBatch}) => {
  const { uid } = keycode
  const { batchNumber } = keycodeBatch
  const svgPath = imagePath({uid, batchNumber, type: 'svg'})
  const pngPath = imagePath({uid, batchNumber, type: 'png'})
  return ['-density', pngDensity, '-background', 'none', svgPath, pngPath]
}

const retrieveSVGFromS3 = async ({keycode, keycodeBatch}) => {
  try {
    const { uid, s3Bucket: Bucket, svgS3Key: Key } = keycode
    // console.log("RETRIEVE SVG:", keycode)
    const { batchNumber } = keycodeBatch

    const { Body } = await s3.getObject({Bucket, Key}).promise()
    const svgPath = imagePath({uid, batchNumber, type: 'svg'}) 

    fs.writeFileSync(svgPath, Body, { mode: 0o755 })

    return { svgPath }
  } catch (error) {
    errorHandler(error)
  }
}

module.exports.generateKeycodePNG = async (keycodeId, keycodeBatchId, done) => {
  try {
    // Make sure we are talking about a real keycode
    const keycode = await Keycode.findById(keycodeId)
    const keycodeBatch = await KeycodeBatch.findById(keycodeBatchId)
    const { uid } = keycode
    // const { batchNumber } = keycodeBatch

    // Get SVG from S3
    const { svgPath } = await retrieveSVGFromS3({keycode, keycodeBatch})
    console.log(`Downloaded SVG for ${uid} to ${svgPath}`)

    // Run convert on SVG to create PNG
    const convertCmdArgs = convertCommandArgs({keycode, keycodeBatch})
    console.log("Convert Command (PNG): ", convertCmdArgs.join(' '))
    const convert = spawn('convert', convertCmdArgs)
    convert.stdout.on('data', data => console.log("Convert (PNG) STDOUT: " + data))
    convert.stderr.on('data', data => console.error("Convert (PNG) STDERR: " + data))

    return convert.on('close', async (code2) => {
      console.log("Convert (PNG) exited w/ code: " + code2 + " uid:" + keycode.uid)

      // Put PNG on S3
      if (process.env.AWS_S3_BUCKET_NAME) {
        await uploadToS3({type: 'png', keycode, keycodeBatch})
      }
      done(null, keycode)
    })
  } catch (errors) {
    console.error("INEXPORT:", errors)
    done(errors, null)
  }
  return
}

// Common

const scriptPath = path.resolve('quikkly', 'python-sdk', 'scripts', 'quikkly-generate-code.py')
const nativeLibsPath = path.resolve('quikkly', 'libquikklycore-3.4.8-server', (process.platform === 'darwin' ? 'macos' : 'ubuntu' ))
const tmpFilename = ({uid,batchNumber,type}) => (batchNumber ? `${batchNumber}.${uid}.${type}` : `00000000-00.${uid}.${type}`)
const imagePath = ({uid,batchNumber,type}) => path.resolve('tmp', tmpFilename({uid,batchNumber,type}))

const uploadToS3 = async ({keycode, keycodeBatch, type}) => {
  try {
    const { uid } = keycode
    const { batchNumber } = keycodeBatch
    const Bucket = process.env.AWS_S3_BUCKET_NAME

    const Key = tmpFilename({uid,batchNumber, type})
    const Body = fs.readFileSync(imagePath({uid,batchNumber,type}));
    console.log(`Uploading ${type.toUpperCase()} to s3://${Bucket}/${Key}`)
    await s3.putObject({Bucket, Key, Body}).promise();

    keycode.update({
      status: "unassigned",
      s3Bucket: Bucket,
      [type + 's3key']: Key, // svgS3Key or pngS3Key
    }) 
  } catch (errors) {
    throw new Error(errors)
  }
}

