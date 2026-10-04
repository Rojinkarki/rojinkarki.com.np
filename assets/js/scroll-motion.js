(() => {
  const progress = document.querySelector('.scroll-progress span');
  const updateProgress = () => {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const fraction = available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0;
    if (progress) progress.style.transform = `scaleX(${fraction})`;
  };
  let frame = 0;
  window.addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(() => { frame = 0; updateProgress(); });
  }, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const targets = document.querySelectorAll(
    '.index-page .section-title, .index-page .about .profile-card, .index-page .about-content, .index-page .project-card, .index-page .skills-category, .index-page .experience-card, .index-page .education-card, .index-page .cert-card, .index-page .contact .info-box, .index-page .contact-form'
  );
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
  targets.forEach(element => {
    element.classList.add('motion-reveal');
    observer.observe(element);
  });
  document.documentElement.classList.add('motion-ready');
})();
