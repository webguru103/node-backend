'use strict';

const db = require('../data-access');
const { userSerializer, deviceSerializer } = require('../serializers');

module.exports.create = async (req, res) => {
  const { email, firstName, lastName, admin, password, passwordConfirmation } = req.body.user;
  const _user = await db.users.createUser({
    email: email.toLowerCase(), firstName, lastName, admin, password, passwordConfirmation
  })

  if (!_user.errors) {
    const user = userSerializer(_user)
    return res.status(201).send({user})
  } else {
    const { errors } = _user;
    return res.status(422).send({errors})
  }
}

module.exports.update = async (req, res) => {
  const fields = Object.keys(req.body.user)
  const id = parseInt(req.params.id)
  const { email, firstName, lastName, admin, password, passwordConfirmation } = req.body.user;
  const _user = await db.users.updateUser({id, fields, user: {
    email: email.toLowerCase(), firstName, lastName, admin, password, passwordConfirmation
  }})

  if (!_user.errors) {
    const user = userSerializer(_user)
    return res.status(200).send({user})
  } else {
    const { errors } = _user;
    return res.status(422).send({errors})
  }
}

module.exports.getAll = async (req, res) => {
  const pageNumber = parseInt(req.query.page) || 1
  const pageSize = parseInt(req.query.per) || 10
  const { count, users: _users } = await db.users.getUsers({ pageNumber, pageSize })
  const users = _users.map(user => ({
    user: userSerializer(user),
    devices: user.Devices.map(device => deviceSerializer(device))
  }))

  return res.status(200).send({ count, users })
}

module.exports.getOne = async (req, res) => {
  const id = parseInt(req.params.id)
  const _user = await db.users.getUser({id})

  if (!_user) return res.status(404).send({user: null})

  const _device = await db.devices.findByUserId(id).catch((error) => console.error(error))

  const user = userSerializer(_user);

  let device;

  if (_device) device = deviceSerializer(_device);

  return res.status(200).send({user, device})
}
