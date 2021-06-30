const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    default: '',
  },
  markdown: {
    type: String,
    default: '',
  },
  author: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  parentNodeId: {
    type: String,
    default: '',
  },
  nodeId: {
    type: String,
    required: true,
    default: Date.now,
  },
});

const Note = mongoose.model('Note', noteSchema);
module.exports = { Note, noteSchema };
