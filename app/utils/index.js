'use strict';

const bcrypt = require('bcrypt')
const uuidv4 = require('uuid/v4');

const encryptedPassword = (password) => {
  const salt = bcrypt.genSaltSync(10)
  const encrypted = bcrypt.hashSync(password, salt)
  return encrypted
}
module.exports.encryptedPassword = encryptedPassword

module.exports.getUid = (length) => uuidv4();

module.exports.validations = require('./validations');

module.exports.ms = (seconds) => seconds * 1000

module.exports.errorHandler = (err) => {
  const { name, errors, original } = err
  console.error("ERROR:", name, errors, original, err)
  if (original) {
    return({
      errors: [original.detail]
    })
  } else if (errors) {
    return({
      errors: errors.map(error => error.message)
    })
  } else {
    return {errors}
  }
}
module.exports.states = require('../../constants/states.json');
