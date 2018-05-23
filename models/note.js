const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const noteSchema = new Schema({
  user: String,
  title : String,
  text: {type: String, default: ''},
  status: {type: String, default: 'unfinished'},
  urgency: String,
  category: {type: String, default: 'Notes'},
  date: {type: Date, default: Date.now()},
  theme: {type: [String], default: []},
  format: {type: String, default: ''}

});

const Note = mongoose.model('Note', noteSchema);


module.exports = Note;