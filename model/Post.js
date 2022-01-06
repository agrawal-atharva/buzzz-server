const mongoose = require('mongoose');
const User = require('./User');
const { Schema } = mongoose;

const PostSchema = new Schema(
	{
		userId: {
			type: String,
			required: true,
			ref: 'User',
		},
		desc: {
			type: String,
			max: 500,
		},
		img: {
			type: String,
		},
		likes: {
			type: Array,
			default: [],
		},
		comments: [
			{
				text: String,
				postedBy: String,
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
