document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const keywordInput = document.getElementById("keyword");
    const listDiv = document.querySelector(".list");
    const bookDiv = document.getElementById("book");

    let selectedKeywords = []; // stores progressive filters

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const newKeyword = keywordInput.value.trim().toLowerCase();
        if (!newKeyword || selectedKeywords.includes(newKeyword)) return;

        selectedKeywords.push(newKeyword);
        keywordInput.value = ""; // clear input after submit

        listDiv.innerHTML = "🔍 Filtering by: " + selectedKeywords.join(", ");
        bookDiv.innerHTML = "";

        try {
            const query = selectedKeywords.join(',');
            const response = await fetch(`http://localhost:3000/books/search?keyword=${encodeURIComponent(query)}`);
            const books = await response.json();

            if (!books.length) {
                listDiv.innerHTML += "<br><p>No books match all filters 😔</p>";
                return;
            }

            listDiv.innerHTML += "<br>"; // keep filter tags at top
            books.forEach((book) => {
                const item = document.createElement("div");
                item.textContent = book.title;
                item.style.cursor = "pointer";
                item.style.margin = "0.5em 0";
                item.style.fontWeight = "bold";
                item.style.color = "#000d36";

                item.addEventListener("click", () => {
                    bookDiv.innerHTML = `
                        <iframe src="http://localhost:3000/${book.pdfUrl}" 
                            width="100%" height="100%" style="border:none;"></iframe>
                    `;
                });

                listDiv.appendChild(item);
            });
        } catch (err) {
            console.error("Error:", err);
            listDiv.innerHTML += "<br><p style='color:red;'>Server error 😓</p>";
        }
    });
});
