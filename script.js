
// Mostrar sección con animación al scrollear
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.registro-section').forEach(sec => {
  observer.observe(sec);
});
