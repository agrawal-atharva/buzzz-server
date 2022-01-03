const mongoose = require('mongoose');
const { Schema } = mongoose;

const FriendRequestSchema = new Schema(
	{
		requester: {
			type: String,
			required: true,
		},
		recipient: {
			type: String,
			required: true,
		},
		status: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('FriendRequest', FriendRequestSchema);
