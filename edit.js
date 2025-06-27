import { db, storage } from './firebase-app.js';
import { getDocs, collection, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const formFields = document.getElementById("formFields");
const searchBtn = document.getElementById("searchBtn");
const cancelBtn = document.getElementById("cancelBtn");
const searchTitle = document.getElementById("searchTitle");

let selectedDocId = null;
let keywords = [];

// 🔁 Renders keyword chips with delete ❌
function renderKeywords() {
    const container = document.getElementById("keywords-container");
    container.innerHTML = "";

    keywords.forEach((kw, index) => {
        const span = document.createElement("span");
        span.textContent = kw + " ❌";
        span.style.padding = "5px 10px";
        span.style.margin = "5px";
        span.style.border = "1px solid black";
        span.style.borderRadius = "8px";
        span.style.cursor = "pointer";
        span.style.display = "inline-block";
        span.style.background = "#f2f2f2";

        span.addEventListener("click", () => {
            keywords.splice(index, 1);
            renderKeywords();
        });

        container.appendChild(span);
    });
}

// ➕ Add new keyword
window.addKeyword = function () {
    const input = document.getElementById("new-keyword");
    const newKw = input.value.trim();
    if (newKw && !keywords.includes(newKw)) {
        keywords.push(newKw);
        input.value = "";
        renderKeywords();
    }
};

searchBtn.addEventListener("click", async () => {
    try {
        const titleToFind = searchTitle.value.trim().toLowerCase();
        const booksCol = collection(db, "books");
        const snapshot = await getDocs(booksCol);
        const bookDoc = snapshot.docs.find(doc => doc.data().title?.toLowerCase() === titleToFind);

        if (!bookDoc) {
            alert("No such book found!");
            return;
        }

        const data = bookDoc.data();
        selectedDocId = bookDoc.id;

        document.getElementById("author").value = data.author || "";
        document.getElementById("description").value = data.description || "";
        document.getElementById("published").value = data.published || "";
        document.getElementById("title").value = data.title || "";
        document.getElementById("location").value = data.location || "";

        keywords = Array.isArray(data.keywords) ? [...data.keywords] : [];
        renderKeywords();

        formFields.style.display = "block";
    } catch (err) {
        console.error("🔥 Error during search:", err);
        alert("Error searching book!");
    }
});

cancelBtn.addEventListener("click", () => {
    formFields.style.display = "none";
    selectedDocId = null;
    searchTitle.value = "";
    keywords = [];
});

document.getElementById("editForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!selectedDocId) {
        alert("Search a book first!");
        return;
    }

    const file = document.getElementById("pdfUpload").files[0];
    const updatedData = {
        author: document.getElementById("author").value,
        description: document.getElementById("description").value,
        published: document.getElementById("published").value,
        title: document.getElementById("title").value,
        location: document.getElementById("location").value,
        keywords: keywords
    };

    try {
        if (file) {
            console.log("📁 Uploading file:", file.name);
            const pdfRef = ref(storage, `uploads/${file.name}`);
            await uploadBytes(pdfRef, file);
            console.log("✅ PDF uploaded");

            updatedData.pdfUrl = file.name;
        }

        const bookRef = doc(db, "books", selectedDocId);
        await updateDoc(bookRef, updatedData);
        console.log("✅ Firestore updated with:", updatedData);

        alert("✅ Book updated successfully!");
        document.getElementById("editForm").reset();
        formFields.style.display = "none";
        selectedDocId = null;
        keywords = [];
    } catch (err) {
        console.error("🔥 Error during update:", err);
        alert("Something went wrong: " + err.message);
    }
});
