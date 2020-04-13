const bcrypt = require('bcrypt')

const encryptedPassword = async (password) => await bcrypt(password, 10)
module.exports.encryptedPassword = encryptedPassword

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
    console.error(errors)
    return {
      errors
    }
  }
}
