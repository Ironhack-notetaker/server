const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const teamSchema = new Schema({
  user : [String],
  note: [{type: Schema.Types.ObjectId}],
  teamName: String,
  urgency: String,
  status: String,
  theme: {type: [String], default: []}
});

const Team = mongoose.model('Team', teamSchema);


module.exports = Team;