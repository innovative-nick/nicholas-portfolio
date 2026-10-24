import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const root = document.documentElement;
const EASE = 'power3.out';

/* ---------- Header: hide on scroll down, show on scroll up ---------- */
const header = $('[data-header]');
let lastY = window.scrollY;
let ticking = false;
function onScroll() {
  const y = window.scrollY;
  header.classList.toggle('is-scrolled', y > 20);
  if (!document.body.classList.contains('menu-open')) {
    if (y > lastY + 4 && y > 160) header.classList.add('is-hidden');
    else if (y < lastY - 4 || y < 160) header.classList.remove('is-hidden');
  }
  lastY = y;
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();

/* ---------- Mobile menu ---------- */
const menu = $('[data-menu]');
const menuBtn = $('[data-menu-btn]');
function setMenu(open) {
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.classList.toggle('menu-open', open);
  if (open) {
    menu.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
  } else {
    menu.classList.remove('is-open');
    setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 600);
  }
}
menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
$$('[data-menu-link]').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.body.classList.contains('menu-open')) { setMenu(false); menuBtn.focus(); }
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 1024 && document.body.classList.contains('menu-open')) setMenu(false);
});

/* ---------- Animations ---------- */
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  root.classList.add('anim-ready');

  // Page fade-in
  gsap.from('main', { opacity: 0, duration: 0.3, ease: 'none' });

  /* Hero intro sequence */
  const hero = gsap.timeline({ defaults: { ease: EASE }, delay: 0.1 });
  hero
    .to('.hero__hi', { opacity: 1, duration: 0.6 })
    .to('[data-hero-line]', { y: 0, duration: 1, stagger: 0.12, ease: 'power4.out' }, '-=0.35')
    .fromTo('[data-portrait]', { opacity: 0, y: 40, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, clearProps: 'filter' }, '-=0.7')
    .fromTo('.hero [data-hero]:not(.hero__hi)', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, '-=0.6');

  // Bobbing scroll arrow
  gsap.to('[data-bob]', { y: 8, duration: 1.4, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1.8 });

  // Portrait parallax
  gsap.to('[data-portrait] picture', {
    yPercent: -8, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  /* Generic reveals */
  $$('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 30, opacity: 0, duration: 0.9, ease: EASE,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  /* Stats: border draw + count-up */
  const stats = $('[data-stats]');
  if (stats) {
    gsap.from(stats, {
      clipPath: 'inset(0 100% 0 0)', duration: 0.9, ease: 'power2.inOut',
      scrollTrigger: { trigger: stats, start: 'top 90%', once: true },
    });
    $$('[data-count]', stats).forEach((el) => {
      const raw = el.dataset.count;
      const n = parseFloat(raw);
      if (Number.isNaN(n)) return;
      const suffix = raw.replace(/^[\d.]+/, '');
      const obj = { v: 0 };
      el.textContent = '0' + suffix;
      gsap.to(obj, {
        v: n, duration: 1.2, ease: 'power2.out', delay: 0.3,
        onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; },
        scrollTrigger: { trigger: stats, start: 'top 90%', once: true },
      });
    });
  }

  /* About: heading slide, arrow spin, word-by-word lead */
  gsap.from('[data-about-head] .display', {
    x: -60, opacity: 0, duration: 1, ease: EASE,
    scrollTrigger: { trigger: '#about', start: 'top 80%', once: true },
  });
  gsap.from('[data-about-arrow]', {
    rotate: -180, opacity: 0, duration: 1, ease: EASE, delay: 0.2,
    scrollTrigger: { trigger: '#about', start: 'top 80%', once: true },
  });
  const words = $$('[data-words] .w');
  if (words.length) {
    gsap.fromTo(words, { opacity: 0.15 }, {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: '[data-words]', start: 'top 85%', end: 'bottom 45%', scrub: true },
    });
  }

  /* Services rows from the right */
  gsap.from('[data-services] .svc', {
    x: 60, opacity: 0, duration: 0.9, stagger: 0.1, ease: EASE,
    scrollTrigger: { trigger: '[data-services]', start: 'top 85%', once: true },
  });

  /* Skills cards: fly in and settle */
  $$('[data-sk]').forEach((card, i) => {
    const r = parseFloat(getComputedStyle(card).getPropertyValue('--r')) || 0;
    gsap.from(card, {
      y: 120, opacity: 0, rotation: r * -4, duration: 1.1, ease: 'back.out(1.4)', delay: i * 0.12,
      scrollTrigger: { trigger: '[data-skills]', start: 'top 85%', once: true },
    });
  });

  /* Work cards: reveal + image settle */
  $$('[data-proj]').forEach((card) => {
    const img = $('[data-proj-img]', card);
    const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 90%', once: true } });
    tl.from(card, { y: 40, opacity: 0, duration: 0.9, ease: EASE });
    if (img) tl.from(img, { scale: 1.12, duration: 1.3, ease: EASE, clearProps: 'transform' }, 0);
  });

  /* Figma collage slides sideways while scrolling */
  const figImg = $('[data-figma-img]');
  if (figImg) {
    gsap.fromTo(figImg, { scale: 1.12, xPercent: -4 }, {
      xPercent: 4, ease: 'none',
      scrollTrigger: { trigger: figImg, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  }

  /* "Let's Talk" lines */
  gsap.to('[data-talk-line]', {
    y: 0, duration: 1, stagger: 0.12, ease: 'power4.out',
    scrollTrigger: { trigger: '[data-contact]', start: 'top 75%', once: true },
  });

  /* Page background turns black approaching the contact section */
  gsap.fromTo(document.body, { backgroundColor: '#ffffff' }, {
    backgroundColor: '#111111', ease: 'none',
    scrollTrigger: { trigger: '[data-contact]', start: 'top 95%', end: 'top 45%', scrub: true },
  });

  return () => { root.classList.remove('anim-ready'); };
});

/* Desktop-only extras */
mm.add('(prefers-reduced-motion: no-preference) and (hover: hover) and (min-width: 1025px)', () => {
  // Skill cards sway slightly as you scroll past
  $$('[data-sway]').forEach((el, i) => {
    gsap.fromTo(el, { rotation: i % 2 ? -1.5 : 1.5 }, {
      rotation: i % 2 ? 1.5 : -1.5, ease: 'none',
      scrollTrigger: { trigger: '[data-skills]', start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  // "VIEW" cursor label over project images
  const dot = $('[data-cursor-dot]');
  if (!dot) return;
  const xTo = gsap.quickTo(dot, 'x', { duration: 0.35, ease: 'power3' });
  const yTo = gsap.quickTo(dot, 'y', { duration: 0.35, ease: 'power3' });
  const move = (e) => { xTo(e.clientX); yTo(e.clientY); };
  window.addEventListener('mousemove', move);
  const targets = $$('[data-cursor]');
  const show = () => gsap.to(dot, { scale: 1, opacity: 1, duration: 0.3, ease: EASE });
  const hide = () => gsap.to(dot, { scale: 0, opacity: 0, duration: 0.25, ease: 'power2.in' });
  targets.forEach((t) => { t.addEventListener('mouseenter', show); t.addEventListener('mouseleave', hide); });
  return () => {
    window.removeEventListener('mousemove', move);
    targets.forEach((t) => { t.removeEventListener('mouseenter', show); t.removeEventListener('mouseleave', hide); });
  };
});

// Recalculate trigger positions once fonts and images have loaded
window.addEventListener('load', () => ScrollTrigger.refresh());
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
