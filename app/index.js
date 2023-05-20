// @ts-check
'use strict';
const express = require('express');
require('express-async-errors');
const {applyMiddleware} = require('./middleware');

const app = express();
applyMiddleware(app);

module.exports = {
  app,
};
