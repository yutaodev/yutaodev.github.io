// static/js/search.js

document.addEventListener("DOMContentLoaded", function () {
    const openSearchBtn = document.getElementById("openSearch");
    const closeSearchBtn = document.getElementById("closeSearch");
    const searchDialog = document.getElementById("searchDialog");
    const input = document.getElementById("search-input");
    const resultsList = document.getElementById("search-results");

    let indexData = [];

    // 加载搜索数据
    fetch("/index.json")
        .then(res => res.json())
        .then(data => indexData = data);

    // 打开搜索对话框
    openSearchBtn.addEventListener("click", function (e) {
        e.preventDefault();
        searchDialog.style.display = "block";
        // 聚焦到搜索输入框
        setTimeout(() => {
            input.focus();
        }, 100);
    });

    // 关闭搜索对话框
    closeSearchBtn.addEventListener("click", function () {
        searchDialog.style.display = "none";
        // 清空搜索内容
        input.value = "";
        resultsList.innerHTML = "";
    });

    // 点击对话框外部关闭
    searchDialog.addEventListener("click", function (e) {
        if (e.target === searchDialog) {
            searchDialog.style.display = "none";
            input.value = "";
            resultsList.innerHTML = "";
        }
    });

    // 搜索功能
    input.addEventListener("input", function () {
        const keyword = this.value.trim().toLowerCase();
        resultsList.innerHTML = "";

        if (keyword.length === 0) return;

        const results = indexData.filter(item =>
            item.title.toLowerCase().includes(keyword) ||
            (item.summary && item.summary.toLowerCase().includes(keyword))
        );

        console.log("搜索关键词:", keyword);
        console.log("搜索结果数量:", results.length);

        if (results.length === 0) {
            resultsList.innerHTML = "<li>未找到相关文章</li>";
        } else if (results.length <= 10) {
            results.forEach(item => {
                const li = document.createElement("li");
                li.innerHTML = `<a href="${item.permalink}">${item.title}</a>`;
                resultsList.appendChild(li);
            });
        } else {
            // 显示前10个结果
            results.slice(0, 10).forEach(item => {
                const li = document.createElement("li");
                li.innerHTML = `<a href="${item.permalink}">${item.title}</a>`;
                resultsList.appendChild(li);
            });
            // 添加"更多..."选项
            const moreLi = document.createElement("li");
            moreLi.innerHTML = `<a href="#" id="show-more-results" style="color: red;">更多...</a>`;
            resultsList.appendChild(moreLi);

            // 点击"更多..."显示全部结果
            document.getElementById("show-more-results").addEventListener("click", function (e) {
                e.preventDefault();
                resultsList.innerHTML = "";
                results.forEach(item => {
                    const li = document.createElement("li");
                    li.innerHTML = `<a href="${item.permalink}">${item.title}</a>`;
                    resultsList.appendChild(li);
                });
            });
        }
    });
});
