/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
const router = require('express').Router();
const titleMaker = require('../utils/titleMaker');
const { Note } = require('../mongodb/models/Note');

// ----- home page -----
router.get('/home', async (req, res) => {
  const { name: author } = req.user;

  try {
    // get child notes
    const childNotes = await Note.find(
      { author, parentNodeId: '' },
    ).sort(
      { title: 'asc' },
    );

    // get recent notes
    const recentNotes = await Note.find(
      { author },
    ).sort(
      { updatedAt: 'desc' },
    ).limit(10);

    res.json({ childNotes, recentNotes });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// ----- edit page -----
router.get('/edit/:id', async (req, res) => {
  const { name: author } = req.user;
  const { id } = req.params;

  try {
    // get a note
    const note = await Note.findOne(
      { author, _id: id },
    );

    res.json({ note });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// ----- search for notes -----
router.get('/notes', async (req, res) => {
  const { name: author } = req.user;
  const { query } = req.query;

  try {
    // get some notes
    const notes = await Note.find(
      { author, markdown: { $regex: query, $options: 'i' } },
    ).sort(
      { updatedAt: 'desc' },
    );

    res.json({ query, notes });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// ----- create a note -----
router.post('/notes', async (req, res) => {
  const { name: author } = req.user;
  const { nodeId } = req.body;

  try {
    // create a new note
    const note = new Note({
      author,
      parentNodeId: nodeId,
    });

    // save the note
    const createdNote = await note.save();

    res.status(201).json({ note: createdNote });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// ----- read a note -----
router.get('/notes/:id', async (req, res) => {
  const { name: author } = req.user;
  const { id } = req.params;

  try {
    // get a note
    const note = await Note.findOne(
      { author, _id: id },
    );
    // get child notes
    const childNotes = await Note.find(
      { author, parentNodeId: note.nodeId },
    ).sort(
      { title: 'asc' },
    );
    // get a path
    const path = [note];
    for (let i = 0; i < 2; i += 1) {
      const x = await Note.findOne(
        { author, nodeId: path[0].parentNodeId },
      );
      if (!x) break;
      path.unshift(x);
    }

    res.json({ note, childNotes, path });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// ----- update a note -----
router.put('/notes/:id', async (req, res) => {
  const { name: author } = req.user;
  const { id } = req.params;
  const { markdown, parentId } = req.body;

  try {
    // 1. update the markdown & title
    if (id && markdown) {
      const updatedNote = await Note.findOneAndUpdate(
        { author, _id: id },
        { $set: { markdown, title: titleMaker(markdown), updatedAt: Date.now() } },
        { new: true },
      );

      res.json({ note: updatedNote });
    }

    // 2. update the parentId
    if (id && parentId) {
      // ----- checks -----
      // check if passed note IDs are invalid
      const note = await Note.findOne(
        { author, _id: id },
      );
      const parentNote = await Note.findOne(
        { author, _id: parentId },
      );
      // check if a parent note exist
      if (parentNote === null) throw new Error('The passed note ID doesn\'t exist!');
      // check if a current note ID and a parent note ID are the same
      if (note.id === parentNote.id) throw new Error('The passed parent ID is equal to the current note ID!');
      // check if the new path is valid
      let x = parentNote; let loopLimit = 30;
      while (x.parentNodeId && loopLimit) {
        x = await Note.find(
          { author, nodeId: x.parentNodeId },
        );
        // x = allNotes.find((el) => el.nodeId === x.parentNodeId);
        loopLimit -= 1;
        if (loopLimit === 0) throw new Error('To deep to move :)');
        if (x.id === note.id) throw new Error('The passed parent ID is a child to the current note ID!');
      }

      // ----- action -----
      const updatedNote = await Note.findOneAndUpdate(
        { author, _id: id },
        { $set: { parentNodeId: parentNote.nodeId, updatedAt: Date.now() } },
        { new: true },
      );

      const updatedPath = [updatedNote];
      for (let i = 0; i < 2; i += 1) {
        const x2 = await Note.findOne(
          { author, nodeId: updatedPath[0].parentNodeId },
        );
        if (!x2) break;
        updatedPath.unshift(x2);
      }
      res.json({ path: updatedPath });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// ----- delete a note -----
router.delete('/notes/:id', async (req, res) => {
  const { name: author } = req.user;
  const { id } = req.params;

  try {
    // get the note
    const note = await Note.findOne(
      { author, _id: id },
    );
    // check if there is a child note
    const childNote = await Note.findOne(
      { author, parentNodeId: note.nodeId },
    );
    if (childNote) throw new Error('The note has a child note!');

    // delete the note
    await Note.findOneAndDelete(
      { author, _id: id },
    );

    // find a parent note
    const parentNote = await Note.findOne(
      { author, nodeId: note.parentNodeId },
    );

    // redirect to the parent note
    res.json({ parentNote });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
