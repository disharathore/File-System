const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const admin = require('firebase-admin');
require('dotenv').config(); // Load .env

// 🔐 Initialize Firebase Admin using environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();
const folderPath = './uploads'; // Folder where your PDFs are stored

// Read all PDF files in the folder
fs.readdirSync(folderPath).forEach(async (file) => {
  if (file.endsWith('.pdf')) {
    try {
      const filePath = path.join(folderPath, file);
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);

      const fullText = pdfData.text;
      const bookFileName = path.basename(file, '.pdf'); // filename without extension

      // 🔍 Match Firestore document using `pdfUrl` field
      const snapshot = await db.collection('books')
        .where('pdfUrl', '==', bookFileName)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const docId = snapshot.docs[0].id;
        await db.collection('books').doc(docId).set({ fullText }, { merge: true });
        console.log(`✅ Updated fullText for book: ${bookFileName}`);
      } else {
        console.warn(`⚠️ No matching Firestore book found with pdfUrl: ${bookFileName}`);
      }

    } catch (error) {
      console.error(`❌ Error processing file ${file}:`, error.message);
    }
  }
});
