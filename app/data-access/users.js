'use strict';

const { User } = require('../models');
const { errorHandler } = require('../utils');

module.exports.findById = async (id) => {
  try {
    const user = await User.findById(id)
    return user
  } catch (error) {
    console.error(error)
    return null
  }
};

module.exports.findByEmail = (email) => new Promise((resolve, reject) => {
  User.findOne({ where: { email: email } }).then(user => {
    if (!user) reject({ error: `User with email: ${email} not found` });
    else resolve(user);
  })
});

module.exports.findByPhone = (phone) => new Promise((resolve, reject) => {
  User.findOne({ where: { phone: phone } }).then(user => {
    if (!user) reject({ error: `User with email: ${phone} not found` });
    else resolve(user);
  })
});

module.exports.getUsers = async ({
  pageNumber,
  pageSize
}) => {
  const count = await User.count()
  const limit = pageSize
  const pages = Math.ceil(count / limit)
  const offset = limit * (pageNumber - 1)
  const order = [['id','DESC']]
  const users = await (pageNumber <= pages ?  User.findAll({offset, limit, order, include: ['Devices']}) : []);

  return { count, users }
}

module.exports.getUser = async ({id}) => User.findById(id).catch(errors => errors)

module.exports.createUser = async ({
  email,
  firstname,
  lastname,
  password,
  passwordconfirmation,
  admin,
  phone
}) => {
  console.log(firstname, lastname, passwordconfirmation);
  return User.create({
    email,
    firstName,
    lastName,
    password: {
      password,
      passwordConfirmation: passwordconfirmation
    },
    admin,
    phone
  })
  .then(user => user)
  .catch(errorHandler)
}

module.exports.updateUser = async ({
  id,
  fields,
  user: {
    email,
    firstName,
    lastName,
    password,
    passwordConfirmation,
    admin,
    phone
  }
}) => {
  const passwordFields = {password, passwordConfirmation}
  const user = await User.findById(id)
  let _fields = fields || []
  if (_fields.includes('password') && _fields.includes('passwordConfirmation')) {
    _fields = _fields.concat(['encryptedPassword'])
  }
  return user
    .update({ email, firstName, lastName, password: passwordFields, admin, phone }, {fields: _fields})
    .catch(errorHandler)
}

module.exports.destroyUser = async (id) => {
  try {
    const user = await User.findById(id);
    await user.destroy({ force: true })
    return {message: 'Removed'};
  } catch (error) {
    console.log(error);
    return null;
  }
}
