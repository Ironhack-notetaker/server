// const mongoose = require("mongoose");
// const Schema   = mongoose.Schema;

// const userSchema = new Schema({
//   username: String,
//   password: String,
//   email: String,
//   bio: {type: String, default: ""},
//   avatar: {type: String, default: ""},
//   favorites: {type: [String], default: []},
//   teams: {type: [String], default: []}
// },
// {
//   usePushEach: true
// }, {
//   timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
// });

// const User = mongoose.model("User", userSchema);
// module.exports = User;


const mongoose = require("mongoose");

const Schema = mongoose.Schema;




const userSchema = new Schema (
	{

			// fullName: {
			// 	type: String,
			// 	required: [true, 'Please tell us your name']
			// },


			username: {
				type: String,
				required: [true, 'Username is required']
			},


			password: {
				type: String,
				required: [true, 'Encrypted password is empty']
			}


	},



	{
		timestamps: true
	}

);



const User = mongoose.model("User", userSchema );

module.exports = User;