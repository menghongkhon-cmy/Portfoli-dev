# Menghong khon — Developer Portfolio

A premium, bilingual (English / Khmer), dark & light mode personal portfolio built with plain **HTML5, CSS3, and JavaScript** — no frameworks, no build step. Open `index.html` and it works.

Live sections: Hero · About · Skills · Projects (with filtering + detail modal) · Journey/Experience timeline · Education · Certifications · GitHub activity · Testimonials carousel · Contact.

---

## 1. Quick start

No build tools are required.

- **Open directly**: double-click `index.html`, or
- **Local server (recommended)**, so relative paths and fonts behave exactly like production:
  ```bash
  cd portfolio
  python3 -m http.server 8000
  # visit http://localhost:8000
  ```
- **Deploy**: drag the `portfolio/` folder into Vercel, Netlify, GitHub Pages, or any static host. There is no server-side code.

---

## 2. Folder structure

```text
portfolio/
│
├── index.html          # all markup/sections (semantic HTML5, SEO + Open Graph tags)
├── 404.html             # branded not-found page
├── style.css            # entire design system: tokens, layout, components, responsive rules
├── data.js              # ALL editable content lives here (see below)
├── script.js            # rendering + interactions (reads data.js, writes the DOM)
│
├── assets/
│   ├── images/
│   │   └── og-cover.jpg     # Open Graph / social share preview image
│   ├── icons/
│   │   └── favicon.svg      # brand mark favicon
│   └── cv/
│       └── Menghong_khon_CV.pdf # file behind the "Download CV" button
│
└── README.md
```

---

## 3. Editing content (no code changes needed)

Everything you'd want to update — name, bio, projects, skills, education, certifications, social links, and **every English/Khmer string on the page** — lives in **`data.js`**. You do not need to touch `index.html` or `script.js` to update content.

| To change...                         | Edit this in `data.js`      |
|---------------------------------------|------------------------------|
| Name, email, social links, CV file    | `SITE`                       |
| Skill bars & percentages              | `SKILLS`                     |
| Projects (tech, links, category)      | `PROJECTS`                   |
| Testimonial authors                   | `TESTIMONIALS`               |
| Any visible text, in either language  | `I18N.en` / `I18N.km`        |

**Adding a project** — two steps:
1. Add an entry to the `PROJECTS` array (id, category, tech stack, GitHub/demo links).
2. Add matching content under `I18N.en.projects.items.<id>` **and** `I18N.km.projects.items.<id>` (name, description, overview, features, challenges, learned). The project card and its detail modal render automatically.

**Adding a certification / timeline step / testimonial** works the same way — add one entry to the relevant array/list in both `I18N.en` and `I18N.km`.

**Filters** use these category values: `web`, `frontend`, `backend`, `fullstack` — assign one to each project.

---

## 4. Language & theme

- Switch via the navbar controls; both choices persist in `localStorage` (`portfolio-lang`, `portfolio-theme`) and are re-applied on the next visit.
- Khmer typography uses **Noto Sans Khmer** with heavier heading weights for readability; layout stays identical between languages.
- Add a third language by adding a new key (e.g. `I18N.fr`) with the same shape as `I18N.en`, then add a button in the `.lang-switch` markup in `index.html`.

---

## 5. Things built to be swapped in later

- **Contact form**: currently a front-end-only simulation (shows a success state after a short delay) so no private API key is ever exposed in client code. To send real emails, connect it to a form backend such as [Formspree](https://formspree.io), [EmailJS](https://www.emailjs.com), or your own serverless function, inside `initContactForm()` in `script.js`.
- **GitHub activity section**: ships with clean static placeholder numbers/graph (`renderGithub()` in `script.js`). Swap in the real [GitHub REST API](https://docs.github.com/en/rest) (`/users/{username}/repos`, contribution data, etc.) when ready — the markup and styling already expect that shape of data.
- **Profile photo**: `assets/images/profile.jpg` is used in two places — the floating avatar badge in the hero and the portrait card in the About section. It currently ships with a branded placeholder (gradient + initials). Replace that file with your own photo (square, at least 600×600px works well for both crops) and it updates in both spots automatically. If the file is ever missing or fails to load, the layout gracefully falls back to the initials badge instead of a broken image icon.
- **CV file**: replace `assets/cv/Menghong_khon_CV.pdf` with your real résumé (keep the same filename, or update `SITE.cvFile` in `data.js`).
- **OG image**: swap `assets/images/og-cover.jpg` for a real photo/screenshot-based social card if you want (1200×630px recommended).

---

## 6. Design system (in `style.css`)

- All colors, spacing, radii, fonts, and shadows are CSS custom properties defined once in `:root` and overridden under `[data-theme="light"]` — change a token once, it updates everywhere.
- Typefaces: **Space Grotesk** (display/headings), **Inter** (body), **JetBrains Mono** (code/labels), **Noto Sans Khmer** (Khmer text).
- Every animation respects `prefers-reduced-motion: reduce` (see the bottom of `style.css`) and the custom cursor/magnetic buttons are automatically disabled on touch devices.

---

## 7. Performance & accessibility notes

- No external JS frameworks or icon libraries — icons are a single inline SVG sprite (`<symbol>` defs at the top of `index.html`), so there's no extra network request per icon.
- Scroll-triggered animations use `IntersectionObserver` (not scroll-event polling).
- Semantic landmarks (`header`, `main`, `footer`, `nav`), skip-to-content link, visible focus states, and `aria-*` attributes on interactive controls (modal, mobile menu, filters, carousel) are included throughout.
- Google Fonts are the only external network request; everything else is self-contained.

---

## 8. Browser support

Built for evergreen browsers (Chrome, Edge, Firefox, Safari — latest two versions). Uses modern-but-widely-supported CSS (`color-mix()`, `backdrop-filter`, CSS custom properties); on older browsers a couple of decorative touches (the GitHub contribution heatmap tint, glass blur) degrade gracefully to a flat color rather than breaking layout.
