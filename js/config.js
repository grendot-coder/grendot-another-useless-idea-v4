window.PORTFOLIO_CONFIG = {

  meta: {
    title: "Grendy Agusti — Frontend & Fullstack Developer",
    description: "Windows 3.1 Retro Portfolio of Grendy Agusti, a frontend & fullstack developer building thoughtful, interactive, and high-performance web experiences.",
    favicon: "img/favicon-32x32.png"
  },


  images: {
    logoMark: "img/window.png",     
    startLogo: "img/window.png",                  
    heroPortrait: "img/rupa.png",   
    icons: {
      about: "img/note.png",
      projects: "img/folder.png",  
      rupa: "img/ace.png",      
      skills: "img/cpl.png",    
      contact: "img/mail.png"    
    }
  },


  about: {
    title: "Notepad - ABOUT_ME.TXT",
    name: "GRENDY ARVEL PUTRA AGUSTI",
    role: "Frontend & Fullstack Developer · Balitar, ID",
    bio1: "Welcome to my retro desktop! I build (not so)responsive web applications, creative interactive interfaces, and (not so)clean backends. Im trying to be better tho.",
    bio2: "I like trying new thing i just discovered, albeit massively helped by AI(Thanks Agy).",
    quickNavHint: "Quick Navigation:\n• Check out Projects (File Manager)\n• Launch RUPA.EXE for the animated ASCII art\n• Send an email via Mail_Me",
    buttonLabel: "Explore Projects >>"
  },


  stickyNote: {
    en: {
      heading: "Quick Guide",
      intro: "Welcome! This site is my portofolio that is heavily inspired by <strong>Windows 3.1</strong> desktop environment:",
      items: [
        "<strong>Single-Click:</strong> Click any desktop icon or window button to launch it.",
        "<strong>Move & Organize Note:</strong> Drag the note by its top bar.",
        "<strong>Start Menu:</strong> Access all shortcuts from the bottom-left <em>Start</em> button.",
      ],
      tip: "Tip: Drag this note anywhere by its top bar!"
    },
    id: {
      heading: "Panduan Pengunjung",
      intro: "Sugeng Rawuh! Ini Web Portofolio saya yang sangat inspired-by tampilan dekstop<strong>Windows 3.1</strong> :",
      items: [
        "<strong>Klik Sekali:</strong> Klik ikon desktop atau menu untuk membuka aplikasi.",
        "<strong>Geser Notes:</strong> Tahan & geser bar judul diatas untuk memindahkan note ini.",
        "<strong>Menu Start:</strong> Akses shortcuts seluruh menu dari tombol <em>Start</em> di kiri bawah.",
      ],
      tip: "Tips: Note ini bisa digeser dengan cara drag bagian atas!"
    }
  },


  projects: [
    {
      id: "p1",
      title: "RPL 2 Class Website (2026)",
      category: "WEB_APPS",
      description: "A class portal designed and worked by 12 unemployed students with custom CSS Grid and responsive showcases.",
      tech: ["JavaScript", "CSS Grid", "Responsive"],
      image: "img/web.png",
      link: "https://xirpl2smkbrantas-website.vercel.app/",
      linkLabel: "Launch App ↗"
    },
    {
      id: "p2",
      title: "Andari Bouquet Shop (2026)",
      category: "ECOMMERCE",
      description: "An e-commerce landing page crafted for my mom, a local florist with product browsing and direct ordering. (Early Dev)",
      tech: ["JavaScript", "Modern CSS", "UI/UX"],
      image: "img/buket.png",
      link: "#",
      linkLabel: "View Catalog ↗"
    },
    {
      id: "p3",
      title: "Toge Productions Showcase (2026)",
      category: "SHOWCASES",
      description: "A game studio landing showcase highlighting releases and multimedia assets.",
      tech: ["HTML5", "CSS3", "Typography"],
      image: "img/landing.png",
      link: "https://drive.google.com/drive/folders/1WA-0xtVuj2vODOM_cZhSO9rmrPRsxZuY?usp=drive_link",
      linkLabel: "View Drive ↗"
    }
  ],

  /* ---------------------------------------------------------------------
     SKILLS & KNOWLEDGE (CONTROL PANEL: SKILLS.CPL)
     No progress bars or arbitrary percentages — clean categorical tags & principles.
  --------------------------------------------------------------------- */
  skills: {
    windowTitle: "Control Panel - Knowledge",
    categories: [
      {
        name: "Frontend Development",
        tags: ["HTML5 (Semantic)", "CSS3 & Modern Layout", "JavaScript (ES6+)", "Canvas API"]
      },
      {
        name: "Backend & Systems",
        tags: ["PHP", "Authentication & CRUD"]
      },
      {
        name: "Tools & Workflow",
        tags: ["Git & GitHub", "Vercel Deployment", "VS Code", "AI-Assisted Engineering", "Performance Optimization"]
      }
    ],
    principlesTitle: "Development Principles:",
    principles: [
      "Doing my best trying to optimize",
      "Focus on usability",
      "Creative multimedia & interactive graphic experiences",
      "Learning and Trying everything i just discovered",
      "Making things as I like it, but i can make one up to your liking"
    ],
    statusInfo: {
      ram: "16 MB Installed",
      mode: "Win3.1 Enhanced Mode"
    }
  },

  /* ---------------------------------------------------------------------
     CONTACT & SOCIAL (MAIL ME)
  --------------------------------------------------------------------- */
  contact: {
    windowTitle: "MAIL ME",
    recipientEmail: "grendy.xpplg2@gmail.com",
    formAction: "https://formspree.io/f/mjgnjbkr",
    fields: {
      toLabel: "To:",
      nameLabel: "Your Name:",
      emailLabel: "Your Email:",
      messageLabel: "Message:",
      submitLabel: "Send Message",
      cancelLabel: "Cancel"
    },
    socialLinks: [
      { label: "@grendot-coder", url: "https://github.com/grendot-coder" }
    ]
  }
};
