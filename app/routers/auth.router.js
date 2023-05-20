// @ts-check
'use strict';
const express = require('express');
const {authController} = require('../controllers/auth.controller');

const router = express.Router();

router.route('/register')
  .post(
    authController.postRegister,
  );

router.route('/login')
  .post(
    authController.postLogin,
  );

const authRouter = router;

module.exports = {
  authRouter,
};
