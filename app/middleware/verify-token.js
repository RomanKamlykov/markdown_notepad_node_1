// @ts-check
'use strict';
const jwt = require('jsonwebtoken');
const {secret} = require('../../config');
const {HttpException} = require('../helpers');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
function verifyToken(req, res, next) {
  const authorization = req['headers']['authorization'];
  if (!authorization) throw new HttpException('Unauthorized', 401);

  const token = authorization.split(' ')[1];
  if (!token) throw new HttpException('Unauthorized', 401);

  try {
    req['user'] = jwt.verify(token, secret);
    next();
  } catch (e) {
    res.sendStatus(401);
  }
}

module.exports = {
  verifyToken,
};
