document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const keywordInput = document.getElementById("keyword");
    const listDiv = document.querySelector(".list");
    const bookDiv = document.getElementById("book");

    let activeKeywords = []; // ✅ properly declared and used 

    form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newKeyword = keywordInput.value.trim().toLowerCase();
    if (!newKeyword || activeKeywords.includes(newKeyword)) return;

    activeKeywords.push(newKeyword);
    keywordInput.value = "";
    listDiv.innerHTML = "🔍 Searching...";
    bookDiv.innerHTML = "";

    try {
        const query = activeKeywords.map(k => encodeURIComponent(k)).join(",");
        const response = await fetch(`http://localhost:3000/books/search?keyword=${query}`);
        const books = await response.json();

        if (!books.length) {
            listDiv.innerHTML = `<p>No books found for keywords: <strong>${activeKeywords.join(", ")}</strong></p>`;
            return;
        }

        listDiv.innerHTML = `<p style="margin-bottom: 0.5em;">Filtered by: <strong>${activeKeywords.join(", ")}</strong></p>`;

        books.forEach((book) => {
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
                        <iframe src="http://localhost:3000/${book.pdfUrl}" 
                                width="100%" height="400px" style="border:none; margin-top:1em;"></iframe>
                    </div>
                `;
            });

            listDiv.appendChild(item);
        });
    } catch (err) {
        console.error("Error:", err);
        listDiv.innerHTML = "<p style='color:red;'>Server error 😓</p>";
    }
});

});