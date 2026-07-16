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
     PRODUCTS CAROUSEL — Infinite Marquee with Swipe
     ============================================ */
  const carousel  = $('.products-carousel');
  const marquee   = $('.products-marquee');
  const trackInner = $('.products-track-inner');
  const prevBtn   = $('#carousel-prev-btn');
  const nextBtn   = $('#carousel-next-btn');

  if (carousel && marquee && trackInner) {
    let currentX = 0;
    let animPaused = false;
    const speed     = 0.8;   // px per frame
    const cardWidth = 328;   // 300px card + 28px gap

    // ─── Auto-scroll loop ──────────────────────────────────────────
    function step() {
      if (!animPaused) {
        currentX -= speed;
        const tw = trackInner.offsetWidth;
        if (currentX <= -tw) currentX += tw;
        marquee.style.transform = `translateX(${currentX}px)`;
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);

    // ─── Snap helpers ──────────────────────────────────────────────
    function snapTo(targetX) {
      animPaused = true;
      marquee.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
      marquee.style.transform  = `translateX(${targetX}px)`;
      setTimeout(() => {
        currentX = targetX;
        const tw = trackInner.offsetWidth;
        if (currentX <= -tw) {
          currentX += tw;
          marquee.style.transition = 'none';
          marquee.style.transform  = `translateX(${currentX}px)`;
        }
        marquee.style.transition = 'none';
        setTimeout(() => { animPaused = false; }, 2500);
      }, 510);
    }

    const snapNearest = () => snapTo(-Math.round(-currentX / cardWidth) * cardWidth);
    const snapNext    = () => snapTo(-(Math.floor(-currentX / cardWidth) + 1) * cardWidth);
    function snapPrev() {
      let idx = Math.ceil(-currentX / cardWidth) - 1;
      if (idx < 0) {
        const tw = trackInner.offsetWidth;
        currentX -= tw;
        marquee.style.transition = 'none';
        marquee.style.transform  = `translateX(${currentX}px)`;
        idx = Math.ceil(-currentX / cardWidth) - 1;
      }
      snapTo(-idx * cardWidth);
    }

    // ─── Button controls ──────────────────────────────────────────
    nextBtn?.addEventListener('click', () => { animPaused = true; snapNext(); });
    prevBtn?.addEventListener('click', () => { animPaused = true; snapPrev(); });

    // ─── Desktop hover pause ──────────────────────────────────────
    carousel.addEventListener('mouseenter', () => { animPaused = true;  });
    carousel.addEventListener('mouseleave', () => { animPaused = false; });

    // ─── Pointer Events swipe (works on mobile AND desktop drag) ──
    let pointerStartX   = 0;
    let pointerStartY   = 0;
    let pointerStartCX  = 0;
    let pointerDown     = false;
    let dirLocked       = false;  // null=undecided, true=horiz, false=vert
    let swipeDelta      = 0;
    let isHoriz         = false;

    carousel.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return; // left-click only
      marquee.style.transition = 'none';
      animPaused = true;
      pointerDown    = true;
      dirLocked      = false;
      isHoriz        = false;
      swipeDelta     = 0;
      pointerStartX  = e.clientX;
      pointerStartY  = e.clientY;
      pointerStartCX = currentX;
      // Capture keeps events coming even if pointer leaves the element
      carousel.setPointerCapture(e.pointerId);
    });

    carousel.addEventListener('pointermove', (e) => {
      if (!pointerDown) return;
      const dx = e.clientX - pointerStartX;
      const dy = e.clientY - pointerStartY;

      // Direction decision (need at least 6px of movement)
      if (!dirLocked) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        isHoriz  = Math.abs(dx) >= Math.abs(dy);
        dirLocked = true;
      }

      if (!isHoriz) return; // vertical — browser handles page scroll naturally

      swipeDelta = dx;
      currentX   = pointerStartCX + dx;

      // Seamless loop during drag
      const tw = trackInner.offsetWidth;
      if (currentX > 20)       { currentX -= tw; pointerStartCX = currentX - dx; }
      else if (currentX < -tw - 20) { currentX += tw; pointerStartCX = currentX - dx; }

      marquee.style.transform = `translateX(${currentX}px)`;
    });

    function onPointerUp() {
      if (!pointerDown) return;
      pointerDown = false;
      if (!isHoriz) { animPaused = false; return; } // was a vertical scroll
      if (Math.abs(swipeDelta) > 50) {
        swipeDelta < 0 ? snapNext() : snapPrev();
      } else {
        snapNearest();
      }
    }

    carousel.addEventListener('pointerup',     onPointerUp);
    carousel.addEventListener('pointercancel', onPointerUp);

    // ─── Mouse-following glow on cards ────────────────────────────
    $$('.prod-card, .project-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--y', `${e.clientY - rect.top}px`);
      });
    });
  }




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
     CONTACT FORM — UX feedback
     ============================================ */
  const form = $('.contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      const orig = btn.innerHTML;
      btn.innerHTML = '✓ Mensagem enviada!';
      btn.style.background = '#059669';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3500);
    });
  }

});
