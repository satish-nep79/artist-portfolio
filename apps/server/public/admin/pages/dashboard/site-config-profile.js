let cropper = null;
let cropModalInstance = null;

function init() {
  try {
    addListeners();
  } catch (err) {
    console.error("[Init Error] Failed to initialize listeners:", err);
  }
}

function addListeners() {
  const changePhotoBtn = document.getElementById("changePhotoBtn");
  const profilePhotoInput = document.getElementById("profilePhotoInput");
  const applyCropBtn = document.getElementById("applyCropBtn");
  const cropModalEl = document.getElementById("cropModal");

  if (!profilePhotoInput || !changePhotoBtn || !applyCropBtn) {
    console.warn(
      "[Init Warning] One or more required DOM elements were not found.",
    );
  }

  if (cropModalEl && window.bootstrap) {
    try {
      cropModalInstance = new bootstrap.Modal(cropModalEl);
    } catch (err) {
      console.error("[Bootstrap Error] Failed to instantiate modal:", err);
    }
  } else if (!window.bootstrap) {
    console.error(
      "[Bootstrap Error] Bootstrap JavaScript library is not loaded.",
    );
  }

  profilePhotoInput?.addEventListener("change", onPickImage);
  changePhotoBtn?.addEventListener("click", () => profilePhotoInput?.click());
  applyCropBtn?.addEventListener("click", onApplyCrop);

  // FIX 1: Permanent listener (not re-attached on every file pick)
  cropModalEl?.addEventListener("shown.bs.modal", () => {
    try {
      if (cropper) cropper.destroy();

      const imageToCrop = document.getElementById("imageToCrop");
      if (!imageToCrop) throw new Error("Element #imageToCrop not found.");
      if (typeof Cropper === "undefined")
        throw new Error("Cropper.js is not loaded.");

      cropper = new Cropper(imageToCrop, {
        aspectRatio: 2 / 3,
        viewMode: 1,
        autoCropArea: 0.9,
        responsive: true,
      });
    } catch (err) {
      console.error("[Cropper Error] Failed to initialize Cropper.js:", err);
    }
  });

  // FIX 4: Also revoke the stale blob URL when modal closes
  cropModalEl?.addEventListener("hidden.bs.modal", () => {
    if (cropper) {
      try {
        cropper.destroy();
      } catch (err) {
        console.error("[Cropper Error] Failed to destroy instance:", err);
      } finally {
        cropper = null;
      }
    }
    const imageToCrop = document.getElementById("imageToCrop");
    if (imageToCrop?.src?.startsWith("blob:")) {
      URL.revokeObjectURL(imageToCrop.src);
      imageToCrop.src = "";
    }
  });
}

function onPickImage(event) {
  try {
    const file = event.target.files[0];
    if (!file) return;

    const imageToCrop = document.getElementById("imageToCrop");
    if (!imageToCrop) throw new Error("Element #imageToCrop not found in DOM.");

    // FIX 4: Revoke previous blob URL before creating a new one
    if (imageToCrop.src?.startsWith("blob:"))
      URL.revokeObjectURL(imageToCrop.src);
    imageToCrop.src = URL.createObjectURL(file);

    if (cropModalInstance) {
      cropModalInstance.show();
    } else {
      console.warn("[Modal Warning] Modal instance not available.");
    }
  } catch (err) {
    console.error("[Pick Image Error] Error during image selection:", err);
  }
}

function onApplyCrop() {
  try {
    if (!cropper) throw new Error("Cropper instance is not initialized.");

    // FIX 2: getData(true) returns the crop-box dimensions, not the full image
    const cropData = cropper.getData(true);
    const cropW = cropData.width;

    // FIX 3: Raise ceiling to 4000px to match the 4000×6000 target
    const clampedW = Math.min(Math.max(cropW, 800), 4000);
    const clampedH = Math.round(clampedW * 1.5); // 2:3 → height = width × 1.5

    const canvas = cropper.getCroppedCanvas({
      width: clampedW,
      height: clampedH,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });

    if (!canvas) throw new Error("Failed to generate cropped canvas.");

    canvas.toBlob(
      (blob) => {
        try {
          if (!blob)
            throw new Error("Canvas toBlob returned null or empty blob.");

          const photoPreview = document.getElementById("photoPreview");
          if (photoPreview) {
            // FIX 4: Revoke the old preview blob URL before replacing it
            if (photoPreview.src?.startsWith("blob:"))
              URL.revokeObjectURL(photoPreview.src);
            photoPreview.src = URL.createObjectURL(blob);
          }

          const profilePhotoInput =
            document.getElementById("profilePhotoInput");
          if (!profilePhotoInput)
            throw new Error("Element #profilePhotoInput not found.");

          const croppedFile = new File([blob], "profile-cropped.jpg", {
            type: "image/jpeg",
          });
          const container = new DataTransfer();
          container.items.add(croppedFile);
          profilePhotoInput.files = container.files;

          if (cropModalInstance) cropModalInstance.hide();
        } catch (blobErr) {
          console.error(
            "[Blob Processing Error] Failed to attach cropped file:",
            blobErr,
          );
        }
      },
      "image/jpeg",
      0.9,
    );
  } catch (err) {
    console.error("[Apply Crop Error] Failed to process cropped image:", err);
  }
}

init();
