/*
  main.js
  ---------------------------------------------------------------------------
  Renders all data-driven sections (Projects, Experience, Skills, Contact)
  from data.js, and owns the shared "window" modal used by both Projects
  and Experience. Nothing in here is section-specific markup that couldn't
  be regenerated from data.js, add an entry there and it appears here
  automatically.
*/

document.addEventListener("DOMContentLoaded", () => {
  renderNav();
  renderHero();
  renderAbout();
  renderProjects();
  renderExperience();
  renderSkills();
  renderEducation();
  renderContact();
  initLightbox();
  initWindowModal();
  initNavScroll();
});

/* ---------------------------------------------------------------------- */
/* Nav                                                                     */
/* ---------------------------------------------------------------------- */
function renderNav() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    links.classList.toggle("is-open");
  });
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => links.classList.remove("is-open"));
  });
}

function initNavScroll() {
  const nav = document.getElementById("site-nav");
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------------------------------------------------------------------- */
/* Hero                                                                    */
/* ---------------------------------------------------------------------- */
function renderHero() {
  const { hero, contact } = SITE_DATA;
  document.getElementById("hero-name").textContent = hero.name;
  document.getElementById("hero-subtitle").textContent = hero.subtitle;
  document.getElementById("hero-location").textContent = hero.location;

  const resumeLink = document.getElementById("hero-resume-link");
  if (resumeLink && contact.resume) {
    resumeLink.href = contact.resume;
    // Desktop: open in the lightbox PDF viewer. Mobile/touch: fall through
    // to the plain target="_blank" link already set in the HTML, since
    // mobile browsers handle embedded PDFs badly.
    resumeLink.addEventListener("click", (e) => {
      if (isMobileOrTouch()) return;
      e.preventDefault();
      openPDFViewer(contact.resume, "Resume", resumeLink);
    });
  } else if (resumeLink) {
    resumeLink.remove();
  }
}

/* ---------------------------------------------------------------------- */
/* About                                                                   */
/* ---------------------------------------------------------------------- */
// Optional per-photo crop from data.js (CSS aspect-ratio / object-position).
function photoCropStyle(ph) {
  const parts = [];
  if (ph.ratio) parts.push(`aspect-ratio:${escapeHTML(ph.ratio)}`);
  if (ph.pos) parts.push(`object-position:${escapeHTML(ph.pos)}`);
  return parts.length ? ` style="${parts.join(";")}"` : "";
}

function renderAbout() {
  const wrap = document.getElementById("archive-items");
  const board = document.getElementById("archive-board");
  if (!wrap || !board) return;
  wrap.innerHTML = "";

  const records = SITE_DATA.about.records || [];
  const photos = (SITE_DATA.about.photos || []).filter((ph) => ph && ph.src);

  const photoHTML = (ph, n) => `
    <div class="paper">
      <img src="${ph.src}" alt="${escapeHTML(ph.alt || "")}"${photoCropStyle(ph)}>
      <span class="photo-fig">Fig. ${n}</span>
      ${ph.caption ? `<span class="photo-caption">${escapeHTML(ph.caption)}</span>` : ""}
    </div>`;

  // Each record gets its own row, alternating left and right. Its photo (if
  // any) sits in the same row on the opposite side, like papers spread out
  // on a desk. A photo's `side` in data.js picks its side (the record takes
  // the other one); `record` picks which record it sits beside.
  const photoFor = {};
  photos.forEach((ph, k) => {
    const idx = Number.isInteger(ph.record) ? ph.record : k;
    (photoFor[idx] = photoFor[idx] || []).push(ph);
  });

  let figNo = 0;
  records.forEach((record, i) => {
    const ph = (photoFor[i] || [])[0];
    let side = i % 2 === 0 ? "left" : "right";
    if (ph && (ph.side === "left" || ph.side === "right")) side = ph.side === "left" ? "right" : "left";

    const rec = document.createElement("article");
    rec.className = `board-item record record-v${i % 3} side-${side}${ph ? "" : " solo"}`;
    rec.style.gridRow = String(i + 1);
    rec.innerHTML = `
      <div class="paper">
        <div class="record-head"><span>Record ${String(i + 1).padStart(2, "0")}</span><span>${escapeHTML(record.era)}</span></div>
        <p>${escapeHTML(record.text)}</p>
      </div>`;
    wrap.appendChild(rec);

    if (ph) {
      const fig = document.createElement("figure");
      fig.className = `board-item archive-photo side-${side === "left" ? "right" : "left"}`;
      fig.style.gridRow = String(i + 1);
      fig.dataset.record = String(i);
      fig.innerHTML = photoHTML(ph, ++figNo);
      wrap.appendChild(fig);
    }
  });
  // Photos pointing past the last record get rows of their own.
  Object.keys(photoFor).map(Number).filter((idx) => idx >= records.length).forEach((idx) => {
    photoFor[idx].forEach((ph) => {
      const fig = document.createElement("figure");
      fig.className = `board-item archive-photo side-${figNo % 2 === 0 ? "left" : "right"}`;
      fig.style.gridRow = String(idx + 1);
      fig.dataset.record = String(Math.max(records.length - 1, 0));
      fig.innerHTML = photoHTML(ph, ++figNo);
      wrap.appendChild(fig);
    });
  });

  wrap.querySelectorAll("img").forEach((img) => img.addEventListener("load", drawArchiveLinks));
  drawArchiveLinks();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawArchiveLinks);
  window.addEventListener("load", drawArchiveLinks);
  if (window.ResizeObserver) new ResizeObserver(drawArchiveLinks).observe(board);

  // The marker arrows draw themselves the first time the desk scrolls into view.
  const linksSvg = document.getElementById("archive-links");
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    linksSvg.classList.add("is-drawn");
  } else {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        linksSvg.classList.add("is-drawn");
        io.disconnect();
      }
    }, { threshold: 0.15 });
    io.observe(board);
  }
}

// Marker arrows linking the papers in reading order: the title to the first
// record, each record to the next, and each record to its photo. They are
// drawn from the papers' real positions, so they also work when the layout
// stacks on a phone. Each stroke wobbles a little (seeded, so it is the same
// every time) and ends in a hand-drawn "V" arrowhead.
function drawArchiveLinks() {
  const board = document.getElementById("archive-board");
  const svg = document.getElementById("archive-links");
  if (!board || !svg) return;

  const b = board.getBoundingClientRect();
  if (!b.width) return;
  svg.setAttribute("viewBox", `0 0 ${b.width} ${b.height}`);

  const rel = (el) => {
    const r = el.getBoundingClientRect();
    return { l: r.left - b.left, r: r.right - b.left, t: r.top - b.top, b: r.bottom - b.top };
  };
  const title = board.querySelector(".archive-title");
  const recs = Array.from(board.querySelectorAll(".record"));
  const photos = Array.from(board.querySelectorAll(".archive-photo"));

  let n = 0;
  let out = "";
  // Deterministic "random" in [-0.5, 0.5] so the doodles don't change on resize.
  const jitter = (k) => { const x = Math.sin((k + 1) * 12.9898) * 43758.5453; return (x - Math.floor(x)) - 0.5; };
  const f = (v) => v.toFixed(1);

  const arrow = (x1, y1, x2, y2, axis) => {
    const k = n++ * 11;
    let c1x, c1y, c2x, c2y;
    if (axis === "v") {
      const dy = Math.max(Math.abs(y2 - y1) * 0.5, 40) * (y2 >= y1 ? 1 : -1);
      c1x = x1 + jitter(k + 1) * 26; c1y = y1 + dy * 0.9;
      c2x = x2 + jitter(k + 2) * 26; c2y = y2 - dy * 0.9;
    } else {
      const dx = Math.max(Math.abs(x2 - x1) * 0.5, 24) * (x2 >= x1 ? 1 : -1);
      c1x = x1 + dx * 0.9; c1y = y1 + jitter(k + 1) * 22;
      c2x = x2 - dx * 0.9; c2y = y2 + jitter(k + 2) * 22;
    }
    const ang = Math.atan2(y2 - c2y, x2 - c2x);
    const len = 19;
    const w1 = ang + 0.52 + jitter(k + 3) * 0.2;
    const w2 = ang - 0.52 + jitter(k + 4) * 0.2;
    const hx1 = x2 - len * Math.cos(w1), hy1 = y2 - len * Math.sin(w1);
    const hx2 = x2 - len * Math.cos(w2), hy2 = y2 - len * Math.sin(w2);
    const delay = (n - 1) * 0.55;
    out += `<path class="arrow-line" pathLength="1" style="--d:${delay.toFixed(2)}s" d="M${f(x1)} ${f(y1)}C${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(x2)} ${f(y2)}"/>`;
    out += `<path class="arrow-head" pathLength="1" style="--d:${(delay + 0.85).toFixed(2)}s" d="M${f(hx1)} ${f(hy1)}L${f(x2)} ${f(y2)}L${f(hx2)} ${f(hy2)}"/>`;
  };

  const first = recs.length ? rel(recs[0]) : null;
  if (title && first) {
    const t = rel(title);
    // leave the tape in the middle of each paper clear
    arrow(t.l + (t.r - t.l) * 0.3, t.b - 12, first.l + (first.r - first.l) * 0.22, first.t + 8, "v");
  }
  recs.forEach((el, i) => {
    if (!recs[i + 1]) return;
    const a = rel(el), c = rel(recs[i + 1]);
    // Land on the near side of the next record so the arrow doesn't cut
    // across a photo sitting beside the one above.
    const goesRight = (c.l + c.r) / 2 > (a.l + a.r) / 2;
    const fromX = a.l + (a.r - a.l) * (goesRight ? 0.62 : 0.38);
    const toX = c.l + (c.r - c.l) * (goesRight ? 0.28 : 0.72);
    // start inside the lower margin of one paper, end just inside the next
    arrow(fromX, a.b - 16, toX, c.t + 8, "v");
  });
  photos.forEach((el) => {
    const rec = recs[Number(el.dataset.record)];
    if (!rec) return;
    const a = rel(rec), p = rel(el);
    const ay = (a.t + a.b) / 2, py = (p.t + p.b) / 2;
    if (p.l >= a.r - 50) arrow(a.r + 6, ay, p.l - 8, py, "h");
    else if (p.r <= a.l + 50) arrow(a.l - 6, ay, p.r + 8, py, "h");
    else arrow((a.l + a.r) / 2, a.b + 4, (p.l + p.r) / 2, p.t - 10, "v");
  });

  svg.innerHTML = `<g class="link-lines">${out}</g>`;
}

/* ---------------------------------------------------------------------- */
/* Projects — rendered as strata bands, newest/in-progress on top, each    */
/* holding its projects as "fossil" cards. See groupProjectsIntoLayers().  */
/* ---------------------------------------------------------------------- */
const PROJECT_LAYER_COLORS = ["var(--color-rock-dark)", "var(--color-clay)", "var(--color-sand)"];

function groupProjectsIntoLayers(projects) {
  const inProgress = projects.filter((p) => p.status === "in-progress");
  const dated = projects
    .filter((p) => p.status !== "in-progress")
    .slice()
    .sort((a, b) => (b.year || 0) - (a.year || 0));

  const layers = [];
  if (inProgress.length) {
    layers.push({ label: "Still Excavating", projects: inProgress });
  }
  let currentYear = null;
  let currentGroup = null;
  dated.forEach((project) => {
    if (project.year !== currentYear) {
      currentYear = project.year;
      currentGroup = { label: String(currentYear), projects: [] };
      layers.push(currentGroup);
    }
    currentGroup.projects.push(project);
  });
  return layers;
}

function renderProjects() {
  const wrap = document.getElementById("project-grid");
  wrap.innerHTML = "";

  const layers = groupProjectsIntoLayers(SITE_DATA.projects);
  let specimenNo = 0;

  layers.forEach((layer, i) => {
    const band = document.createElement("div");
    band.className = "project-layer";
    // Each band shades darker toward its bottom (the last one fades into
    // the bedrock background), so the wavy edge where the next layer
    // begins stays visible instead of every band melting together.
    // --layer-top colors that wavy edge.
    const thisColor = PROJECT_LAYER_COLORS[i % PROJECT_LAYER_COLORS.length];
    const bottomColor = i < layers.length - 1
      ? `color-mix(in srgb, ${thisColor} 72%, black)`
      : "var(--color-bg)";
    band.style.background = `linear-gradient(to bottom, ${thisColor} 0%, ${bottomColor} 100%)`;
    band.style.setProperty("--layer-top", thisColor);

    const grain = document.createElement("div");
    grain.className = "layer-grain";
    grain.setAttribute("aria-hidden", "true");
    band.appendChild(grain);

    const inner = document.createElement("div");
    inner.className = "container";

    const label = document.createElement("span");
    label.className = "project-layer-label";
    label.textContent = layer.label;
    inner.appendChild(label);

    const grid = document.createElement("div");
    grid.className = "fossil-grid";
    layer.projects.forEach((project) => {
      specimenNo++;
      const card = document.createElement("button");
      card.type = "button";
      card.className = "fossil-card";
      card.setAttribute("aria-haspopup", "dialog");

      // A real screenshot/photo wins over the drawn fossil once one is
      // set in the project's media array.
      const cover = (project.media || []).find((m) => m && m.src && m.type === "image");
      const art = cover
        ? `<img class="fossil-cover" src="${cover.src}" alt="${escapeHTML(cover.alt || "")}">`
        : `<span class="fossil-dust" aria-hidden="true"></span>${fossilSVG(project.fossil)}`;

      const tags = (project.tags || []).slice(0, 3).join(" · ");
      card.innerHTML = `
        <span class="fossil-relief${cover ? " has-cover" : ""}">${art}</span>
        <span class="fossil-info">
          <span class="fossil-catalog">Specimen Nº ${String(specimenNo).padStart(3, "0")}</span>
          <span class="project-name">${escapeHTML(project.name)}</span>
          <span class="project-tagline">${escapeHTML(tags)}</span>
          ${project.dates ? `<span class="fossil-meta">${escapeHTML(project.dates)}</span>` : ""}
          <span class="fossil-open">View details &rarr;</span>
        </span>
      `;
      card.addEventListener("click", () => openWindowModal(buildProjectModalContent(project)));
      grid.appendChild(card);
    });
    inner.appendChild(grid);

    band.appendChild(inner);
    wrap.appendChild(band);
  });
}

function buildProjectModalContent(project) {
  return {
    title: project.name,
    subtitle: project.dates,
    fossil: project.fossil,
    media: project.media,
    tags: project.tags,
    description: project.description,
    reflection: project.reflection,
    links: project.links,
    downloads: project.downloads
  };
}

/* ---------------------------------------------------------------------- */
/* Experience                                                              */
/* ---------------------------------------------------------------------- */
const EXP_TABS = [
  { key: "work", label: "Work" },
  { key: "extracurricular", label: "Extracurricular" },
  { key: "volunteer", label: "Volunteer" }
];

function renderExperience() {
  const tabBar = document.getElementById("exp-tabs");
  const timelineWrap = document.getElementById("exp-timeline");
  tabBar.innerHTML = "";
  timelineWrap.innerHTML = "";

  EXP_TABS.forEach((tab, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "exp-tab" + (i === 0 ? " is-active" : "");
    btn.textContent = tab.label;
    btn.dataset.tab = tab.key;
    btn.addEventListener("click", () => setActiveExpTab(tab.key));
    tabBar.appendChild(btn);

    const group = document.createElement("div");
    group.className = "timeline-entry" + (i === 0 ? " is-visible" : "");
    group.dataset.tabPanel = tab.key;

    const list = SITE_DATA.experience[tab.key] || [];
    list.forEach((entry) => {
      const item = document.createElement("div");
      item.className = "tl-item";
      item.innerHTML = `
        <div class="tl-tag-wrap"><span class="tl-tag">${escapeHTML(entry.dates)}</span></div>
        <span class="tl-node" aria-hidden="true"></span>
      `;

      const card = document.createElement("button");
      card.type = "button";
      card.className = "timeline-card";
      card.setAttribute("aria-haspopup", "dialog");
      card.innerHTML = `
        <div class="role">${escapeHTML(entry.role)}</div>
        <div class="place">${escapeHTML(entry.place)}</div>
      `;
      card.addEventListener("click", () => openWindowModal(buildExperienceModalContent(entry)));
      item.appendChild(card);
      group.appendChild(item);
    });

    timelineWrap.appendChild(group);
  });
}

function setActiveExpTab(key) {
  document.querySelectorAll(".exp-tab").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.tab === key);
  });
  document.querySelectorAll(".timeline-entry").forEach((panel) => {
    panel.classList.toggle("is-visible", panel.dataset.tabPanel === key);
  });
}

function buildExperienceModalContent(entry) {
  return {
    title: `${entry.role} at ${entry.place}`,
    subtitle: entry.dates,
    media: entry.media,
    tags: [],
    description: entry.description,
    reflection: entry.reflection,
    links: [],
    downloads: entry.downloads
  };
}

/* ---------------------------------------------------------------------- */
/* Skills                                                                  */
/* ---------------------------------------------------------------------- */
function renderSkills() {
  const wrap = document.getElementById("skills-groups");
  wrap.innerHTML = "";

  SITE_DATA.skills.forEach((group) => {
    const el = document.createElement("div");
    el.className = "skills-group";
    el.innerHTML = `
      <h3>${escapeHTML(group.category)}</h3>
      <div class="skills-tags">
        ${group.items.map((item) => `<span class="skill-tag">${escapeHTML(item)}</span>`).join("")}
      </div>
    `;
    wrap.appendChild(el);
  });
}

/* ---------------------------------------------------------------------- */
/* Education                                                               */
/* ---------------------------------------------------------------------- */
function renderEducation() {
  const wrap = document.getElementById("education-list");
  if (!wrap) return;
  wrap.innerHTML = "";

  SITE_DATA.education.forEach((entry) => {
    const el = document.createElement("div");
    el.className = "education-entry";
    const awardsHTML = (entry.awards && entry.awards.length)
      ? `<ul class="education-awards">${entry.awards.map((a) => `<li>${escapeHTML(a)}</li>`).join("")}</ul>`
      : "";
    el.innerHTML = `
      <div class="education-head">
        <span class="education-institution">${escapeHTML(entry.institution)}</span>
        <span class="education-dates">${escapeHTML(entry.dates)}</span>
      </div>
      <div class="education-program">${escapeHTML(entry.program)}</div>
      ${awardsHTML}
    `;
    wrap.appendChild(el);
  });
}

/* ---------------------------------------------------------------------- */
/* Contact                                                                 */
/* ---------------------------------------------------------------------- */
function renderContact() {
  const { contact } = SITE_DATA;
  const wrap = document.getElementById("contact-links");
  wrap.innerHTML = "";

  const links = [
    { label: contact.email, url: `mailto:${contact.email}`, icon: "email" },
    { label: "GitHub", url: contact.github, icon: "github" },
    { label: "LinkedIn", url: contact.linkedin, icon: "linkedin" },
    { label: "Instagram", url: contact.instagram, icon: "instagram" }
  ];

  links.forEach((link) => {
    const a = document.createElement("a");
    a.className = "contact-link";
    a.href = link.url;
    if (link.url.startsWith("http")) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    a.innerHTML = `${ICONS[link.icon] || ""}<span>${escapeHTML(link.label)}</span>`;
    wrap.appendChild(a);
  });

  document.getElementById("footer-year").textContent = new Date().getFullYear();
}

/* ---------------------------------------------------------------------- */
/* Page-scroll lock, shared by the window modal and the lightbox so that  */
/* closing one while the other is still open doesn't re-enable scrolling. */
/* ---------------------------------------------------------------------- */
let openOverlayCount = 0;
function lockPageScroll() {
  openOverlayCount++;
  document.body.style.overflow = "hidden";
}
function unlockPageScroll() {
  openOverlayCount = Math.max(0, openOverlayCount - 1);
  if (openOverlayCount === 0) document.body.style.overflow = "";
}

/* ---------------------------------------------------------------------- */
/* Shared window modal (Projects + Experience)                            */
/* ---------------------------------------------------------------------- */
let modalOverlay, modalTitleText, modalBody, lastFocusedEl;

function initWindowModal() {
  modalOverlay = document.getElementById("window-overlay");
  modalTitleText = document.getElementById("window-title-text");
  modalBody = document.getElementById("window-body");

  document.getElementById("window-close").addEventListener("click", closeWindowModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeWindowModal();
  });
  document.addEventListener("keydown", (e) => {
    // Step aside if the lightbox is open on top of this modal — it owns
    // Escape while it's the topmost thing on screen.
    const lightboxIsOpen = lightboxOverlay && lightboxOverlay.classList.contains("is-open");
    if (e.key === "Escape" && modalOverlay.classList.contains("is-open") && !lightboxIsOpen) {
      closeWindowModal();
    }
    if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && stepActiveSlideshow
        && modalOverlay.classList.contains("is-open") && !lightboxIsOpen) {
      stepActiveSlideshow(e.key === "ArrowRight" ? 1 : -1);
    }
  });
}

function openWindowModal(content) {
  lastFocusedEl = document.activeElement;
  modalTitleText.textContent = content.title;

  const mediaItems = (content.media || []).filter((m) => m && m.src);
  const downloads = content.downloads || [];

  const mediaHTML = buildMediaHTML(mediaItems);
  // Placard: dates and "Medium" (the tech stack) set like a gallery wall
  // label. Skipped entirely when an entry has neither.
  const datesHTML = content.subtitle
    ? `<p class="window-dates">${escapeHTML(content.subtitle)}</p>`
    : "";
  const mediumHTML = (content.tags && content.tags.length)
    ? `<p class="window-medium"><span>Medium</span>${content.tags.map((t) => escapeHTML(t)).join(" · ")}</p>`
    : "";
  const placardHTML = (datesHTML || mediumHTML)
    ? `<div class="window-placard">${datesHTML}${mediumHTML}</div>`
    : "";
  const watermarkHTML = (content.fossil && typeof fossilSVG === "function")
    ? `<span class="window-watermark" aria-hidden="true">${fossilSVG(content.fossil)}</span>`
    : "";
  const descriptionHTML = content.description
    ? `<div class="window-section-title">Description</div><p class="window-description">${escapeHTML(content.description)}</p>`
    : "";
  // No reflection yet: skip the section entirely rather than showing a
  // visible gap or placeholder text.
  const reflectionHTML = content.reflection
    ? `<div class="window-section-title">Reflection</div><p class="window-reflection">${escapeHTML(content.reflection)}</p>`
    : "";
  // No downloads yet: skip the section, same rule as media and reflection.
  const downloadsHTML = downloads.length
    ? `<div class="window-section-title">Related</div><div class="window-downloads">${downloads.map((d, i) => buildDownloadLinkHTML(d, i)).join("")}</div>`
    : "";
  const linksHTML = (content.links && content.links.length)
    ? `<div class="window-links">${content.links.map((l) => `<a class="btn" href="${l.url}" target="_blank" rel="noopener noreferrer">${escapeHTML(l.label)}</a>`).join("")}</div>`
    : "";

  modalBody.innerHTML = watermarkHTML + mediaHTML + placardHTML + descriptionHTML + reflectionHTML + downloadsHTML + linksHTML;
  wireSlideshow(modalBody, mediaItems);
  wirePdfDownloadLinks(modalBody, downloads);

  modalOverlay.classList.add("is-open");
  modalOverlay.setAttribute("aria-hidden", "false");
  lockPageScroll();
  document.getElementById("window-close").focus();
}

function closeWindowModal() {
  stepActiveSlideshow = null;
  modalBody.querySelectorAll("video").forEach((v) => v.pause());
  modalOverlay.classList.remove("is-open");
  modalOverlay.setAttribute("aria-hidden", "true");
  unlockPageScroll();
  if (lastFocusedEl) lastFocusedEl.focus();
}

/* ---------------------------------------------------------------------- */
/* Media: shown straight away as a framed slideshow at the top of the     */
/* window. Arrows, dots, the arrow keys and swipes step through; clicking */
/* an image opens it full size in the lightbox. Videos play inline.       */
/* ---------------------------------------------------------------------- */
const SLIDE_CHEVRON_LEFT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
const SLIDE_CHEVRON_RIGHT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';
let stepActiveSlideshow = null;

function buildMediaHTML(items) {
  // No src yet on anything: render nothing at all, rather than a visible
  // empty box. Set `src` in data.js and the slot appears automatically.
  if (!items.length) return "";

  const multi = items.length > 1;
  const slides = items.map((item, i) => {
    const el = item.type === "video"
      ? `<video src="${item.src}" controls playsinline preload="metadata"></video>`
      : `<img class="media-trigger" data-media-index="${i}" src="${item.src}" alt="${escapeHTML(item.alt || "")}">`;
    return `<div class="slide${i === 0 ? " is-active" : ""}">${el}</div>`;
  }).join("");
  const arrows = multi
    ? `<button type="button" class="slide-arrow slide-prev" aria-label="Previous image">${SLIDE_CHEVRON_LEFT}</button>
       <button type="button" class="slide-arrow slide-next" aria-label="Next image">${SLIDE_CHEVRON_RIGHT}</button>`
    : "";
  const hasCaptions = items.some((m) => m.caption);
  const bar = multi
    ? `<div class="slide-bar"><span class="slide-count">1 / ${items.length}</span><span class="slide-dots">${items.map((_, i) => `<button type="button" class="slide-dot${i === 0 ? " is-active" : ""}" data-slide="${i}" aria-label="Show image ${i + 1}"></button>`).join("")}</span></div>`
    : "";
  return `<div class="window-slideshow">
    <div class="slide-frame">${slides}${arrows}</div>
    ${hasCaptions ? '<p class="slide-caption"></p>' : ""}
    ${bar}
  </div>`;
}

function wireSlideshow(scope, items) {
  const root = scope.querySelector(".window-slideshow");
  if (!root) return;
  const slides = Array.from(root.querySelectorAll(".slide"));
  const dots = Array.from(root.querySelectorAll(".slide-dot"));
  const caption = root.querySelector(".slide-caption");
  const count = root.querySelector(".slide-count");
  const frame = root.querySelector(".slide-frame");
  let index = 0;

  function show(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
      const video = slide.querySelector("video");
      if (video && i !== index) video.pause();
    });
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
    if (count) count.textContent = `${index + 1} / ${slides.length}`;
    if (caption) {
      const text = items[index].caption;
      caption.innerHTML = text ? `<span class="slide-fig">Fig. ${index + 1}</span>${escapeHTML(text)}` : "";
    }
  }
  show(0);

  const prev = root.querySelector(".slide-prev");
  const next = root.querySelector(".slide-next");
  if (prev) prev.addEventListener("click", () => show(index - 1));
  if (next) next.addEventListener("click", () => show(index + 1));
  dots.forEach((dot) => dot.addEventListener("click", () => show(parseInt(dot.dataset.slide, 10))));

  // Swipe on touch screens.
  let startX = null;
  frame.addEventListener("pointerdown", (e) => { startX = e.pointerType === "touch" ? e.clientX : null; });
  frame.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
  });

  root.querySelectorAll(".media-trigger").forEach((el) => {
    el.addEventListener("click", () => {
      openImageGallery(items, parseInt(el.dataset.mediaIndex, 10) || 0, el);
    });
  });

  stepActiveSlideshow = slides.length > 1 ? (delta) => show(index + delta) : null;
}

/* ---------------------------------------------------------------------- */
/* Downloads — PDFs open in the lightbox on desktop (new tab on mobile/   */
/* touch); everything else (zips, jars) stays a plain forced download.   */
/* ---------------------------------------------------------------------- */
function buildDownloadLinkHTML(download, index) {
  const isPDF = /\.pdf$/i.test(download.path);
  const attrs = isPDF
    ? `target="_blank" rel="noopener noreferrer" data-pdf="true" data-download-index="${index}"`
    : `download`;
  return `<a class="btn window-download-link" href="${download.path}" ${attrs}>${ICONS.download || ""}<span>${escapeHTML(download.label)}</span></a>`;
}

function wirePdfDownloadLinks(scope, downloads) {
  scope.querySelectorAll('.window-download-link[data-pdf="true"]').forEach((el) => {
    el.addEventListener("click", (e) => {
      // Mobile/touch: let the target="_blank" link open normally instead.
      if (isMobileOrTouch()) return;
      e.preventDefault();
      const d = downloads[parseInt(el.dataset.downloadIndex, 10)];
      openPDFViewer(d.path, d.label, el);
    });
  });
}

/* ---------------------------------------------------------------------- */
/* Utils                                                                   */
/* ---------------------------------------------------------------------- */
function escapeHTML(str) {
  if (str == null) return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
