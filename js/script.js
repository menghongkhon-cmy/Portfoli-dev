/**
 * ============================================================
 *  PORTFOLIO SCRIPT
 *  Reads content from data.js (SITE, SKILLS, PROJECTS, TESTIMONIALS, I18N)
 *  and renders + wires up the whole page.
 * ============================================================
 */
(function () {
  "use strict";

  const LIVE_DATA_KEY = "portfolio-admin-data";
  const ADMIN_GATE_PASSWORD = "@menghong180";
  const liveData = (() => {
    try {
      const stored = localStorage.getItem(LIVE_DATA_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      return null;
    }
  })();
  const siteData = liveData && liveData.SITE ? liveData.SITE : SITE;
  const skillsData = liveData && liveData.SKILLS ? liveData.SKILLS : SKILLS;
  const projectsData = liveData && liveData.PROJECTS ? liveData.PROJECTS : PROJECTS;
  const testimonialsData =
    liveData && liveData.TESTIMONIALS ? liveData.TESTIMONIALS : TESTIMONIALS;
  const translations = liveData && liveData.I18N ? liveData.I18N : I18N;
  const appearanceData = liveData && liveData.APPEARANCE ? liveData.APPEARANCE : {};

  /* ---------------- helpers ---------------- */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = () => window.matchMedia("(hover: none), (pointer: coarse)").matches;

  function t(lang, path) {
    const parts = path.split(".");
    let node = translations[lang];
    for (const p of parts) {
      if (node == null) break;
      node = node[p];
    }
    if (node != null) return node;
    if (lang !== "en") return t("en", path);
    return "";
  }

  /* ---------------- state ---------------- */
  const state = {
    lang: localStorage.getItem("portfolio-lang") || "en",
    theme: localStorage.getItem("portfolio-theme") || appearanceData.defaultTheme || "dark",
    projectFilter: "all",
    testimonialIndex: 0,
  };

  /* ============================================================
     THEME
  ============================================================ */
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("portfolio-theme", theme);
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0a0d16" : "#f7f7fb");
    const icon = $("#themeToggle use");
    if (icon) icon.setAttribute("href", theme === "dark" ? "#i-sun" : "#i-moon");
  }

  function initTheme() {
    if (appearanceData.accent) {
      document.documentElement.style.setProperty("--accent", appearanceData.accent);
    }
    applyTheme(state.theme);
    $("#themeToggle").addEventListener("click", () => {
      applyTheme(state.theme === "dark" ? "light" : "dark");
    });
  }

  function initSiteSettings() {
    const stats = siteData.stats || {};
    const counters = $$('[data-counter]');
    [stats.projects, stats.technologies, stats.monthsLearning].forEach((value, index) => {
      if (value == null || !counters[index]) return;
      counters[index].setAttribute("data-counter", String(value));
    });

    const profileImages = $$(".hero__avatar img, .about__photo img");
    if (siteData.profileImageDataUrl) {
      profileImages.forEach((image) => { image.src = siteData.profileImageDataUrl; });
    }

    const cvUrl = siteData.cvDataUrl ||
      (siteData.cvFile === "assets/cv/Menghong_CV.pdf" ? "Khon_Menghong_CV_Final.pdf" : siteData.cvFile);
    if (cvUrl) $$("a[download]").filter((link) => /\.pdf|CV/i.test(link.href)).forEach((link) => { link.href = cvUrl; });
    $$('a[href^="mailto:"]').forEach((link) => {
      link.href = `mailto:${siteData.email}`;
      const text = link.querySelector("span");
      if (text) text.textContent = siteData.email;
    });
    const socialLinks = siteData.social || {};
    if (socialLinks.github) $$('a[href*="github.com"]').forEach((link) => { link.href = socialLinks.github; });
    if (socialLinks.linkedin) $$('a[href*="linkedin.com"]').forEach((link) => { link.href = socialLinks.linkedin; });
    if (socialLinks.telegram) $$('a[href*="t.me/"]').forEach((link) => { link.href = socialLinks.telegram; });
    $$('a[download]').forEach((link) => {
      if (siteData.cvFileName) link.download = siteData.cvFileName;
    });
  }

  /* ============================================================
     LANGUAGE / I18N
  ============================================================ */
  function applyStaticTranslations(lang) {
    $$("[data-i18n]").forEach((el) => {
      const val = t(lang, el.getAttribute("data-i18n"));
      if (val) el.textContent = val;
    });
    $$("[data-i18n-alt]").forEach((el) => {
      const val = t(lang, el.getAttribute("data-i18n-alt"));
      if (val) el.setAttribute("alt", val);
    });
    document.title = t(lang, "meta.title");
    const desc = $('meta[name="description"]');
    if (desc) desc.setAttribute("content", t(lang, "meta.description"));
    const ogDesc = $('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", t(lang, "meta.description"));
    const ogTitle = $('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", t(lang, "meta.title"));
  }

  function updateLangSwitchUI(lang) {
    $$(".lang-switch__btn").forEach((btn) => {
      const active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function closeLangSwitch() {
    const switcher = $("#langSwitch");
    if (!switcher) return;
    switcher.classList.remove("is-open");
    switcher.setAttribute("aria-expanded", "false");
  }

  function toggleLangSwitch() {
    const switcher = $("#langSwitch");
    if (!switcher) return;
    const isOpen = switcher.classList.toggle("is-open");
    switcher.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  function setLanguage(lang) {
    state.lang = lang;
    localStorage.setItem("portfolio-lang", lang);
    document.documentElement.setAttribute("lang", lang);
    document.body.classList.toggle("lang-km", lang === "km");
    document.body.classList.toggle("lang-ja", lang === "ja");
    applyStaticTranslations(lang);
    updateLangSwitchUI(lang);
    closeLangSwitch();
    renderDynamicSections(lang);
  }

  function initLanguage() {
    $$(".lang-switch__btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.classList.contains("is-active")) {
          toggleLangSwitch();
          return;
        }
        setLanguage(btn.getAttribute("data-lang"));
      });
    });
    document.documentElement.setAttribute("lang", state.lang);
    document.body.classList.toggle("lang-km", state.lang === "km");
    document.body.classList.toggle("lang-ja", state.lang === "ja");
  }

  /* ============================================================
     DYNAMIC SECTION RENDERERS
  ============================================================ */
  function renderDynamicSections(lang) {
    renderAboutTimeline(lang);
    renderSkills(lang);
    renderProjects(lang);
    renderJourney(lang);
    renderBackgroundStudy(lang);
    renderEducation(lang);
    renderCerts(lang);
    renderGithub(lang);
    renderTestimonials(lang);
    renderAboutLists(lang);

    const modal = $("#projectModal");
    if (modal && !modal.hidden && modal.dataset.openId) {
      openProjectModal(modal.dataset.openId);
    }
  }

  // ---- About: strengths list ----
  function renderAboutLists(lang) {
    const list = $("#strengthsList");
    list.innerHTML = "";
    (t(lang, "about.strengths") || []).forEach((s) => {
      const li = document.createElement("li");
      li.textContent = s;
      list.appendChild(li);
    });

    const highlights = $("#aboutHighlights");
    if (!highlights) return;
    highlights.innerHTML = "";
    (t(lang, "about.highlights") || []).forEach((highlight) => {
      const item = document.createElement("article");
      item.className = "about__highlight";
      item.innerHTML = `<h3>${highlight.title || ""}</h3><p>${highlight.text || ""}</p>`;
      highlights.appendChild(item);
    });
  }

  // ---- About: mini timeline ----
  function renderAboutTimeline(lang) {
    const wrap = $("#aboutTimeline");
    wrap.innerHTML = '<div class="mini-timeline"></div>';
    const mini = $(".mini-timeline", wrap);
    (t(lang, "about.timeline") || []).forEach((step) => {
      const item = document.createElement("div");
      item.className = "mini-timeline__item reveal";
      item.innerHTML = `
        <span class="mini-timeline__dot" aria-hidden="true"></span>
        <span class="mini-timeline__label">${step.label}</span>
        <p class="mini-timeline__desc">${step.desc}</p>`;
      mini.appendChild(item);
    });
    observeReveal();
  }

  // ---- Skills ----
  function renderSkills(lang) {
    ["frontend", "backend", "tools"].forEach((group) => {
      const container = $(`.skill-bars[data-skill-group="${group}"]`);
      container.innerHTML = "";
      const items = skillsData[group];
      items.forEach((skill) => {
        const row = document.createElement("div");
        row.className = "skill-bar";
        row.innerHTML = `
          <div class="skill-bar__top">
            <span class="skill-bar__name">${skill.name}</span>
            <span class="skill-bar__value">${skill.level}%</span>
          </div>
          <div class="skill-bar__track">
            <span class="skill-bar__fill" data-fill="${skill.level}"></span>
          </div>`;
        container.appendChild(row);
      });
      // update the average ring value
      const avg = Math.round(items.reduce((a, s) => a + s.level, 0) / items.length);
      const card = container.closest(".skill-card");
      const ring = $(".skill-card__ring", card);
      ring.setAttribute("data-ring", avg);
      $(".skill-card__pct", ring).textContent = "0%";
      const circle = $(".ring-fg", ring);
      const r = circle.r.baseVal.value;
      const circumference = 2 * Math.PI * r;
      circle.style.strokeDasharray = `${circumference}`;
      circle.style.strokeDashoffset = `${circumference}`;
      circle.dataset.circumference = circumference;
    });
    resetSkillAnimationState();
    observeSkillCards();
  }

  function resetSkillAnimationState() {
    $$(".skill-card").forEach((c) => c.classList.remove("is-animated"));
  }

  function animateSkillCard(card) {
    if (card.classList.contains("is-animated")) return;
    card.classList.add("is-animated");
    const reduced = prefersReducedMotion();

    // bars
    $$(".skill-bar__fill", card).forEach((fill) => {
      const level = fill.getAttribute("data-fill");
      requestAnimationFrame(() => {
        fill.style.width = reduced ? level + "%" : level + "%";
      });
    });

    // ring
    const ring = $(".skill-card__ring", card);
    const target = parseInt(ring.getAttribute("data-ring"), 10);
    const circle = $(".ring-fg", ring);
    const pctLabel = $(".skill-card__pct", ring);
    const circumference = parseFloat(circle.dataset.circumference);

    if (reduced) {
      circle.style.strokeDashoffset = circumference - (target / 100) * circumference;
      pctLabel.textContent = target + "%";
      return;
    }
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      circle.style.strokeDashoffset = circumference - (current / 100) * circumference;
      pctLabel.textContent = current + "%";
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  let skillObserver;
  function observeSkillCards() {
    if (skillObserver) skillObserver.disconnect();
    skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) animateSkillCard(entry.target);
        });
      },
      { threshold: 0.35 }
    );
    $$(".skill-card").forEach((card) => {
      skillObserver.observe(card);
      if (!card.dataset.hoverAnimationBound) {
        card.addEventListener("mouseenter", () => animateSkillRing(card));
        card.dataset.hoverAnimationBound = "true";
      }
    });
  }

  function animateSkillRing(card) {
    if (prefersReducedMotion()) return;
    const ring = $(".skill-card__ring", card);
    const circle = $(".ring-fg", ring);
    const pctLabel = $(".skill-card__pct", ring);
    const target = parseInt(ring.getAttribute("data-ring"), 10) || 0;
    const circumference = parseFloat(circle.dataset.circumference);
    const duration = 900;
    const start = performance.now();
    circle.style.strokeDashoffset = circumference;

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      circle.style.strokeDashoffset = circumference - (current / 100) * circumference;
      pctLabel.textContent = current + "%";
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ---- Projects ----
  function projectInitials(name) {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }

  function projectImagePath(image) {
    if (!image) return "";
    return image.includes("/") ? image : `assets/projects/${image}.jpg`;
  }

  function renderProjects(lang) {
    const grid = $("#projectsGrid");
    grid.innerHTML = "";
    const dict = t(lang, "projects.items");
    const labels = t(lang, "projects");

    projectsData.forEach((proj, i) => {
      const content = dict[proj.id];
      const card = document.createElement("article");
      card.className = "project-card";
      card.style.animationDelay = `${i * 0.06}s`;
      card.setAttribute("data-category", proj.category);
      card.setAttribute("data-project-id", proj.id);
      const imagePath = projectImagePath(proj.image);
      card.innerHTML = `
        <div class="project-card__image">
          ${imagePath ? `<img src="${imagePath}" alt="${content.name} project preview" loading="lazy">` : ""}
          <span class="project-card__glyph" aria-hidden="true">${projectInitials(content.name)}</span>
        </div>
        <div class="project-card__body">
          <div class="project-card__top">
            <div>
              <span class="project-card__cat">${labels.filters[proj.category] || proj.category}</span>
              <h3 class="project-card__title">${content.name}</h3>
            </div>
          </div>
          <p class="project-card__desc">${content.desc}</p>
          <div class="project-card__tech">
            ${proj.tech.map((tech) => `<span class="tech-tag">${tech}</span>`).join("")}
          </div>
          <div class="project-card__actions">
            <a href="${proj.github}" target="_blank" rel="noopener" class="project-card__icon-link" aria-label="${labels.github} — ${content.name}">
              <svg class="icon icon--sm" aria-hidden="true"><use href="#i-github"></use></svg>
            </a>
            <a href="${proj.demo}" target="_blank" rel="noopener" class="project-card__icon-link" aria-label="${labels.demo} — ${content.name}">
              <svg class="icon icon--sm" aria-hidden="true"><use href="#i-external"></use></svg>
            </a>
            <button type="button" class="project-card__details-link" data-open-project="${proj.id}">
              ${labels.details}
              <svg class="icon icon--sm" aria-hidden="true"><use href="#i-arrow-right"></use></svg>
            </button>
          </div>
        </div>`;
      grid.appendChild(card);
      const projectImage = $(".project-card__image img", card);
      if (projectImage) {
        const imageWrap = projectImage.parentElement;
        imageWrap.classList.add("has-image");
        projectImage.addEventListener("error", () => {
          imageWrap.classList.remove("has-image");
          projectImage.remove();
        }, { once: true });
      }
    });

    applyProjectFilter(state.projectFilter);
    $$("[data-open-project]").forEach((btn) => {
      btn.addEventListener("click", () => openProjectModal(btn.getAttribute("data-open-project")));
    });
  }

  function applyProjectFilter(filter) {
    state.projectFilter = filter;
    $$(".project-card").forEach((card) => {
      const match = filter === "all" || card.getAttribute("data-category") === filter;
      card.classList.toggle("is-hidden", !match);
    });
  }

  function initProjectFilters() {
    $$(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$(".filter-btn").forEach((b) => {
          b.classList.remove("is-active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-selected", "true");
        applyProjectFilter(btn.getAttribute("data-filter"));
      });
    });
  }

  // ---- Project modal ----
  function openProjectModal(id) {
    const lang = state.lang;
    const proj = projectsData.find((p) => p.id === id);
    if (!proj) return;
    const content = t(lang, "projects.items")[id];
    const labels = t(lang, "projects.modal");

    const modalMedia = $("#modalMedia");
    const imagePath = projectImagePath(proj.image);
    modalMedia.innerHTML = `${imagePath ? `<img src="${imagePath}" alt="${content.name} project preview">` : ""}<span aria-hidden="true">${projectInitials(content.name)}</span>`;
    const modalImage = $("img", modalMedia);
    if (modalImage) {
      modalMedia.classList.add("has-image");
      modalImage.addEventListener("error", () => {
        modalMedia.classList.remove("has-image");
        modalImage.remove();
      }, { once: true });
    }
    $("#modalTags").innerHTML = proj.tech.map((tc) => `<span class="tech-tag">${tc}</span>`).join("");
    $("#modalTitle").textContent = content.name;
    $("#modalDesc").textContent = content.desc;
    $("#modalOverview").textContent = content.overview;
    $("#modalFeatures").innerHTML = content.features.map((f) => `<li>${f}</li>`).join("");
    $("#modalChallenges").textContent = content.challenges;
    $("#modalLearned").textContent = content.learned;
    $("#modalGithub").href = proj.github;
    $("#modalDemo").href = proj.demo;
    $$("#modalGithub span")[0] && ($("#modalGithub span").textContent = labels.github);
    $$("#modalDemo span")[0] && ($("#modalDemo span").textContent = labels.demo);

    const modal = $("#projectModal");
    modal.hidden = false;
    document.body.classList.add("no-scroll");
    requestAnimationFrame(() => modal.classList.add("is-open"));
    modal.dataset.openId = id;
    $(".modal__close", modal).focus();
  }

  function closeProjectModal() {
    const modal = $("#projectModal");
    modal.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    setTimeout(() => (modal.hidden = true), 200);
  }

  function initModal() {
    $$("[data-close-modal]").forEach((el) => el.addEventListener("click", closeProjectModal));
    document.addEventListener("keydown", (e) => {
      const modal = $("#projectModal");
      if (modal.hidden) return;
      if (e.key === "Escape") {
        closeProjectModal();
        return;
      }
      if (e.key === "Tab") {
        const focusable = $$(
          'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])',
          modal
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  // ---- Journey timeline ----
  function renderJourney(lang) {
    const wrap = $("#journeyTimeline");
    wrap.innerHTML = "";
    (t(lang, "journey.items") || []).forEach((item) => {
      const el = document.createElement("div");
      el.className = "timeline__item reveal";
      el.innerHTML = `
        <span class="timeline__dot" aria-hidden="true"></span>
        <span class="timeline__date">${item.date}</span>
        <div class="timeline__content">
          <h3 class="timeline__title">${item.title}</h3>
          <p class="timeline__desc">${item.desc}</p>
        </div>`;
      wrap.appendChild(el);
    });
    observeReveal();
  }

  // ---- Background study timeline ----
  function renderBackgroundStudy(lang) {
    const wrap = $("#backgroundStudyTimeline");
    wrap.innerHTML = "";
    (t(lang, "backgroundStudy.items") || []).forEach((item) => {
      const el = document.createElement("div");
      el.className = "timeline__item reveal";
      el.innerHTML = `
        <span class="timeline__dot" aria-hidden="true"></span>
        <span class="timeline__date">${item.date}</span>
        <div class="timeline__content">
          <h3 class="timeline__title">${item.title}</h3>
          <p class="timeline__desc">${item.desc}</p>
        </div>`;
      wrap.appendChild(el);
    });
    observeReveal();
  }

  // ---- Education ----
  function renderEducation(lang) {
    const edu = t(lang, "education");
    $("#eduSchool").textContent = edu.school;
    $("#eduYear").textContent = edu.year;
    $("#eduProgram").textContent = edu.program;
    $("#eduLocation").textContent = edu.location || "";
    $("#eduSkills").innerHTML = edu.skillsList.map((s) => `<li>${s}</li>`).join("");
    $("#eduProjects").innerHTML = edu.projectsList.map((s) => `<li>${s}</li>`).join("");
  }

  // ---- Certifications ----
  const CERT_ICON = { Certificate: "i-award", Award: "i-star", Workshop: "i-code" };
  function certIcon(typeEn) {
    return CERT_ICON[typeEn] || "i-award";
  }
  function renderCerts(lang) {
    const grid = $("#certsGrid");
    grid.innerHTML = "";
    const itemsEn = t("en", "certs.items"); // used to key the icon consistently regardless of language
    const items = t(lang, "certs.items") || [];
    items.forEach((cert, i) => {
      const iconRef = certIcon(itemsEn[i] ? itemsEn[i].type : "Certificate");
      const card = document.createElement("div");
      card.className = "cert-card reveal";
      card.innerHTML = `
        <div class="cert-card__icon"><svg class="icon" aria-hidden="true"><use href="#${iconRef}"></use></svg></div>
        <span class="cert-card__type">${cert.type}</span>
        <h3 class="cert-card__title">${cert.title}</h3>
        <p class="cert-card__org">${cert.org}</p>
        <span class="cert-card__year">${cert.year}</span>`;
      grid.appendChild(card);
    });
    observeReveal();
  }

  // ---- GitHub activity (static, replaceable-with-live-API section) ----
  const GH_LANGS = [
    { name: "JavaScript", pct: 38, color: "var(--accent)" },
    { name: "Python", pct: 30, color: "var(--amber)" },
    { name: "HTML / CSS", pct: 22, color: "var(--success)" },
    { name: "Other", pct: 10, color: "var(--text-tertiary)" },
  ];

  function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  function renderGithub(lang) {
    $("#ghUsername").textContent = "@" + siteData.githubUsername;
    $("#ghProfileLink").href = siteData.social.github;

    // language distribution bar + legend
    const bar = $("#ghLangBar");
    const legend = $("#ghLangLegend");
    bar.innerHTML = "";
    legend.innerHTML = "";
    GH_LANGS.forEach((l) => {
      const seg = document.createElement("span");
      seg.className = "lang-bar__seg";
      seg.style.width = l.pct + "%";
      seg.style.background = l.color;
      bar.appendChild(seg);

      const item = document.createElement("div");
      item.className = "lang-legend__item";
      item.innerHTML = `<span class="lang-legend__dot" style="background:${l.color}"></span>${l.name} — ${l.pct}%`;
      legend.appendChild(item);
    });

    // decorative contribution grid (static placeholder, deterministic)
    const grid = $("#ghContribGrid");
    if (!grid.childElementCount) {
      for (let i = 0; i < 26 * 7; i++) {
        const cell = document.createElement("span");
        cell.className = "gh-cell";
        const level = Math.floor(seededRandom(i + 1) * 5);
        const alpha = [0.06, 0.2, 0.4, 0.65, 0.9][level];
        cell.style.background = `color-mix(in srgb, var(--accent) ${alpha * 100}%, var(--bg-elevated-2))`;
        grid.appendChild(cell);
      }
    }

    // if the streak counter already finished animating, refresh its
    // translated suffix ("days" / "ថ្ងៃ") without re-running the count-up
    refreshCounterSuffixes(lang);
  }

  // ---- Testimonials carousel ----
  function renderTestimonials(lang) {
    const track = $("#carouselTrack");
    const dots = $("#carouselDots");
    track.innerHTML = "";
    dots.innerHTML = "";
    const dict = t(lang, "testimonials.items");

    testimonialsData.forEach((tItem, i) => {
      const content = dict[tItem.id];
      const card = document.createElement("div");
      card.className = "testimonial-card" + (i === state.testimonialIndex ? " is-active" : "");
      const initials = tItem.name.split(" ").map((w) => w[0]).join("");
      card.innerHTML = `
        <svg class="icon icon--lg testimonial-card__quote-icon" aria-hidden="true"><use href="#i-quote"></use></svg>
        <p class="testimonial-card__quote">${content.quote}</p>
        <div class="testimonial-card__avatar">${initials}</div>
        <div>
          <div class="testimonial-card__name">${tItem.name}</div>
          <div class="testimonial-card__role">${t(lang, "testimonials.eyebrow")}</div>
        </div>`;
      track.appendChild(card);

      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel__dot" + (i === state.testimonialIndex ? " is-active" : "");
      dot.setAttribute("aria-label", `Show testimonial ${i + 1}`);
      dot.addEventListener("click", () => goToTestimonial(i));
      dots.appendChild(dot);
    });
  }

  function goToTestimonial(index) {
    const cards = $$(".testimonial-card");
    const dots = $$(".carousel__dot");
    if (!cards.length) return;
    state.testimonialIndex = (index + cards.length) % cards.length;
    cards.forEach((c, i) => c.classList.toggle("is-active", i === state.testimonialIndex));
    dots.forEach((d, i) => d.classList.toggle("is-active", i === state.testimonialIndex));
  }

  function initCarousel() {
    $("#carouselPrev").addEventListener("click", () => goToTestimonial(state.testimonialIndex - 1));
    $("#carouselNext").addEventListener("click", () => goToTestimonial(state.testimonialIndex + 1));

    if (prefersReducedMotion()) return;
    let autoplay = setInterval(() => goToTestimonial(state.testimonialIndex + 1), 6000);
    const carousel = $("#testimonialCarousel");
    carousel.addEventListener("mouseenter", () => clearInterval(autoplay));
    carousel.addEventListener("mouseleave", () => {
      autoplay = setInterval(() => goToTestimonial(state.testimonialIndex + 1), 6000);
    });
  }

  /* ============================================================
     SCROLL REVEAL (Intersection Observer)
  ============================================================ */
  let revealObserver;
  function observeReveal() {
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
      );
    }
    $$(".reveal:not(.is-visible)").forEach((el) => revealObserver.observe(el));
  }

  /* ============================================================
     COUNTERS (stat numbers count up when visible)
  ============================================================ */
  function animateCounter(el) {
    if (el.dataset.animated === "true") return;
    el.dataset.animated = "true";
    const target = parseInt(el.getAttribute("data-counter"), 10) || 0;
    el.dataset.targetValue = String(target);
    const suffixKey = el.getAttribute("data-suffix-key");
    const suffix = suffixKey ? " " + t(state.lang, suffixKey) : "";
    if (prefersReducedMotion()) {
      el.textContent = target + suffix;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }

  // updates the trailing translated word (e.g. "days") on counters that
  // have already finished animating, without re-running the count-up
  function refreshCounterSuffixes(lang) {
    $$("[data-suffix-key]").forEach((el) => {
      if (el.dataset.animated === "true") {
        el.textContent = el.dataset.targetValue + " " + t(lang, el.getAttribute("data-suffix-key"));
      }
    });
  }

  function initCounters() {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) animateCounter(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    $$("[data-counter]").forEach((el) => counterObserver.observe(el));
  }

  /* ============================================================
     NAVIGATION (scroll shrink, active link, mobile menu)
  ============================================================ */
  function initNavScroll() {
    const nav = $("#siteNav");
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initLogoVoice() {
    const logo = $(".nav__logo");
    if (!logo || !("speechSynthesis" in window)) return;

    const speakGreeting = () => {
      window.speechSynthesis.cancel();
      const greeting = new SpeechSynthesisUtterance("Hello sir, I'm Menghong");
      const voices = window.speechSynthesis.getVoices();
      const khmerVoice = voices.find((voice) => /^(km)(-|_)/i.test(voice.lang));
      const maleVoice = voices.find((voice) =>
        /^en(-|_)/i.test(voice.lang) && /David|Mark|Alex|Daniel|George|Google UK English Male/i.test(voice.name)
      );
      greeting.voice = khmerVoice || maleVoice || voices.find((voice) => /^en(-|_)/i.test(voice.lang)) || null;
      greeting.lang = greeting.voice ? greeting.voice.lang : "km-KH";
      greeting.rate = .9;
      greeting.pitch = .9;
      greeting.volume = .9;
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(greeting);
    };

    logo.addEventListener("mouseenter", speakGreeting);
    logo.addEventListener("click", speakGreeting);
  }

  function initActiveLinkTracking() {
    const sections = $$("main > section[id]");
    const links = $$(".nav__link");
    const map = {};
    links.forEach((l) => (map[l.getAttribute("href").slice(1)] = l));

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = map[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            links.forEach((l) => l.classList.remove("is-active"));
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => obs.observe(s));
  }

  function initMobileNav() {
    const burger = $("#navBurger");
    const overlay = $("#mobileNav");
    function open() {
      overlay.classList.add("is-open");
      document.body.classList.add("no-scroll");
      burger.setAttribute("aria-expanded", "true");
      burger.querySelector("use").setAttribute("href", "#i-close");
    }
    function close() {
      overlay.classList.remove("is-open");
      document.body.classList.remove("no-scroll");
      burger.setAttribute("aria-expanded", "false");
      burger.querySelector("use").setAttribute("href", "#i-menu");
    }
    burger.addEventListener("click", () => {
      overlay.classList.contains("is-open") ? close() : open();
    });
    $$("#mobileNav a").forEach((a) => a.addEventListener("click", close));
    window.mobileNavClose = close;
    window.mobileNavOpen = open;
    window.mobileNavToggle = () => (overlay.classList.contains("is-open") ? close() : open());
  }

  /* ============================================================
     SCROLL PROGRESS / SCROLL TOP / FLOAT CTA
  ============================================================ */
  function initScrollExtras() {
    const bar = $("#scrollProgressBar");
    const topBtn = $("#scrollTopBtn");
    const cta = $("#floatCta");

    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + "%";

      const show = scrollTop > 560;
      topBtn.classList.toggle("is-visible", show);
      cta.classList.toggle("is-visible", show);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" }));
    $("#footerTopBtn").addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" }));
  }

  /* ============================================================
     CUSTOM CURSOR
  ============================================================ */
  function initCursor() {
    if (isTouch() || prefersReducedMotion()) return;
    const dot = $("#cursorDot");
    const ring = $("#cursorRing");
    let dx = 0, dy = 0, rx = 0, ry = 0;

    window.addEventListener("mousemove", (e) => {
      dx = e.clientX;
      dy = e.clientY;
      dot.style.left = dx + "px";
      dot.style.top = dy + "px";
    });

    function loop() {
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(loop);
    }
    loop();

    document.addEventListener("mouseover", (e) => {
      if (e.target.closest("a, button, .project-card, input, textarea")) ring.classList.add("is-active");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest("a, button, .project-card, input, textarea")) ring.classList.remove("is-active");
    });
  }

  /* ============================================================
     MAGNETIC BUTTONS
  ============================================================ */
  function initMagneticButtons() {
    if (isTouch() || prefersReducedMotion()) return;
    $$(".btn--magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* ============================================================
     LOADER
  ============================================================ */
  function initLoader() {
    const loader = $("#loader");
    const statusText = $("#loaderStatusText");
    const statusCode = $("#loaderStatusCode");
    const startedAt = performance.now();
    let finished = false;
    const startupSteps = [
      [0, "INITIALIZING PORTFOLIO", "[RUN]"],
      [1500, "LOADING PROFILE DATA", "[RUN]"],
      [3000, "STARTING CODE MODULES", "[RUN]"],
      [4500, "CONNECTING PROJECTS", "[OK]"],
    ];
    const stepTimers = startupSteps.map(([delay, text, code]) => setTimeout(() => {
      if (statusText) statusText.textContent = text;
      if (statusCode) statusCode.textContent = code;
    }, delay));
    const finish = () => {
      if (finished) return;
      finished = true;
      stepTimers.forEach((timer) => clearTimeout(timer));
      document.body.classList.add("page-loaded");
      loader.classList.add("is-hidden");
    };
    window.addEventListener("load", () => {
      const minimumTime = prefersReducedMotion() ? 0 : 6000;
      const remaining = Math.max(minimumTime - (performance.now() - startedAt), 0);
      setTimeout(finish, remaining);
    });
    // Safety fallback in case 'load' already fired
    setTimeout(finish, prefersReducedMotion() ? 0 : 6000);
  }

  /* ============================================================
     CONTACT FORM
  ============================================================ */
  function initContactForm() {
    const form = $("#contactForm");
    const status = $("#formStatus");
    const btn = $("#contactSubmitBtn");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#cf-name").value.trim();
      const email = $("#cf-email").value.trim();
      const message = $("#cf-message").value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !emailOk || !message) {
        status.textContent = t(state.lang, "contact.formError");
        status.className = "form-status form-status--error";
        return;
      }

      const originalLabel = btn.querySelector("span").textContent;
      btn.querySelector("span").textContent = t(state.lang, "contact.formSending");
      btn.disabled = true;

      // NOTE: this is a static front-end demo. To actually deliver messages,
      // wire this up to a form backend (e.g. Formspree, EmailJS, or your own
      // serverless endpoint) — never put private API keys in this file.
      setTimeout(() => {
        status.textContent = t(state.lang, "contact.formSuccess");
        status.className = "form-status form-status--success";
        btn.querySelector("span").textContent = originalLabel;
        btn.disabled = false;
        form.reset();
      }, 900);
    });
  }

  /* ============================================================
     COPY EMAIL
  ============================================================ */
  function initCopyEmail() {
    const btn = $("#copyEmailBtn");
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(siteData.email);
      } catch (err) {
        /* clipboard unavailable — fail silently, no crash */
      }
      showToast(t(state.lang, "contact.copied"));
    });
  }

  function showToast(msg) {
    const toast = $("#toast");
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  /* ============================================================
     LOCAL TIME WIDGET
  ============================================================ */
  function initLocalTime() {
    function update() {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat(state.lang === "km" ? "km-KH" : "en-US", {
        timeZone: "Asia/Phnom_Penh",
        hour: "numeric",
        minute: "2-digit",
      }).format(now);
      const label = state.lang === "km" ? `ម៉ោង ${timeStr} នៅភ្នំពេញ (UTC+7)` : `${timeStr} local time in Phnom Penh (UTC+7)`;
      $("#localTimeText").textContent = label;
    }
    update();
    setInterval(update, 30000);
  }

  /* ============================================================
     DOWNLOAD CV TRACKING (client-side only, no backend)
  ============================================================ */
  function initCvTracking() {
    $("#downloadCvBtn").addEventListener("click", () => {
      const count = parseInt(localStorage.getItem("cv-download-count") || "0", 10) + 1;
      localStorage.setItem("cv-download-count", String(count));
      console.info(`[portfolio] CV download #${count}`);
    });
  }

  /* ============================================================
     KEYBOARD SHORTCUTS
  ============================================================ */
  function initKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      const tag = (e.target.tagName || "").toLowerCase();
      const typing = tag === "input" || tag === "textarea" || e.target.isContentEditable;

      if (e.key === "/" && !typing) {
        e.preventDefault();
        window.mobileNavToggle && window.mobileNavToggle();
      }
      if (e.key === "Escape") {
        window.mobileNavClose && window.mobileNavClose();
      }
    });
  }

  /* ============================================================
     EASTER EGG — Konami code + console message
  ============================================================ */
  function initEasterEgg() {
    console.log(
      "%c< Menghong.khon />",
      "font-family:monospace; font-size:18px; font-weight:700; color:#7c5cff;"
    );
    console.log(
      "%cLooking under the hood, huh? I like that.\nWant to build something together?",
      "font-family:monospace; font-size:12px; color:#a4a9c1;"
    );

    const seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let pos = 0;
    document.addEventListener("keydown", (e) => {
      pos = e.key === seq[pos] ? pos + 1 : 0;
      if (pos === seq.length) {
        pos = 0;
        showToast("🎉 Easter egg found — thanks for exploring!");
      }
    });
  }

  /* ============================================================
     PROFILE PHOTO FALLBACK
     If assets/images/profile.jpg is missing or fails to load,
     show the initials badge instead of a broken image icon.
  ============================================================ */
  function initAvatarFallback() {
    $$(".hero__avatar img, .about__photo img").forEach((img) => {
      const wrap = img.closest(".hero__avatar, .about__photo");
      if (img.complete && img.naturalWidth === 0) wrap.classList.add("img-fallback");
      img.addEventListener("error", () => wrap.classList.add("img-fallback"), { once: true });
    });
  }

  function initAboutPhotoCycle() {
    const frame = $(".about__photo");
    const photos = $$('img', frame);
    if (!frame || photos.length < 2) return;
    let photoIndex = 0;
    photos[0].classList.add("is-active");

    window.setInterval(() => {
      const previousPhoto = photos[photoIndex];
      photoIndex = (photoIndex + 1) % photos.length;
      const nextPhoto = photos[photoIndex];
      frame.classList.add("is-changing");
      nextPhoto.classList.add("is-active");
      window.setTimeout(() => {
        previousPhoto.classList.remove("is-active");
        frame.classList.remove("is-changing", "is-changing-reverse");
      }, 1200);
    }, 3000);
  }

  /* ============================================================
     FOOTER YEAR
  ============================================================ */
  function initFooterYear() {
    $("#footerYear").textContent = new Date().getFullYear();
  }

  function initAdminGate() {
    const link = $("#adminGateLink");
    if (!link) return;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const entered = window.prompt("Enter admin access password:");
      if (entered == null) return;
      if (entered === ADMIN_GATE_PASSWORD) {
        window.location.href = link.href;
      } else {
        window.alert("Incorrect admin access password.");
      }
    });
  }

  /* ============================================================
     INIT
  ============================================================ */
  function init() {
    initLoader();
    initSiteSettings();
    initTheme();
    initLanguage();
    initNavScroll();
    initLogoVoice();
    initActiveLinkTracking();
    initMobileNav();
    initScrollExtras();
    initCursor();
    initMagneticButtons();
    initProjectFilters();
    initModal();
    initCarousel();
    initContactForm();
    initCopyEmail();
    initLocalTime();
    initCvTracking();
    initKeyboardShortcuts();
    initEasterEgg();
    initFooterYear();
    initAdminGate();
    initAvatarFallback();
    initAboutPhotoCycle();

    // first paint of all translated + dynamic content
    applyStaticTranslations(state.lang);
    updateLangSwitchUI(state.lang);
    renderDynamicSections(state.lang);

    // counters + reveal need DOM from the render pass above
    initCounters();
    observeReveal();
  }

  window.addEventListener("storage", (event) => {
    if (event.key === LIVE_DATA_KEY) window.location.reload();
  });

  document.addEventListener("DOMContentLoaded", init);
})();
