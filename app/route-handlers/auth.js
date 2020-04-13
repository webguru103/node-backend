const jwt = require('jwt-simple');
const sId = 'AC543678b029d6155187817b3ddbdd3220';
const authKey = '42f00c40a5b1fc86e3b02ede6a176d47';
const twilioClient = require('twilio')(sId, authKey);
const db = require('../data-access');
const { userSerializer } = require('../serializers');

module.exports.emailLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) return res.sendStatus(401);

    const user = await db.users.findByEmail(email.toLowerCase());
    if (!user) return res.sendStatus(401);

    const passwordMatches = user.authenticate(password)
    if (!passwordMatches) return res.sendStatus(401);

    const token = jwt.encode({ id: user.id, email: email }, process.env.JWT_SECRET);

    res.status(200).json({ id: user.id, token: token });
  } catch (errors) {
    res.status(400).json({errors})    
  }
}

module.exports.mobileLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) return res.sendStatus(401);

    const user = await db.users.findByEmail(email.toLowerCase());
    if (!user) return res.sendStatus(401);

    const passwordMatches = user.authenticate(password)
    if (!passwordMatches) return res.sendStatus(401);

    const token = jwt.encode({ id: user.id, email: email }, process.env.JWT_SECRET);

    res.status(200).json({ user: userSerializer(user), token });
  } catch (errors) {
    res.status(400).json({errors})    
  }
}

module.exports.mobileRegister = async (req, res) => {
  try {
    const {
      email,
      firstName,
      lastName,
      password,
      passwordConfirmation,
      admin,
      phone
    } = req.body;
    const user = await db.users.createUser({
      email: email.toLowerCase(),
      firstname: firstName,
      lastname: lastName,
      password,
      passwordconfirmation: passwordConfirmation,
      admin,
      phone
    });
  
    if (user && !user.errors) {
      const token = jwt.encode({ id: user.id, email: email }, process.env.JWT_SECRET);
      res.status(200).json({ user: userSerializer(user), token });
    } else {
      const { errors } = user;
      return res.status(422).send({errors})
    }

  } catch (errors) {
    res.status(400).json({errors})
  }
}

module.exports.resetPassword = async (req, res) => {
  try {
    const { newPassowrd, passwordConfirmation, user } = req.body;
    const id = parseInt(user.id);
    const fields = [
      'password', 'passwordConfirmation'
    ];
    const updatedUser = {
      ...user,
      password: newPassowrd,
      passwordConfirmation,
    }
    const newUser = await db.users.updateUser({ id, fields, user: { ...updatedUser } });
    if (!newUser) return res.sendStatus(401);

    res.status(200).json({ status: 'Updated Password!' });
  } catch (errors) {
    res.status(400).json({errors})
  }
}

const getRandomCode = () => {
  const codes = [];
  for (let i = 0; i < 6; i++) {
    codes.push(Math.floor(Math.random() * Math.floor(10)).toString());
  }

  return codes.join('');
}

module.exports.phoneVerificationRequest = async (req, res) => {
  try {
    const from = '+14804705551';
    const { phoneNumber } = req.body;
    const verificationCode = getRandomCode();

    const user = await db.users.findByPhone(phoneNumber);
    if (!user) {
      return res.sendStatus(401);
    }

    const message = await twilioClient.messages.create({
      body: verificationCode,
      from,
      to: phoneNumber
    });

    res.status(200).json({ status: message.status, user: userSerializer(user), code: verificationCode });
  } catch (errors) {
    res.status(400).json({errors});
  }
}
