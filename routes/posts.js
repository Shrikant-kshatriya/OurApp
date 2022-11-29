const express = require('express');
const { postArticle, singlePagePost, renderEditPage, editPost, deletePost } = require('../controller/postsController');
const router = express.Router();

router.post('/', postArticle);
router.get('/:postid', singlePagePost);
router.put('/:postid', editPost);
router.delete('/:postid', deletePost);
router.get('/edit/:postid', renderEditPage);


module.exports = router;