// @ts-check
'use strict';
const express = require('express');
const {notesController} = require('../controllers/notes.controller');

const router = express.Router();

router.route('/home')
  .get(
    notesController.getHome,
  );

router.route('/edit/:id')
  .get(
    notesController.getEdit,
  );

router.route('/notes')
  .post(
    notesController.postNote,
  )
  .get(
    notesController.getNotes,
  );

router.route('/notes/:id')
  .get(
    notesController.getNote,
  )
  .put(
    notesController.putNote,
  )
  .delete(
    notesController.deleteNote,
  );

router.route('/titles')
  .get(
    notesController.getTitles,
  );

const notesRouter = router;

module.exports = {
  notesRouter,
};
