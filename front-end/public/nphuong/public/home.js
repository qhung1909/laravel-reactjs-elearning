/* menu */
document.addEventListener('DOMContentLoaded', function () {
    const topMenu = document.getElementById('top-menu');
    const toggleTopMenuIcon = document.getElementById('toggle-top-menu-icon');

    if (toggleTopMenuIcon && topMenu) {
        document.addEventListener('click', (e) => {
            if (toggleTopMenuIcon.contains(e.target)) {
                // Nếu bấm vào icon, bật/tắt menu
                topMenu.classList.toggle('topmenu-expanded');
                topMenu.classList.toggle('hidden');
            } else {
                // Nếu click ngoài icon mà menu đang mở, ẩn menu
                if (topMenu.classList.contains('topmenu-expanded')) {
                    topMenu.classList.remove('topmenu-expanded');
                    topMenu.classList.add('hidden');
                }
            }
        });
    }
});

/* Chủ đề phổ biến */
const carousel1 = document.getElementById('carousel1');
const carousel2 = document.getElementById('carousel2');
const nextButton = document.getElementById('nextButton');
const prevButton = document.getElementById('prevButton');

// Biến trạng thái để kiểm tra div nào đang hiển thị
let isCarousel1Visible = true;

nextButton.addEventListener('click', () => {
    if (isCarousel1Visible) {
        carousel1.classList.add('hidden');
        carousel2.classList.remove('hidden');
    } else {
        carousel1.classList.remove('hidden');
        carousel2.classList.add('hidden');
    }
    isCarousel1Visible = !isCarousel1Visible;
});

prevButton.addEventListener('click', () => {
    if (isCarousel1Visible) {
        carousel1.classList.add('hidden');
        carousel2.classList.remove('hidden');
    } else {
        carousel1.classList.remove('hidden');
        carousel2.classList.add('hidden');
    }
    isCarousel1Visible = !isCarousel1Visible;
});

/* ----------------- */

/* Giảng viên */
const prevSlideButton = document.getElementById('prevSlideButton');
const nextSlideButton = document.getElementById('nextSlideButton');
const slides = document.querySelectorAll('.carousel-slide');
let currentIndex = 0;

// Hàm hiển thị slide hiện tại và ẩn các slide khác
function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('hidden', i !== index);
    });
}

// Sự kiện nhấn nút quay lại
prevSlideButton.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
    showSlide(currentIndex);
});

// Sự kiện nhấn nút tiếp theo
nextSlideButton.addEventListener('click', () => {
    currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
    showSlide(currentIndex);
});

// Thiết lập slide đầu tiên khi trang được tải
showSlide(currentIndex);


/* Bộ lọc  */
document.addEventListener("DOMContentLoaded", function () {
    // Hàm để xử lý toggle
    function setupToggle(btnId, contentSelector) {
        const toggleBtn = document.getElementById(btnId);
        const contents = document.querySelectorAll(contentSelector);

        if (toggleBtn) {
            toggleBtn.addEventListener("click", function () {
                contents.forEach(content => {
                    content.classList.toggle("collapsed");
                });

                // Thay đổi biểu tượng dựa trên trạng thái của nội dung
                toggleBtn.innerHTML = contents[0].classList.contains("collapsed")
                    ? "<i class='bx bx-chevron-down'></i>"
                    : "<i class='bx bx-chevron-up'></i>";
            });
        }
    }

    // Gọi hàm setupToggle cho từng phần tử
    setupToggle("toggle-btn", ".lesson-content");
    setupToggle("toggle-btn-tlv", ".lesson-content-tlv");
    setupToggle("toggle-btn-cd", ".lesson-content-cd");
    setupToggle("toggle-btn-tlc", ".lesson-content-tlc");
    setupToggle("toggle-btn-capdo", ".lesson-content-capdo");
    setupToggle("toggle-btn-nn", ".lesson-content-nn");
    setupToggle("toggle-btn-gia", ".lesson-content-gia");
    setupToggle("toggle-btn-dacdiem", ".lesson-content-dacdiem");
    setupToggle("toggle-btn-phude", ".lesson-content-phude");
});



