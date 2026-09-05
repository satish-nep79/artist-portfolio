import { setButtonLoading } from "../shared/js/loading-indicator.js";
import { showToast } from "../shared/js/toast.js";
import { apiRequest } from "../shared/js/api_request.js";

const passwordInput = document.getElementById("password");
const togglePasswordButton = document.getElementById("togglePassword");
const togglePasswordIcon = document.getElementById("togglePasswordIcon");
const loginForm = document.getElementById("loginForm");

function init() {
  addListeners();
}

function addListeners() {
  console.log("Adding event listeners");
  togglePasswordButton.addEventListener("click", togglePassword);
  loginForm.addEventListener("submit", onSubmit);

  console.log("Event listeners added");
}

function togglePassword() {
  const isPasswordVisible = passwordInput.type === "text";

  passwordInput.type = isPasswordVisible ? "password" : "text";

  togglePasswordIcon.classList.toggle("ti-eye", !isPasswordVisible);
  togglePasswordIcon.classList.toggle("ti-eye-off", isPasswordVisible);

  togglePasswordButton.setAttribute(
    "title",
    isPasswordVisible ? "Show password" : "Hide password",
  );

  togglePasswordButton.setAttribute(
    "aria-label",
    isPasswordVisible ? "Show password" : "Hide password",
  );
}

async function onSubmit(event) {
  try {
    event.preventDefault();
    console.log("Form submitted");
    const loginForm = document.getElementById("loginForm");
    const submitButton = loginForm.querySelector('button[type="submit"]');
    setButtonLoading(submitButton, true, "Signing in...");

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    const response = await apiRequest({
      url: "/api/v1/login",
      method: "POST",
      body: {
        email,
        password,
      },
    });

    setButtonLoading(submitButton, false);
    console.log("Login response:", response);

    if (response.success) {

        

      showToast("Login successful!", "success", "Success");
      window.location.href = "/admin";
    } else {
      showToast(
        response.message || "Invalid email or password.",
        "danger",
        "Login Failed",
      );
    }
  } catch (error) {
    console.error("Error during login:", error);
    showToast(
      "An error occurred during login. Please try again.",
      "error",
      "Unexpected Error",
    );
  }
}

init();
