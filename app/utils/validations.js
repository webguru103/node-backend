const stateAbbreviations = require('../utils').states;

module.exports.noBlank = (fieldName) => ({
  notEmpty: {
    args: true,
    msg: `${fieldName} cannot be blank.`
  }
})

module.exports.state = {
  notEmpty: {
    args: true,
    msg: "State cannot be blank."
  },
  isIn: {
    args: [stateAbbreviations],
    msg: "State is not valid."
  }
}

module.exports.email = {
  isEmail: true
}

module.exports.zipCode = {
  notEmpty: {
    args: true,
    msg: "Zip code cannot be blank."
  },
  is: {
    args: [/^\d{5}(\-\d{4})?$/],
    msg: "Zip code is not valid."
  }
}
