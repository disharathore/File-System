const express = require('express');
const router = express.Router();
const multer = require('multer');
const Book = require('../models/Book');

// ✅ Search by keyword(s)
router.get('/search', async (req, res) => {
let keywords = req.query.keyword;
if (!keywords) return res.status(400).json({ message: 'Keyword required' });

const keywordArray = keywords.toLowerCase().split(',').map(k => k.trim());

const books = await Book.find({
keywords: { $all: keywordArray }
});

res.json(books);
});

// ✅ Multer config for file uploads
const storage = multer.diskStorage({
destination: (req, file, cb) => {
cb(null, 'uploads'); // make sure 'uploads/' exists
},
filename: (req, file, cb) => {
cb(null, file.originalname); // or use Date.now() + '-' + file.originalname for unique names
}
});

const upload = multer({
storage: storage,
limits: { fileSize: 25 * 1024 * 1024 } // 25 MB limit
});

// ✅ Upload a new book (PDF + metadata)
router.post('/upload', upload.single('pdf'), async (req, res) => {
console.log('🛠 req.body:', req.body);
console.log('🛠 req.file:', req.file);

const { title, author, published, description, keywords } = req.body;
if (!req.file) return res.status(400).json({ message: "No PDF uploaded" });

const book = new Book({
title,
author,
published,
description,
keywords: keywords.split(',').map(k => k.trim().toLowerCase()),
pdfUrl: 'uploads/' + req.file.filename
});

await book.save();
res.status(201).json({ message: "✅ Book uploaded", book });
});

module.exports = router;

