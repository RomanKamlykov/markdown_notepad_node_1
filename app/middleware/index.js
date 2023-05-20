// @ts-check
'use strict';
const express = require('express');
const {authRouter} = require('../routers/auth.router');
const {verifyToken} = require('./verify-token');
const {notesRouter} = require('../routers/notes.router');
const {errorHandler} = require('./error-handler');

/**
 * @param {import('express').Express} app
 * @returns {void}
 */
function applyMiddleware(app) {
  app.use(express.json());
  app.use(express.static(`${__dirname}/../../public`));

  app.use('/', authRouter);
  app.use('/', verifyToken, notesRouter);
  app.use(errorHandler);
}

module.exports = {
  applyMiddleware,
};
