// @ts-check
'use strict';
const {notesService} = require('../services/notes.service');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function getHome(req, res) {
  /** @type {string} */
  const author = req['user']['name'];
  const {childNotes, recentNotes} = await notesService.getHome(author);
  res.json({childNotes, recentNotes});
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function getEdit(req, res) {
  /** @type {string} */
  const id = req['params']['id'];
  /** @type {string} */
  const author = req['user']['name'];
  const note = await notesService.getEdit(id, author);
  res.json({note});
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function postNote(req, res) {
  /** @type {string} */
  const nodeId = req['body']['nodeId'];
  /** @type {string} */
  const author = req['user']['name'];
  const note = await notesService.postNote(nodeId, author);
  res.status(201).json({note});
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function getNotes(req, res) {
  /** @type {string} */
  const query = req['query']['query'];
  /** @type {string} */
  const author = req['user']['name'];
  const notes = await notesService.getNotes(query, author);
  res.json({query, notes});
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function getNote(req, res) {
  /** @type {string} */
  const id = req['params']['id'];
  /** @type {string} */
  const author = req['user']['name'];
  const {note, childNotes, path} = await notesService.getNote(id, author);
  res.json({note, childNotes, path});
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function putNote(req, res) {
  /** @type {string} */
  const id = req['params']['id'];
  /** @type {string} */
  const markdown = req['body']['markdown'];
  /** @type {string} */
  const parentId = req['body']['parentId'];
  /** @type {string} */
  const author = req['user']['name'];
  const result = await notesService.putNote(id, {markdown, parentId}, author);
  res.json(result);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function deleteNote(req, res) {
  /** @type {string} */
  const id = req['params']['id'];
  /** @type {string} */
  const author = req['user']['name'];
  const parentNote = await notesService.deleteNote(id, author);
  res.json({parentNote});
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function getTitles(req, res) {
  /** @type {string} */
  const query = req['query']['query'];
  /** @type {string} */
  const author = req['user']['name'];
  const notes = await notesService.getTitles(query, author);
  res.json({query, notes});
}

const notesController = {
  getHome,
  getEdit,
  postNote,
  getNotes,
  getNote,
  putNote,
  getTitles,
  deleteNote,
};

module.exports = {
  notesController,
};
