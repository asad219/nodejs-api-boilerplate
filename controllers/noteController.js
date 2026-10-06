const asyncHandler = require('express-async-handler');
const { Note } = require('../models/noteModel');
const { parseNoteCreate, parseNoteUpdate } = require('../validators/note.zod');
const { parsePagination } = require('../validators/common.zod');

// Loads a note and enforces that the caller owns it (admins bypass)
const findNoteForUser = async (req, res) => {
  const note = await Note.findById(req.params.noteId);

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  if (req.user.role !== 'admin' && note.userId.toString() !== String(req.user.userId)) {
    res.status(403);
    throw new Error('Access denied: You do not have permission to access this resource');
  }

  return note;
};

const createNote = asyncHandler(async (req, res) => {
  const data = parseNoteCreate(req.body);

  const note = await Note.create({ ...data, userId: req.user.userId });

  res.status(201).json({
    success: true,
    message: 'Note created successfully',
    note,
  });
});

const getNotesByUser = asyncHandler(async (req, res) => {
  const notes = await Note.find({ userId: req.params.userId })
    .select('-__v')
    .sort({ isPinned: -1, createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    notes,
  });
});

const getAllNotes = asyncHandler(async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const skip = (page - 1) * limit;

  const [notes, total] = await Promise.all([
    Note.find()
      .select('-__v')
      .populate('userId', '_id firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Note.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    notes,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

const updateNote = asyncHandler(async (req, res) => {
  const data = parseNoteUpdate(req.body);
  const note = await findNoteForUser(req, res);

  Object.assign(note, data);
  await note.save();

  res.status(200).json({
    success: true,
    message: 'Note updated successfully',
    note,
  });
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = await findNoteForUser(req, res);

  await note.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Note deleted successfully',
  });
});

module.exports = {
  createNote,
  getNotesByUser,
  getAllNotes,
  updateNote,
  deleteNote,
};
