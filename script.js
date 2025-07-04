import { db } from './firebase-app.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const keywordInput = document.getElementById("keyword");
    const listDiv = document.querySelector(".list");
    const bookDiv = document.getElementById("book");
    const resetBtn = document.getElementById("reset");

    let activeKeywords = [];

    // 🟨 Tooltip setup
    const globalTooltip = document.createElement("div");
    globalTooltip.className = "hover-box";
    Object.assign(globalTooltip.style, {
        position: "absolute",
        background: "#fff",
        padding: "0.5em 0.7em",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "0.9rem",
        fontFamily: "Nunito",
        color: "#000",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        whiteSpace: "nowrap",
        zIndex: "10",
        display: "none"
    });
    document.body.appendChild(globalTooltip);

    // 🔍 SEARCH FUNCTION
    async function runSearch() {
        listDiv.innerHTML = "🔍 Searching...";
        bookDiv.innerHTML = "";

        try {
            const booksCol = collection(db, "books");
            const snapshot = await getDocs(booksCol);
            const allBooks = snapshot.docs.map(doc => doc.data());

            const filteredBooks = allBooks.filter(book =>
                activeKeywords.every(kw => {
                    const title = (book.title || "").toLowerCase();
                    const author = (book.author || "").toLowerCase();
                    const description = (book.description || "").toLowerCase();
                    const keywords = Array.isArray(book.keywords) ? book.keywords : [];
                    return (
                        title.includes(kw) ||
                        author.includes(kw) ||
                        description.includes(kw) ||
                        keywords.some(k => (k || "").toLowerCase().includes(kw))
                    );
                })
            );

            let filtersHTML = `<div style="margin-bottom: 1em; font-family: Montserrat; font-weight: 500;">🔍 Filters: `;
            activeKeywords.forEach((kw, index) => {
                filtersHTML += `
                    <span style="display:inline-block; border:1.5px solid #333; background:#fff; border-radius:20px;
                                 padding:4px 10px; margin-right:8px; margin-top:8px; color:#000; font-size:0.9rem;
                                 box-shadow:0 2px 4.6px rgba(0,0,0,0.27);">
                        ${kw} 
                        <span style="cursor:pointer; margin-left:6px;" data-index="${index}" class="remove-keyword"><strong>X</strong></span>
                    </span>`;
            });
            filtersHTML += `</div>`;

            listDiv.innerHTML = filtersHTML;

            document.querySelectorAll(".remove-keyword").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const indexToRemove = parseInt(e.target.getAttribute("data-index"));
                    activeKeywords.splice(indexToRemove, 1);
                    runSearch();
                });
            });

            if (!filteredBooks.length) {
                listDiv.innerHTML += `<p>No books found for keywords: <strong>${activeKeywords.join(", ")}</strong></p>`;
                return;
            }

            // 📕 Render Book Titles + Tooltip
            filteredBooks.forEach((book) => {
                const item = document.createElement("div");
                item.textContent = book.title;
                Object.assign(item.style, {
                    cursor: "pointer",
                    margin: "0.3em 0",
                    fontWeight: "bold",
                    color: "#000d36",
                    position: "relative"
                });

                item.addEventListener("mouseenter", () => {
                    globalTooltip.innerHTML = `<strong>Author:</strong> ${book.author}<br><strong>Published:</strong> ${book.published}`;
                    const rect = item.getBoundingClientRect();
                    globalTooltip.style.left = rect.left + "px";
                    globalTooltip.style.top = rect.bottom + window.scrollY + 4 + "px";
                    globalTooltip.style.display = "block";
                });
                item.addEventListener("mouseleave", () => {
                    globalTooltip.style.display = "none";
                });

                item.addEventListener("click", () => {
                    const fileName = encodeURIComponent(book.title) + ".pdf";
                    const filePath = `./uploads/${fileName}`;
                    bookDiv.innerHTML = `
                        <div style="color: white; font-family: Montserrat; padding: 1em;">
                            <h2>${book.title}</h2>
                            <p><strong>Author:</strong> ${book.author}</p>
                            <p><strong>Published:</strong> ${book.published}</p>
                            <p><strong>Description:</strong> ${book.description}</p>
                            <p><strong>Location:</strong> ${book.location || "Not specified"}</p>
                            <iframe src="${filePath}" 
                            width="100%" height="400px" style="border:none; margin-top:1em;"></iframe>
                        </div>`;
                });


                listDiv.appendChild(item);
            });

        } catch (err) {
            console.error("🔥 Full error:", err);
            listDiv.innerHTML = "<p style='color:red;'>Error loading books 😓</p>";
        }
    }

    // 🔍 Add keyword and search
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const newKeyword = keywordInput.value.trim().toLowerCase();
        if (!newKeyword || activeKeywords.includes(newKeyword)) return;
        activeKeywords.push(newKeyword);
        keywordInput.value = "";
        await runSearch();
    });

    // ♻️ Reset button
    resetBtn.addEventListener("click", (e) => {
        e.preventDefault();
        activeKeywords = [];
        keywordInput.value = "";
        listDiv.innerHTML = "";
        bookDiv.innerHTML = "";
        globalTooltip.style.display = "none";
    });
});
