const express = require('express');
const { renderHome, renderCreatePost, searchQuery, renderChat } = require('../controller/indexController');
const router = express.Router();

router.get('/', renderHome);
router.get('/create', renderCreatePost);
router.get('/search/:searchQuery', searchQuery);
router.get('/chat', renderChat);

module.exports = router;