// models/Book.js
const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  published: String,
  description: String,
  keywords: [String],
  pdfUrl: String,
});

module.exports = mongoose.model('book', BookSchema);
