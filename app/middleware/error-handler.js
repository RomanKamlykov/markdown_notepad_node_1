// @ts-check
'use strict';
const http = require('http');
const {HttpException} = require('../helpers');

/**
 * @param {unknown} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof HttpException) {
    const {message, statusCode} = err;
    const error = http.STATUS_CODES[statusCode];
    res.status(statusCode).json({message, statusCode, error});
  } else if (err instanceof Error) {
    const {message} = err;
    const statusCode = 500;
    const error = http.STATUS_CODES[statusCode];
    res.status(statusCode).json({message, statusCode, error});
  } else {
    res.sendStatus(500);
  }

  next();
}

module.exports = {
  errorHandler,
};
