// posts için gerekli routerları buraya yazın
const express = require('express');
const Post = require('./posts-model');

const router = express.Router();

// 1 [GET] /api/posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Gönderiler alınamadı' });
  }
});

// 2 [GET] /api/posts/:id
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Gönderi bilgisi alınamadı' });
  }
});

// 3 [POST] /api/posts
router.post('/', async (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    return res
      .status(400)
      .json({ message: 'Lütfen gönderi için bir title ve contents sağlayın' });
  }
  try {
    const { id } = await Post.insert({ title, contents });
    const newPost = await Post.findById(id);
    res.status(201).json(newPost);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Veritabanına kaydedilirken bir hata oluştu' });
  }
});

// 4 [PUT] /api/posts/:id
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    }
    const { title, contents } = req.body;
    if (!title || !contents) {
      return res
        .status(400)
        .json({ message: 'Lütfen gönderi için title ve contents sağlayın' });
    }
    await Post.update(req.params.id, { title, contents });
    const updatedPost = await Post.findById(req.params.id);
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: 'Gönderi bilgileri güncellenemedi' });
  }
});

// 5 [DELETE] /api/posts/:id
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ message: 'Belirtilen ID li gönderi bulunamadı' });
    }
    await Post.remove(req.params.id);
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Gönderi silinemedi' });
  }
});

// 6 [GET] /api/posts/:id/comments
router.get('/:id/comments', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Girilen ID'li gönderi bulunamadı." });
    }
    const comments = await Post.findPostComments(req.params.id);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Yorumlar bilgisi getirilemedi' });
  }
});

module.exports = router;
