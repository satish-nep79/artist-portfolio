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

export function showProgressDialog(message = "Loading...") {
  const dialog = document.createElement("div");

  dialog.id = "progressDialog";
  dialog.className = "progress-dialog";
  dialog.innerHTML = `
        <div class="progress-dialog-content">
            <span
                class="spinner-border"
                role="status"
                aria-hidden="true"
            ></span>

            <span>${message}</span>
        </div>
    `;

  document.body.appendChild(dialog);
}

export function hideProgressDialog() {
    document.getElementById("progressDialog")?.remove();
}
