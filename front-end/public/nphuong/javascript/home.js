document.getElementById('dropdownButton').addEventListener('click', function () {
    var menu = document.getElementById('dropdownMenu');
    menu.classList.toggle('show');
});

document.addEventListener('click', function (event) {
    var button = document.getElementById('dropdownButton');
    var menu = document.getElementById('dropdownMenu');
    if (!button.contains(event.target) && !menu.contains(event.target)) {
        menu.classList.remove('show');
    }
});


/* Chủ đề phổ biến */
document.addEventListener('DOMContentLoaded', function() {
    let curIndex = 0; // Current slide index
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    const slideWrapper = document.querySelector('.slide-wrapper');

    function showSlide(index) {
        slideWrapper.style.transform = `translateX(-${index * 100}%)`;
    }

    document.getElementById('next').addEventListener('click', function() {
        curIndex = (curIndex + 1) % totalSlides;
        showSlide(curIndex);
    });

    document.getElementById('prev').addEventListener('click', function() {
        curIndex = (curIndex - 1 + totalSlides) % totalSlides;
        showSlide(curIndex);
    });

    // Auto-slide every 5 seconds
    setInterval(function() {
        curIndex = (curIndex + 1) % totalSlides;
        showSlide(curIndex);
    }, 5000);

    // Show initial slide
    showSlide(curIndex);
});

