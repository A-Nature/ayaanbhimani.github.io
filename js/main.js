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
function renderAbout() {
  const bioWrap = document.getElementById("about-bio");
  bioWrap.innerHTML = "";
  SITE_DATA.about.bio.forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    bioWrap.appendChild(p);
  });
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
  { key: "volunteer", label: "Volunteer" },
  { key: "extracurricular", label: "Extracurricular" }
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
      const card = document.createElement("button");
      card.type = "button";
      card.className = "timeline-card";
      card.setAttribute("aria-haspopup", "dialog");
      card.innerHTML = `
        <div class="role">${escapeHTML(entry.role)}</div>
        <div class="place">${escapeHTML(entry.place)}</div>
        <div class="dates">${escapeHTML(entry.dates)}</div>
      `;
      card.addEventListener("click", () => openWindowModal(buildExperienceModalContent(entry)));
      group.appendChild(card);
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
  });
}

function openWindowModal(content) {
  lastFocusedEl = document.activeElement;
  modalTitleText.textContent = content.title;

  const mediaItems = (content.media || []).filter((m) => m && m.src);
  const downloads = content.downloads || [];

  const mediaHTML = buildMediaHTML(mediaItems);
  const tagsHTML = (content.tags && content.tags.length)
    ? `<div class="window-tags">${content.tags.map((t) => `<span class="tag">${escapeHTML(t)}</span>`).join("")}</div>`
    : "";
  const subtitleHTML = content.subtitle
    ? `<div class="window-section-title">${escapeHTML(content.subtitle)}</div>`
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
    ? `<div class="window-section-title">Downloads</div><div class="window-downloads">${downloads.map((d, i) => buildDownloadLinkHTML(d, i)).join("")}</div>`
    : "";
  const linksHTML = (content.links && content.links.length)
    ? `<div class="window-links">${content.links.map((l) => `<a class="btn" href="${l.url}" target="_blank" rel="noopener noreferrer">${escapeHTML(l.label)}</a>`).join("")}</div>`
    : "";

  modalBody.innerHTML = mediaHTML + subtitleHTML + tagsHTML + descriptionHTML + reflectionHTML + downloadsHTML + linksHTML;
  wireMediaTriggers(modalBody, mediaItems);
  wirePdfDownloadLinks(modalBody, downloads);

  modalOverlay.classList.add("is-open");
  modalOverlay.setAttribute("aria-hidden", "false");
  lockPageScroll();
  document.getElementById("window-close").focus();
}

function closeWindowModal() {
  modalOverlay.classList.remove("is-open");
  modalOverlay.setAttribute("aria-hidden", "true");
  unlockPageScroll();
  if (lastFocusedEl) lastFocusedEl.focus();
}

/* ---------------------------------------------------------------------- */
/* Media thumbnails (images/video) — click opens the shared lightbox,     */
/* with left/right navigation when an entry has more than one.           */
/* ---------------------------------------------------------------------- */
function buildMediaHTML(items) {
  // No src yet on anything: render nothing at all, rather than a visible
  // empty box. Set `src` in data.js and the slot appears automatically.
  if (!items.length) return "";

  const multi = items.length > 1;
  const thumbClass = multi ? "window-media-thumb" : "window-media";
  const thumbsHTML = items.map((item, i) => {
    const playIcon = item.type === "video" ? `<span class="media-play-icon">${ICONS.play || ""}</span>` : "";
    const el = item.type === "video"
      ? `<video src="${item.src}" muted playsinline></video>`
      : `<img src="${item.src}" alt="${escapeHTML(item.alt || "")}">`;
    return `<div class="${thumbClass} media-trigger" data-media-index="${i}">${el}${playIcon}</div>`;
  }).join("");

  return multi ? `<div class="window-media-strip">${thumbsHTML}</div>` : thumbsHTML;
}

function wireMediaTriggers(scope, items) {
  scope.querySelectorAll(".media-trigger").forEach((el) => {
    el.addEventListener("click", () => {
      openImageGallery(items, parseInt(el.dataset.mediaIndex, 10) || 0, el);
    });
  });
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
