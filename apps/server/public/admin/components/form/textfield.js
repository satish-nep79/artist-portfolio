document.addEventListener("DOMContentLoaded", () => {
  const textareas = document.querySelectorAll("[data-character-input]");

  textareas.forEach((textarea) => {
    const counter = document.querySelector(
      `[data-character-counter="${textarea.id}"]`,
    );

    if (!counter) {
      return;
    }

    const updateCounter = () => {
      const currentLength = textarea.value.length;
      const maxLength = textarea.maxLength;

      counter.textContent = `${currentLength} / ${maxLength}`;
    };

    textarea.addEventListener("input", updateCounter);

    // Set initial value for existing database content
    updateCounter();
  });
});
