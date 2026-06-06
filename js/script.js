/**
 * SAMY AKRM — PORTFOLIO SCRIPT
 * Vulnerability Analyst & Penetration Tester
 * ──────────────────────────────────────────
 * Features:
 *  • Scroll progress bar
 *  • Sticky navbar (scrolled state)
 *  • Active nav link tracking (IntersectionObserver)
 *  • Mobile drawer open/close
 *  • Scroll reveal animations (IntersectionObserver)
 *  • Certificate lightbox
 *  • Back-to-top button
 *  • Smooth scroll for anchor links
 */

'use strict';

/* ─── Utility ─────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ─── DOM References ──────────────────────── */
const navbar        = $('#navbar');
const navToggle     = $('#nav-toggle');
const mobileDrawer  = $('#mobile-drawer');
const drawerOverlay = $('#drawer-overlay');
const progressBar   = $('#scroll-progress');
const backToTopBtn  = $('#back-to-top');
const lightbox      = $('#lightbox');
const lightboxImg   = $('#lightbox-img');
const lightboxClose = $('#lightbox-close');
const certCards     = $$('.cert-card');
const drawerLinks   = $$('.drawer-link');
const navLinks      = $$('.nav-links a');
const sections      = $$('section[id]');

/* ═══════════════════════════════════════════
   SCROLL PROGRESS BAR
═══════════════════════════════════════════ */
function updateScrollProgress() {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
}

/* ═══════════════════════════════════════════
   NAVBAR — sticky + scrolled state
═══════════════════════════════════════════ */
function updateNavbar() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

/* ═══════════════════════════════════════════
   ACTIVE NAV LINK (IntersectionObserver)
═══════════════════════════════════════════ */
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
);

sections.forEach((sec) => navObserver.observe(sec));

/* ═══════════════════════════════════════════
   BACK TO TOP BUTTON
═══════════════════════════════════════════ */
function updateBackToTop() {
  if (window.scrollY > 500) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ═══════════════════════════════════════════
   MOBILE DRAWER
═══════════════════════════════════════════ */
function openDrawer() {
  mobileDrawer.classList.add('open');
  drawerOverlay.classList.add('active');
  navToggle.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  mobileDrawer.classList.remove('open');
  drawerOverlay.classList.remove('active');
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

navToggle.addEventListener('click', () => {
  const isOpen = mobileDrawer.classList.contains('open');
  isOpen ? closeDrawer() : openDrawer();
});

drawerOverlay.addEventListener('click', closeDrawer);

drawerLinks.forEach((link) => {
  link.addEventListener('click', closeDrawer);
});

/* Close drawer on Escape */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (mobileDrawer.classList.contains('open')) closeDrawer();
    if (lightbox.classList.contains('active'))   closeLightbox();
  }
});

/* ═══════════════════════════════════════════
   SMOOTH SCROLL for anchor links
═══════════════════════════════════════════ */
$$('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const targetId  = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = $(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ═══════════════════════════════════════════
   SCROLL REVEAL (IntersectionObserver)
═══════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
);

$$('.reveal, .reveal-left, .reveal-right').forEach((el) => {
  revealObserver.observe(el);
});

/* ═══════════════════════════════════════════
   CERTIFICATE LIGHTBOX
═══════════════════════════════════════════ */
function openLightbox(imgSrc, altText) {
  lightboxImg.src = imgSrc;
  lightboxImg.alt = altText || 'Certificate';
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImg.src = '';
  document.body.style.overflow = '';
}

certCards.forEach((card) => {
  const imgSrc  = card.getAttribute('data-img');
  const altText = card.querySelector('.cert-name')?.textContent || 'Certificate';

  card.addEventListener('click', () => openLightbox(imgSrc, altText));

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(imgSrc, altText);
    }
  });
});

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

/* ═══════════════════════════════════════════
   UNIFIED SCROLL HANDLER
═══════════════════════════════════════════ */
function onScroll() {
  updateScrollProgress();
  updateNavbar();
  updateBackToTop();
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ─── Init on load ─────────────────────── */
(function init() {
  updateScrollProgress();
  updateNavbar();
  updateBackToTop();

  /* Stagger grid children with delay classes */
  $$('.skills-grid .skill-cat, .certs-grid .cert-card, .projects-grid .project-card')
    .forEach((el, i) => {
      el.classList.add(`d${(i % 6) + 1}`);
    });
})();
