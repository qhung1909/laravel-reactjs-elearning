// Hàm toggle cho Section 1
export const toggleSection1 = () => {
    const toggleBtnSection1 = document.getElementById("toggle-btn");
    const lessonContents = document.querySelectorAll(".lesson-content");
    console.log(lessonContents);

    if (toggleBtnSection1) {
        toggleBtnSection1.onclick("click", function () {
            console.log(toggleBtnSection1);
            lessonContents.forEach((content) => {
                content.classList.toggle("collapsed");
            });

            toggleBtnSection1.textContent = lessonContents[0].classList.contains("collapsed")
                ? "Hiện thêm ^"
                : "Ẩn bớt v";
        });
    }
};





// Hàm chính để gọi các hàm toggle
export const ToggleDetail = () => {
    toggleSection1();


};
