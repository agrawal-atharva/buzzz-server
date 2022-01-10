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
		friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		isModerator: {
			type: Boolean,
			default: false,
		},
		notification: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		requestSent: {
			type: Array,
			default: [],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
