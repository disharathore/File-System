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
        const booksCol = collection(db, "books");
        const snapshot = await getDocs(booksCol);
        const allBooks = snapshot.docs.map(doc => doc.data());

        const filteredBooks = allBooks.filter(book =>
            activeKeywords.every(kw =>
                book.title.toLowerCase().includes(kw) ||
                book.author.toLowerCase().includes(kw) ||
                (book.description?.toLowerCase().includes(kw) || "").includes(kw) ||
                (book.keywords || []).some(k => k.toLowerCase().includes(kw))
            )
        );

        if (!filteredBooks.length) {
            listDiv.innerHTML = `<p>No books found for keywords: <strong>${activeKeywords.join(", ")}</strong></p>`;
            return;
        }

        listDiv.innerHTML = `<p style="margin-bottom: 0.5em;">Filtered by: <strong>${activeKeywords.join(", ")}</strong></p>`;

        filteredBooks.forEach((book) => {
            const item = document.createElement("div");
            item.textContent = book.title;
            item.style.cursor = "pointer";
            item.style.margin = "0.3em 0";
            item.style.fontWeight = "bold";
            item.style.color = "#000d36";
            item.style.position = "relative";

            // Tooltip creation
            const tooltip = document.createElement("div");
            tooltip.className = "hover-box";
            tooltip.innerHTML = `
                <strong>Author:</strong> ${book.author}<br>
                <strong>Published:</strong> ${book.published}
            `;
            tooltip.style.position = "absolute";
            tooltip.style.top = "0";
            tooltip.style.left = "100%"; // aligns it directly to the right  
            tooltip.style.marginLeft = "8px"; // small gap from the title
            tooltip.style.background = "#fff";
            tooltip.style.padding = "0.4em 0.6em";
            tooltip.style.border = "1px solid #ccc";
            tooltip.style.borderRadius = "4px";
            tooltip.style.fontSize = "0.85rem";
            tooltip.style.fontFamily = "Nunito";
            tooltip.style.color = "#000";
            tooltip.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
            tooltip.style.whiteSpace = "nowrap";
            tooltip.style.zIndex = "10";
            tooltip.style.display = "none";


            item.addEventListener("mouseenter", () => {
                tooltip.style.display = "block";
            });
            item.addEventListener("mouseleave", () => {
                tooltip.style.display = "none";
            });

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

            item.appendChild(tooltip);
            listDiv.appendChild(item);
        });

    } catch (err) {
        console.error("Error loading books:", err);
        listDiv.innerHTML = "<p style='color:red;'>Error loading books 😓</p>";
    }
});
});