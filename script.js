import { db } from './firebase-app.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const keywordInput = document.getElementById("keyword");
    const listDiv = document.querySelector(".list");
    const bookDiv = document.getElementById("book");

    let activeKeywords = [];

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const newKeyword = keywordInput.value.trim().toLowerCase();
        if (!newKeyword || activeKeywords.includes(newKeyword)) return;

        activeKeywords.push(newKeyword);
        keywordInput.value = "";
        listDiv.innerHTML = "🔍 Searching...";
        bookDiv.innerHTML = "";

        try {
            // Fetch books from Firestore
            const booksCol = collection(db, "books");
            const snapshot = await getDocs(booksCol);
            const allBooks = snapshot.docs.map(doc => doc.data());

            // Filter books using keywords
            const filteredBooks = allBooks.filter(book =>
                activeKeywords.some(kw =>
                    book.title.toLowerCase().includes(kw) ||
                    book.author.toLowerCase().includes(kw) ||
                    (book.description?.toLowerCase().includes(kw) || "").includes(kw) ||
                    (book.keywords || []).some(k => k.toLowerCase().includes(kw))
                )
            );

            // If no results
            if (!filteredBooks.length) {
                listDiv.innerHTML = `<p>No books found for keywords: <strong>${activeKeywords.join(", ")}</strong></p>`;
                return;
            }

            // Show filtered titles
            listDiv.innerHTML = `<p style="margin-bottom: 0.5em;">Filtered by: <strong>${activeKeywords.join(", ")}</strong></p>`;

            filteredBooks.forEach((book) => {
                const item = document.createElement("div");
                item.textContent = book.title;
                item.style.cursor = "pointer";
                item.style.margin = "0.3em 0";
                item.style.fontWeight = "bold";
                item.style.color = "#000d36";

                item.addEventListener("click", () => {
                    bookDiv.innerHTML = `
                        <div style="color: white; font-family: Montserrat; padding: 1em;">
                            <h2>${book.title}</h2>
                            <p><strong>Author:</strong> ${book.author}</p>
                            <p><strong>Published:</strong> ${book.published}</p>
                            <p><strong>Description:</strong> ${book.description}</p>
                            <p><strong>Location:</strong> ${book.location || "Not specified"}</p>
                            <iframe src="uploads/${encodeURIComponent(book.pdfUrl)}.pdf" 
                                    width="100%" height="400px" style="border:none; margin-top:1em;"></iframe>
                        </div>
                    `;
                });

                listDiv.appendChild(item);
            });

        } catch (err) {
            console.error("Error loading books:", err);
            listDiv.innerHTML = "<p style='color:red;'>Error loading books 😓</p>";
        }
    });
    const resetBtn = document.getElementById("reset");

    resetBtn.addEventListener("click", (e) => {
        e.preventDefault(); // prevent default reset behavior

        // Clear keywords and UI
        activeKeywords = [];
        keywordInput.value = "";
        listDiv.innerHTML = "";
        bookDiv.innerHTML = "";
    });

});
