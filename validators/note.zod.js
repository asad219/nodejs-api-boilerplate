const { z } = require('zod');

const noteFields = {
  title: z
    .string({ error: 'Title is required' })
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters'),
  content: z.string().max(10000, 'Content cannot exceed 10000 characters').optional(),
  isPinned: z.boolean().optional(),
};

const noteCreateSchema = z.object(noteFields);

const noteUpdateSchema = z
  .object(noteFields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'At least one field is required');

const parseNoteCreate = (data) => noteCreateSchema.parse(data);
const parseNoteUpdate = (data) => noteUpdateSchema.parse(data);

module.exports = {
  noteCreateSchema,
  noteUpdateSchema,
  parseNoteCreate,
  parseNoteUpdate,
};
