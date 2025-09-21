// Menú móvil: abre/cierra el overlay usando .open (coincide con el CSS)
(() => {
  const menu = document.querySelector('.menu');
  const nav  = document.querySelector('.nav');
  if (!menu || !nav) return;

  const open = () => {
    nav.classList.add('open');
    menu.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open'); // opcional: para bloquear scroll
  };

  const close = () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  menu.addEventListener('click', (e) => {
    e.preventDefault();
    nav.classList.contains('open') ? close() : open();
  });

  // Cierra al navegar dentro del menú
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) close();
  });

  // Cierra con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  // Si cambia a desktop, resetea el estado del menú
  const mq = window.matchMedia('(min-width: 768px)');
  const sync = () => { if (mq.matches) close(); };
  mq.addEventListener ? mq.addEventListener('change', sync) : mq.addListener(sync);
})();
