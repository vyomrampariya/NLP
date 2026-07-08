/* NLP Knowledge Repository — Theme toggle */

(function(){
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');

  const setIcon = (theme) => {
    if(!icon) return;
    icon.textContent = theme === 'light' ? '☀️' : '🌙';
  };

  const stored = localStorage.getItem('nlp_theme');
  if(stored){
    root.setAttribute('data-theme', stored);
    setIcon(stored);
  } else {
    // If OS prefers light, default to light.
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    if(prefersLight && prefersLight.matches){
      root.setAttribute('data-theme', 'light');
      setIcon('light');
    } else {
      setIcon('dark');
    }
  }

  btn?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') || 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('nlp_theme', next);
    setIcon(next);
  });
})();

