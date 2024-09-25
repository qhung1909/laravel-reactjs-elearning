// function w3_open() {
//     document.getElementById("mySidebar").style.transform = "translateX(0)";
//     document.getElementById("top-menu").classList.add("hidden"); // Ẩn breadcrumb khi mở sidebar
// }

// function w3_close() {
//     document.getElementById("mySidebar").style.transform = "translateX(-100%)";
//     document.getElementById("top-menu").classList.remove("hidden"); // Hiển thị breadcrumb khi đóng sidebar
// }


    /* Tất cả khóa học */
    const openButton = document.getElementById('openButton');
    const filterContent = document.getElementById('filterContent');
    const courseCol = document.getElementById('courseCol');
    openButton.addEventListener('click', () => {
        filterContent.classList.toggle('hidden');
        if (filterContent.classList.contains('hidden')) {
            courseCol.classList.remove('col-span-9');
            courseCol.classList.add('col-span-12');
        } else {
            courseCol.classList.remove('col-span-12');
            courseCol.classList.add('col-span-9');
        }
    })
    /* Chủ đề phổ biến */
    document.addEventListener('DOMContentLoaded', () => {
        const carousel = document.getElementById('carousel');
        const nextButton = document.getElementById('nextButton');
        const prevButton = document.getElementById('prevButton');

        let offset = 0;
        const itemsPerRow = 3; // Số mục mỗi dòng
        const rowsPerPage = 2; // Số dòng cần hiển thị

        const updateCarousel = () => {
            const width = window.innerWidth;
            let itemsToShow = 0;

            // Xác định số lượng mục cần hiển thị dựa trên kích thước màn hình
            if (width >= 1280) {
                itemsToShow = 10; // Hiển thị 2 dòng trên màn hình rất lớn (xl)
            } else if (width >= 1024) {
                itemsToShow = 10; // Hiển thị 2 dòng trên màn hình lớn (lg)
            } else if (width >= 768) {
                itemsToShow = 10; // Hiển thị 2 dòng trên màn hình vừa (md)
            } else {
                itemsToShow = 4; // Hiển thị 2 dòng trên màn hình nhỏ (sm)
            }


            const items = carousel.querySelectorAll('.font-bold');
            items.forEach((item, index) => {
                if (index >= offset && index < offset + itemsToShow) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });

            // Cập nhật nút điều hướng
            nextButton.disabled = offset + itemsToShow >= items.length;
            prevButton.disabled = offset === 0;
        };

        // Xử lý sự kiện nút điều hướng
        nextButton.addEventListener('click', () => {
            const items = carousel.querySelectorAll('.font-bold');
            if (offset + itemsPerRow * rowsPerPage < items.length) {
                offset += itemsPerRow * rowsPerPage;
                updateCarousel();
            }
        });

        prevButton.addEventListener('click', () => {
            if (offset - itemsPerRow * rowsPerPage >= 0) {
                offset -= itemsPerRow * rowsPerPage;
                updateCarousel();
            }
        });

        // Cập nhật carousel khi trang được tải hoặc kích thước cửa sổ thay đổi
        updateCarousel();
        window.addEventListener('resize', updateCarousel);
    });
    /* End Chủ đề */

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
    /* End Giảng viên */

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
