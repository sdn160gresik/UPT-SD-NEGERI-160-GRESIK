// Interaksi ringan untuk menu pembelajaran futuristik.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a.chapter-card, a.back-button').forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      // Biarkan navigasi normal; efek visual singkat diberikan oleh CSS.
    });
  });
});
