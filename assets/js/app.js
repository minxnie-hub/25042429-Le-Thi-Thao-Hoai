(() => {
  const menuBtn = document.querySelector('.menu-button');
  const nav = document.querySelector('.main-nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        nav.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const progress = document.querySelector('.reading-progress span');
  const topBtn = document.querySelector('.back-to-top');
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0;
    if (progress) progress.style.width = `${pct}%`;
    if (topBtn) topBtn.classList.toggle('is-visible', window.scrollY > 620);
    document.querySelector('.site-header')?.classList.toggle('is-scrolled', window.scrollY > 48);
  };
  updateScroll();
  window.addEventListener('scroll', updateScroll, { passive: true });
  topBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = [...document.querySelectorAll('.reveal')];
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: '0px 0px -40px' });
    revealEls.forEach(el => observer.observe(el));
  }

  const parallax = document.querySelector('[data-parallax]');
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (parallax && finePointer && !reducedMotion) {
    const papers = [...parallax.querySelectorAll('.paper')];
    parallax.addEventListener('pointermove', (e) => {
      const r = parallax.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      papers.forEach((paper, index) => {
        const amount = (index + 1) * 5;
        paper.style.translate = `${x * amount}px ${y * amount}px`;
      });
    });
    parallax.addEventListener('pointerleave', () => papers.forEach(paper => { paper.style.translate = ''; }));
  }


  const homeHero = document.querySelector('.home-hero');
  if (homeHero && finePointer && !reducedMotion) {
    homeHero.addEventListener('pointermove', (event) => {
      const rect = homeHero.getBoundingClientRect();
      homeHero.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      homeHero.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
    homeHero.addEventListener('pointerleave', () => {
      homeHero.style.setProperty('--mx', '50%');
      homeHero.style.setProperty('--my', '50%');
    });
  }

  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const img = lightbox.querySelector('img');
    const caption = lightbox.querySelector('figcaption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    let lastTrigger = null;
    const close = () => {
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      img.src = '';
      lastTrigger?.focus();
    };
    document.querySelectorAll('[data-lightbox]').forEach(btn => {
      btn.addEventListener('click', () => {
        lastTrigger = btn;
        img.src = btn.dataset.lightbox;
        img.alt = btn.querySelector('img')?.alt || '';
        caption.textContent = btn.dataset.caption || '';
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
      });
    });
    closeBtn?.addEventListener('click', close);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && lightbox.getAttribute('aria-hidden') === 'false') close();
    });
  }

  const tocLinks = [...document.querySelectorAll('.toc-card a')];
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const sections = tocLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const tocObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      tocLinks.forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === `#${visible.target.id}`));
    }, { rootMargin: '-20% 0px -65%', threshold: [0,.2,.5] });
    sections.forEach(s => tocObserver.observe(s));
  }
})();
