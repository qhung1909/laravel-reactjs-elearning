document.getElementById('dropdownButton').addEventListener('click', function() {
    var menu = document.getElementById('dropdownMenu');
    menu.classList.toggle('show');
});

document.addEventListener('click', function(event) {
    var button = document.getElementById('dropdownButton');
    var menu = document.getElementById('dropdownMenu');
    if (!button.contains(event.target) && !menu.contains(event.target)) {
        menu.classList.remove('show');
    }
});
