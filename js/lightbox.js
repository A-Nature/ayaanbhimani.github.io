/*
  lightbox.js
  ---------------------------------------------------------------------------
  Shared media viewer, reusing the window-modal's titlebar/chrome (same
  .window-overlay/.window-modal/.window-titlebar/.window-close classes as
  main.js's project/experience modal, see css/style.css). Two ways in:

    openImageGallery(items, startIndex, triggerEl)
      items is a filtered array of { type: "image"|"video", src, alt }.
      Opens the clicked item, with left/right arrows + arrow keys to step
      through the rest when there's more than one.

    openPDFViewer(path, label, triggerEl)
      Desktop: embeds the PDF in an <iframe>, with "Open in new tab" and
      "Download" links in the titlebar as a fallback.
      Mobile/touch: skipped entirely — the caller should just let the link
      open in a new tab instead, since mobile browsers handle embedded PDFs
      badly. isMobileOrTouch() is exported for callers to check first.

  This overlay can stack on top of the project/experience window-modal
  (main.js). Closing it only closes itself — the Escape/backdrop handlers
  here never touch the underlying modal, and main.js's own Escape handler
  is guarded to step aside while this is open (see initWindowModal()).
*/

let lightboxOverlay, lightboxTitleText, lightboxBody, lightboxActions, lightboxPrevBtn, lightboxNextBtn;
let lightboxLastFocusedEl = null;
let lightboxGallery = null; // { items, index } while viewing images/video, null otherwise

function isMobileOrTouch() {
  return window.matchMedia("(max-width: 720px)").matches ||
    ("ontouchstart" in window) ||
    (navigator.maxTouchPoints || 0) > 0;
}

function initLightbox() {
  lightboxOverlay = document.getElementById("lightbox-overlay");
  lightboxTitleText = document.getElementById("lightbox-title-text");
  lightboxBody = document.getElementById("lightbox-body");
  lightboxActions = document.getElementById("lightbox-titlebar-actions");
  lightboxPrevBtn = document.getElementById("lightbox-prev");
  lightboxNextBtn = document.getElementById("lightbox-next");
  if (!lightboxOverlay) return;

  lightboxPrevBtn.innerHTML = ICONS.chevronLeft || "";
  lightboxNextBtn.innerHTML = ICONS.chevronRight || "";

  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  lightboxOverlay.addEventListener("click", (e) => {
    if (e.target === lightboxOverlay) closeLightbox();
  });
  lightboxPrevBtn.addEventListener("click", () => stepGallery(-1));
  lightboxNextBtn.addEventListener("click", () => stepGallery(1));

  document.addEventListener("keydown", (e) => {
    if (!lightboxOverlay.classList.contains("is-open")) return;
    if (e.key === "Escape") {
      // Stops the window-modal's own Escape listener (main.js) from also
      // firing in this same dispatch — otherwise it re-checks lightbox
      // state AFTER closeLightbox() has already cleared it below, and
      // closes the project modal too instead of stepping back to it.
      e.stopImmediatePropagation();
      closeLightbox();
    }
    if (e.key === "ArrowLeft") stepGallery(-1);
    if (e.key === "ArrowRight") stepGallery(1);
  });
}

function openImageGallery(items, startIndex, triggerEl) {
  if (!items || !items.length) return;
  lightboxLastFocusedEl = triggerEl || document.activeElement;
  lightboxGallery = { items, index: startIndex || 0 };
  lightboxActions.innerHTML = "";
  renderGalleryItem();
  showLightbox();
}

function stepGallery(delta) {
  if (!lightboxGallery) return;
  const n = lightboxGallery.items.length;
  lightboxGallery.index = (lightboxGallery.index + delta + n) % n;
  renderGalleryItem();
}

function renderGalleryItem() {
  // Pause whatever video was playing before swapping to the next item.
  const playing = lightboxBody.querySelector("video");
  if (playing) playing.pause();

  const item = lightboxGallery.items[lightboxGallery.index];
  if (item.type === "video") {
    lightboxTitleText.textContent = item.alt || "Video";
    lightboxBody.innerHTML = `<video src="${item.src}" controls playsinline class="lightbox-video"></video>`;
  } else {
    lightboxTitleText.textContent = item.alt || "Image";
    lightboxBody.innerHTML = `<img src="${item.src}" alt="${escapeHTML(item.alt || "")}" class="lightbox-image">`;
  }

  const multi = lightboxGallery.items.length > 1;
  lightboxPrevBtn.hidden = !multi;
  lightboxNextBtn.hidden = !multi;
}

function openPDFViewer(path, label, triggerEl) {
  lightboxLastFocusedEl = triggerEl || document.activeElement;
  lightboxGallery = null;
  lightboxPrevBtn.hidden = true;
  lightboxNextBtn.hidden = true;
  lightboxTitleText.textContent = label || "Document";
  lightboxBody.innerHTML = `<iframe src="${path}" class="lightbox-pdf" title="${escapeHTML(label || "PDF")}"></iframe>`;
  lightboxActions.innerHTML = `
    <a href="${path}" target="_blank" rel="noopener noreferrer" class="lightbox-action-link">Open in new tab</a>
    <a href="${path}" download class="lightbox-action-link">Download</a>
  `;
  showLightbox();
}

function showLightbox() {
  lightboxOverlay.classList.add("is-open");
  lightboxOverlay.setAttribute("aria-hidden", "false");
  lockPageScroll();
  document.getElementById("lightbox-close").focus();
}

function closeLightbox() {
  const playing = lightboxBody.querySelector("video");
  if (playing) playing.pause();

  lightboxOverlay.classList.remove("is-open");
  lightboxOverlay.setAttribute("aria-hidden", "true");
  lightboxBody.innerHTML = "";
  lightboxActions.innerHTML = "";
  lightboxGallery = null;
  unlockPageScroll();

  if (lightboxLastFocusedEl) lightboxLastFocusedEl.focus();
}
