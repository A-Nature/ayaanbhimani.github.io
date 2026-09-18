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
  const { hero } = SITE_DATA;
  document.getElementById("hero-name").textContent = hero.name;
  document.getElementById("hero-subtitle").textContent = hero.subtitle;
  document.getElementById("hero-location").textContent = hero.location;
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
/* Projects                                                                */
/* ---------------------------------------------------------------------- */
function renderProjects() {
  const grid = document.getElementById("project-grid");
  grid.innerHTML = "";

  SITE_DATA.projects.forEach((project) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "project-icon-tile";
    tile.setAttribute("aria-haspopup", "dialog");
    tile.innerHTML = `
      <span class="project-name">${escapeHTML(project.name)}</span>
      <span class="project-tagline">${escapeHTML(project.tags[0] || "")}</span>
    `;
    tile.addEventListener("click", () => openWindowModal(buildProjectModalContent(project)));
    grid.appendChild(tile);
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
    if (e.key === "Escape" && modalOverlay.classList.contains("is-open")) {
      closeWindowModal();
    }
  });
}

function openWindowModal(content) {
  lastFocusedEl = document.activeElement;
  modalTitleText.textContent = content.title;

  const mediaHTML = buildMediaHTML(content.media);
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
  const downloadsHTML = (content.downloads && content.downloads.length)
    ? `<div class="window-section-title">Downloads</div><div class="window-downloads">${content.downloads.map((d) => `<a class="btn window-download-link" href="${d.path}" download>${ICONS.download || ""}<span>${escapeHTML(d.label)}</span></a>`).join("")}</div>`
    : "";
  const linksHTML = (content.links && content.links.length)
    ? `<div class="window-links">${content.links.map((l) => `<a class="btn" href="${l.url}" target="_blank" rel="noopener noreferrer">${escapeHTML(l.label)}</a>`).join("")}</div>`
    : "";

  modalBody.innerHTML = mediaHTML + subtitleHTML + tagsHTML + descriptionHTML + reflectionHTML + downloadsHTML + linksHTML;

  modalOverlay.classList.add("is-open");
  modalOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.getElementById("window-close").focus();
}

function closeWindowModal() {
  modalOverlay.classList.remove("is-open");
  modalOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocusedEl) lastFocusedEl.focus();
}

function buildMediaHTML(media) {
  // No src yet: render nothing at all, rather than a visible empty box.
  // Set `src` in data.js and this slot appears automatically, no other
  // code changes needed.
  if (!media || !media.src) return "";
  if (media.type === "video") {
    return `<div class="window-media"><video src="${media.src}" controls playsinline></video></div>`;
  }
  return `<div class="window-media"><img src="${media.src}" alt="${escapeHTML(media.alt || "")}"></div>`;
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
