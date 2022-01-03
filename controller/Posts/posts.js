const Post = require('../../model/Post');
const User = require('../../model/User');

const createPost = async (req, res) => {
	const newPost = new Post(req.body);
	try {
		const savePost = await newPost.save();
		res.status(200).json(savePost);
	} catch (err) {
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

const likeDislike = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post.likes.includes(req.body.userId)) {
			await post.updateOne({ $push: req.body.userId });
			res.status(200).json('Post liked');
		} else {
			await updateOne({ $pull: req.body.userId });
			res.status(200).json('Post disliked');
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

const getPost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		res.status(200).json(post);
	} catch (err) {
		res.status(500).json(err);
	}
};

const getAllPost = async (req, res) => {
	try {
		const currentUser = await User.findById(req.params.id);
		const currentUserPosts = await Post.find({ userId: currentUser._id });
		const friendPost = await Promise.all(
			currentUser.friends.map((friendId) => {
				Post.find({ userId: friendId });
			})
		);
		res.json(currentUserPosts).concat(...friendPost);
	} catch (err) {
		res.status(500).json(err);
	}
};

module.exports = {
	createPost,
	updatePost,
	deletePost,
	likeDislike,
	getPost,
	getAllPost,
	commentPost,
};
