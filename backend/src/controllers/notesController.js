// Placeholder controller for notes CRUD
exports.listNotes = (req, res) => {
  // TODO: Fetch notes from DB for user
  res.json([]);
};

exports.createNote = (req, res) => {
  // TODO: Create note in DB
  res.json({ id: 'note_id', title: req.body.title, body: req.body.body });
};

exports.deleteNote = (req, res) => {
  // TODO: Delete note from DB
  res.status(204).send();
};
