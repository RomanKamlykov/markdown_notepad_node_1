// @ts-check
'use strict';
const mongoose = require('mongoose');
const {uri, options, port} = require('./config');
const {app} = require('./app');

function main() {
  try {
    mongoose.connect(uri, options, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      } else {
        console.log('MongoDB connected.');
        app.listen(port, () => {
          console.log(`Server started on port ${port}`);
        });
      }
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
