/**
 * Admin Sidebar Interactivity & Collapse State
 */

export function initSidebar() {
  const toggle = document.getElementById("sidebarToggle");
  const layout = document.querySelector(".dashboard-layout");

  if (!toggle || !layout) return;

  // 1. Restore saved collapsed state on boot
  const isSavedCollapsed =
    localStorage.getItem("admin-sidebar-collapsed") === "true";
  if (isSavedCollapsed) {
    setSidebarState(layout, toggle, true);
  }

  // 2. Click listener for collapse toggle button
  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    const isCurrentlyCollapsed = layout.classList.contains("sidebar-collapsed");
    const nextState = !isCurrentlyCollapsed;

    setSidebarState(layout, toggle, nextState);
    localStorage.setItem("admin-sidebar-collapsed", String(nextState));
  });
}

/**
 * Updates DOM classes and accessibility attributes for the sidebar toggle
 */
function setSidebarState(layout, toggle, collapse) {
  layout.classList.toggle("sidebar-collapsed", collapse);

  toggle.setAttribute("aria-expanded", String(!collapse));
  toggle.setAttribute("aria-label", collapse ? "Show sidebar" : "Hide sidebar");
  toggle.setAttribute("title", collapse ? "Show sidebar" : "Hide sidebar");

  const icon = toggle.querySelector("i");
  if (icon) {
    icon.className = `ti ti-layout-sidebar-left-${collapse ? "expand" : "collapse"}`;
  }
}

// Auto-run when DOM is ready
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", initSidebar);
}
