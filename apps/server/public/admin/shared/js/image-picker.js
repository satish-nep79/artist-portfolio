/**
 * Promisified Image Picker & Cropper Utility
 * @param {Object} options Configuration settings
 * @param {number} [options.aspectRatio=2/3] Crop aspect ratio (width / height)
 * @param {number} [options.minWidth=800] Minimum width output in px
 * @param {number} [options.maxWidth=4000] Maximum width output in px
 * @param {string} [options.filename='cropped.jpg'] Output File object name
 * @param {string} [options.modalId='cropModal'] ID of the crop modal
 * @returns {Promise<File|null>} Resolves with the cropped File, or null if cancelled/failed.
 */

import { showToast } from "./toast.js";

export async function pickAndCropImage(options = {}) {
  const config = {
    aspectRatio: 2 / 3,
    minWidth: 800,
    maxWidth: 4000,
    filename: "cropped.jpg",
    modalId: "cropModal",
    cropImageId: "imageToCrop",
    applyBtnId: "applyCropBtn",
    ...options,
  };

  return new Promise((resolve) => {
    // 1. Create invisible file input on the fly
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return resolve(null);
      openCropModal(file, config, resolve);
    };

    // Trigger native file picker
    document.body.appendChild(fileInput);
    fileInput.onchange = (e) => {
      document.body.removeChild(fileInput);
      const file = e.target.files?.[0];
      if (!file) return resolve(null);
      openCropModal(file, config, resolve);
    };
    fileInput.click();
  });
}

function openCropModal(file, config, resolve) {
  const modalEl = document.getElementById(config.modalId);
  const cropImg = document.getElementById(config.cropImageId);
  const applyBtn = document.getElementById(config.applyBtnId);

  if (!modalEl || !cropImg || !applyBtn) {
    console.error("[ImagePicker] Required modal DOM elements not found.");
    return resolve(null);
  }

  // Use Tabler or Bootstrap Modal constructor
  const ModalConstructor = window.tabler?.Modal || window.bootstrap?.Modal;
  if (!ModalConstructor) {
    console.error("[ImagePicker] Tabler/Bootstrap JS is not loaded.");
    return resolve(null);
  }

  const modalInstance = new ModalConstructor(modalEl);
  let cropper = null;
  let isApplied = false;

  // Clean up Object URLs safely
  const revokeImgSrc = () => {
    if (cropImg.src?.startsWith("blob:")) URL.revokeObjectURL(cropImg.src);
  };

  revokeImgSrc();
  cropImg.src = URL.createObjectURL(file);

  // Modal event: Initialize Cropper when modal becomes visible
  const onModalShown = () => {
    if (cropper) cropper.destroy();

    const naturalW = cropImg.naturalWidth;
    if (naturalW < config.minWidth) {
      showToast("Image must be at least 800px wide.", "warning");
      modalInstance.hide();
      return resolve(null);
    }

    const scale = cropImg.clientWidth / cropImg.naturalWidth; // display vs real
    const minCropBoxWidth = config.minWidth * scale;

    cropper = new Cropper(cropImg, {
      aspectRatio: config.aspectRatio,
      viewMode: 1,
      autoCropArea: 0.9,
      responsive: true,
      minCropBoxWidth: minCropBoxWidth,
    });
  };

  // Modal event: Cleanup on close
  const onModalHidden = () => {
    modalEl.removeEventListener("shown.bs.modal", onModalShown);
    modalEl.removeEventListener("hidden.bs.modal", onModalHidden);

    if (cropper) {
      cropper.destroy();
      cropper = null;
    }
    revokeImgSrc();
    cropImg.src = "";

    // If user closed modal without clicking apply, resolve with null
    if (!isApplied) resolve(null);
  };

  // Click handler for Apply Crop button
  const onApply = () => {
    if (!cropper) return;

    const cropData = cropper.getData(true);
    const clampedW = Math.min(
      Math.max(cropData.width, config.minWidth),
      config.maxWidth,
    );
    const clampedH = Math.round(clampedW * (1 / config.aspectRatio));

    const canvas = cropper.getCroppedCanvas({
      width: clampedW,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });

    if (!canvas) {
      modalInstance.hide();
      return;
    }

    canvas.toBlob(
      (blob) => {
        if (blob) {
          isApplied = true;
          const croppedFile = new File([blob], config.filename, {
            type: "image/jpeg",
          });
          resolve(croppedFile);
        } else {
          isApplied = true;
          resolve(null);
        }
        modalInstance.hide();
      },
      "image/jpeg",
      0.9,
    );
  };

  // Attach lifecycle listeners and open modal
  modalEl.addEventListener("shown.bs.modal", onModalShown);
  modalEl.addEventListener("hidden.bs.modal", onModalHidden);
  applyBtn.addEventListener("click", onApply, { once: true });

  modalInstance.show();
}
