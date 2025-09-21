document.querySelector('.menu')?.addEventListener('click', () => {
  const nav = document.querySelector('.nav');
  if(!nav) return;
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
});

// ====== Toggle del menú móvil (panel lateral) ======
(function () {
  const menu = document.querySelector('.menu');
  const nav  = document.querySelector('.nav');
  if (!menu || !nav) return;

  // fondo oscuro
  let backdrop = document.querySelector('.backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'backdrop';
    document.body.appendChild(backdrop);
  }

  const openNav = () => {
    nav.classList.add('is-open');
    backdrop.classList.add('show');
    document.body.classList.add('nav-open');
  };
  const closeNav = () => {
    nav.classList.remove('is-open');
    backdrop.classList.remove('show');
    document.body.classList.remove('nav-open');
  };

  menu.addEventListener('click', (e) => {
    e.preventDefault();
    nav.classList.contains('is-open') ? closeNav() : openNav();
  });
  backdrop.addEventListener('click', closeNav);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) closeNav(); });
})();
