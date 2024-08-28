document.addEventListener("DOMContentLoaded", function () {
    // Section 1 Toggle Button
    const toggleBtnSection1 = document.getElementById("toggle-btn");
    const lessonContents = document.querySelectorAll(".lesson-content");

    toggleBtnSection1.addEventListener("click", function () {
        lessonContents.forEach((content) => {
            if (content.classList.contains("collapsed")) {
                content.classList.remove("collapsed");
            } else {
                content.classList.add("collapsed");
            }
        });

        if (lessonContents[0].classList.contains("collapsed")) {
            toggleBtnSection1.textContent = "Hiện thêm ^";
        } else {
            toggleBtnSection1.textContent = "Ẩn bớt v";
        }
    });

    // Section 3 Toggle Button
    const toggleBtnSection3 = document.getElementById("toggle-btn-section-3");
    const section3Contents = document.querySelectorAll(".section-3-content");

    toggleBtnSection3.addEventListener("click", function () {
        section3Contents.forEach((content) => {
            if (content.classList.contains("collapsed")) {
                content.classList.remove("collapsed");
            } else {
                content.classList.add("collapsed");
            }
        });

        if (section3Contents[0].classList.contains("collapsed")) {
            toggleBtnSection3.textContent = "Hiện thêm ^";
        } else {
            toggleBtnSection3.textContent = "Ẩn bớt v";
        }
    });
});
