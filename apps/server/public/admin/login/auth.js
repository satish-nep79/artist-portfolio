import { setButtonLoading } from "../shared/js/loading-indicator.js";
import { showToast } from "../shared/js/toast.js";

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
  event.preventDefault();
  console.log("Form submitted");
  const loginForm = document.getElementById("loginForm");
  const submitButton = loginForm.querySelector('button[type="submit"]');
  setButtonLoading(submitButton, true, "Signing in...");
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate a delay for demonstration purposes

  const email = loginForm.email.value;
  const password = loginForm.password.value;
  console.log("Email:", email);
  console.log("Password:", password);

  // Simulate a successful login
  setButtonLoading(submitButton, false);
  showToast("Login successful!", "success");
}

init();
