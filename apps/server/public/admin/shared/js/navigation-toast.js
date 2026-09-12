import { showToast } from "./toast.js";

const NEXT_PAGE_TOAST_KEY = "adminNextPageToast";
const TOAST_DELAY = 300;

function showNextPageToast() {
    const storedToast = sessionStorage.getItem(NEXT_PAGE_TOAST_KEY);

    if (!storedToast) {
        return;
    }

    sessionStorage.removeItem(NEXT_PAGE_TOAST_KEY);

    try {
        const { message, type, title } = JSON.parse(storedToast);

        setTimeout(() => {
            showToast(message, type, title);
        }, TOAST_DELAY);
    } catch (error) {
        console.error("Failed to restore navigation toast:", error);
    }
}

document.addEventListener("DOMContentLoaded", showNextPageToast);