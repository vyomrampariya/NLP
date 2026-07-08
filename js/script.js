/* NLP Knowledge Repository — Core UI behaviors */

(function(){
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

  // ----- Loading animation -----
  const loading = $('#loading');
  window.addEventListener('load', () => {
    if(!loading) return;
    loading.style.opacity = '0';
    loading.style.transition = 'opacity 350ms ease';
    setTimeout(() => loading.remove(), 380);
  });

  // ----- Back to top -----
  const backToTop = $('#backToTop');
  const toggleBackToTop = () => {
    if(!backToTop) return;
    const show = window.scrollY > 700;
    backToTop.classList.toggle('is-visible', show);
  };
  window.addEventListener('scroll', toggleBackToTop, {passive:true});
  toggleBackToTop();
  backToTop?.addEventListener('click', () => {
    window.scrollTo({top:0, behavior:'smooth'});
  });

  // ----- Mobile nav toggle -----
  const navToggle = $('.navToggle');
  const navMenu = $('#navMenu');
  if(navToggle && navMenu){
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on link click
    $$('#navMenu .nav__link', navMenu).forEach(a => {
      a.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ----- Accordion (reflection cards) -----
  const accordions = $$('[data-accordion]');
  accordions.forEach(acc => {
    const buttons = $$('[data-accordion] .accordion__btn', acc);
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));

        const panel = btn.nextElementSibling;
        if(panel){
          panel.hidden = expanded;
        }

        // Optional: allow only one open per accordion
        if(!expanded){
          buttons.forEach(other => {
            if(other !== btn){
              other.setAttribute('aria-expanded', 'false');
              const p = other.nextElementSibling;
              if(p) p.hidden = true;
            }
          });
        }
      });
    });
  });

  // ----- Scroll reveal -----
  const revealEls = $$('[data-reveal]');
  if(revealEls.length){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(e.isIntersecting){
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, {threshold: 0.15});
    revealEls.forEach(el => io.observe(el));
  }

  // ----- Scroll progress bar + active navigation highlight + breadcrumb -----
  const progress = $('#scrollProgress');
  const navLinks = $$('#navMenu .nav__link');
  const breadcrumb = $('#breadcrumb');
  const mobileBreadcrumbValue = $('#mobileBreadcrumbValue');

  const sectionIds = navLinks.map(a => a.getAttribute('data-section'));

  const getActiveSection = () => {
    const viewportMid = window.scrollY + window.innerHeight * 0.35;
    let active = sectionIds[0];

    for(const id of sectionIds){
      const el = document.getElementById(id);
      if(!el) continue;
      const top = el.offsetTop;
      if(top <= viewportMid) active = id;
    }
    return active;
  };

  const setProgress = () => {
    if(!progress) return;
    const doc = document.documentElement;
    const total = doc.scrollHeight - window.innerHeight;
    const pct = total <= 0 ? 0 : (window.scrollY / total) * 100;
    progress.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  };

  const highlightNav = () => {
    const activeId = getActiveSection();
    navLinks.forEach(a => {
      a.classList.toggle('is-active', a.getAttribute('data-section') === activeId);
    });

    const activeLink = navLinks.find(a => a.getAttribute('data-section') === activeId);
    const label = activeLink?.textContent?.trim() || 'Home';
    if(breadcrumb) breadcrumb.textContent = label;
    if(mobileBreadcrumbValue) mobileBreadcrumbValue.textContent = label;
  };

  window.addEventListener('scroll', () => {
    setProgress();
    highlightNav();
  }, {passive:true});

  setProgress();
  highlightNav();

  // ----- Tooltip (used by cards/workflow) -----
  const tooltip = $('#tooltip');
  const showTooltip = (text, x, y) => {
    if(!tooltip) return;
    tooltip.textContent = text;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
    tooltip.hidden = false;
  };
  const hideTooltip = () => {
    if(!tooltip) return;
    tooltip.hidden = true;
  };

  document.addEventListener('pointermove', (e) => {
    // keep tooltip stable without jitter
    if(tooltip && !tooltip.hidden && tooltip.dataset.follow === 'true'){
      tooltip.style.left = `${e.clientX}px`;
      tooltip.style.top = `${e.clientY}px`;
    }
  });
  document.addEventListener('pointerdown', hideTooltip);

  window.__NLP_TOOLTIP__ = {showTooltip, hideTooltip};

  // ----- Quick nav panel -----
  const quickNav = $('.quickNav');
  if(quickNav){
    quickNav.addEventListener('click', (e) => {
      const panel = $('.quickNav__panel', quickNav);
      if(!panel) return;
      if(e.target.closest('.quickNav__panel')) return;
      quickNav.classList.toggle('is-open');
      e.stopPropagation();
    });
    document.addEventListener('click', () => quickNav.classList.remove('is-open'));
  }

})();

