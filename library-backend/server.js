const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bookRoutes = require('./routes/books');
const app = express();

// ✅ Middleware
app.use(cors()); // allow cross-origin frontend requests
app.use(express.json());

// ✅ Optional: Extend server timeout to 2 mins
app.use((req, res, next) => {
res.setTimeout(120000); // 2 minutes
next();
});

// ✅ Serve static PDF files
app.use('/uploads', express.static('uploads'));

// ✅ Routes
app.use('/books', bookRoutes);

// ✅ MongoDB connection
mongoose.connect('mongodb://localhost:27017/library', {
useNewUrlParser: true,
useUnifiedTopology: true,
}).then(() => {
console.log("✅ Connected to MongoDB");
}).catch(err => {
console.error("❌ MongoDB error", err);
});

// ✅ Start server
app.listen(3000, () => {
console.log("✅ Server running on http://localhost:3000");
});