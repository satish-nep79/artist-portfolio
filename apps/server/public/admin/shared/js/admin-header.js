function initHeaderDropdowns() {
    const profileBtn = document.getElementById('profileDropdownBtn');
    const profileMenu = document.getElementById('profileDropdown');
    const notifyBtn = document.getElementById('notificationDropdownBtn');
    const notifyMenu = document.getElementById('notificationDropdown');

    const closeAll = () => {
        profileMenu?.classList.remove('show');
        profileBtn?.setAttribute('aria-expanded', 'false');
        notifyMenu?.classList.remove('show');
        notifyBtn?.setAttribute('aria-expanded', 'false');
    };

    // Profile Dropdown
    profileBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = profileMenu?.classList.contains('show');
        closeAll();
        if (!isOpen) {
            profileMenu?.classList.add('show');
            profileBtn.setAttribute('aria-expanded', 'true');
        }
    });

    // Notification Dropdown
    notifyBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = notifyMenu?.classList.contains('show');
        closeAll();
        if (!isOpen) {
            notifyMenu?.classList.add('show');
            notifyBtn.setAttribute('aria-expanded', 'true');
        }
    });

    // Close on outside click or Escape key
    document.addEventListener('click', closeAll);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAll();
    });
}

document.addEventListener('DOMContentLoaded', initHeaderDropdowns);