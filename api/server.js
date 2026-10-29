// server için gerekli olanları burada ayarlayın
const express = require('express');

// posts router'ını buraya require edin ve bağlayın
const postsRouter = require('./posts/posts-router');

const server = express();

server.use(express.json());

server.use('/api/posts', postsRouter);

module.exports = server;
