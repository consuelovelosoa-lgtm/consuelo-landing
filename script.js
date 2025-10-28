// ====== CONFIG ENCUESTA ======
const API_URL    = 'https://script.google.com/macros/s/AKfycbyFza082lJGBzyiZhgzpMQ8HCh0wiMraFTsLElhw7Hy7FStBYOaMsm8eJ5OaaIixhaIPg/exec';
const API_SECRET = 'encuesta_2025_super_secreto';
const SURVEY_ID  = 'enc-2025-01'; // cámbialo cuando cambies la pregunta
const QUESTION   = '¿Cuál es tu prioridad para Maule Sur?';
// ==============================

function getVoterId(){
  let id = localStorage.getItem('enc_voterId');
  if(!id){
    id = (crypto.randomUUID ? crypto.randomUUID() : ('v_'+Math.random().toString(36).slice(2)));
    localStorage.setItem('enc_voterId', id);
  }
  return id;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', fetchResults);
} else {
  fetchResults();
}

async function fetchResults(){
  try{
    const r = await fetch(`${API_URL}?surveyId=${encodeURIComponent(SURVEY_ID)}`);
    const data = await r.json();
    renderResults(data);
  }catch(e){ console.warn(e); }
}

async function sendVote(optionId, optionText){
  try{
    toggleVoting(false);
    const payload = {
      secret: API_SECRET,
      surveyId: SURVEY_ID,
      question: QUESTION,
      optionId,
      optionText,
      voterId: getVoterId()
    };
    const r = await fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    if(!data.ok) throw new Error(data.error || 'Error');
    renderResults(data);
    localStorage.setItem(`voted_${SURVEY_ID}`, optionId);
  }catch(e){
    alert('No pudimos registrar tu voto. Intenta de nuevo.');
    console.error(e);
  }finally{
    toggleVoting(true);
  }
}

function toggleVoting(enable){
  document.querySelectorAll('.encuesta input[type="radio"], .encuesta button')
    .forEach(el => el.disabled = !enable);
}

function renderResults(data){
  if(!data || !data.ok) return;
  const cont = document.getElementById('encuesta-resultados');
  if(!cont) return;

  cont.innerHTML = '';
  data.options.forEach(o => {
    const row = document.createElement('div');
    row.className = 'resultado-row';
    row.innerHTML = `
      <div class="resultado-top">
        <span class="opcion">${o.text}</span>
        <span class="porcentaje">${o.percent}%</span>
      </div>
      <div class="bar"><div class="fill" style="width:${o.percent}%"></div></div>
      <div class="cuenta">${o.count} voto${o.count===1?'':'s'}</div>
    `;
    cont.appendChild(row);
  });
  const totalEl = document.getElementById('encuesta-total');
  if(totalEl) totalEl.textContent = data.total.toString();
}

/* ====== Menú móvil: drawer derecho ====== */
(() => {
  'use strict';

  const header  = document.querySelector('.header');
  const menuBtn = document.querySelector('.menu');
  const nav     = document.querySelector('.nav');
  if (!menuBtn || !nav) return;

  // Backdrop único
  let backdrop = document.querySelector('.backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'backdrop';
    document.body.appendChild(backdrop);
  }

  let lastFocus = null;

  const focusablesSelector =
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const openNav = () => {
    lastFocus = document.activeElement;
    nav.classList.add('is-open');
    backdrop.classList.add('show');
    document.body.classList.add('nav-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    nav.setAttribute('aria-hidden', 'false');

    // Enfocar primer link del menú
    const first = nav.querySelector(focusablesSelector);
    if (first) first.focus();
  };

  const closeNav = () => {
    nav.classList.remove('is-open');
    backdrop.classList.remove('show');
    document.body.classList.remove('nav-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-hidden', 'true');

    // Devolver foco al botón menú
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    } else {
      menuBtn.focus();
    }
  };

  const isOpen = () => nav.classList.contains('is-open');

  // Toggle por botón
  menuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isOpen() ? closeNav() : openNav();
  });

  // Cerrar por backdrop
  backdrop.addEventListener('click', closeNav);

  // Cerrar por ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) closeNav();
  });

  // Trap de foco dentro del drawer
  document.addEventListener('keydown', (e) => {
    if (!isOpen() || e.key !== 'Tab') return;
    const focusables = Array.from(nav.querySelectorAll(focusablesSelector))
      .filter(el => el.offsetParent !== null && !el.hasAttribute('disabled'));
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last  = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });

  // Click en links del nav
  nav.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;

    // Navegación a secciones (#ancla) con offset del header
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#')) {
      e.preventDefault();
      const id = href.slice(1);
      const target = document.getElementById(id);
      closeNav();
      if (target) {
        const headerH = header ? header.offsetHeight : 0;
        const y = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      return;
    }

    // Cualquier otro link: cerrar y seguir navegación normal
    closeNav();
  });

  // Si pasa a desktop, asegurar estado cerrado
  const mqDesktop = window.matchMedia('(min-width: 1024px)');
  const handleMQ  = () => { if (mqDesktop.matches && isOpen()) closeNav(); };
  mqDesktop.addEventListener('change', handleMQ);
})();

/* ====== (Opcional) Marcar activo al hacer click en el nav de desktop ====== */
(() => {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  nav.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    // No tocar el botón verde de WhatsApp
    if (link.classList.contains('whatsapp')) return;

    // Limpiar y marcar activo (visible en desktop)
    nav.querySelectorAll('a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
  });
})();
