// static/js/search.js

document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("search-input");
    const resultsList = document.getElementById("search-results");

    let indexData = [];

    fetch("/index.json")
        .then(res => res.json())
        .then(data => indexData = data);

    input.addEventListener("input", function () {
        const keyword = this.value.trim().toLowerCase();
        resultsList.innerHTML = "";

        if (keyword.length === 0) return;

        const results = indexData.filter(item =>
            item.title.toLowerCase().includes(keyword) ||
            (item.summary && item.summary.toLowerCase().includes(keyword))
        );

        if (results.length === 0) {
            resultsList.innerHTML = "<li>未找到相关文章</li>";
        } else {
            results.slice(0, 10).forEach(item => {
                const li = document.createElement("li");
                li.innerHTML = `<a href="${item.permalink}">${item.title}</a>`;
                resultsList.appendChild(li);
            });
        }
    });
});
