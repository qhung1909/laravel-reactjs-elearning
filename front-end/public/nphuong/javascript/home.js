const slideWrapper = document.querySelector('.slide-wrapper');
const slides = document.querySelectorAll('.slide');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

let currentIndex = 0;
const totalSlides = slides.length;

function updateSlide() {
    slideWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
}

nextButton.addEventListener('click', () => {
    if (currentIndex < totalSlides - 1) {
        currentIndex++;
        updateSlide();
    }
});

prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateSlide();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const filterButton = document.getElementById('filterButton');
    const filterPanel = document.getElementById('filterPanel');
    const overlay = document.getElementById('overlay');

    filterButton.addEventListener('click', function() {
        filterPanel.classList.toggle('hidden');
        overlay.classList.toggle('hidden');
    });

    overlay.addEventListener('click', function() {
        filterPanel.classList.add('hidden');
        overlay.classList.add('hidden');
    });
});
