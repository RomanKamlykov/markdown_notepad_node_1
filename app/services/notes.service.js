// @ts-check
'use strict';
const {Note} = require('../mongodb/models/Note');
const {HttpException, titleMaker} = require('../helpers');

/**
 * @param {string} author
 * @returns {Promise<{childNotes: Note[], recentNotes: Note[]}>}
 */
async function getHome(author) {
  const [childNotes, recentNotes] = await /** @type {Promise<[Note[], Note[]]>} */ Promise.all([
    Note.find({author, parentNodeId: ''}).sort({title: 'asc'}),
    Note.find({author}).sort({updatedAt: 'desc'}).limit(10),
  ]);
  return {childNotes, recentNotes};
}

/**
 * @param {string} id
 * @param {string} author
 * @returns {Promise<Note>}
 */
function getEdit(id, author) {
  return /** @type {Promise<Note>} */ Note.findOne({author, _id: id});
}

/**
 * @param {string} parentNodeId
 * @param {string} author
 * @returns {Promise<Note>}
 */
function postNote(parentNodeId, author) {
  const note = new Note({
    author,
    parentNodeId,
  });
  return /** @type {Promise<Note>} */ note.save();
}

/**
 * @param {string} query
 * @param {string} author
 * @returns {Promise<Note[]>}
 */
function getNotes(query, author) {
  return /** @type {Promise<Note[]>} */ Note.find({author, markdown: {$regex: query, $options: 'i'}}).sort({updatedAt: 'desc'});
}

/**
 * @param {string} id
 * @param {string} author
 * @returns {Promise<{note: Note, childNotes: Note[], path: Note[]}>}
 */
async function getNote(id, author) {
  const note = await /** @type {Promise<Note>} */ Note.findOne({author, _id: id});
  const childNotes = await /** @type {Promise<Note[]>} */ Note.find({author, parentNodeId: note.nodeId}).sort({title: 'asc'});
  /** @type {Note[]} */
  const path = [note];
  for (let i = 0; i < 2; i += 1) {
    const x = await /** @type {Promise<Note>} */ Note.findOne({author, nodeId: path[0].parentNodeId});
    if (!x) break;
    path.unshift(x);
  }
  return {note, childNotes, path};
}

/**
 * @param {string} id
 * @param {string} [markdown]
 * @param {string} [parentId]
 * @param {string} author
 * @returns {Promise<Note | Note[]>}
 */
async function putNote(id, {markdown, parentId}, author) {
  // update the markdown & title
  if (id && markdown) {
    return /** @type {Promise<Note>} */ Note.findOneAndUpdate(
      {author, _id: id},
      {$set: {markdown, title: titleMaker(markdown), updatedAt: Date.now()}},
      {new: true},
    );
  }

  // update the parentId
  if (id && parentId) {
    // ----- checks -----
    // check if passed note IDs are invalid
    const [note, parentNote] = await /** @type {Promise<[Note, Note]>} */ Promise.all([
      Note.findOne({author, _id: id}),
      Note.findOne({author, _id: parentId}),
    ]);
    // check if a parent note exist
    if (parentNote === null) throw new HttpException("The passed note ID doesn't exist!", 400);
    // check if a current note ID and a parent note ID are the same
    if (note.id === parentNote.id) throw new HttpException('The passed parent ID is equal to the current note ID!', 400);
    // check if the new path is valid
    let x = parentNote; let loopLimit = 30;
    while (x.parentNodeId && loopLimit) {
      x = await /** @type {Promise<Note>} */ Note.find({author, nodeId: x.parentNodeId});
      // x = allNotes.find((el) => el.nodeId === x.parentNodeId);
      loopLimit -= 1;
      if (loopLimit === 0) throw new HttpException('To deep to move :)', 400);
      if (x.id === note.id) throw new HttpException('The passed parent ID is a child to the current note ID!', 400);
    }

    // ----- action -----
    const updatedNote = await /** @type {Promise<Note>} */ Note.findOneAndUpdate(
      {author, _id: id},
      {$set: {parentNodeId: parentNote.nodeId, updatedAt: Date.now()}},
      {new: true},
    );

    /** @type {Note[]} */
    const updatedPath = [updatedNote];
    for (let i = 0; i < 2; i += 1) {
      const x2 = await /** @type {Promise<Note>} */ Note.findOne({author, nodeId: updatedPath[0].parentNodeId});
      if (!x2) break;
      updatedPath.unshift(x2);
    }
    return updatedPath;
  }

  throw HttpException('Bad Request', 400);
}

/**
 * @param {string} id
 * @param {string} author
 * @returns {Promise<Note>}
 */
async function deleteNote(id, author) {
  // get the note
  const note = await /** @type {Promise<Note>} */ Note.findOne({author, _id: id});
  // check if there is a child note
  const childNote = await /** @type {Promise<Note>} */ Note.findOne({author, parentNodeId: note.nodeId});
  if (childNote) throw new HttpException('The note has a child note!', 400);
  // delete the note
  await Note.findOneAndDelete({author, _id: id});
  // return a parent note
  return /** @type {Promise<Note>} */ Note.findOne({author, nodeId: note.parentNodeId});
}

/**
 * @param {string} query
 * @param {string} author
 * @returns {Promise<Note[]>}
 */
function getTitles(query, author) {
  return /** @type {Promise<Note[]>} */ Note.find({author, title: {$regex: query, $options: 'i'}}).sort({updatedAt: 'desc'});
}

const notesService = {
  getHome,
  getEdit,
  postNote,
  getNotes,
  getNote,
  putNote,
  deleteNote,
  getTitles,
};

module.exports = {
  notesService,
};
