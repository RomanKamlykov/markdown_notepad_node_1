// @ts-check
'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../mongodb/models/User');
const {HttpException} = require('../helpers');
const {secret} = require('../../config');

/**
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
async function postRegister(name, email, password) {
  name = name.toLowerCase();
  email = email.toLowerCase();

  // check if the email is already registered
  const userExist = await /** @type {Promise<User>} */ User.findOne({name, email});
  if (userExist) throw new HttpException('The email is already registered!', 400);

  // create a user
  const hashedPassword = await /** @type {Promise<string>} */ bcrypt.hash(password, 10);
  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  return /** @type {Promise<User>} */ user.save();
}

/**
 * @param {string} name
 * @param {string} password
 * @returns {Promise<string>}
 */
async function postLogin(name, password) {
  name = name.toLowerCase();

  // check if the user is in the database
  const user = await /** @type {Promise<User>} */ User.findOne({name});
  if (!user) throw new HttpException('Unauthorized', 401);

  // check if the password is correct
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new HttpException('Unauthorized', 401);

  // create and assign a token
  const payload = {id: user.id, name: user.name};
  const options = {expiresIn: '24h'};
  return jwt.sign(payload, secret, options);
}

const authService = {
  postRegister,
  postLogin,
};

module.exports = {
  authService,
};
