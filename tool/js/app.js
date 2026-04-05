/**
 * App - Main orchestrator for the tool page
 */
import { loadState, saveState } from './state-manager.js';
import { initImageUploader } from './image-uploader.js';
import { initAnimationPreviewer } from './animation-previewer.js';
import { initCardBackgroundSelector, initZoomBackgroundSelector } from './background-selector.js';
import { initQRGenerator } from './qr-generator.js';

document.addEventListener('DOMContentLoaded', () => {
  initStepIndicator();
  initQRGenerator();
  initZoomBackgroundSelector();
  initImageUploader();
  initLinkConfig();
  initAnimationPreviewer();
  initCardBackgroundSelector();
  initNavigation();
  initMobileQRPreview();
  restoreState();
});

function initStepIndicator() {
  const sections = document.querySelectorAll('.section');
  const dots = document.querySelectorAll('.step-dot');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = [...sections].indexOf(entry.target);
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === idx);
          dot.classList.toggle('done', i < idx);
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => observer.observe(s));
}

function initLinkConfig() {
  const toggle = document.getElementById('link-toggle');
  const urlWrap = document.getElementById('link-url-wrap');
  const urlInput = document.getElementById('link-url');

  if (!toggle || !urlWrap) return;

  toggle.addEventListener('change', () => {
    urlWrap.classList.toggle('visible', toggle.checked);
    saveState({ linkEnabled: toggle.checked });
  });

  if (urlInput) {
    urlInput.addEventListener('input', () => {
      saveState({ linkUrl: urlInput.value });
    });
  }
}

function initNavigation() {
  const btn = document.getElementById('btn-next');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const state = loadState();

    if (!state.cardImage) {
      const upload = document.getElementById('section-upload');
      if (upload) {
        upload.scrollIntoView({ behavior: 'smooth' });
        upload.querySelector('.section-card').style.borderColor = 'var(--color-error)';
        setTimeout(() => {
          upload.querySelector('.section-card').style.borderColor = '';
        }, 2000);
      }
      return;
    }

    window.location.href = 'confirm.html';
  });
}

function initMobileQRPreview() {
  const qrSection = document.getElementById('section-qr');
  const stickyPreview = document.querySelector('.qr-sticky-preview');
  if (!qrSection || !stickyPreview) return;

  const isMobile = () => window.innerWidth <= 600;

  const observer = new IntersectionObserver((entries) => {
    if (!isMobile()) {
      stickyPreview.classList.remove('visible');
      return;
    }
    entries.forEach(entry => {
      stickyPreview.classList.toggle('visible', entry.isIntersecting);
    });
  }, { threshold: 0.05 });

  observer.observe(qrSection);

  window.addEventListener('resize', () => {
    if (!isMobile()) stickyPreview.classList.remove('visible');
  });
}

function restoreState() {
  const state = loadState();

  // Restore link toggle
  const toggle = document.getElementById('link-toggle');
  const urlWrap = document.getElementById('link-url-wrap');
  const urlInput = document.getElementById('link-url');
  if (toggle && state.linkEnabled) {
    toggle.checked = true;
    if (urlWrap) urlWrap.classList.add('visible');
  }
  if (urlInput && state.linkUrl) {
    urlInput.value = state.linkUrl;
  }

  // Restore uploaded image
  if (state.cardImage) {
    const area = document.getElementById('upload-area');
    if (area) {
      area.classList.add('has-file');
      area.innerHTML = `
        <div class="upload-preview">
          <img src="${state.cardImage}" alt="${state.cardImageName || '名刺'}">
        </div>
        <p class="upload-text" style="margin-top: 0.75rem">
          <strong>${state.cardImageName || '名刺画像'}</strong>
        </p>
        <p class="upload-hint">クリックで変更</p>
      `;
    }
    const previewImg = document.getElementById('anim-preview-img');
    if (previewImg) previewImg.src = state.cardImage;
  }
}
