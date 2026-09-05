export function setButtonLoading(button, loading, loadingText = "Loading...") {
  if (loading) {
    button.dataset.originalContent = button.innerHTML;

    button.disabled = true;
    button.setAttribute("aria-busy", "true");

    button.innerHTML = `
            <span
                class="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
            ></span>
            ${loadingText}
        `;
  } else {
    button.disabled = false;
    button.removeAttribute("aria-busy");

    button.innerHTML = button.dataset.originalContent;

    delete button.dataset.originalContent;
  }
}
