/**
 * Image Uploader - drag & drop, validation, preview
 */
import { saveState } from './state-manager.js';

const MAX_SIZE = 500 * 1024; // 500KB
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

export function initImageUploader() {
  const area = document.getElementById('upload-area');
  const input = document.getElementById('card-image-input');
  if (!area || !input) return;

  area.addEventListener('click', () => input.click());
  area.addEventListener('dragover', handleDragOver);
  area.addEventListener('dragleave', handleDragLeave);
  area.addEventListener('drop', handleDrop);
  input.addEventListener('change', handleFileSelect);
}

function handleDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
  e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) processFile(file);
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) processFile(file);
}

function processFile(file) {
  const area = document.getElementById('upload-area');
  const error = document.getElementById('upload-error');

  if (!ALLOWED_TYPES.includes(file.type)) {
    showError(error, 'JPEG または PNG 画像を選択してください');
    return;
  }

  if (file.size > MAX_SIZE) {
    showError(error, `ファイルサイズが大きすぎます（${(file.size / 1024).toFixed(0)}KB / 上限500KB）`);
    return;
  }

  hideError(error);

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    saveState({ cardImage: dataUrl, cardImageName: file.name });
    showPreview(area, dataUrl, file.name);
    updateAnimationPreviewImage(dataUrl);
  };
  reader.readAsDataURL(file);
}

function showPreview(area, dataUrl, fileName) {
  area.classList.add('has-file');
  area.innerHTML = `
    <div class="upload-preview">
      <img src="${dataUrl}" alt="${fileName}">
    </div>
    <p class="upload-text" style="margin-top: 0.75rem">
      <strong>${fileName}</strong>
    </p>
    <p class="upload-hint">クリックで変更</p>
  `;
}

function updateAnimationPreviewImage(dataUrl) {
  const img = document.getElementById('anim-preview-img');
  if (img) img.src = dataUrl;
}

function showError(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
}

function hideError(el) {
  if (!el) return;
  el.style.display = 'none';
}
