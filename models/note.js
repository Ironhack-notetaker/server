const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const noteSchema = new Schema({
  user: String,
  title : String,
  text: String,
  status: String,
  urgency: String,
  category: String,
  date: Number,
  theme: {type: [String], default: []},
  format: String

});

const Note = mongoose.model('Note', noteSchema);


module.exports = Note;