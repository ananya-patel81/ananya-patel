/* =====================================================
   ANANYA PATEL PORTFOLIO — script.js
   Handles: nav, scroll animations, carousel,
   expand/collapse, project modals, leadership modals,
   scroll arrows. Light theme only.
   ===================================================== */

/* ──────────────────────────────────────────
   1. LUCIDE ICONS — initialise after DOM load
   ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();

  initNav();
  initScrollAnimations();
  initCarousel();
  initExpandable();
  initProjectModals();
  initLeadershipModals();
  initScrollArrows();
  initActiveNavLinks();
});

/* ──────────────────────────────────────────
   3. NAVIGATION — hamburger toggle
   ────────────────────────────────────────── */
function initNav() {
  const hamburger = document.getElementById('navHamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a link is clicked (mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ──────────────────────────────────────────
   4. ACTIVE NAV LINK on scroll
   ────────────────────────────────────────── */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ──────────────────────────────────────────
   5. FADE-IN ON SCROLL
   ────────────────────────────────────────── */
function initScrollAnimations() {
  const targets = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
}

/* ──────────────────────────────────────────
   6. IMAGE CAROUSEL (Achievements)
   ────────────────────────────────────────── */
function initCarousel() {
  const track  = document.getElementById('carouselTrack');
  const prev   = document.getElementById('carouselPrev');
  const next   = document.getElementById('carouselNext');
  const dotsWrap = document.getElementById('carouselDots');

  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  let current  = 0;
  const total  = slides.length;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));

  // Keyboard support
  [prev, next].forEach(btn => {
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') btn.click();
    });
  });

  // Auto-advance every 4 s (pause on hover)
  let timer = setInterval(() => goTo(current + 1), 4000);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(timer));
  track.parentElement.addEventListener('mouseleave', () => {
    timer = setInterval(() => goTo(current + 1), 4000);
  });
}

/* ──────────────────────────────────────────
   7. EXPANDABLE SECTIONS (Experience)
   ────────────────────────────────────────── */
function initExpandable() {
  document.querySelectorAll('.expand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('aria-controls');
      const content  = document.getElementById(targetId);
      const expanded = btn.getAttribute('aria-expanded') === 'true';

      btn.setAttribute('aria-expanded', String(!expanded));
      if (expanded) {
        content.hidden = true;
      } else {
        content.hidden = false;
      }
      // Re-render icons inside newly visible content
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  });
}

/* ──────────────────────────────────────────
   8. HORIZONTAL SCROLL ARROWS (Projects)
   ────────────────────────────────────────── */
function initScrollArrows() {
  const scrollEl = document.getElementById('projectsScroll');
  const btnLeft  = document.getElementById('scrollLeft');
  const btnRight = document.getElementById('scrollRight');

  if (!scrollEl) return;

  const STEP = 320;

  btnLeft.addEventListener('click', () => {
    scrollEl.scrollBy({ left: -STEP, behavior: 'smooth' });
  });

  btnRight.addEventListener('click', () => {
    scrollEl.scrollBy({ left: STEP, behavior: 'smooth' });
  });

  // Show/hide arrows based on scroll position
  function updateArrows() {
    btnLeft.style.opacity  = scrollEl.scrollLeft > 10 ? '1' : '0.3';
    btnRight.style.opacity = scrollEl.scrollLeft < scrollEl.scrollWidth - scrollEl.clientWidth - 10 ? '1' : '0.3';
  }

  scrollEl.addEventListener('scroll', updateArrows, { passive: true });
  updateArrows();
}

/* ──────────────────────────────────────────
   9. PROJECT DATA
   ────────────────────────────────────────── */
const projectData = [
  {
    title: 'Enterprise Knowledge Assistant',
    duration: 'May 2026 – Present',
    type: 'Independent Technical Project',
    advisor: null,
    stack: ['Python', 'RAG', 'FAISS', 'Sentence Transformers', 'LLM'],
    overview: 'An AI-powered Enterprise Knowledge Assistant leveraging Retrieval-Augmented Generation (RAG), 384-dimensional semantic embeddings, and FAISS vector indexing to deliver source-grounded question answering over organizational knowledge repositories.',
    contributions: [
      'Engineered and deployed the full RAG pipeline with semantic chunking, embedding generation, and FAISS vector indexing for sub-millisecond retrieval.',
      'Implemented high-performance vector retrieval using 384-dimensional embeddings, achieving sub-millisecond search latency while supporting scalable knowledge discovery across unstructured document collections.',
    ],
    link: 'https://github.com/ananya-patel81/enterprise-knowledge-assistant',
    linkLabel: 'GitHub Repository',
  },
  {
    title: 'Game Theory & Probability Research Project',
    duration: 'Dec 2025 – April 2026',
    type: 'Research Project',
    advisor: 'Prof. Jyothi Krishnan, IIT Gandhinagar (CCL)',
    stack: ['Python', 'Probabilistic Simulation', 'Game Theory', 'RL-inspired Methods'],
    overview: 'Modeled strategic decision-making under uncertainty for the dice game Farkle using probabilistic simulations and game theory frameworks at the Creative Learning Academic Lab (CCL, IITGN).',
    contributions: [
      'Designed and evaluated optimal play strategies across stochastic environments, validating theoretical mathematical models against empirical game data.',
      'Drew inspiration from Reinforcement Learning ideas to evaluate policy performance across varying risk thresholds and game states.',
    ],
    link: 'https://ccl.iitgn.ac.in/',
    linkLabel: 'CCL, IITGN',
  },
  {
    title: 'Smart Rent Prediction System',
    duration: 'Jan 2026 – Apr 2026',
    type: 'Course Project — Software Tools & Techniques for AI',
    advisor: null,
    stack: ['Python', 'Scikit-learn', 'Random Forest', 'Optuna', 'Docker', 'Streamlit', 'Hugging Face'],
    overview: 'Optimized a Random Forest regression pipeline for dynamic house rent prediction, securing 91% prediction accuracy (MAE of ₹12,479) by replacing a high-compute GridSearch with an intelligent cross-validated Optuna Bayesian Optimization framework.',
    contributions: [
      'Replaced GridSearch with Optuna Bayesian HPO, dramatically reducing hyperparameter tuning time while improving model accuracy to MAE ₹12,479.',
      'Architected a repeatable MLOps deployment pipeline by containerizing the full application runtime with Docker, eliminating environment version conflicts during deployment of a real-time Streamlit inference app to Hugging Face.',
    ],
    link: 'https://github.com/ananya-patel81/sttai-assignment4-submission',
    linkLabel: 'GitHub Repository',
  },
  {
    title: 'Smart Game Engines using C++',
    duration: 'Aug 2025 – Nov 2025',
    type: 'Course Project',
    advisor: 'Prof. Balagopal Komarath, IIT Gandhinagar',
    stack: ['C++', 'OOP', 'Data Structures', 'MiniMax', 'Alpha-Beta Pruning'],
    overview: 'Developed intelligent terminal-based game engines for Connect4, Sudoku, and Tic-Tac-Toe in C++, leveraging object-oriented programming and core data structures to manage dynamic game states.',
    contributions: [
      'Implemented the MiniMax decision algorithm with Alpha-Beta pruning for optimal adversarial move computation under latency constraints.',
      'Designed modular OOP architecture with game-tree evaluation and state-space graph search, enabling clean extension to new game types.',
    ],
    link: 'https://github.com/ananya-patel81/Smart-game-engine/tree/main',
    linkLabel: 'GitHub Repository',
  },
  {
    title: 'OpenCV Virtual Mouse Using Hand Gestures',
    duration: 'Jan 2026 – Feb 2026',
    type: 'Independent Technical Project',
    advisor: null,
    stack: ['Python', 'OpenCV', 'MediaPipe', 'Computer Vision'],
    overview: 'Developed a hands-free computer interface for sterile or public kiosk environments, achieving a smooth 30 FPS processing rate by optimizing an OpenCV video pipeline to translate hand gestures into real-time cursor actions.',
    contributions: [
      'Optimized the OpenCV video capture and processing pipeline to maintain 30 FPS without frame drops.',
      'Used MediaPipe hand landmark detection to map finger positions to cursor coordinates, click, and scroll events in real time.',
    ],
    link: 'https://github.com/ananya-patel81/ai_virtual_mouse',
    linkLabel: 'GitHub Repository',
  },
  {
    title: 'Business Data Analytics Project',
    duration: 'Dec 2024 – Feb 2025',
    type: 'Industry Project — Finlatics',
    advisor: null,
    stack: ['Python', 'Pandas', 'Matplotlib', 'Seaborn', 'EDA'],
    overview: 'Analyzed a real-time banking marketing dataset with 45,000+ records using Python libraries to study demographic, behavioral, and campaign-related factors influencing term deposit subscription outcomes.',
    contributions: [
      'Conducted end-to-end exploratory data analysis on 45K+ customer records, identifying key behavioral segments most likely to subscribe to term deposits.',
      'Derived actionable insights on customer segmentation and campaign effectiveness; work earned a Letter of Recommendation from Finlatics.',
    ],
    link: 'https://github.com/ananya-patel81/Business-Data-Analytics-Project-Finlatics',
    linkLabel: 'GitHub Repository',
  },
  {
    title: 'Arduino Dual-Axis Solar Tracker',
    duration: 'Jan 2025 – Feb 2025',
    type: 'Course Project',
    advisor: 'Prof. Arup Lal Chakraborty, IIT Gandhinagar',
    stack: ['Arduino', 'C', 'LDR Sensors', 'Servo Motors', 'Embedded Systems'],
    overview: 'Designed an Arduino-based solar tracking system using LDR sensors and control logic for dynamic orientation, improving solar energy capture efficiency compared to static panel setups under real-world testing conditions.',
    contributions: [
      'Implemented dual-axis control logic using light-dependent resistor (LDR) sensor differentials to orient the solar panel toward maximum irradiance.',
      'Validated energy capture improvements against a static panel baseline under real outdoor lighting conditions.',
    ],
    link: 'https://github.com/ananya-patel81/Dual-Axis-Solar-Tracker-Arduino',
    linkLabel: 'GitHub Repository',
  },
];

/* ──────────────────────────────────────────
   10. PROJECT MODALS
   ────────────────────────────────────────── */
function initProjectModals() {
  const modal     = document.getElementById('projectModal');
  const closeBtn  = document.getElementById('modalClose');
  const modalBody = document.getElementById('modalBody');

  // Open modal on "View Details" click
  document.querySelectorAll('.btn-proj-detail').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx  = parseInt(btn.getAttribute('data-project'), 10);
      const data = projectData[idx];
      if (!data) return;

      modalBody.innerHTML = buildProjectModalHTML(data);
      openModal(modal);
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  });

  closeBtn.addEventListener('click', () => closeModal(modal));
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(modal); });

  // Keyboard: Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) closeModal(modal);
  });
}

function buildProjectModalHTML(d) {
  const stackTags = d.stack.map(s => `<span>${s}</span>`).join('');
  const bullets   = d.contributions.map(c => `<li>${c}</li>`).join('');
  const advisor   = d.advisor ? `<p class="modal-section-label">Advisor</p><p>${d.advisor}</p>` : '';

  return `
    <h2 id="modalTitle">${d.title}</h2>
    <div class="modal-meta">
      <span>${d.type}</span>
      <span>${d.duration}</span>
    </div>
    ${advisor}
    <p class="modal-section-label">Tech Stack</p>
    <div class="modal-tags">${stackTags}</div>
    <p class="modal-section-label">Overview</p>
    <p>${d.overview}</p>
    <p class="modal-section-label">Key Contributions</p>
    <ul class="modal-contrib-list">${bullets}</ul>
    <a href="${d.link}" target="_blank" rel="noopener" class="modal-link">
      <i data-lucide="external-link"></i> ${d.linkLabel}
    </a>
  `;
}

/* ──────────────────────────────────────────
   11. LEADERSHIP DATA
   ────────────────────────────────────────── */
const leadershipData = [
  {
    title: 'Blithchron PR Coordinator',
    org: 'Blithchron — Annual Cultural Fest, IIT Gandhinagar',
    duration: 'May 2025 – March 2026',
    summary: `Led a team of 70+ undergraduate and postgraduate students to orchestrate Blithchron '26, driving a 2× increase in flagship marathon participation to 3,000+ runners while managing end-to-end logistics and vendor budgets for the largest student-run college cultural festival of Gujarat.`,
    details: [
      'Led a cross-functional team of 70+ students across PR, logistics, vendor management, and outreach.',
      'Drove organic marketing and brand campaigns that doubled event reach compared to previous editions.',
      'Managed marathon logistics scaling attendance from ~1,500 to 3,000+ runners.',
      'Operated under strict promotional compliance while maximizing visibility through targeted campus activities.',
    ],
  },
  {
    title: 'Student Guide',
    org: 'IIT Gandhinagar — Faculty-Led Initiative',
    duration: 'May 2026 – Present',
    summary: 'Part of a faculty-led initiative aimed at providing holistic support to students in all domains of college life.',
    details: [
      'Mentored first-year students, offering guidance on coursework, campus life, and emotional well-being.',
      'Promoted a positive and inclusive environment in both academic and non-academic settings.',
      'Acted as a consistent point of contact for new students navigating the transition to IIT life.',
    ],
  },
  {
    title: 'Course Mentor — Product Design & Prototyping',
    org: 'IIT Gandhinagar',
    duration: 'Aug 2025 – Nov 2025',
    summary: 'Mentored 60+ undergraduate students on end-to-end product development under faculty supervision.',
    details: [
      'Guided students through prototyping, design thinking, innovation workflows, and procurement processes.',
      'Evaluated assignments and provided structured feedback to improve product quality and presentation.',
      'Acted as a liaison between faculty and students through doubt-solving sessions and academic support.',
    ],
  },
];

/* ──────────────────────────────────────────
   12. LEADERSHIP MODALS
   ────────────────────────────────────────── */
function initLeadershipModals() {
  const modal     = document.getElementById('leadershipModal');
  const closeBtn  = document.getElementById('leaderModalClose');
  const modalBody = document.getElementById('leaderModalBody');

  document.querySelectorAll('.btn-leadership-detail').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx  = parseInt(btn.getAttribute('data-leadership'), 10);
      const data = leadershipData[idx];
      if (!data) return;

      modalBody.innerHTML = buildLeadershipModalHTML(data);
      openModal(modal);
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  });

  closeBtn.addEventListener('click', () => closeModal(modal));
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(modal); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) closeModal(modal);
  });
}

function buildLeadershipModalHTML(d) {
  const bullets = d.details.map(c => `<li>${c}</li>`).join('');

  return `
    <h2 id="leaderModalTitle">${d.title}</h2>
    <div class="modal-meta">
      <span>${d.org}</span>
      <span>${d.duration}</span>
    </div>
    <p class="modal-section-label">Summary</p>
    <p>${d.summary}</p>
    <p class="modal-section-label">Responsibilities</p>
    <ul class="modal-contrib-list">${bullets}</ul>
  `;
}

/* ──────────────────────────────────────────
   13. MODAL HELPERS
   ────────────────────────────────────────── */
function openModal(modal) {
  modal.hidden = false;
  document.body.style.overflow = 'hidden';

  // Focus the close button for accessibility
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) setTimeout(() => closeBtn.focus(), 50);

  // Trap focus inside modal
  modal.addEventListener('keydown', trapFocus);
}

function closeModal(modal) {
  modal.hidden = true;
  document.body.style.overflow = '';
  modal.removeEventListener('keydown', trapFocus);
}

function trapFocus(e) {
  if (e.key !== 'Tab') return;
  const focusable = Array.from(
    e.currentTarget.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')
  ).filter(el => !el.disabled);

  if (!focusable.length) return;

  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) { e.preventDefault(); last.focus(); }
  } else {
    if (document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
}
