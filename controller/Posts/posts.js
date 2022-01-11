const Post = require('../../model/Post');
const User = require('../../model/User');

const createPost = async (req, res) => {
	const newPost = new Post(req.body);
	console.log('New Post', newPost);
	try {
		const savePost = await newPost.save();
		console.log('Saved Post', savePost);
		res.status(201).json(savePost);
	} catch (err) {
		console.log('Error::', err);
		res.status(500).json(err);
	}
};

const updatePost = async (req, res) => {
	const post = Post.findById(req.params.id);
	try {
		if (post.userId === req.body.userId) {
			await post.updateOne({ $set: req.body });
			res.status(200).json('Post updated successfully');
		} else {
			res.status(403).json('You can update only your post');
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

const deletePost = async (req, res) => {
	const post = Post.findById(req.params.id);
	try {
		if (post.userId === req.body.userId) {
			await post.deleteOne();
			res.status(200).json('Post deleted successfully');
		} else {
			res.status(403).json('You can delete only your post');
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

const likePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post.likes.includes(req.body.userId)) {
			await post
				.updateOne({ $push: { likes: req.body.userId } })
				.populate('userId');
			res.status(200).json(post);
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

const disLikePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.likes.includes(req.body.userId)) {
			await post.updateOne({ $pull: req.body.userId });
			res.status(200).json(post);
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

const commentPost = async (req, res) => {
	try {
		const newComment = {
			text: req.body.text,
			postedBy: req.user._id,
		};
		const comment = await Post.findByIdAndUpdate(req.params.id, {
			$push: { newComment },
		});
		res.status(200).json(comment);
	} catch (err) {
		res.status(500).json(err);
	}
};

const getSinglePost = async (req, res) => {
	try {
		const post = await Post.find({ postId: req.params.id });
		res.status(200).json(post);
	} catch (err) {
		res.status(500).json(err);
	}
};

const getAllPost = async (req, res) => {
	try {
		const getAllPost = await Post.find({
			userId: { $in: [req.user._id, ...req.user.friends] },
		}).populate('userId');
		console.log('AllPost', getAllPost);
		res.status(200).json(getAllPost);
	} catch (err) {
		res.status(500).json(err);
	}
};

module.exports = {
	createPost,
	updatePost,
	deletePost,
	likePost,
	disLikePost,
	getSinglePost,
	getAllPost,
	commentPost,
};
