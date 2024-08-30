document.addEventListener("DOMContentLoaded", function () {
    // Section 1 Toggle Button
    const toggleBtnSection1 = document.getElementById("toggle-btn");
    const lessonContents = document.querySelectorAll(".lesson-content");

    toggleBtnSection1.addEventListener("click", function () {
        lessonContents.forEach((content) => {
            content.classList.toggle("collapsed");
        });

        toggleBtnSection1.textContent = lessonContents[0].classList.contains(
            "collapsed"
        )
            ? "Hiện thêm ^"
            : "Ẩn bớt v";
    });

    // Section 3 Toggle Button
    const toggleBtnSection3 = document.getElementById("toggle-btn-section-3");
    const section3Contents = document.querySelectorAll(".section-3-content");

    toggleBtnSection3.addEventListener("click", function () {
        section3Contents.forEach((content) => {
            content.classList.toggle("collapsed");
        });

        toggleBtnSection3.textContent = section3Contents[0].classList.contains(
            "collapsed"
        )
            ? "Hiện thêm ^"
            : "Ẩn bớt v";
    });

    // Section 5 Toggle Button
    const toggleBtnSection5 = document.getElementById("toggle-btn-section-5");
    const instructorContent = document.querySelector(".instructor-content");

    toggleBtnSection5.addEventListener("click", function () {
        instructorContent.classList.toggle("collapsed");

        toggleBtnSection5.textContent = instructorContent.classList.contains(
            "collapsed"
        )
            ? "Hiện thêm ^"
            : "Ẩn bớt v";
    });
});
