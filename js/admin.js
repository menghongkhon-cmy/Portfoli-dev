/**
 * ============================================================
 *  ADMIN PANEL SCRIPT
 *  Loads SITE/SKILLS/PROJECTS/TESTIMONIALS/I18N from data.js,
 *  lets you edit everything visually, autosaves a draft, mirrors
 *  it live to the public site (same browser), and can export a
 *  fresh data.js for permanent publishing.
 * ============================================================ */
(function () {
  "use strict";

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const clone = (o) => JSON.parse(JSON.stringify(o));

  const DRAFT_KEY = "admin-draft-v1";
  const LIVE_KEY = "portfolio-admin-data";
  const PASS_KEY = "admin-passcode-v1";

  let draft = null;
  let editLang = "en";
  let activePanel = "dashboard";
  let saveTimer = null;

  /* ============================================================
     DOM BUILDER HELPERS
  ============================================================ */
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach((k) => {
        if (k === "class") node.className = attrs[k];
        else if (k === "html") node.innerHTML = attrs[k];
        else if (k.indexOf("on") === 0 && typeof attrs[k] === "function") {
          node.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
        } else {
          node.setAttribute(k, attrs[k]);
        }
      });
    }
    (children || []).forEach((c) => {
      if (c == null) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function fieldWrap(labelText, inputEl, hint) {
    const wrap = el("div", { class: "admin-field" });
    wrap.appendChild(el("label", {}, [labelText]));
    wrap.appendChild(inputEl);
    if (hint) wrap.appendChild(el("p", { class: "admin-field__hint" }, [hint]));
    return wrap;
  }

  function textField(labelText, value, onChange, opts) {
    opts = opts || {};
    const input = el("input", { type: opts.type || "text" });
    input.value = value || "";
    input.addEventListener("input", () => onChange(input.value));
    return fieldWrap(labelText, input, opts.hint);
  }

  function textAreaField(labelText, value, onChange, opts) {
    opts = opts || {};
    const ta = el("textarea", { rows: opts.rows || 4 });
    ta.value = value || "";
    ta.addEventListener("input", () => onChange(ta.value));
    return fieldWrap(labelText, ta, opts.hint);
  }

  function linesField(labelText, arrValue, onChange, hint) {
    const ta = el("textarea", { rows: 4 });
    ta.value = (arrValue || []).join("\n");
    ta.addEventListener("input", () => {
      onChange(ta.value.split("\n").map((s) => s.trim()).filter(Boolean));
    });
    return fieldWrap(labelText, ta, hint || "One item per line.");
  }

  function selectField(labelText, value, options, onChange) {
    const select = el("select", {});
    options.forEach((opt) => {
      const optionEl = el("option", { value: opt.value }, [opt.label]);
      if (opt.value === value) optionEl.setAttribute("selected", "selected");
      select.appendChild(optionEl);
    });
    select.addEventListener("change", () => onChange(select.value));
    return fieldWrap(labelText, select);
  }

  function iconBtn(iconId, label, onClick, danger) {
    const btn = el("button", {
      type: "button",
      class: "list-editor__btn" + (danger ? " list-editor__btn--danger" : ""),
      "aria-label": label,
      title: label,
      onclick: onClick,
    });
    btn.innerHTML = `<svg class="icon icon--sm" aria-hidden="true"><use href="#${iconId}"></use></svg>`;
    return btn;
  }

  function addButton(label, onClick) {
    const btn = el("button", { type: "button", class: "list-editor__add", onclick: onClick });
    btn.innerHTML = `<svg class="icon icon--sm" aria-hidden="true"><use href="#a-plus"></use></svg> ${label}`;
    return btn;
  }

  function panelHead(title, desc) {
    return el("div", { class: "admin-panel__head" }, [
      el("h1", { class: "admin-panel__title" }, [title]),
      el("p", { class: "admin-panel__desc" }, [desc]),
    ]);
  }

  // generic repeatable-list item card: move up/down, delete, custom fields
  function listItemCard(index, array, rerenderFn, fieldsBuilder, opts) {
    opts = opts || {};
    const item = array[index];
    const card = el("div", { class: "list-editor__item" });
    const top = el("div", { class: "list-editor__item-top" });
    top.appendChild(
      el("span", { class: "list-editor__index" }, [
        opts.titleFn ? opts.titleFn(item, index) : `#${index + 1}`,
      ])
    );
    const actions = el("div", { class: "list-editor__actions" });
    if (index > 0) {
      actions.appendChild(
        iconBtn("a-up", "Move up", () => {
          const tmp = array[index - 1];
          array[index - 1] = array[index];
          array[index] = tmp;
          scheduleSave();
          rerenderFn();
        })
      );
    }
    if (index < array.length - 1) {
      actions.appendChild(
        iconBtn("a-down", "Move down", () => {
          const tmp = array[index + 1];
          array[index + 1] = array[index];
          array[index] = tmp;
          scheduleSave();
          rerenderFn();
        })
      );
    }
    actions.appendChild(
      iconBtn(
        "a-trash",
        "Delete",
        () => {
          if (!confirm("Delete this item? This can't be undone.")) return;
          array.splice(index, 1);
          scheduleSave();
          rerenderFn();
        },
        true
      )
    );
    top.appendChild(actions);
    card.appendChild(top);
    card.appendChild(fieldsBuilder(item, index));
    return card;
  }

  function downloadDataUrl(dataUrl, filename) {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function toast(msg) {
    const t = $("#adminToast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("is-visible");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("is-visible"), 3200);
  }

  /* ============================================================
     DRAFT STATE
  ============================================================ */
  function defaultDraft() {
    return {
      SITE: clone(SITE),
      SKILLS: clone(SKILLS),
      PROJECTS: clone(PROJECTS),
      TESTIMONIALS: clone(TESTIMONIALS),
      I18N: clone(I18N),
      APPEARANCE: { accent: "#7c5cff", defaultTheme: "dark" },
    };
  }

  function loadDraft() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const base = defaultDraft();
        base.SITE = Object.assign(base.SITE, parsed.SITE || {});
        base.SKILLS = Object.assign(base.SKILLS, parsed.SKILLS || {});
        base.PROJECTS = parsed.PROJECTS || base.PROJECTS;
        base.TESTIMONIALS = parsed.TESTIMONIALS || base.TESTIMONIALS;
        base.I18N = Object.assign(base.I18N, parsed.I18N || {});
        base.APPEARANCE = Object.assign(base.APPEARANCE, parsed.APPEARANCE || {});
        return base;
      }
    } catch (err) {
      /* fall through to defaults */
    }
    return defaultDraft();
  }

  function persist() {
    try {
      const text = JSON.stringify(draft);
      localStorage.setItem(DRAFT_KEY, text);
      localStorage.setItem(LIVE_KEY, text);
      setStatus("Saved · live preview updated");
    } catch (err) {
      setStatus("⚠️ Couldn't save — storage may be full (try a smaller photo/CV file)");
    }
  }

  function scheduleSave() {
    setStatus("Saving…");
    clearTimeout(saveTimer);
    saveTimer = setTimeout(persist, 350);
  }

  function setStatus(msg) {
    const s = $("#saveStatus");
    if (s) s.textContent = msg;
  }

  function exportDataJs() {
    const site = clone(draft.SITE);
    delete site.profileImageDataUrl;
    delete site.cvDataUrl;
    delete site.cvFileName;

    const banner =
      "/**\n" +
      " * ============================================================\n" +
      " *  PORTFOLIO DATA\n" +
      " *  Generated by the Admin Panel on " +
      new Date().toISOString().slice(0, 10) +
      "\n" +
      " *  All editable content lives here.\n" +
      " * ============================================================\n" +
      " */\n\n";

    const text =
      banner +
      `const SITE = ${JSON.stringify(site, null, 2)};\n\n` +
      `const SKILLS = ${JSON.stringify(draft.SKILLS, null, 2)};\n\n` +
      `const PROJECTS = ${JSON.stringify(draft.PROJECTS, null, 2)};\n\n` +
      `const TESTIMONIALS = ${JSON.stringify(draft.TESTIMONIALS, null, 2)};\n\n` +
      `const I18N = ${JSON.stringify(draft.I18N, null, 2)};\n`;

    const blob = new Blob([text], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    downloadDataUrl(url, "data.js");
    URL.revokeObjectURL(url);
    toast("data.js downloaded — replace the file in your portfolio folder to publish it.");
  }

  function openPreview() {
    window.open("index.html", "_blank");
  }

  function resetDraft() {
    if (
      !confirm(
        "This clears all admin edits (draft + live preview) and reverts to the original data.js content. Continue?"
      )
    )
      return;
    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(LIVE_KEY);
    draft = defaultDraft();
    toast("Reset to defaults. Refresh your site tab to see the original content.");
    showPanel(activePanel);
  }

  /* ============================================================
     PANEL: DASHBOARD
  ============================================================ */
  function dashStat(num, label) {
    return el("div", { class: "dash-stat" }, [
      el("div", { class: "dash-stat__num" }, [String(num)]),
      el("div", { class: "dash-stat__label" }, [label]),
    ]);
  }

  function renderDashboard(container) {
    container.appendChild(
      panelHead(
        "Dashboard",
        "Manage every part of your portfolio from here. Changes save automatically and preview live in this browser — download data.js when you're ready to publish for everyone."
      )
    );

    const skillCount =
      draft.SKILLS.frontend.length + draft.SKILLS.backend.length + draft.SKILLS.tools.length;

    container.appendChild(
      el("div", { class: "dash-stats" }, [
        dashStat(draft.PROJECTS.length, "Projects"),
        dashStat(skillCount, "Skills"),
        dashStat(draft.TESTIMONIALS.length, "Testimonials"),
        dashStat(draft.I18N.en.certs.items.length, "Certifications"),
      ])
    );

    container.appendChild(
      el("div", { class: "dash-note" }, [
        el("strong", {}, ["How publishing works: "]),
        "this is a static site with no server or database, so edits here save to this browser only and instantly update the live site when you open/refresh it here. To make changes visible to everyone, click \"Download data.js\" above, replace the file in your portfolio folder, and redeploy. Photo/CV uploads work the same way — download the file from the Media tab and replace it in assets/.",
      ])
    );

    container.appendChild(
      el("div", { class: "dash-actions" }, [
        el("button", { type: "button", class: "btn btn--outline", onclick: openPreview }, [
          "Open Live Preview",
        ]),
        el("button", { type: "button", class: "btn btn--primary", onclick: exportDataJs }, [
          "Download data.js",
        ]),
      ])
    );

    container.appendChild(
      el("div", { class: "danger-zone" }, [
        el("h3", {}, ["Reset content"]),
        el("p", {}, [
          "Discards all admin edits (draft + live preview) and reverts to the original data.js values.",
        ]),
        el("button", { type: "button", class: "btn btn--outline btn--sm", onclick: resetDraft }, [
          "Reset to defaults",
        ]),
        el(
          "button",
          {
            type: "button",
            class: "btn btn--outline btn--sm",
            style: "margin-left:10px;",
            onclick: () => {
              if (!confirm("Reset your admin passcode? You'll be asked to set a new one next time.")) return;
              localStorage.removeItem(PASS_KEY);
              location.reload();
            },
          },
          ["Reset passcode"]
        ),
      ])
    );
  }

  /* ============================================================
     PANEL: PROFILE & HERO
  ============================================================ */
  function renderProfile(container) {
    container.appendChild(
      panelHead("Profile & Hero", "Your identity, contact details, and the hero section text.")
    );

    const site = draft.SITE;

    const card1 = el("div", { class: "admin-card" }, [
      el("div", { class: "admin-card__title" }, ["Basic info"]),
    ]);
    const grid1 = el("div", { class: "admin-grid" });
    grid1.appendChild(textField("Full name", site.name, (v) => { site.name = v; scheduleSave(); }));
    grid1.appendChild(
      textField("Role / slug", site.role, (v) => { site.role = v; scheduleSave(); }, {
        hint: "Internal identifier, lowercase-with-dashes.",
      })
    );
    grid1.appendChild(textField("Email", site.email, (v) => { site.email = v; scheduleSave(); }, { type: "email" }));
    grid1.appendChild(textField("Location", site.location, (v) => { site.location = v; scheduleSave(); }));
    grid1.appendChild(
      textField("Phone (display)", site.phone && site.phone.display, (v) => {
        site.phone = site.phone || {};
        site.phone.display = v;
        scheduleSave();
      })
    );
    grid1.appendChild(
      textField(
        "Phone (tel: link)",
        site.phone && site.phone.href,
        (v) => {
          site.phone = site.phone || {};
          site.phone.href = v;
          scheduleSave();
        },
        { type: "tel", hint: "Digits only, e.g. +855965390269. Leave both phone fields blank to hide it." }
      )
    );
    card1.appendChild(grid1);
    container.appendChild(card1);

    const card2 = el("div", { class: "admin-card" }, [
      el("div", { class: "admin-card__title" }, ["Social & links"]),
    ]);
    const grid2 = el("div", { class: "admin-grid" });
    grid2.appendChild(
      textField("GitHub URL", site.social.github, (v) => { site.social.github = v; scheduleSave(); }, { type: "url" })
    );
    grid2.appendChild(
      textField("GitHub username", site.githubUsername, (v) => { site.githubUsername = v; scheduleSave(); })
    );
    grid2.appendChild(
      textField("LinkedIn URL", site.social.linkedin, (v) => { site.social.linkedin = v; scheduleSave(); }, { type: "url" })
    );
    grid2.appendChild(
      textField("Telegram URL", site.social.telegram, (v) => { site.social.telegram = v; scheduleSave(); }, { type: "url" })
    );
    grid2.appendChild(
      textField("Telegram handle (display)", site.telegramHandle, (v) => { site.telegramHandle = v; scheduleSave(); })
    );
    card2.appendChild(grid2);
    container.appendChild(card2);

    const card3 = el("div", { class: "admin-card" }, [
      el("div", { class: "admin-card__title" }, ["Hero stats"]),
    ]);
    const grid3 = el("div", { class: "admin-grid" });
    grid3.appendChild(
      textField("Projects built", site.stats.projects, (v) => { site.stats.projects = Number(v) || 0; scheduleSave(); }, { type: "number" })
    );
    grid3.appendChild(
      textField("Technologies", site.stats.technologies, (v) => { site.stats.technologies = Number(v) || 0; scheduleSave(); }, { type: "number" })
    );
    grid3.appendChild(
      textField("Months learning", site.stats.monthsLearning, (v) => { site.stats.monthsLearning = Number(v) || 0; scheduleSave(); }, { type: "number" })
    );
    card3.appendChild(grid3);
    container.appendChild(card3);

    const hero = draft.I18N[editLang].hero;
    const contact = draft.I18N[editLang].contact;
    const footer = draft.I18N[editLang].footer;

    const card4 = el("div", { class: "admin-card" }, [
      el("div", { class: "admin-card__title" }, [`Hero text (${editLang.toUpperCase()})`]),
    ]);
    card4.appendChild(
      textField("Displayed name", hero.name, (v) => { hero.name = v; scheduleSave(); }, {
        hint: "The large heading text in the hero, shown in this language. The nav logo, footer, and code-card badge always use \"Full name\" above (kept consistent across languages).",
      })
    );
    card4.appendChild(textField("Status badge", hero.badge, (v) => { hero.badge = v; scheduleSave(); }));
    card4.appendChild(textField("Role line", hero.role, (v) => { hero.role = v; scheduleSave(); }));
    card4.appendChild(
      textAreaField("Intro paragraph", hero.intro, (v) => { hero.intro = v; scheduleSave(); }, { rows: 3 })
    );
    container.appendChild(card4);

    const card5 = el("div", { class: "admin-card" }, [
      el("div", { class: "admin-card__title" }, [`SEO — browser tab & search results (${editLang.toUpperCase()})`]),
    ]);
    card5.appendChild(
      textField("Page title", draft.I18N[editLang].meta.title, (v) => { draft.I18N[editLang].meta.title = v; scheduleSave(); })
    );
    card5.appendChild(
      textAreaField(
        "Meta description",
        draft.I18N[editLang].meta.description,
        (v) => { draft.I18N[editLang].meta.description = v; scheduleSave(); },
        { rows: 2 }
      )
    );
    container.appendChild(card5);

    const card6 = el("div", { class: "admin-card" }, [
      el("div", { class: "admin-card__title" }, [`Contact & footer text (${editLang.toUpperCase()})`]),
    ]);
    card6.appendChild(
      textAreaField("Contact subtitle", contact.subtitle, (v) => { contact.subtitle = v; scheduleSave(); }, { rows: 2 })
    );
    card6.appendChild(
      textAreaField("Footer tagline", footer.tagline, (v) => { footer.tagline = v; scheduleSave(); }, { rows: 2 })
    );
    container.appendChild(card6);
  }

  /* ============================================================
     PANEL: ABOUT
  ============================================================ */
  function renderAbout(container) {
    container.appendChild(
      panelHead("About", "Your bio, strengths, goals, and the small path timeline in the About section.")
    );
    const about = draft.I18N[editLang].about;
    about.highlights = Array.isArray(about.highlights) ? about.highlights : [];

    const card1 = el("div", { class: "admin-card" }, [
      el("div", { class: "admin-card__title" }, [`Bio (${editLang.toUpperCase()})`]),
    ]);
    card1.appendChild(textAreaField("Biography", about.bio, (v) => { about.bio = v; scheduleSave(); }, { rows: 5 }));
    container.appendChild(card1);

    const card2 = el("div", { class: "admin-card" }, [
      el("div", { class: "admin-card__title" }, ["Strengths"]),
    ]);
    card2.appendChild(linesField("Strengths list", about.strengths, (v) => { about.strengths = v; scheduleSave(); }));
    container.appendChild(card2);

    const card3 = el("div", { class: "admin-card" }, [
      el("div", { class: "admin-card__title" }, ["Enjoyment & goals"]),
    ]);
    card3.appendChild(
      textAreaField("What I enjoy building", about.enjoy, (v) => { about.enjoy = v; scheduleSave(); }, { rows: 2 })
    );
    card3.appendChild(
      textAreaField("Career goal", about.goal, (v) => { about.goal = v; scheduleSave(); }, { rows: 2 })
    );
    card3.appendChild(
      textField("Currently learning", about.learning, (v) => { about.learning = v; scheduleSave(); })
    );
    container.appendChild(card3);

    const cardHighlights = el("div", { class: "admin-card" }, [
      el("div", { class: "admin-card__title" }, [`About highlights (${editLang.toUpperCase()})`]),
      el("p", { class: "admin-field__hint" }, ["Add as many extra About entries as you need. Each entry appears on the public About section."]),
    ]);
    const highlightsWrap = el("div", { class: "list-editor" });
    about.highlights.forEach((highlight, i) => {
      highlightsWrap.appendChild(
        listItemCard(i, about.highlights, () => showPanel("about"), (item) => {
          const box = el("div", {});
          box.appendChild(textField("Highlight title", item.title, (v) => { item.title = v; scheduleSave(); }));
          box.appendChild(textAreaField("Highlight details", item.text, (v) => { item.text = v; scheduleSave(); }, { rows: 3 }));
          return box;
        }, { titleFn: (item) => item.title || "Untitled highlight" })
      );
    });
    cardHighlights.appendChild(highlightsWrap);
    cardHighlights.appendChild(addButton("+ Add About highlight", () => {
      about.highlights.push({ title: "New highlight", text: "" });
      scheduleSave();
      showPanel("about");
    }));
    container.appendChild(cardHighlights);

    const card4 = el("div", { class: "admin-card" }, [
      el("div", { class: "admin-card__title" }, ["Path timeline"]),
    ]);
    const listWrap = el("div", { class: "list-editor" });
    about.timeline.forEach((step, i) => {
      listWrap.appendChild(
        listItemCard(
          i,
          about.timeline,
          () => showPanel("about"),
          (item) => {
            const box = el("div", {});
            box.appendChild(textField("Label", item.label, (v) => { item.label = v; scheduleSave(); }));
            box.appendChild(textField("Description", item.desc, (v) => { item.desc = v; scheduleSave(); }));
            return box;
          },
          { titleFn: (item) => item.label || "Untitled" }
        )
      );
    });
    card4.appendChild(listWrap);
    card4.appendChild(
      addButton("+ Add timeline step", () => {
        about.timeline.push({ label: "New step", desc: "" });
        scheduleSave();
        showPanel("about");
      })
    );
    container.appendChild(card4);
  }

  /* ============================================================
     PANEL: SKILLS
  ============================================================ */
  function renderSkills(container) {
    container.appendChild(
      panelHead("Skills", "Group labels are translatable; percentages and the skill list are shared across languages.")
    );

    ["frontend", "backend", "tools"].forEach((group) => {
      const groupLabel = draft.I18N[editLang].skills[group];
      const card = el("div", { class: "admin-card" }, [
        el("div", { class: "admin-card__title" }, [`${groupLabel} (${editLang.toUpperCase()} label)`]),
      ]);
      card.appendChild(
        textField("Group label", groupLabel, (v) => { draft.I18N[editLang].skills[group] = v; scheduleSave(); })
      );

      const rows = el("div", {});
      draft.SKILLS[group].forEach((skill, i) => {
        const row = el("div", { class: "skill-row" });
        const nameInput = el("input", { type: "text", placeholder: "Skill name" });
        nameInput.value = skill.name;
        nameInput.addEventListener("input", () => { skill.name = nameInput.value; scheduleSave(); });
        const levelInput = el("input", { type: "number", min: "0", max: "100" });
        levelInput.value = skill.level;
        levelInput.addEventListener("input", () => {
          skill.level = Math.max(0, Math.min(100, Number(levelInput.value) || 0));
          scheduleSave();
        });
        row.appendChild(nameInput);
        row.appendChild(levelInput);
        row.appendChild(
          iconBtn(
            "a-trash",
            "Remove skill",
            () => {
              draft.SKILLS[group].splice(i, 1);
              scheduleSave();
              showPanel("skills");
            },
            true
          )
        );
        rows.appendChild(row);
      });
      card.appendChild(rows);
      card.appendChild(
        addButton("+ Add skill", () => {
          draft.SKILLS[group].push({ name: "New skill", level: 50 });
          scheduleSave();
          showPanel("skills");
        })
      );
      container.appendChild(card);
    });
  }

  /* ============================================================
     PANEL: PROJECTS
  ============================================================ */
  function ensureUniqueId(base) {
    let id = base;
    let n = 1;
    const exists = (candidate) => draft.PROJECTS.some((p) => p.id === candidate);
    while (exists(id)) {
      n += 1;
      id = base + "-" + n;
    }
    return id;
  }

  function renderProjects(container) {
    container.appendChild(
      panelHead(
        "Projects",
        "Add, edit, reorder, or remove projects. Fill in both EN and KM tabs (top-right toggle) so nothing shows blank."
      )
    );

    const listWrap = el("div", { class: "list-editor" });
    draft.PROJECTS.forEach((proj, i) => {
      if (!draft.I18N[editLang].projects.items[proj.id]) {
        draft.I18N[editLang].projects.items[proj.id] = {
          name: "",
          desc: "",
          overview: "",
          features: [],
          challenges: "",
          learned: "",
        };
      }
      const content = draft.I18N[editLang].projects.items[proj.id];

      listWrap.appendChild(
        listItemCard(
          i,
          draft.PROJECTS,
          () => showPanel("projects"),
          (item) => {
            const box = el("div", {});
            const grid = el("div", { class: "admin-grid" });
            grid.appendChild(
              textField(`Project name (${editLang.toUpperCase()})`, content.name, (v) => { content.name = v; scheduleSave(); })
            );
            grid.appendChild(
              selectField(
                "Category",
                item.category,
                [
                  { value: "web", label: "Web" },
                  { value: "frontend", label: "Frontend" },
                  { value: "backend", label: "Backend" },
                  { value: "fullstack", label: "Full Stack" },
                ],
                (v) => { item.category = v; scheduleSave(); }
              )
            );
            box.appendChild(grid);

            box.appendChild(
              textField("Technologies (comma-separated)", (item.tech || []).join(", "), (v) => {
                item.tech = v.split(",").map((s) => s.trim()).filter(Boolean);
                scheduleSave();
              })
            );

            const grid2 = el("div", { class: "admin-grid" });
            grid2.appendChild(textField("GitHub URL", item.github, (v) => { item.github = v; scheduleSave(); }, { type: "url" }));
            grid2.appendChild(textField("Live demo URL", item.demo, (v) => { item.demo = v; scheduleSave(); }, { type: "url" }));
            box.appendChild(grid2);

            const imageCard = el("div", { class: "admin-card admin-card--nested" });
            imageCard.appendChild(el("div", { class: "admin-card__title" }, ["Project image"]));
            if (item.image) {
              const imagePreview = el("img", { src: item.image, alt: "", class: "project-image-preview" });
              imageCard.appendChild(imagePreview);
            }
            const imageUpload = el("label", { class: "upload-btn" }, ["Upload project image"]);
            const imageInput = el("input", { type: "file", accept: "image/*" });
            imageInput.addEventListener("change", () => {
              const file = imageInput.files[0];
              if (!file) return;
              if (file.size > 1.5 * 1024 * 1024) {
                toast("That image is large — consider under ~1.5MB to stay within browser storage limits.");
              }
              const reader = new FileReader();
              reader.onload = () => {
                item.image = reader.result;
                scheduleSave();
                showPanel("projects");
              };
              reader.readAsDataURL(file);
            });
            imageUpload.appendChild(imageInput);
            imageCard.appendChild(imageUpload);
            if (item.image) {
              imageCard.appendChild(
                el("button", {
                  type: "button",
                  class: "btn btn--outline btn--sm",
                  style: "margin-left:10px;",
                  onclick: () => { delete item.image; scheduleSave(); showPanel("projects"); },
                }, ["Remove image"])
              );
            }
            imageCard.appendChild(el("p", { class: "admin-field__hint" }, ["Displayed on the public project card. Images are saved in this browser until you export data.js."]));
            box.appendChild(imageCard);

            box.appendChild(
              textAreaField(`Short description (${editLang.toUpperCase()})`, content.desc, (v) => { content.desc = v; scheduleSave(); }, { rows: 2 })
            );
            box.appendChild(
              textAreaField(`Overview (${editLang.toUpperCase()})`, content.overview, (v) => { content.overview = v; scheduleSave(); }, { rows: 3 })
            );
            box.appendChild(
              linesField(`Key features (${editLang.toUpperCase()})`, content.features, (v) => { content.features = v; scheduleSave(); })
            );
            box.appendChild(
              textAreaField(`Challenges (${editLang.toUpperCase()})`, content.challenges, (v) => { content.challenges = v; scheduleSave(); }, { rows: 2 })
            );
            box.appendChild(
              textAreaField(`What I learned (${editLang.toUpperCase()})`, content.learned, (v) => { content.learned = v; scheduleSave(); }, { rows: 2 })
            );
            return box;
          },
          { titleFn: () => content.name || proj.id }
        )
      );
    });
    container.appendChild(listWrap);

    container.appendChild(
      addButton("+ Add project", () => {
        const id = ensureUniqueId("new-project");
        draft.PROJECTS.push({ id, category: "web", tech: [], github: "", demo: "" });
        ["en", "km"].forEach((l) => {
          draft.I18N[l].projects.items[id] = {
            name: "New project",
            desc: "",
            overview: "",
            features: [],
            challenges: "",
            learned: "",
          };
        });
        scheduleSave();
        showPanel("projects");
      })
    );
  }

  /* ============================================================
     PANEL: JOURNEY
  ============================================================ */
  function renderJourney(container) {
    container.appendChild(panelHead("Journey", "The experience/journey timeline between Projects and Education."));
    const journey = draft.I18N[editLang].journey;

    const card = el("div", { class: "admin-card" }, [
      el("div", { class: "admin-card__title" }, [`Section subtitle (${editLang.toUpperCase()})`]),
    ]);
    card.appendChild(
      textAreaField("Subtitle", journey.subtitle, (v) => { journey.subtitle = v; scheduleSave(); }, { rows: 2 })
    );
    container.appendChild(card);

    const listWrap = el("div", { class: "list-editor" });
    journey.items.forEach((jitem, i) => {
      listWrap.appendChild(
        listItemCard(
          i,
          journey.items,
          () => showPanel("journey"),
          (item) => {
            const box = el("div", {});
            const grid = el("div", { class: "admin-grid" });
            grid.appendChild(textField("Date / label", item.date, (v) => { item.date = v; scheduleSave(); }));
            grid.appendChild(textField("Title", item.title, (v) => { item.title = v; scheduleSave(); }));
            box.appendChild(grid);
            box.appendChild(
              textAreaField("Description", item.desc, (v) => { item.desc = v; scheduleSave(); }, { rows: 2 })
            );
            return box;
          },
          { titleFn: (item) => item.title || "Untitled" }
        )
      );
    });
    container.appendChild(listWrap);
    container.appendChild(
      addButton("+ Add journey step", () => {
        journey.items.push({ date: "", title: "New milestone", desc: "" });
        scheduleSave();
        showPanel("journey");
      })
    );
  }

  /* ============================================================
     PANEL: EDUCATION
  ============================================================ */
  function renderEducation(container) {
    container.appendChild(panelHead("Education", "A single education record shown with a graduation-cap icon."));
    const edu = draft.I18N[editLang].education;

    const card = el("div", { class: "admin-card" });
    const grid = el("div", { class: "admin-grid" });
    grid.appendChild(textField("School / institution", edu.school, (v) => { edu.school = v; scheduleSave(); }));
    grid.appendChild(textField("Year range", edu.year, (v) => { edu.year = v; scheduleSave(); }));
    card.appendChild(grid);
    card.appendChild(textField("Program", edu.program, (v) => { edu.program = v; scheduleSave(); }));
    card.appendChild(linesField("Skills gained", edu.skillsList, (v) => { edu.skillsList = v; scheduleSave(); }));
    card.appendChild(
      linesField("Relevant coursework projects", edu.projectsList, (v) => { edu.projectsList = v; scheduleSave(); })
    );
    container.appendChild(card);
  }

  /* ============================================================
     PANEL: CERTIFICATIONS
  ============================================================ */
  function renderCerts(container) {
    container.appendChild(panelHead("Certifications", "Certificates, awards, and workshops shown as cards."));
    const certs = draft.I18N[editLang].certs;

    const listWrap = el("div", { class: "list-editor" });
    certs.items.forEach((c, i) => {
      listWrap.appendChild(
        listItemCard(
          i,
          certs.items,
          () => showPanel("certs"),
          (item) => {
            const box = el("div", {});
            box.appendChild(textField("Title", item.title, (v) => { item.title = v; scheduleSave(); }));
            const grid = el("div", { class: "admin-grid" });
            grid.appendChild(textField("Organization", item.org, (v) => { item.org = v; scheduleSave(); }));
            grid.appendChild(textField("Year", item.year, (v) => { item.year = v; scheduleSave(); }));
            box.appendChild(grid);
            if (editLang === "en") {
              box.appendChild(
                selectField(
                  "Type (controls the icon)",
                  item.type,
                  [
                    { value: "Certificate", label: "Certificate" },
                    { value: "Award", label: "Award" },
                    { value: "Workshop", label: "Workshop" },
                  ],
                  (v) => { item.type = v; scheduleSave(); }
                )
              );
            } else {
              box.appendChild(
                textField("Type (translated label)", item.type, (v) => { item.type = v; scheduleSave(); }, {
                  hint: "The icon is controlled by the English tab's Type field.",
                })
              );
            }
            return box;
          },
          { titleFn: (item) => item.title || "Untitled" }
        )
      );
    });
    container.appendChild(listWrap);
    container.appendChild(
      addButton("+ Add certification", () => {
        certs.items.push({ title: "New certificate", org: "", year: String(new Date().getFullYear()), type: "Certificate" });
        scheduleSave();
        showPanel("certs");
      })
    );
  }

  /* ============================================================
     PANEL: TESTIMONIALS
  ============================================================ */
  function renderTestimonials(container) {
    container.appendChild(panelHead("Testimonials", "Names are shared across languages; role and quote are translated."));

    const listWrap = el("div", { class: "list-editor" });
    draft.TESTIMONIALS.forEach((tItem, i) => {
      if (!draft.I18N[editLang].testimonials.items[tItem.id]) {
        draft.I18N[editLang].testimonials.items[tItem.id] = { role: "", quote: "" };
      }
      const content = draft.I18N[editLang].testimonials.items[tItem.id];

      listWrap.appendChild(
        listItemCard(
          i,
          draft.TESTIMONIALS,
          () => showPanel("testimonials"),
          (item) => {
            const box = el("div", {});
            box.appendChild(textField("Name", item.name, (v) => { item.name = v; scheduleSave(); }));
            box.appendChild(
              textField(`Role (${editLang.toUpperCase()})`, content.role, (v) => { content.role = v; scheduleSave(); })
            );
            box.appendChild(
              textAreaField(`Quote (${editLang.toUpperCase()})`, content.quote, (v) => { content.quote = v; scheduleSave(); }, { rows: 3 })
            );
            return box;
          },
          { titleFn: (item) => item.name || "Untitled" }
        )
      );
    });
    container.appendChild(listWrap);
    container.appendChild(
      addButton("+ Add testimonial", () => {
        const id = "t" + Date.now();
        draft.TESTIMONIALS.push({ id, name: "New person" });
        ["en", "km"].forEach((l) => { draft.I18N[l].testimonials.items[id] = { role: "", quote: "" }; });
        scheduleSave();
        showPanel("testimonials");
      })
    );
  }

  /* ============================================================
     PANEL: APPEARANCE
  ============================================================ */
  function renderAppearance(container) {
    container.appendChild(
      panelHead(
        "Appearance",
        "One accent color is used across both dark and light mode. Pick the default theme new visitors see first — they can still toggle it."
      )
    );

    const card = el("div", { class: "admin-card" }, [el("div", { class: "admin-card__title" }, ["Accent color"])]);
    const colorRow = el("div", { class: "color-field" });
    const colorInput = el("input", { type: "color" });
    colorInput.value = draft.APPEARANCE.accent || "#7c5cff";
    const hexLabel = el("span", { class: "color-field__hex" }, [colorInput.value]);
    colorInput.addEventListener("input", () => {
      draft.APPEARANCE.accent = colorInput.value;
      hexLabel.textContent = colorInput.value;
      scheduleSave();
    });
    colorRow.appendChild(colorInput);
    colorRow.appendChild(hexLabel);
    card.appendChild(colorRow);
    card.appendChild(
      el("p", { class: "admin-field__hint" }, [
        "Applies instantly to buttons, links, highlights, and glows across the whole site.",
      ])
    );
    container.appendChild(card);

    const card2 = el("div", { class: "admin-card" }, [el("div", { class: "admin-card__title" }, ["Default theme"])]);
    card2.appendChild(
      selectField(
        "Theme new visitors see first",
        draft.APPEARANCE.defaultTheme || "dark",
        [
          { value: "dark", label: "Dark" },
          { value: "light", label: "Light" },
        ],
        (v) => { draft.APPEARANCE.defaultTheme = v; scheduleSave(); }
      )
    );
    card2.appendChild(
      el("p", { class: "admin-field__hint" }, [
        "Doesn't affect visitors who've already picked a theme manually — their choice is remembered.",
      ])
    );
    container.appendChild(card2);
  }

  /* ============================================================
     PANEL: MEDIA (photo + CV)
  ============================================================ */
  function renderMedia(container) {
    container.appendChild(
      panelHead(
        "Photo & CV",
        "Upload a photo and CV to preview instantly. To publish them permanently, download the files and replace the ones in your assets folder."
      )
    );

    const site = draft.SITE;

    const photoCard = el("div", { class: "admin-card" }, [el("div", { class: "admin-card__title" }, ["Profile photo"])]);
    const photoRow = el("div", { class: "media-row" });
    const preview = el("div", { class: "media-preview" });
    if (site.profileImageDataUrl) {
      preview.appendChild(el("img", { src: site.profileImageDataUrl, alt: "" }));
    } else {
      preview.appendChild(el("span", {}, [(site.name || "?").slice(0, 2).toUpperCase()]));
    }
    photoRow.appendChild(preview);

    const controls = el("div", {});
    const uploadLabel = el("label", { class: "upload-btn" }, ["Upload photo"]);
    const fileInput = el("input", { type: "file", accept: "image/*" });
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file) return;
      if (file.size > 1.5 * 1024 * 1024) {
        toast("That image is large — consider under ~1.5MB to stay within browser storage limits.");
      }
      const reader = new FileReader();
      reader.onload = () => {
        site.profileImageDataUrl = reader.result;
        scheduleSave();
        showPanel("media");
      };
      reader.readAsDataURL(file);
    });
    uploadLabel.appendChild(fileInput);
    controls.appendChild(uploadLabel);

    if (site.profileImageDataUrl) {
      controls.appendChild(
        el(
          "button",
          {
            type: "button",
            class: "btn btn--outline btn--sm",
            style: "margin-left:10px;",
            onclick: () => downloadDataUrl(site.profileImageDataUrl, "profile.jpg"),
          },
          ["Download photo file"]
        )
      );
      controls.appendChild(
        el(
          "button",
          {
            type: "button",
            class: "btn btn--outline btn--sm",
            style: "margin-left:10px;",
            onclick: () => { delete site.profileImageDataUrl; scheduleSave(); showPanel("media"); },
          },
          ["Remove"]
        )
      );
    }
    photoRow.appendChild(controls);
    photoCard.appendChild(photoRow);
    photoCard.appendChild(
      el("p", { class: "admin-field__hint" }, [
        "Used for both the hero avatar badge and the About section portrait. After downloading, save it as assets/images/profile.jpg to replace the default.",
      ])
    );
    container.appendChild(photoCard);

    const cvCard = el("div", { class: "admin-card" }, [el("div", { class: "admin-card__title" }, ["CV / Résumé (PDF)"])]);
    cvCard.appendChild(
      el("p", {}, [site.cvFileName ? `Custom file uploaded: ${site.cvFileName}` : "Using the default CV file."])
    );

    const cvControls = el("div", { style: "margin-top:14px;" });
    const cvUploadLabel = el("label", { class: "upload-btn" }, ["Upload CV (PDF)"]);
    const cvFileInput = el("input", { type: "file", accept: "application/pdf" });
    cvFileInput.addEventListener("change", () => {
      const file = cvFileInput.files[0];
      if (!file) return;
      if (file.size > 4 * 1024 * 1024) {
        toast("That PDF is large — browser storage has limited space. Consider compressing it.");
      }
      const reader = new FileReader();
      reader.onload = () => {
        site.cvDataUrl = reader.result;
        site.cvFileName = file.name;
        scheduleSave();
        showPanel("media");
      };
      reader.readAsDataURL(file);
    });
    cvUploadLabel.appendChild(cvFileInput);
    cvControls.appendChild(cvUploadLabel);
    if (site.cvDataUrl) {
      cvControls.appendChild(
        el(
          "button",
          {
            type: "button",
            class: "btn btn--outline btn--sm",
            style: "margin-left:10px;",
            onclick: () => downloadDataUrl(site.cvDataUrl, site.cvFileName || "CV.pdf"),
          },
          ["Download CV file"]
        )
      );
      cvControls.appendChild(
        el(
          "button",
          {
            type: "button",
            class: "btn btn--outline btn--sm",
            style: "margin-left:10px;",
            onclick: () => { delete site.cvDataUrl; delete site.cvFileName; scheduleSave(); showPanel("media"); },
          },
          ["Remove"]
        )
      );
    }
    cvCard.appendChild(cvControls);
    cvCard.appendChild(
      el("p", { class: "admin-field__hint" }, [
        "After downloading, save it into assets/cv/ (keep the same filename data.js expects, or update SITE.cvFile).",
      ])
    );
    container.appendChild(cvCard);
  }

  /* ============================================================
     NAVIGATION / BOOT
  ============================================================ */
  const PANEL_RENDERERS = {
    dashboard: renderDashboard,
    profile: renderProfile,
    about: renderAbout,
    skills: renderSkills,
    projects: renderProjects,
    journey: renderJourney,
    education: renderEducation,
    certs: renderCerts,
    testimonials: renderTestimonials,
    appearance: renderAppearance,
    media: renderMedia,
  };

  function showPanel(name) {
    activePanel = name;
    $$(".admin-nav__item").forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-panel") === name);
    });
    const container = $("#adminContent");
    container.innerHTML = "";
    const wrapper = el("div", { class: "admin-panel is-active" });
    container.appendChild(wrapper);
    (PANEL_RENDERERS[name] || renderDashboard)(wrapper);
  }

  function initNav() {
    $$(".admin-nav__item").forEach((btn) => {
      btn.addEventListener("click", () => showPanel(btn.getAttribute("data-panel")));
    });
  }

  function initLangToggle() {
    $$(".admin-lang-toggle__btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        editLang = btn.getAttribute("data-edit-lang");
        $$(".admin-lang-toggle__btn").forEach((b) => b.classList.toggle("is-active", b === btn));
        showPanel(activePanel);
      });
    });
  }

  function boot() {
    draft = loadDraft();
    const brand = $("#sidebarBrand");
    if (brand) brand.textContent = draft.SITE.name || "Admin";
    initNav();
    initLangToggle();
    $("#previewBtn").addEventListener("click", openPreview);
    $("#exportBtn").addEventListener("click", exportDataJs);
    const lockAgainBtn = $("#lockAgainBtn");
    if (lockAgainBtn) {
      lockAgainBtn.addEventListener("click", () => {
        location.reload();
      });
    }
    showPanel("dashboard");
    // publish the currently-loaded draft immediately so preview matches on first load
    try {
      localStorage.setItem(LIVE_KEY, JSON.stringify(draft));
    } catch (err) {
      /* storage full — dashboard save-status will surface this on next edit */
    }
  }

  /* ============================================================
     LOCK SCREEN
  ============================================================ */
  function safeAtob(s) {
    try {
      return decodeURIComponent(escape(atob(s)));
    } catch (err) {
      return "";
    }
  }
  function safeBtoa(s) {
    return btoa(unescape(encodeURIComponent(s)));
  }

  function initLock() {
    const lockScreen = $("#lockScreen");
    const app = $("#adminApp");
    const form = $("#lockForm");
    const input = $("#lockInput");
    const errorEl = $("#lockError");
    const titleEl = $("#lockTitle");
    const subtitleEl = $("#lockSubtitle");

    const stored = localStorage.getItem(PASS_KEY);
    const firstRun = !stored;

    if (firstRun) {
      titleEl.textContent = "Set an admin passcode";
      subtitleEl.textContent = "Choose a passcode to keep casual visitors out of this editor on this browser.";
    }

    function unlock() {
      lockScreen.hidden = true;
      app.hidden = false;
      boot();
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = input.value;
      if (!val) return;
      if (firstRun) {
        if (val.length < 4) {
          errorEl.textContent = "Use at least 4 characters.";
          return;
        }
        localStorage.setItem(PASS_KEY, safeBtoa(val));
        unlock();
        return;
      }
      if (val === safeAtob(stored)) {
        unlock();
      } else {
        errorEl.textContent = "Incorrect passcode. Try again.";
        input.value = "";
        input.focus();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", initLock);
})();
