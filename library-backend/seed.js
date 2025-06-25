const mongoose = require('mongoose');
const Book = require('./models/Book');

mongoose.connect('mongodb://localhost:27017/library', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

const seedBooks = async () => {
  // remove this line if you don’t want to delete old books:
  // await Book.deleteMany(); 

  await Book.insertMany([
    {
      title: "Wings of Fire",
      keywords: ["abdul kalam", "biography", "missile man"],
      pdfUrl: "uploads/sapiens.pdf",
      author: "A.P.J Abdul Kalam",
      published: "1999",
      description: "An autobiography of A.P.J Abdul Kalam – Missile Man of India."
    },
    {
      title: "Sapiens: A Brief History of Humankind",
      keywords: ["history", "human", "evolution", "sapiens"],
      pdfUrl: "uploads/sapiens.pdf",
      author: "Yuval Noah Harari",
      published: "2011",
      description: "A thought-provoking journey through the history and impact of Homo sapiens."
    },
    {
      title: "The alchemist",
      keywords: ["Alchemy", "paulo"],
      pdfUrl: "uploads/The Alchemist by Paulo Coehlo",
      author: "Paulo Coelho",
      published: "2011",
      description: "A thought-provoking journey through the history and impact of Homo sapiens."
    }
    // ➕ Add more real books like this
  ]);

  console.log("✅ Book data inserted!");
  mongoose.disconnect();
};

seedBooks();
