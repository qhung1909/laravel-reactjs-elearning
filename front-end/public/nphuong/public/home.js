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
