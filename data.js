/**
 * ============================================================
 *  PORTFOLIO DATA
 *  All editable content lives here. Update this file to change
 *  names, projects, skills, links, or translations — no need to
 *  touch index.html or script.js for content changes.
 * ============================================================
 */

// ---------------------------------------------------------------
// 1. SITE-WIDE CONFIG (things that don't need translating)
// ---------------------------------------------------------------
const SITE = {
  name: "Menghong",
  role: "menghongkhon-cmy",
  email: "menghongkhon180@gmail.com",
  location: "Phnom Penh, Cambodia",
  social: {
    github: "https://github.com/menghongkhon-cmy",
    linkedin: "https://linkedin.com/in/menghong-khon",
    telegram: "https://t.me/Menghong180",
  },
  githubUsername: "menghongkhon-cmy",
  cvFile: "Khon_Menghong_CV_Final.pdf",
  stats: {
    projects: 7,
    technologies: 14,
    monthsLearning: 14,
  },
};

// ---------------------------------------------------------------
// 2. SKILLS (percentages are editable — keep them realistic)
// ---------------------------------------------------------------
const SKILLS = {
  frontend: [
    { name: "HTML", level: 92 },
    { name: "CSS", level: 88 },
    { name: "JavaScript", level: 80 },
    { name: "Responsive Design", level: 85 },
    { name: "UI / UX", level: 75 },
  ],
  backend: [
    { name: "Python", level: 78 },
    { name: "Flask", level: 72 },
    { name: "REST API", level: 70 },
    { name: "Database (SQL)", level: 68 },
  ],
  tools: [
    { name: "Git", level: 82 },
    { name: "GitHub", level: 84 },
    { name: "VS Code", level: 90 },
    { name: "Vercel", level: 74 },
    { name: "Figma", level: 65 },
  ],
};

// ---------------------------------------------------------------
// 3. PROJECTS
// ---------------------------------------------------------------
const PROJECTS = [
  {
    id: "ecommerce",
    category: "fullstack",
    tech: ["HTML", "CSS", "JavaScript", "Flask", "SQLite"],
    image: "shop",
    github: "https://github.com/menghongkhon-cmy/ecommerce-website",
    demo: "#",
  },
  {
    id: "typing",
    category: "frontend",
    tech: ["HTML", "CSS", "JavaScript"],
    image: "typing",
    github: "https://github.com/menghongkhon-cmy/typing-practice",
    demo: "#",
  },
  {
    id: "grammar",
    category: "frontend",
    tech: ["HTML", "CSS", "JavaScript"],
    image: "grammar",
    github: "https://github.com/menghongkhon-cmy/grammar-learning",
    demo: "#",
  },
  {
    id: "techstore",
    category: "fullstack",
    tech: ["Flask", "Python", "PostgreSQL", "Bootstrap"],
    image: "techstore",
    github: "https://github.com/menghongkhon-cmy/technology-store",
    demo: "#",
  },
  {
    id: "clothing",
    category: "frontend",
    tech: ["HTML", "CSS", "JavaScript"],
    image: "clothing",
    github: "https://github.com/menghongkhon-cmy/clothing-store",
    demo: "#",
  },
  {
    id: "cafe",
    category: "web",
    tech: ["HTML", "CSS", "JavaScript"],
    image: "cafe",
    github: "https://github.com/menghongkhon-cmy/cafe-website",
    demo: "#",
  },
  {
    id: "flaskcrud",
    category: "backend",
    tech: ["Python", "Flask", "SQLAlchemy", "REST API"],
    image: "flaskcrud",
    github: "https://github.com/menghongkhon-cmy/flask-crud-app",
    demo: "#",
  },
];

// ---------------------------------------------------------------
// 4. TESTIMONIALS
// ---------------------------------------------------------------
const TESTIMONIALS = [
  { id: "t1", name: "Sophea Lihov", role: "instructor" },
  { id: "t2", name: "Michael Menghak", role: "mentor" },
  { id: "t3", name: "Vanna Heng Le", role: "teammate" },
];

// ---------------------------------------------------------------
// 5. TRANSLATIONS — every string on the page lives here
// ---------------------------------------------------------------
const I18N = {
  en: {
    meta: {
      title: "Menghong",
      description:
        "Portfolio of Menghong, a full-stack web developer from Phnom Penh, Cambodia, building fast, clean and functional web products with JavaScript, Python and Flask.",
    },
    nav: {
      home: "Home",
      about: "About",
      skills: "Skills",
      projects: "Projects",
      journey: "Journey",
      backgroundStudy: "Background Study",
      contact: "Contact",
      contactBtn: "Contact Me",
    },
    hero: {
      badge: "Available for Projects",
      greeting: "Hi, I'm",
      name: "Menghong",
      role: "Web Developer / Full-Stack Developer",
      intro:
        "I design and build clean, fast, and reliable web products — from responsive front-ends to Flask-powered back-ends. Currently sharpening my full-stack skills one real project at a time.",
      ctaProjects: "View My Projects",
      ctaContact: "Contact Me",
      ctaCV: "Download CV",
      statProjects: "Projects built",
      statTech: "Technologies",
      statMonths: "Months learning",
      scroll: "Scroll",
      codeCardTab: "profile.js",
      codeLoading: "loading skills...",
      avatarAlt: "Photo of Menghong",
    },
    about: {
      eyebrow: "About",
      title: "The developer behind the code",
      bio: "I'm a web developer and computer science student based in Phnom Penh, Cambodia. I enjoy turning ideas into working products — starting from a blank file and ending with something people can actually click, use, and rely on. I care about clean code, thoughtful UX, and shipping things that work, not just things that look good in a screenshot.",
      strengthsTitle: "Strengths",
      strengths: [
        "Fast learner, comfortable picking up new tools",
        "Detail-oriented on UI and code structure",
        "Comfortable working across the full stack",
        "Clear communicator, good at explaining technical ideas",
      ],
      enjoyTitle: "What I enjoy building",
      enjoy:
        "Practical, everyday tools — online stores, learning apps, dashboards, and small business websites — things that solve a real, visible problem.",
      goalTitle: "Career goal",
      goal:
        "To grow into a professional full-stack developer, contribute to real products used by real people, and eventually lead technical projects of my own.",
      learningTitle: "Currently learning",
      learning: "React, PostgreSQL, and REST API design patterns.",
      photoAlt: "Portrait of Menghong",
      timeline: [
        { label: "Education", desc: "Building CS fundamentals" },
        { label: "Learning", desc: "Modern web development" },
        { label: "Projects", desc: "Applying skills to real builds" },
        { label: "Future Career", desc: "Full-Stack Developer" },
      ],
    },
    skills: {
      eyebrow: "Skills",
      title: "What I work with",
      subtitle:
        "A practical toolkit built through courses, projects, and a lot of debugging.",
      frontend: "Frontend",
      backend: "Backend",
      tools: "Tools & Workflow",
    },
    projects: {
      eyebrow: "Work",
      title: "Featured projects",
      subtitle:
        "A selection of projects I've built to practice and apply real-world web development skills.",
      filters: {
        all: "All",
        web: "Web",
        frontend: "Frontend",
        backend: "Backend",
        fullstack: "Full Stack",
      },
      github: "GitHub",
      demo: "Live Demo",
      details: "View Details",
      modal: {
        overview: "Overview",
        features: "Key features",
        tech: "Technologies used",
        challenges: "Challenges",
        learned: "What I learned",
        github: "View Code",
        demo: "Live Demo",
      },
      items: {
        ecommerce: {
          name: "E-commerce Website",
          desc: "A full online store with product listings, a shopping cart, and a Flask-powered checkout flow.",
          overview:
            "A complete e-commerce experience: users can browse products by category, filter and search, add items to a persistent cart, and complete a mock checkout. The backend, built with Flask and SQLite, manages products, orders, and simple inventory.",
          features: [
            "Product catalog with category filtering and search",
            "Persistent shopping cart with quantity controls",
            "Checkout flow with order summary",
            "Admin-style product management routes",
          ],
          challenges:
            "Keeping cart state consistent between the front-end and the Flask session store, and structuring the database so new product categories could be added without code changes.",
          learned:
            "How to design a relational schema for a real store, and how to keep server-rendered pages fast without a heavy JS framework.",
        },
        typing: {
          name: "Typing Practice Website",
          desc: "An interactive typing trainer that tracks speed, accuracy, and progress over time.",
          overview:
            "A browser-based typing tutor with live WPM and accuracy tracking, multiple difficulty levels, and a clean, distraction-free typing interface built for daily practice.",
          features: [
            "Real-time words-per-minute and accuracy tracking",
            "Multiple text difficulty levels",
            "Visual feedback for correct / incorrect keystrokes",
            "Session history stored locally",
          ],
          challenges:
            "Measuring typing accuracy and speed in real time without noticeable input lag, especially on longer passages.",
          learned:
            "Working precisely with the DOM and keyboard events, and how small UI details (like caret position) affect perceived performance.",
        },
        grammar: {
          name: "English Grammar Learning Website",
          desc: "A structured practice site with grammar lessons, quizzes, and instant feedback.",
          overview:
            "An educational site organized into grammar topics, each with a short lesson followed by an interactive quiz. Instant feedback and a running score help learners track their progress.",
          features: [
            "Lessons organized by grammar topic and difficulty",
            "Interactive multiple-choice quizzes with instant feedback",
            "Progress tracking across topics",
            "Mobile-friendly quiz interface",
          ],
          challenges:
            "Designing quiz data so new questions and topics could be added easily, without restructuring the front-end.",
          learned:
            "How to separate content from logic using structured JavaScript data, making the site easy to extend.",
        },
        techstore: {
          name: "Technology Store",
          desc: "A Flask-powered electronics store with product management and a PostgreSQL database.",
          overview:
            "An online technology store focused on a solid backend: product CRUD, categories, and a PostgreSQL database, wrapped in a clean Bootstrap-based storefront.",
          features: [
            "Full CRUD for products and categories",
            "PostgreSQL database with relational structure",
            "Search and category-based browsing",
            "Responsive storefront layout",
          ],
          challenges:
            "Moving from SQLite to PostgreSQL and handling migrations cleanly during active development.",
          learned:
            "Practical database design, and how to structure a Flask app into blueprints for maintainability.",
        },
        clothing: {
          name: "Clothing Store",
          desc: "A stylish front-end storefront concept with product filtering and a cart preview.",
          overview:
            "A front-end-focused clothing storefront exploring layout, imagery, and interaction: size and color selectors, a live cart preview, and smooth filtering by category.",
          features: [
            "Size and color variant selection",
            "Live cart preview without a page reload",
            "Category and price filtering",
            "Fully responsive product grid",
          ],
          challenges:
            "Building a smooth filtering experience using vanilla JavaScript, without a front-end framework.",
          learned:
            "Advanced CSS Grid/Flexbox layout techniques and writing reusable vanilla JS components.",
        },
        cafe: {
          name: "Cafe Website",
          desc: "A warm, visual marketing site for a small cafe, with a menu and reservation form.",
          overview:
            "A marketing-style website for a small local cafe: an inviting hero section, a categorized menu, an about story, and a simple reservation request form.",
          features: [
            "Categorized, easy-to-scan menu layout",
            "Reservation request form with validation",
            "Image-forward, warm visual design",
            "Smooth scroll navigation between sections",
          ],
          challenges:
            "Balancing rich imagery with fast load times on mobile connections.",
          learned:
            "Image optimization techniques and designing for a non-technical, hospitality-focused audience.",
        },
        flaskcrud: {
          name: "Flask CRUD Application",
          desc: "A backend-focused CRUD app demonstrating clean REST API design with Flask.",
          overview:
            "A backend-first project focused on doing CRUD properly: a REST API built with Flask and SQLAlchemy, complete with validation, error handling, and clear route structure.",
          features: [
            "Full REST API (Create, Read, Update, Delete)",
            "SQLAlchemy ORM models with relationships",
            "Input validation and structured error responses",
            "Organized route/blueprint structure",
          ],
          challenges:
            "Designing consistent, predictable API responses and handling edge cases like missing or invalid data.",
          learned:
            "REST API design conventions, and how to structure a Flask backend so it's easy to extend into a real product.",
        },
      },
    },
    journey: {
      eyebrow: "Journey",
      title: "Experience & journey",
      subtitle: "A timeline of how I got here — and where I'm headed.",
      items: [
        {
          date: "2025",
          title: "Started Web Development",
          desc: "Began learning HTML, CSS, and JavaScript fundamentals, and built my first static websites.",
        },
        {
          date: "2026",
          title: "Backend & Databases",
          desc: "Learned Python, Flask, and relational databases; started building full-stack projects.",
        },
        {
          date: "2026",
          title: "Portfolio Projects",
          desc: "Built and shipped real practice projects — stores, learning tools, and CRUD applications — to sharpen practical skills.",
        },
        {
          date: "Future",
          title: "Full-Stack Developer",
          desc: "Goal: land an internship or junior role, contribute to production applications, and keep growing toward a senior full-stack path.",
        },
      ],
    },
    backgroundStudy: {
      eyebrow: "Background Study",
      title: "My education path",
      subtitle: "From secondary school to university, each stage shaped the way I learn and build.",
      items: [
        {
          date: "Grade 9",
          title: "Lower Secondary Education",
          desc: "Completed Grade 9 and built the foundation for continued academic study.",
        },
        {
          date: "Grade 12",
          title: "High School Graduation",
          desc: "Completed Grade 12 with a C grade and prepared for university study.",
        },
        {
          date: "Passerelles numériques Cambodia",
          title: "Web Development Student",
          desc: "Studied web development at Passerelles numériques Cambodia and developed practical skills for building useful digital products.",
        },
        {
          date: "Current focus",
          title: "Learning by Building",
          desc: "Continuing to grow through web development projects, programming practice, and hands-on problem solving.",
        },
      ],
    },
    education: {
      eyebrow: "Education",
      title: "Education",
      school: "Passerelles numériques Cambodia",
      program: "Web Development Program",
      year: "Completed",
      skillsLabel: "Skills gained",
      skillsList: [
        "Data structures & algorithms",
        "Web development fundamentals",
        "Database systems",
        "Software engineering principles",
      ],
      projectsLabel: "Relevant coursework projects",
      projectsList: [
        "Student management system (Flask + MySQL)",
        "Data structures visualizer",
      ],
    },
    certs: {
      eyebrow: "Achievements",
      title: "Certifications & achievements",
      subtitle: "Courses, workshops, and recognitions along the way.",
      items: [
        {
          title: "Responsive Web Design",
          org: "freeCodeCamp",
          year: "2025",
          type: "Certificate",
        },
        {
          title: "Python for Everybody",
          org: "University of Michigan (Coursera)",
          year: "2025",
          type: "Certificate",
        },
        {
          title: "Campus Web Development Workshop",
          org: "Royal University of Phnom Penh",
          year: "2026",
          type: "Workshop",
        },
        {
          title: "University Hackathon — 2nd Place",
          org: "RUPP Tech Club",
          year: "2026",
          type: "Award",
        },
      ],
    },
    github: {
      eyebrow: "Developer Activity",
      title: "On GitHub",
      subtitle: "A snapshot of my open-source activity — connect a live API anytime.",
      repos: "Repositories",
      contributions: "Contributions (past year)",
      streak: "Longest streak",
      topLangsLabel: "Most-used technologies",
      viewProfile: "View GitHub Profile",
      days: "days",
    },
    testimonials: {
      eyebrow: "Testimonials",
      title: "What people say",
      items: {
        t1: {
          quote:
            "Menghong consistently asks the right questions and turns feedback into better code fast. A genuinely dependable student developer.",
        },
        t2: {
          quote:
            "Sharp, curious, and easy to work with. Menghong picked up our stack quickly and shipped working features from day one.",
        },
        t3: {
          quote:
            "Great teammate — organized, communicates clearly, and always ships what they promise, on time.",
        },
      },
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's build something together",
      subtitle:
        "Have a project, an internship opening, or just want to say hi? My inbox is open.",
      formName: "Name",
      formEmail: "Email",
      formSubject: "Subject",
      formMessage: "Message",
      formSend: "Send Message",
      formSending: "Sending...",
      formSuccess: "Thanks! Your message has been noted — I'll get back to you soon.",
      formError: "Something went wrong. Please try again or email me directly.",
      connect: "Connect",
      copyEmail: "Copy email",
      copied: "Copied!",
      locationLabel: "Based in",
    },
    footer: {
      tagline: "Building clean, functional web products — one project at a time.",
      rights: "All rights reserved.",
      backToTop: "Back to top",
    },
    misc: {
      floatingCta: "Let's Work Together",
      scrollTop: "Scroll to top",
      loading: "Loading portfolio",
      notFoundTitle: "404",
      notFoundText: "This page wandered off. Let's get you back home.",
      notFoundBtn: "Back to Home",
      switchTheme: "Toggle theme",
      switchLang: "Switch language",
      menu: "Menu",
      close: "Close",
    },
  },

  km: {
    meta: {
      title: "ម៉េងហុង — អ្នកអភិវឌ្ឍន៍គេហទំព័រ Full-Stack",
      description:
        "គេហទំព័រផលការងាររបស់ ម៉េងហុង អ្នកអភិវឌ្ឍន៍គេហទំព័រ Full-Stack មកពីភ្នំពេញ កម្ពុជា ដែលបង្កើតផលិតផលគេហទំព័រលឿន ស្អាត និងប្រើប្រាស់បានល្អ ដោយប្រើ JavaScript, Python និង Flask។",
    },
    nav: {
      home: "ទំព័រដើម",
      about: "អំពីខ្ញុំ",
      skills: "ជំនាញ",
      projects: "គម្រោង",
      journey: "ដំណើរការ",
      backgroundStudy: "ប្រវត្តិការសិក្សា",
      contact: "ទំនាក់ទំនង",
      contactBtn: "ទាក់ទងខ្ញុំ",
    },
    hero: {
      badge: "ទំនេរទទួលគម្រោង",
      greeting: "សួស្តី ខ្ញុំឈ្មោះ",
      name: "ម៉េងហុង",
      role: "អ្នកអភិវឌ្ឍន៍គេហទំព័រ / Full-Stack Developer",
      intro:
        "ខ្ញុំរចនានិងបង្កើតផលិតផលគេហទំព័រ ដែលស្អាត លឿន និងអាចទុកចិត្តបាន — ចាប់ពី front-end ដែលឆ្លើយតបល្អ រហូតដល់ back-end ដែលដំណើរការដោយ Flask។ បច្ចុប្បន្នខ្ញុំកំពុងកែលម្អជំនាញ full-stack តាមរយៈគម្រោងពិតប្រាកដម្តងមួយៗ។",
      ctaProjects: "មើលគម្រោងរបស់ខ្ញុំ",
      ctaContact: "ទាក់ទងខ្ញុំ",
      ctaCV: "ទាញយក CV",
      statProjects: "គម្រោងបានបង្កើត",
      statTech: "បច្ចេកវិទ្យា",
      statMonths: "ខែនៃការសិក្សា",
      scroll: "រំកិលចុះ",
      codeCardTab: "profile.js",
      codeLoading: "កំពុងផ្ទុកជំនាញ...",
      avatarAlt: "រូបថតរបស់ ម៉េងហុង",
    },
    about: {
      eyebrow: "អំពីខ្ញុំ",
      title: "អ្នកអភិវឌ្ឍន៍នៅពីក្រោយកូដ",
      bio: "ខ្ញុំជាអ្នកអភិវឌ្ឍន៍គេហទំព័រ និងជានិស្សិតវិទ្យាសាស្ត្រកុំព្យូទ័រ រស់នៅភ្នំពេញ កម្ពុជា។ ខ្ញុំចូលចិត្តបំប្លែងគំនិតទៅជាផលិតផលពិតប្រាកដ — ចាប់ផ្តើមពីឯកសារទទេ រហូតដល់អ្វីមួយដែលមនុស្សអាចចុច ប្រើប្រាស់ និងទុកចិត្តបាន។ ខ្ញុំយកចិត្តទុកដាក់លើកូដស្អាត បទពិសោធន៍អ្នកប្រើប្រាស់ដ៏ល្អ និងការបញ្ចប់ការងារឲ្យដំណើរការពិតប្រាកដ មិនមែនគ្រាន់តែស្អាតនៅលើរូបថតអេក្រង់ប៉ុណ្ណោះទេ។",
      strengthsTitle: "ចំណុចខ្លាំង",
      strengths: [
        "រៀនបានលឿន ងាយស្រួលទទួលយកឧបករណ៍ថ្មីៗ",
        "យកចិត្តទុកដាក់ខ្លាំងលើ UI និងរចនាសម្ព័ន្ធកូដ",
        "អាចធ្វើការបានគ្រប់ស្រទាប់ទាំង front-end និង back-end",
        "ទំនាក់ទំនងច្បាស់លាស់ ពូកែពន្យល់គំនិតបច្ចេកទេស",
      ],
      enjoyTitle: "អ្វីដែលខ្ញុំចូលចិត្តបង្កើត",
      enjoy:
        "ឧបករណ៍ជាក់ស្តែងសម្រាប់ប្រើប្រចាំថ្ងៃ — ហាងអនឡាញ កម្មវិធីសិក្សា ផ្ទាំងគ្រប់គ្រង និងគេហទំព័រអាជីវកម្មតូចៗ — អ្វីៗដែលដោះស្រាយបញ្ហាពិតប្រាកដ។",
      goalTitle: "គោលដៅអាជីព",
      goal:
        "ក្លាយជាអ្នកអភិវឌ្ឍន៍ full-stack ដែលមានវិជ្ជាជីវៈ រួមចំណែកបង្កើតផលិតផលពិតប្រាកដសម្រាប់អ្នកប្រើប្រាស់ជាច្រើន និងចុងក្រោយដឹកនាំគម្រោងបច្ចេកទេសផ្ទាល់ខ្លួន។",
      learningTitle: "កំពុងសិក្សា",
      learning: "React, PostgreSQL និងគំរូការរចនា REST API។",
      photoAlt: "រូបថតរបស់ ម៉េងហុង",
      timeline: [
        { label: "ការសិក្សា", desc: "កសាងមូលដ្ឋានវិទ្យាសាស្ត្រកុំព្យូទ័រ" },
        { label: "ការរៀន", desc: "ការអភិវឌ្ឍន៍គេហទំព័រទំនើប" },
        { label: "គម្រោង", desc: "អនុវត្តជំនាញលើការបង្កើតពិតប្រាកដ" },
        { label: "អនាគត", desc: "អ្នកអភិវឌ្ឍន៍ Full-Stack" },
      ],
    },
    skills: {
      eyebrow: "ជំនាញ",
      title: "អ្វីដែលខ្ញុំប្រើប្រាស់",
      subtitle: "សំណុំឧបករណ៍ជាក់ស្តែង បង្កើតឡើងតាមរយៈវគ្គសិក្សា គម្រោង និងការជួសជុលកំហុសជាច្រើន។",
      frontend: "Frontend",
      backend: "Backend",
      tools: "ឧបករណ៍ និងលំហូរការងារ",
    },
    projects: {
      eyebrow: "ស្នាដៃ",
      title: "គម្រោងសំខាន់ៗ",
      subtitle: "គម្រោងមួយចំនួនដែលខ្ញុំបានបង្កើត ដើម្បីអនុវត្តជំនាញអភិវឌ្ឍន៍គេហទំព័រពិតប្រាកដ។",
      filters: {
        all: "ទាំងអស់",
        web: "គេហទំព័រ",
        frontend: "Frontend",
        backend: "Backend",
        fullstack: "Full Stack",
      },
      github: "GitHub",
      demo: "សាកល្បងផ្ទាល់",
      details: "មើលព័ត៌មានលម្អិត",
      modal: {
        overview: "ទិដ្ឋភាពទូទៅ",
        features: "លក្ខណៈពិសេស",
        tech: "បច្ចេកវិទ្យាប្រើប្រាស់",
        challenges: "បញ្ហាប្រឈម",
        learned: "អ្វីដែលខ្ញុំបានរៀន",
        github: "មើលកូដ",
        demo: "សាកល្បងផ្ទាល់",
      },
      items: {
        ecommerce: {
          name: "គេហទំព័រពាណិជ្ជកម្មអេឡិចត្រូនិក",
          desc: "ហាងអនឡាញពេញលេញ មានបញ្ជីផលិតផល រទេះទិញទំនិញ និងដំណើរការទូទាត់ដោយ Flask។",
          overview:
            "បទពិសោធន៍ពាណិជ្ជកម្មអេឡិចត្រូនិកពេញលេញ៖ អ្នកប្រើអាចរកមើលផលិតផលតាមប្រភេទ ត្រង និងស្វែងរក បន្ថែមទំនិញទៅរទេះជាប់រហូត និងបញ្ចប់ការទូទាត់ក្លែងធ្វើ។ Backend ដែលបង្កើតដោយ Flask និង SQLite គ្រប់គ្រងផលិតផល ការបញ្ជាទិញ និងស្តុកទំនិញសាមញ្ញ។",
          features: [
            "កាតាឡុកផលិតផលដែលអាចត្រងតាមប្រភេទ និងស្វែងរក",
            "រទេះទិញទំនិញជាប់រហូត អាចកែចំនួន",
            "ដំណើរការទូទាត់ជាមួយសេចក្តីសង្ខេបការបញ្ជាទិញ",
            "ផ្លូវគ្រប់គ្រងផលិតផលបែបអ្នកគ្រប់គ្រង",
          ],
          challenges:
            "រក្សាស្ថានភាពរទេះទិញឲ្យស្របគ្នារវាង front-end និង session store របស់ Flask និងរៀបចំមូលដ្ឋានទិន្នន័យ ដើម្បីអាចបន្ថែមប្រភេទផលិតផលថ្មីដោយមិនកែកូដ។",
          learned:
            "របៀបរចនា schema ទំនាក់ទំនងសម្រាប់ហាងពិតប្រាកដ និងរបៀបរក្សាទំព័រ server-rendered ឲ្យលឿន ដោយមិនប្រើ JS framework ធំ។",
        },
        typing: {
          name: "គេហទំព័រហាត់វាយអក្សរ",
          desc: "កម្មវិធីហាត់វាយអក្សរអន្តរកម្ម ដែលតាមដានល្បឿន ភាពត្រឹមត្រូវ និងវឌ្ឍនភាពតាមពេលវេលា។",
          overview:
            "កម្មវិធីបង្រៀនវាយអក្សរនៅលើកម្មវិធីរុករក ជាមួយការតាមដាន WPM និងភាពត្រឹមត្រូវផ្ទាល់ កម្រិតលំបាកជាច្រើន និងចំណុចប្រទាក់វាយអក្សរស្អាត មិនរំខាន សម្រាប់ការហាត់ប្រចាំថ្ងៃ។",
          features: [
            "តាមដានចំនួនពាក្យក្នុងមួយនាទី និងភាពត្រឹមត្រូវជាបន្តបន្ទាប់",
            "កម្រិតលំបាកអត្ថបទជាច្រើន",
            "ការឆ្លើយតបដោយរូបភាពសម្រាប់ការវាយត្រូវ/ខុស",
            "ប្រវត្តិវគ្គហាត់ រក្សាទុកនៅលើម៉ាស៊ីនអ្នកប្រើ",
          ],
          challenges:
            "វាស់ស្ទង់ភាពត្រឹមត្រូវ និងល្បឿននៃការវាយអក្សរជាបន្តបន្ទាប់ ដោយមិនមានការយឺតយ៉ាវក្នុងការវាយ ជាពិសេសសម្រាប់អត្ថបទវែងៗ។",
          learned:
            "ការធ្វើការជាមួយ DOM និងព្រឹត្តិការណ៍ក្តារចុចយ៉ាងជាក់លាក់ និងរបៀបដែលព័ត៌មានលម្អិត UI តូចៗ (ដូចជាទីតាំង caret) មានឥទ្ធិពលលើអារម្មណ៍ដំណើរការ។",
        },
        grammar: {
          name: "គេហទំព័រសិក្សាវេយ្យាករណ៍អង់គ្លេស",
          desc: "គេហទំព័រហាត់រៀនមានរចនាសម្ព័ន្ធ មានមេរៀនវេយ្យាករណ៍ សំណួរតេស្ត និងការឆ្លើយតបភ្លាមៗ។",
          overview:
            "គេហទំព័រអប់រំដែលរៀបចំតាមប្រធានបទវេយ្យាករណ៍ នីមួយៗមានមេរៀនខ្លីៗបន្តដោយសំណួរតេស្តអន្តរកម្ម។ ការឆ្លើយតបភ្លាមៗ និងពិន្ទុសរុប ជួយឲ្យអ្នករៀនតាមដានវឌ្ឍនភាព។",
          features: [
            "មេរៀនរៀបចំតាមប្រធានបទ និងកម្រិតលំបាក",
            "សំណួរតេស្តជម្រើសពហុអន្តរកម្ម ជាមួយការឆ្លើយតបភ្លាមៗ",
            "តាមដានវឌ្ឍនភាពគ្រប់ប្រធានបទ",
            "ចំណុចប្រទាក់តេស្តងាយស្រួលប្រើលើទូរស័ព្ទ",
          ],
          challenges:
            "រចនាទិន្នន័យតេស្ត ដើម្បីអាចបន្ថែមសំណួរ និងប្រធានបទថ្មីបានងាយ ដោយមិនចាំបាច់រៀបចំ front-end ឡើងវិញ។",
          learned:
            "របៀបញែកមាតិកាចេញពី logic ដោយប្រើទិន្នន័យ JavaScript ដែលមានរចនាសម្ព័ន្ធ ធ្វើឲ្យគេហទំព័រងាយពង្រីក។",
        },
        techstore: {
          name: "ហាងបច្ចេកវិទ្យា",
          desc: "ហាងគ្រឿងអេឡិចត្រូនិកដំណើរការដោយ Flask ជាមួយការគ្រប់គ្រងផលិតផល និងមូលដ្ឋានទិន្នន័យ PostgreSQL។",
          overview:
            "ហាងបច្ចេកវិទ្យាអនឡាញ ដែលផ្តោតលើ backend រឹងមាំ៖ CRUD ផលិតផល ប្រភេទផលិតផល និងមូលដ្ឋានទិន្នន័យ PostgreSQL រុំព័ទ្ធដោយផ្ទាំងហាងស្អាតដែលប្រើ Bootstrap។",
          features: [
            "CRUD ពេញលេញសម្រាប់ផលិតផល និងប្រភេទ",
            "មូលដ្ឋានទិន្នន័យ PostgreSQL មានរចនាសម្ព័ន្ធទំនាក់ទំនង",
            "ការស្វែងរក និងរកមើលតាមប្រភេទ",
            "ប្លង់ផ្ទាំងហាងឆ្លើយតបល្អ",
          ],
          challenges:
            "ផ្លាស់ប្តូរពី SQLite ទៅ PostgreSQL និងគ្រប់គ្រង migration ដោយរលូនក្នុងអំឡុងពេលអភិវឌ្ឍន៍សកម្ម។",
          learned:
            "ការរចនាមូលដ្ឋានទិន្នន័យជាក់ស្តែង និងរបៀបរៀបចំកម្មវិធី Flask ជា blueprints ដើម្បីងាយថែទាំ។",
        },
        clothing: {
          name: "ហាងសម្លៀកបំពាក់",
          desc: "គំនិតផ្ទាំងហាង front-end ដ៏ទាក់ទាញ ជាមួយការត្រងផលិតផល និងការមើលរទេះទិញជាមុន។",
          overview:
            "ផ្ទាំងហាងសម្លៀកបំពាក់ផ្តោតលើ front-end ស្វែងយល់អំពីប្លង់ រូបភាព និងអន្តរកម្ម៖ ជម្រើសទំហំ និងពណ៌ ការមើលរទេះទិញផ្ទាល់ និងការត្រងតាមប្រភេទដោយរលូន។",
          features: [
            "ការជ្រើសរើសទំហំ និងពណ៌",
            "ការមើលរទេះទិញផ្ទាល់ ដោយមិនចាំបាច់ផ្ទុកទំព័រឡើងវិញ",
            "ការត្រងតាមប្រភេទ និងតម្លៃ",
            "ក្រឡាផលិតផលឆ្លើយតបល្អទាំងស្រុង",
          ],
          challenges:
            "បង្កើតបទពិសោធន៍ត្រងដ៏រលូន ដោយប្រើ JavaScript សុទ្ធ ដោយមិនប្រើ framework front-end។",
          learned:
            "បច្ចេកទេសប្លង់ CSS Grid/Flexbox កម្រិតខ្ពស់ និងការសរសេរសមាសធាតុ JS សុទ្ធអាចប្រើឡើងវិញបាន។",
        },
        cafe: {
          name: "គេហទំព័រហាងកាហ្វេ",
          desc: "គេហទំព័រទីផ្សារកក់ក្តៅសម្រាប់ហាងកាហ្វេតូចមួយ ជាមួយម៉ឺនុយ និងទម្រង់កក់តុ។",
          overview:
            "គេហទំព័រទីផ្សារសម្រាប់ហាងកាហ្វេក្នុងតំបន់មួយ៖ ផ្នែក hero ទាក់ទាញ ម៉ឺនុយចែកជាប្រភេទ រឿងអំពីហាង និងទម្រង់ស្នើសុំកក់តុសាមញ្ញ។",
          features: [
            "ប្លង់ម៉ឺនុយចែកជាប្រភេទ ងាយអាន",
            "ទម្រង់ស្នើសុំកក់តុ ជាមួយការផ្ទៀងផ្ទាត់",
            "រចនាបទបែបរូបភាព កក់ក្តៅ",
            "ការរំកិលរលូនរវាងផ្នែកនានា",
          ],
          challenges:
            "រក្សាតុល្យភាពរវាងរូបភាពស្រស់ស្អាត និងល្បឿនផ្ទុកលឿននៅលើបណ្តាញទូរស័ព្ទ។",
          learned:
            "បច្ចេកទេសបង្រួមទំហំរូបភាព និងការរចនាសម្រាប់អ្នកទស្សនាមិនបច្ចេកទេស ក្នុងវិស័យបដិសណ្ឋារកិច្ច។",
        },
        flaskcrud: {
          name: "កម្មវិធី Flask CRUD",
          desc: "កម្មវិធី CRUD ផ្តោតលើ backend បង្ហាញការរចនា REST API ស្អាតដោយ Flask។",
          overview:
            "គម្រោងផ្តោតលើ backend ជាចម្បង ដើម្បីធ្វើ CRUD ឲ្យបានត្រឹមត្រូវ៖ REST API បង្កើតដោយ Flask និង SQLAlchemy ពេញលេញជាមួយការផ្ទៀងផ្ទាត់ ការគ្រប់គ្រងកំហុស និងរចនាសម្ព័ន្ធផ្លូវច្បាស់លាស់។",
          features: [
            "REST API ពេញលេញ (Create, Read, Update, Delete)",
            "គំរូ SQLAlchemy ORM ជាមួយទំនាក់ទំនងគ្នា",
            "ការផ្ទៀងផ្ទាត់ទិន្នន័យបញ្ចូល និងការឆ្លើយតបកំហុសមានរចនាសម្ព័ន្ធ",
            "រចនាសម្ព័ន្ធផ្លូវ/blueprint រៀបចំបានល្អ",
          ],
          challenges:
            "រចនាការឆ្លើយតប API ឲ្យស្របគ្នា និងទាយបាន ព្រមទាំងគ្រប់គ្រងករណីលើសលប់ដូចជាទិន្នន័យបាត់ ឬមិនត្រឹមត្រូវ។",
          learned:
            "គោលការណ៍រចនា REST API និងរបៀបរៀបចំ backend របស់ Flask ឲ្យងាយពង្រីកទៅជាផលិតផលពិតប្រាកដ។",
        },
      },
    },
    journey: {
      eyebrow: "ដំណើរការ",
      title: "បទពិសោធន៍ និងដំណើរការ",
      subtitle: "កាលានុវត្តភាពនៃដំណើររបស់ខ្ញុំ — និងទិសដៅខាងមុខ។",
      items: [
        {
          date: "2025",
          title: "ចាប់ផ្តើមអភិវឌ្ឍន៍គេហទំព័រ",
          desc: "ចាប់ផ្តើមរៀនមូលដ្ឋាន HTML, CSS និង JavaScript និងបង្កើតគេហទំព័រ static ដំបូង។",
        },
        {
          date: "2026",
          title: "Backend និងមូលដ្ឋានទិន្នន័យ",
          desc: "រៀន Python, Flask និងមូលដ្ឋានទិន្នន័យទំនាក់ទំនង ចាប់ផ្តើមបង្កើតគម្រោង full-stack។",
        },
        {
          date: "2026",
          title: "គម្រោងផលការងារ",
          desc: "បង្កើត និងបញ្ចេញគម្រោងហាត់ពិតប្រាកដ — ហាង កម្មវិធីសិក្សា និងកម្មវិធី CRUD — ដើម្បីកែលម្អជំនាញជាក់ស្តែង។",
        },
        {
          date: "អនាគត",
          title: "អ្នកអភិវឌ្ឍន៍ Full-Stack",
          desc: "គោលដៅ៖ ទទួលបានកម្មសិក្សា ឬតួនាទីអ្នកអភិវឌ្ឍន៍ថ្មី រួមចំណែកបង្កើតកម្មវិធីផលិតកម្មពិតប្រាកដ និងបន្តរីកចម្រើនទៅជាអ្នកអភិវឌ្ឍន៍ជាន់ខ្ពស់។",
        },
      ],
    },
    backgroundStudy: {
      eyebrow: "ប្រវត្តិការសិក្សា",
      title: "ដំណើរការសិក្សារបស់ខ្ញុំ",
      subtitle: "ចាប់ពីអនុវិទ្យាល័យរហូតដល់សាកលវិទ្យាល័យ ដំណាក់កាលនីមួយៗបានជួយបង្កើតវិធីសាស្ត្ររៀន និងការអភិវឌ្ឍរបស់ខ្ញុំ។",
      items: [
        {
          date: "ថ្នាក់ទី ៩",
          title: "ការអប់រំមធ្យមសិក្សាបឋមភូមិ",
          desc: "បានបញ្ចប់ថ្នាក់ទី ៩ និងកសាងមូលដ្ឋានសម្រាប់ការសិក្សាបន្ត។",
        },
        {
          date: "ថ្នាក់ទី ១២",
          title: "បញ្ចប់ការសិក្សាមធ្យមសិក្សា",
          desc: "បានបញ្ចប់ថ្នាក់ទី ១២ ដោយទទួលបាននិទ្ទេស C និងត្រៀមខ្លួនសម្រាប់ការសិក្សានៅសាកលវិទ្យាល័យ។",
        },
        {
          date: "Passerelles numériques Cambodia",
          title: "និស្សិតអភិវឌ្ឍន៍គេហទំព័រ",
          desc: "បានសិក្សាអភិវឌ្ឍន៍គេហទំព័រនៅ Passerelles numériques Cambodia និងអភិវឌ្ឍជំនាញជាក់ស្តែងសម្រាប់បង្កើតផលិតផលឌីជីថលដែលមានប្រយោជន៍។",
        },
        {
          date: "បច្ចុប្បន្ន",
          title: "រៀនតាមរយៈការបង្កើត",
          desc: "បន្តរីកចម្រើនតាមរយៈគម្រោងអភិវឌ្ឍន៍គេហទំព័រ ការអនុវត្តកម្មវិធី និងការដោះស្រាយបញ្ហាជាក់ស្តែង។",
        },
      ],
    },
    education: {
      eyebrow: "ការអប់រំ",
      title: "ការអប់រំ",
      school: "Passerelles numériques Cambodia",
      program: "កម្មវិធីអភិវឌ្ឍន៍គេហទំព័រ",
      year: "បានបញ្ចប់",
      skillsLabel: "ជំនាញទទួលបាន",
      skillsList: [
        "រចនាសម្ព័ន្ធទិន្នន័យ និងក្បួនដោះស្រាយ",
        "មូលដ្ឋានគ្រឹះនៃការអភិវឌ្ឍន៍គេហទំព័រ",
        "ប្រព័ន្ធមូលដ្ឋានទិន្នន័យ",
        "គោលការណ៍វិស្វកម្មសូហ្វវែរ",
      ],
      projectsLabel: "គម្រោងទាក់ទងក្នុងកម្មវិធីសិក្សា",
      projectsList: [
        "ប្រព័ន្ធគ្រប់គ្រងសិស្ស (Flask + MySQL)",
        "កម្មវិធីបង្ហាញរចនាសម្ព័ន្ធទិន្នន័យ",
      ],
    },
    certs: {
      eyebrow: "សមិទ្ធផល",
      title: "វិញ្ញាបនបត្រ និងសមិទ្ធផល",
      subtitle: "វគ្គសិក្សា សិក្ខាសាលា និងការទទួលស្គាល់តាមផ្លូវនេះ។",
      items: [
        {
          title: "ការរចនាគេហទំព័រឆ្លើយតប",
          org: "freeCodeCamp",
          year: "2025",
          type: "វិញ្ញាបនបត្រ",
        },
        {
          title: "Python for Everybody",
          org: "University of Michigan (Coursera)",
          year: "2025",
          type: "វិញ្ញាបនបត្រ",
        },
        {
          title: "សិក្ខាសាលាអភិវឌ្ឍន៍គេហទំព័រនៅសាកលវិទ្យាល័យ",
          org: "សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ",
          year: "2026",
          type: "សិក្ខាសាលា",
        },
        {
          title: "ការប្រកួត Hackathon — ជើងឯកលេខ២",
          org: "RUPP Tech Club",
          year: "2026",
          type: "រង្វាន់",
        },
      ],
    },
    github: {
      eyebrow: "សកម្មភាពអ្នកអភិវឌ្ឍន៍",
      title: "នៅលើ GitHub",
      subtitle: "ទិដ្ឋភាពនៃសកម្មភាព open-source របស់ខ្ញុំ — អាចភ្ជាប់ API ផ្ទាល់នៅពេលណាក៏បាន។",
      repos: "Repositories",
      contributions: "ការចូលរួម (ឆ្នាំកន្លងមក)",
      streak: "ថ្ងៃជាប់គ្នាវែងបំផុត",
      topLangsLabel: "បច្ចេកវិទ្យាប្រើច្រើនបំផុត",
      viewProfile: "មើលប្រវត្តិរូប GitHub",
      days: "ថ្ងៃ",
    },
    testimonials: {
      eyebrow: "សក្ខីកម្ម",
      title: "អ្វីដែលអ្នកដទៃនិយាយ",
      items: {
        t1: {
          quote:
            "តារា តែងតែសួរសំណួរត្រឹមត្រូវ និងបំប្លែងមតិកែលម្អទៅជាកូដល្អប្រសើរយ៉ាងលឿន។ សិស្សអភិវឌ្ឍន៍ដែលទុកចិត្តបានពិតប្រាកដ។",
        },
        t2: {
          quote:
            "ឆ្លាត ចង់ដឹងចង់ឃើញ និងងាយធ្វើការជាមួយ។ តារាចាប់យក stack របស់យើងបានលឿន និងបញ្ចេញមុខងារប្រើប្រាស់បានតាំងពីថ្ងៃដំបូង។",
        },
        t3: {
          quote:
            "សមាជិកក្រុមដ៏ល្អ — មានរបៀបរៀបចំ ទំនាក់ទំនងច្បាស់លាស់ និងបញ្ចប់ការងារតាមកិច្ចសន្យា ទាន់ពេលវេលាជានិច្ច។",
        },
      },
    },
    contact: {
      eyebrow: "ទំនាក់ទំនង",
      title: "តោះបង្កើតអ្វីមួយជាមួយគ្នា",
      subtitle: "មានគម្រោង កម្មសិក្សា ឬគ្រាន់តែចង់ជម្រាបសួរ? ប្រអប់សំបុត្ររបស់ខ្ញុំបើកចំហជានិច្ច។",
      formName: "ឈ្មោះ",
      formEmail: "អ៊ីមែល",
      formSubject: "ប្រធានបទ",
      formMessage: "សារ",
      formSend: "ផ្ញើសារ",
      formSending: "កំពុងផ្ញើ...",
      formSuccess: "អរគុណ! សាររបស់អ្នកត្រូវបានកត់ត្រា ខ្ញុំនឹងឆ្លើយតបវិញឆាប់ៗនេះ។",
      formError: "មានបញ្ហាកើតឡើង។ សូមព្យាយាមម្តងទៀត ឬផ្ញើអ៊ីមែលមកខ្ញុំដោយផ្ទាល់។",
      connect: "ទំនាក់ទំនង",
      copyEmail: "ចម្លងអ៊ីមែល",
      copied: "បានចម្លង!",
      locationLabel: "មានទីតាំងនៅ",
    },
    footer: {
      tagline: "បង្កើតផលិតផលគេហទំព័រស្អាត និងប្រើប្រាស់បានល្អ — ម្តងមួយគម្រោង។",
      rights: "រក្សាសិទ្ធិគ្រប់យ៉ាង។",
      backToTop: "ត្រឡប់ទៅលើ",
    },
    misc: {
      floatingCta: "តោះធ្វើការជាមួយគ្នា",
      scrollTop: "រំកិលឡើងលើ",
      loading: "កំពុងផ្ទុកផលការងារ",
      notFoundTitle: "404",
      notFoundText: "ទំព័រនេះបានវង្វេង។ តោះត្រឡប់ទៅទំព័រដើមវិញ។",
      notFoundBtn: "ត្រឡប់ទៅទំព័រដើម",
      switchTheme: "ប្តូររបៀបបង្ហាញ",
      switchLang: "ប្តូរភាសា",
      menu: "ម៉ឺនុយ",
      close: "បិទ",
    },
  },
};
