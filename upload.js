import { db } from './firebase-app.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const published = document.getElementById("published").value;
  const description = document.getElementById("description").value;
  const location = document.getElementById("location")?.value || "Not specified";
  const keywords = document.getElementById("keywords").value.split(",").map(k => k.trim().toLowerCase());

  try {
    await addDoc(collection(db, "books"), {
      title,
      author,
      published,
      description,
      location,
      keywords,
      pdfUrl: ""  // optional field for future use
    });

    document.getElementById("message").textContent = "✅ Book uploaded successfully!";
    document.getElementById("uploadForm").reset();
  } catch (err) {
    console.error("Upload failed:", err);
    document.getElementById("message").textContent = "❌ Upload failed.";
  }
});
