/* NLP Knowledge Repository — Search concepts + animated counters */

(function(){
  const grid = document.getElementById('conceptCardsGrid');
  const input = document.getElementById('conceptSearch');
  const clearBtn = document.getElementById('searchClear');
  const resultCount = document.getElementById('searchResultCount');

  // ---------- Animated counters ----------
  const counters = Array.from(document.querySelectorAll('[data-counter] .counter'));
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(!e.isIntersecting) return;
      const card = e.target.closest('[data-counter]');
      if(!card) return;
      const targetValue = Number(card.getAttribute('data-counter'));

      const duration = 900;
      const start = performance.now();
      const from = 0;

      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = Math.round(from + (targetValue - from) * eased);
        e.target.textContent = String(val);
        if(t < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(e.target);
    });
  }, {threshold: 0.35});

  counters.forEach(c => counterObserver.observe(c));

  // ---------- Concept filtering ----------
  // concept cards are generated in workflow.js? Actually in script.js? We'll generate in script.js later.
  const filterCards = (query) => {
    if(!grid) return;
    const q = query.trim().toLowerCase();
    const cards = Array.from(grid.querySelectorAll('.conceptCard'));

    if(!q){
      cards.forEach(c => c.style.display = '');
      if(resultCount) resultCount.textContent = `${cards.length} results`;
      return;
    }

    let matches = 0;
    cards.forEach(c => {
      const hay = (c.dataset.search || '').toLowerCase();
      const ok = hay.includes(q);
      c.style.display = ok ? '' : 'none';
      if(ok) matches++;
    });

    if(resultCount) resultCount.textContent = `${matches} result${matches===1?'':'s'}`;
  };

  input?.addEventListener('input', (e) => filterCards(e.target.value));
  clearBtn?.addEventListener('click', () => {
    if(input){
      input.value = '';
      filterCards('');
      input.focus();
    }
  });
})();

