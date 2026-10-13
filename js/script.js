const menuBtn = document.getElementById('menuBtn'), nav = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.classList.toggle('active', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuBtn.classList.remove('active');
  menuBtn.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
const conditions = document.querySelector('#conditions');
if (conditions) {
  const barObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar span').forEach(bar => bar.style.width = bar.dataset.width);
      barObserver.unobserve(entry.target);
    }
  }), { threshold: .2 });
  barObserver.observe(conditions);
}
new Swiper('.reviews-swiper', {
  slidesPerView: 1.2,
  spaceBetween: 12,
  slidesPerGroup: 1,
  navigation: { prevEl: '#reviewPrev', nextEl: '#reviewNext' },
  breakpoints: {
    640: { slidesPerView: 2, spaceBetween: 16 },
    1024: { slidesPerView: 3, spaceBetween: 16 }
  }
});

const toTop = document.getElementById('toTop');
if (toTop) {
  const toggleToTop = () => toTop.classList.toggle('show', window.scrollY > 500);
  toggleToTop();
  window.addEventListener('scroll', toggleToTop, { passive: true });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

const siteNav = document.querySelector('.nav');
if (siteNav) {
  const toggleNav = () => siteNav.classList.toggle('is-stuck', window.scrollY > 10);
  toggleNav();
  window.addEventListener('scroll', toggleNav, { passive: true });
}

const spyLinks = [...document.querySelectorAll('.nav-links a:not(.nav-cta)[href^="#"]')];
const spyTargets = spyLinks
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);
if (spyTargets.length) {
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = '#' + entry.target.id;
      spyLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  spyTargets.forEach(t => spy.observe(t));
}

const socialDock = document.getElementById('socialDock');
const socialToggle = document.getElementById('socialToggle');
if (socialDock && socialToggle) {
  socialToggle.addEventListener('click', () => {
    const open = socialDock.classList.toggle('is-open');
    socialToggle.setAttribute('aria-expanded', String(open));
    socialToggle.setAttribute('aria-label', open ? 'Скрыть соцсети' : 'Показать соцсети');
  });
}

const modalMap = { online: 'onlineModal', offline: 'offlineModal' };
const modals = Object.values(modalMap).map(id => document.getElementById(id)).filter(Boolean);
if (modals.length) {
  const openModal = modal => {
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('is-open'));
    document.body.classList.add('modal-lock');
  };
  const closeModal = modal => {
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-lock');
    const hide = () => { if (!modal.classList.contains('is-open')) modal.hidden = true; };
    modal.addEventListener('transitionend', hide, { once: true });
    setTimeout(hide, 560);
  };
  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const modal = document.getElementById(modalMap[btn.dataset.modalOpen]);
      if (!modal) return;
      modals.forEach(m => { if (m !== modal && m.classList.contains('is-open')) closeModal(m); });
      openModal(modal);
    });
  });
  modals.forEach(modal => {
    modal.querySelectorAll('[data-modal-close]').forEach(el => el.addEventListener('click', () => closeModal(modal)));
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const open = modals.find(m => m.classList.contains('is-open'));
    if (open) closeModal(open);
  });
}

const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');
if (cookieBanner && cookieAccept) {
  if (sessionStorage.getItem('cookiesAccepted') !== '1') {
    setTimeout(() => cookieBanner.classList.add('is-shown'), 400);
    cookieAccept.addEventListener('click', () => {
      sessionStorage.setItem('cookiesAccepted', '1');
      cookieBanner.classList.remove('is-shown');
    });
  }
}
