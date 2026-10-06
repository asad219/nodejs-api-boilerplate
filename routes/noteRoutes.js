const express = require('express');
const {
  createNote,
  getNotesByUser,
  getAllNotes,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');
const validateToken = require('../middleware/validateTokenHandler');
const requireAdmin = require('../middleware/requireAdmin');
const requireOwnership = require('../middleware/requireOwnership');
const { validateObjectId } = require('../middleware/validationObjectIdHandler');

const router = express.Router();

// POST /api/v1/notes
router.post('/', validateToken, createNote);

// GET /api/v1/notes?page=1&limit=10 (admin only)
router.get('/', validateToken, requireAdmin, getAllNotes);

// GET /api/v1/notes/user/:userId
router.get('/user/:userId', validateObjectId, validateToken, requireOwnership(), getNotesByUser);

// PUT /api/v1/notes/:noteId (ownership enforced in the controller)
router.put('/:noteId', validateObjectId, validateToken, updateNote);

// DELETE /api/v1/notes/:noteId (ownership enforced in the controller)
router.delete('/:noteId', validateObjectId, validateToken, deleteNote);

module.exports = router;
