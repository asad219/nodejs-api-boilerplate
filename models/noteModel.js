const mongoose = require('mongoose');
require('./userModel');
const { Schema, model } = mongoose;

const noteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

noteSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
noteSchema.set('toJSON', { virtuals: true });

const Note = model('Note', noteSchema);

module.exports = { Note };
