/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const { uri, options } = require('./config');
const authRouter = require('./api/routes/auth');
const notesRouter = require('./api/routes/notes');
const verifyToken = require('./api/middleware/verifyToken');

const app = express();
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/', authRouter);
app.use('/', verifyToken, notesRouter);

const PORT = process.env.PORT || 5000;

mongoose.connect(uri, options, () => {
  app.listen(PORT, console.log(`MongoDB connected. App available on http://localhost:${PORT}.`));
});
