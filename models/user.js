const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  username: String,
  password: String,
  bio: {type: String, default: ""},
  avatar: {type: String, default: ""},
  favorites: {type: [String], default: []},
  teams: {type: [String], default: []}
},
{
  usePushEach: true
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);
module.exports = User;