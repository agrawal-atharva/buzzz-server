const express = require('express');
const router = express.Router();
const {
	createPost,
	commentPost,
	getAllPost,
	getPost,
	likeDislike,
	deletePost,
} = require('../../controller/Posts/posts');

//create a post
router.post('/', createPost);
//delete a post
router.delete('/delete/:id', deletePost);
//like a post
router.put('/like_dislike/:id', likeDislike);
//comment in post
router.put('/comment', commentPost);
//get a post
router.get('/:id', getPost);
//get following friends posts
router.get('/allpost/:id', getAllPost);

module.exports = router;
