import { setToastForNextPage, showToast } from "../../shared/js/toast.js";
import { apiRequest } from "../../shared/js/api_request.js";
import {
  showProgressDialog,
  hideProgressDialog,
} from "../../shared/js/loading-indicator.js";

function initHeaderDropdowns() {
  const profileBtn = document.getElementById("profileDropdownBtn");
  const profileMenu = document.getElementById("profileDropdown");
  const notifyBtn = document.getElementById("notificationDropdownBtn");
  const notifyMenu = document.getElementById("notificationDropdown");

  const closeAll = () => {
    profileMenu?.classList.remove("show");
    profileBtn?.setAttribute("aria-expanded", "false");
    notifyMenu?.classList.remove("show");
    notifyBtn?.setAttribute("aria-expanded", "false");
  };

  // Profile Dropdown
  profileBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = profileMenu?.classList.contains("show");
    closeAll();
    if (!isOpen) {
      profileMenu?.classList.add("show");
      profileBtn.setAttribute("aria-expanded", "true");
    }
  });

  // Notification Dropdown
  notifyBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = notifyMenu?.classList.contains("show");
    closeAll();
    if (!isOpen) {
      notifyMenu?.classList.add("show");
      notifyBtn.setAttribute("aria-expanded", "true");
    }
  });

  // Close on outside click or Escape key
  document.addEventListener("click", closeAll);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
}

function initLogout() {
  const logoutBtn = document.getElementById("logoutBtn");

  logoutBtn?.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      showProgressDialog("Signing out...");

      const response = await apiRequest({
        url: "/api/v1/logout",
        method: "POST",
      });

      hideProgressDialog();

      console.log("Logout response:", response);

      if (response.success) {
        setToastForNextPage(
          response.message || "Logged out successfully.",
          "success",
          "Logout",
        );

        window.location.href = "/admin/login";
      } else {
        setToastForNextPage(
          response.message || "Logout failed. Please try again.",
          "danger",
          "Logout Error",
        );

        window.location.href = "/admin/login";
      }
    } catch (error) {
      console.error("Logout failed:", error);
      hideProgressDialog();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initHeaderDropdowns();
  initLogout();
});
