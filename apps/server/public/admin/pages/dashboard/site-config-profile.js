import { pickAndCropImage } from "../../shared/js/image-picker.js";

let pickedImageFile = null;

function init() {
  try {
    addListeners();
  } catch (err) {
    console.error("[Init Error] Failed to initialize listeners:", err);
  }
}

function addListeners() {
  const profileImagePreview = document.getElementById("photoPreview");
  const changeProfileImageBtn = document.getElementById("changePhotoBtn");

  changeProfileImageBtn?.addEventListener("click", handleImageChange);
}

async function handleImageChange() {
  const croppedFile = await pickAndCropImage({
    aspectRatio: 2 / 3, // Square crop for profile images
    minWidth: 800,
    maxWidth: 2400,
    filename: "profile-cropped.jpg",
  });

  console.log(
    "Cropped file:",
    croppedFile.name,
    croppedFile.size,
    croppedFile.type,
    croppedFile.lastModified,
  );

  const profileImagePreview = document.getElementById("photoPreview");
  profileImagePreview.src = URL.createObjectURL(croppedFile);
  pickedImageFile = croppedFile;
}

init();
