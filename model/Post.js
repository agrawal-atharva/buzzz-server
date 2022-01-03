const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema(
	{
		usedId: {
			type: String,
			required: true,
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
