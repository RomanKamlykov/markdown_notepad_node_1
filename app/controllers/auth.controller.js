// @ts-check
'use strict';
const {authService} = require('../services/auth.service');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function postRegister(req, res) {
  /** @type {string} */
  const name = req['body']['name'];
  /** @type {string} */
  const email = req['body']['email'];
  /** @type {string} */
  const password = req['body']['password'];
  await authService.postRegister(name, email, password);
  res.sendStatus(201);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function postLogin(req, res) {
  /** @type {string} */
  const name = req['body']['name'];
  /** @type {string} */
  const password = req['body']['password'];
  const token = await authService.postLogin(name, password);
  res.json({token});
}

const authController = {
  postRegister,
  postLogin,
};

module.exports = {
  authController,
};
