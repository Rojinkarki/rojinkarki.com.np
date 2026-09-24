/* Set the saved theme before the page paints, then wire the shared switch. */
(() => {
  const key = 'rojin-portfolio-theme';
  let saved = null;
  try { saved = localStorage.getItem(key); } catch (_) { /* Storage may be disabled. */ }
  document.documentElement.dataset.theme = saved === 'light' ? 'light' : 'dark';

  const init = () => {
    const button = document.getElementById('theme-toggle');
    if (!button) return;
    const update = () => {
      const light = document.documentElement.dataset.theme === 'light';
      button.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
      button.title = light ? 'Switch to dark mode' : 'Switch to light mode';
      const icon = button.querySelector('.theme-icon');
      const label = button.querySelector('.theme-label');
      if (icon) icon.textContent = light ? '◐' : '☀';
      if (label) label.textContent = light ? 'Dark mode' : 'Light mode';
      const color = document.querySelector('meta[name="theme-color"]');
      if (color) color.content = light ? '#f7f8f6' : '#0b1420';
    };
    button.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem(key, next); } catch (_) { /* Toggle still works. */ }
      update();
    });
    update();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
