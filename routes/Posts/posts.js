const express = require('express');
const router = express.Router();
const {
	createPost,
	commentPost,
	getAllPost,
	getSinglePost,
	likePost,
	deletePost,
	disLikePost,
} = require('../../controller/Posts/posts');

//create a post
router.post('/', createPost);
//delete a post
router.delete('/delete/:id', deletePost);
//like a post
router.put('/like/:id', likePost);
//dislike a post
router.put('/dislike/:id', disLikePost);
//comment in post
router.put('/comment', commentPost);
//get a post
router.get('/:id', getSinglePost);
//get following friends posts
router.get('/allpost/:id', getAllPost);

module.exports = router;
