'use strict';

const bcrypt = require('bcrypt');
const { encryptedPassword } = require('../utils')

module.exports = (sequelize, Sequelize) => {

  const User = sequelize.define('User', {
    email: {
      type: Sequelize.STRING,
      unique: true,
      validate: {
        isEmail: true,
        isUnique: function (email) {
          const currentUser = this
          const newRecord = currentUser.id === null
          return User.findOne({where: {email}}).then(previous => {
            // If someone already has this email address and this is a new user being created, OR
            // someone already has this email address and we are are trying to update a different
            // user with the same email address ... then blow up.
            if (previous && (newRecord || currentUser.id !== previous.id)) {
              throw new Error(`Email ${email} has already been taken`)
            }
          })
        }
      },
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    admin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    homeId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    code: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    password: {
      type: Sequelize.VIRTUAL,
      set: function({password, passwordConfirmation}){
        if (password && passwordConfirmation) {
          this.setDataValue('password', {password, passwordConfirmation})
          const encrypted = encryptedPassword(password)
          this.setDataValue('encryptedpassword', encrypted)
        }
      },
      validate: {
        isValid: ({password}) => {
          const regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,}).*")
          if (!regex.test(password)) throw new Error(
            "Password must contain at least one number, one uppercase letter, one lowercase letter, and at least 8 characters"
          )
        },
        mustMatch: function({password, passwordConfirmation}) {
          if (password !== passwordConfirmation) {
            throw new Error('Passwords do not match')
          }
        }
      }
    },
    encryptedPassword: {
      type: Sequelize.BOOLEAN,
      get: function() {
        throw new Error("Can't get the encrypted password!")
      }
    }
  }, { tableName: 'users' })
  User.associate = (models) => {
    models.User.hasMany(models.Device, { foreignKey: 'userId', allowNull: true })
  }
  User.prototype.authenticate = function (password){
    return bcrypt.compareSync(password, this.getDataValue('encryptedPassword'));
  }

  return User
}
