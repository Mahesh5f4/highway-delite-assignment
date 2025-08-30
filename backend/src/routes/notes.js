const express = require('express');
const router = express.Router();
// TODO: Import controllers & auth middleware

// GET /api/notes
router.get('/', (req, res) => {
  // ...List notes logic...
  res.json([]);
});

// POST /api/notes
router.post('/', (req, res) => {
  // ...Create note logic...
  res.json({ id: 'note_id', title: req.body.title, body: req.body.body });
});

// DELETE /api/notes/:id
router.delete('/:id', (req, res) => {
  // ...Delete note logic...
  res.status(204).send();
});

module.exports = router;
