const TOAST_DURATION = 5000;

export function showToast(message, type = "info", title = null) {
    const container = getToastContainer();

    const toast = document.createElement("div");

    const toastTitle = title || getToastTitle(type);
    const icon = getToastIcon(type);

    toast.className = `admin-toast admin-toast-${type}`;
    toast.setAttribute("role", type === "danger" ? "alert" : "status");
    toast.setAttribute("aria-live", "polite");

    toast.innerHTML = `
        <div class="admin-toast-icon" aria-hidden="true">
            <i class="ti ${icon}"></i>
        </div>

        <div class="admin-toast-content">
            <div class="admin-toast-title"></div>
            <div class="admin-toast-message"></div>
        </div>

        <button
            type="button"
            class="admin-toast-close"
            aria-label="Close notification"
        >
            <i class="ti ti-x" aria-hidden="true"></i>
        </button>

        <div class="admin-toast-progress" aria-hidden="true"></div>
    `;

    toast.querySelector(".admin-toast-title").textContent = toastTitle;
    toast.querySelector(".admin-toast-message").textContent = message;

    container.appendChild(toast);

    // Trigger entrance animation after insertion.
    requestAnimationFrame(() => {
        toast.classList.add("admin-toast-visible");
    });

    const closeButton = toast.querySelector(".admin-toast-close");
    const progressBar = toast.querySelector(".admin-toast-progress");

    let timeoutId;
    let remainingTime = TOAST_DURATION;
    let startTime = Date.now();
    let paused = false;

    function closeToast() {
        clearTimeout(timeoutId);

        toast.classList.remove("admin-toast-visible");
        toast.classList.add("admin-toast-closing");

        toast.addEventListener(
            "transitionend",
            () => {
                toast.remove();
            },
            { once: true }
        );
    }

    function startTimer() {
        startTime = Date.now();
        paused = false;

        timeoutId = setTimeout(() => {
            closeToast();
        }, remainingTime);
    }

    function pauseTimer() {
        if (paused) {
            return;
        }

        paused = true;

        clearTimeout(timeoutId);
        progressBar.style.animationPlayState = "paused";

        remainingTime -= Date.now() - startTime;
    }

    function resumeTimer() {
        if (!paused) {
            return;
        }

        progressBar.style.animationPlayState = "running";
        startTimer();
    }

    closeButton.addEventListener("click", closeToast);

    toast.addEventListener("mouseenter", pauseTimer);
    toast.addEventListener("mouseleave", resumeTimer);

    startTimer();

    return {
        close: closeToast
    };
}


function getToastContainer() {
    let container = document.getElementById("adminToastContainer");

    if (!container) {
        container = document.createElement("div");

        container.id = "adminToastContainer";
        container.className = "admin-toast-container";

        document.body.appendChild(container);
    }

    return container;
}


function getToastTitle(type) {
    switch (type) {
        case "success":
            return "Success";

        case "danger":
            return "Something went wrong";

        case "warning":
            return "Warning";

        case "info":
        default:
            return "Information";
    }
}


function getToastIcon(type) {
    switch (type) {
        case "success":
            return "ti-circle-check";

        case "danger":
            return "ti-circle-x";

        case "warning":
            return "ti-alert-triangle";

        case "info":
        default:
            return "ti-info-circle";
    }
}