const Post = require('../../model/Post');
const User = require('../../model/User');

const createPost = async (req, res) => {
	const newPost = new Post(req.body);
	try {
		const savePost = await newPost.save();
		res.status(201).json(savePost);
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

const likePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post.likes.includes(req.body.userId)) {
			if (post.dislikes.includes(req.body.userId)) {
				await post
					.updateOne({
						$push: { likes: req.body.userId },
						$pull: { dislikes: req.body.userId },
					})
					.populate('userId');
			} else {
				await post.updateOne({ $push: { likes: req.body.userId } });
			}
			res.status(200).json(post);
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

const disLikePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post.dislikes.includes(req.body.userId)) {
			if (post.likes.includes(req.body.userId)) {
				await post.updateOne({
					$pull: { likes: req.body.userId },
					$push: { dislikes: req.body.userId },
				});
			} else {
				await post
					.updateOne({ push: { dislikes: req.body.userId } })
					.populate('userId');
			}
		}
		res.status(200).json(post);
	} catch (err) {
		res.status(500).json(err);
	}
};

const commentPost = async (req, res) => {
	try {
		const newComment = {
			text: req.body.text,
			postedBy: req.body.postedBy,
			createdAt: Date.now(),
			img: req.user.profilePicture,
		};
		console.log(newComment);
		const comment = await Post.findByIdAndUpdate(req.params.id, {
			$push: { comments: newComment },
		});
		res.status(200).json(comment);
	} catch (err) {
		res.status(500).json(err);
	}
};

const getAllComments = async (req, res) => {
	try {
		const postId = req.params.id;
		const post = await Post.findById(postId);
		const allComments = post.comments;
		res.status(200).json(allComments);
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
		const currentUser = await User.findById(req.user._id);
		const currentUserFriend = currentUser.friends;
		const getAllPost = await Post.find({
			userId: { $in: [req.params.id, ...currentUserFriend] },
		})
			.populate('userId')
			.sort({ createdAt: -1 });
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
	getAllComments,
};
