const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema(
	{
		username: {
			type: String,
			require: true,
			unique: true,
		},
		email: {
			type: String,
			unique: true,
		},
		profilePicture: {
			type: String,
			default: '',
		},
		coverPicture: {
			type: String,
			default: '',
		},
		friends: {
			type: Array,
			default: [],
		},
		isModerator: {
			type: Boolean,
			default: false,
		},
		notification: {
			type: Array,
			default: [],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
