/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../mongodb/models/User');
const { secret } = require('../../config');

// ----- register -----
router.post('/register', async (req, res) => {
  const name = req.body.name.toLowerCase();
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  try {
    // check if the email is already registered
    const userExist = await User.findOne({ name, email });
    if (userExist) throw new Error('The email is already registered!');

    // create a user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

// ----- login -----
router.post('/login', async (req, res) => {
  const name = req.body.name.toLowerCase();
  const password = req.body.password;

  try {
    // check if the user is in the database
    const user = await User.findOne({ name });
    if (!user) throw new Error('The user isn\'t in the database!');

    // check if the password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('The password is invalid!');

    // create and assign a token
    const payload = { id: user.id, name: user.name };
    const options = { expiresIn: '4h' };
    const token = jwt.sign(payload, secret, options);
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

module.exports = router;
