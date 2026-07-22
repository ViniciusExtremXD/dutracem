/* ============================================
   DUTRA 100 — Main JavaScript v4
   Motion Design & Premium Interaction Details
   ============================================ */

'use strict';

/* ============================================
   SMOOTH SCROLL TO TOP ON PAGE LOAD/REFRESH
   ============================================ */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
  if (window.scrollY > 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

document.addEventListener('DOMContentLoaded', () => {

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ============================================
     HERO CAROUSEL — Ken Burns & Progress Track
     ============================================ */
  const slides      = $$('.hero-slide');
  const indicators  = $$('.hero-indicator');
  const arrowLeft   = $('.hero-arrow-left');
  const arrowRight  = $('.hero-arrow-right');
  const progress    = $('.hero-progress');
  const counter     = $('.hero-slide-counter');

  let current = 0;
  let heroTimer;
  const DELAY = 6000;

  function setSlide(idx) {
    if (!slides.length) return;
    slides[current].classList.remove('active');
    if (indicators[current]) indicators[current].classList.remove('active');

    current = ((idx % slides.length) + slides.length) % slides.length;

    slides[current].classList.add('active');
    if (indicators[current]) indicators[current].classList.add('active');

    if (counter) counter.textContent = `0${current + 1} / 0${slides.length}`;

    if (progress) {
      progress.classList.remove('running');
      progress.style.transition = 'none';
      progress.style.width = '0%';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          progress.style.transition = `width ${DELAY}ms linear`;
          progress.classList.add('running');
        });
      });
    }
  }

  function advance() { setSlide(current + 1); }

  function startTimer() {
    clearInterval(heroTimer);
    heroTimer = setInterval(advance, DELAY);
  }

  function resetTimer() { startTimer(); }

  if (slides.length) {
    setSlide(0);
    startTimer();

    if (arrowLeft)  arrowLeft.addEventListener('click',  () => { setSlide(current - 1); resetTimer(); });
    if (arrowRight) arrowRight.addEventListener('click', () => { setSlide(current + 1); resetTimer(); });

    indicators.forEach((ind, i) => {
      ind.addEventListener('click', () => { setSlide(i); resetTimer(); });
    });
  }

  /* ============================================
     STICKY HEADER
     ============================================ */
  const header = $('.header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================================
     MOBILE MENU
     ============================================ */
  const toggle  = $('.mobile-toggle');
  const navMenu = $('.nav-menu');
  const overlay = $('.mobile-overlay');

  function closeMenu() {
    navMenu?.classList.remove('open');
    toggle?.classList.remove('open');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggle?.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    toggle.classList.toggle('open', open);
    overlay?.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  overlay?.addEventListener('click', closeMenu);
  $$('.nav-menu a').forEach(a => a.addEventListener('click', closeMenu));

  /* ============================================
     UNIVERSAL SCROLL REVEAL — Enhanced Motion
     ============================================ */
  const revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger';
  const revealEls = $$(revealSelectors);

  if (revealEls.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('visible');

          /* Stagger direct children with increasing delays */
          if (el.classList.contains('stagger')) {
            [...el.children].forEach((child, i) => {
              child.style.transitionDelay = `${i * 90}ms`;
              child.classList.add('visible');
            });
          }

          obs.unobserve(el);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => obs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ============================================
     SERVICE ITEMS — Stagger on reveal
     ============================================ */
  const svcList = $('.services-list');
  if (svcList && 'IntersectionObserver' in window) {
    const svcObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        $$('.svc-item').forEach((item, i) => {
          setTimeout(() => item.classList.add('visible'), i * 100);
        });
        svcObs.unobserve(entry.target);
      });
    }, { threshold: 0.1 });
    svcObs.observe(svcList);
  }

  /* ============================================
     ANIMATED COUNTERS (Quartic Easing)
     ============================================ */
  const counters = $$('.counter');
  if (counters.length && 'IntersectionObserver' in window) {
    const countObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.target;
        const dur = 2000;
        let start = null;

        function step(ts) {
          if (!start) start = ts;
          const pct = Math.min((ts - start) / dur, 1);
          const eased = 1 - Math.pow(1 - pct, 4);
          el.textContent = Math.floor(eased * target).toLocaleString('pt-BR');
          if (pct < 1) requestAnimationFrame(step);
          else el.textContent = target.toLocaleString('pt-BR');
        }

        requestAnimationFrame(step);
        countObs.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => countObs.observe(el));
  }

  /* ============================================
     FAQ ACCORDION
     ============================================ */
  $$('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const body = item.querySelector('.faq-body');
    if (!q || !body) return;

    q.addEventListener('click', () => {
      const wasActive = item.classList.contains('active');

      $$('.faq-item').forEach(it => {
        it.classList.remove('active');
        const b = it.querySelector('.faq-body');
        if (b) b.style.maxHeight = '0';
      });

      if (!wasActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ============================================
     SMOOTH SCROLL FOR CTA
     ============================================ */
  $$('a[href="#contato"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = $('#contato');
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ============================================
     PRODUCTS — Mouse-following glow on cards
     ============================================ */
  $$('.prod-card, .project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--y', `${e.clientY - rect.top}px`);
    });
  });




  /* ============================================
     ACTIVE NAV LINK ON SCROLL
     ============================================ */
  const sections = $$('section[id]');
  const navLinks = $$('.nav-menu a[href^="#"]');

  if (sections.length) {
    window.addEventListener('scroll', () => {
      let active = '';
      sections.forEach(sec => {
        if (scrollY >= sec.offsetTop - 150) active = sec.id;
      });
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + active);
      });
    }, { passive: true });
  }

  /* ============================================
     MAGNETIC BUTTONS
     ============================================ */
  $$('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      btn.style.transform = `translate(${x * .1}px, ${y * .1}px) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ============================================
     CONTACT ACTIONS — Dynamic WhatsApp & Email Dispatch
     ============================================ */
  const sendWaBtn = $('#send-wa-btn');
  const sendMailBtn = $('#send-mail-btn');

  if (sendWaBtn) {
    sendWaBtn.addEventListener('click', () => {
      const name = $('#name')?.value.trim() || '';
      const phone = $('#phone')?.value.trim() || '';
      const subject = $('#subject')?.value || 'Orçamento';
      const msg = $('#message')?.value.trim() || '';

      let text = `Olá! Vim pelo site da Dutra 100.\n\n`;
      if (name) text += `*Nome:* ${name}\n`;
      if (phone) text += `*Telefone:* ${phone}\n`;
      if (subject) text += `*Assunto:* ${subject}\n`;
      if (msg) text += `*Mensagem:* ${msg}\n`;

      const waUrl = `https://wa.me/5511975481863?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    });
  }

  if (sendMailBtn) {
    sendMailBtn.addEventListener('click', () => {
      const name = $('#name')?.value.trim() || 'Cliente';
      const phone = $('#phone')?.value.trim() || '';
      const subject = $('#subject')?.value || 'Solicitação de Orçamento - Dutra 100';
      const msg = $('#message')?.value.trim() || '';

      let body = `Nome: ${name}\nTelefone: ${phone}\nAssunto: ${subject}\n\nMensagem:\n${msg}`;
      const mailUrl = `mailto:comercial@dutra100.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailUrl;
    });
  }

});
