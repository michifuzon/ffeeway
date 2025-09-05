/* ===== Utilidad: detectar móvil ===== */
const isMobile = () =>
  /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  window.matchMedia('(max-width: 768px)').matches;

/* Quitar cualquier autofocus en móvil para evitar auto-zoom */
(() => {
  if (isMobile()) {
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('[autofocus]').forEach(el => el.removeAttribute('autofocus'));
    });
  }
})();

/* ===== Scrollspy (resalta sección activa) ===== */
(() => {
  const links = Array.from(document.querySelectorAll('#site-nav a'));
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (!links.length || !sections.length) return;

  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = '#' + entry.target.id;
      const link = links.find(a => a.getAttribute('href') === id);
      if (link && entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });

  sections.forEach(sec => spy.observe(sec));
})();

/* ===== Placeholders (no tocar si ya hay contenido) ===== */
(() => {
  const mountStore = document.getElementById('mount-store');
  if (mountStore && mountStore.children.length === 0) {
    mountStore.textContent = 'Aquí irá el catálogo inicial de Ffee Way (ej.: 4 productos destacados).';
  }

  const mountReviews = document.getElementById('mount-reviews');
  if (mountReviews && mountReviews.children.length === 0) {
    const sample = [
      { user: 'Fausti', text: 'Flat white impecable y baristas muy amables.', rating: 5 },
      { user: 'Nico',   text: 'Buen espresso; acidez brillante. Volvería.',    rating: 4 },
    ];
    mountReviews.innerHTML = sample.map(r =>
      `<div class="mount-placeholder" style="min-height:auto;padding:12px;text-align:left;">
         <b>${r.user}</b> — ${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}<br>
         <span style="opacity:.9">${r.text}</span>
       </div>`
    ).join('');
  }
})();

/* ===== Menú móvil (toggle) — opcional: no afecta si no hay .nav-toggle ===== */
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  const openMenu = () => {
    nav.classList.add('open');
    document.body.classList.add('noscroll');
    toggle.setAttribute('aria-expanded', 'true');
  };
  const closeMenu = () => {
    nav.classList.remove('open');
    document.body.classList.remove('noscroll');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    (nav.classList.contains('open') ? closeMenu() : openMenu());
  });

  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // Si pasás a desktop, asegurá que quede cerrado
  const mql = window.matchMedia('(max-width: 900px)');
  const syncState = () => { if (!mql.matches) closeMenu(); };
  window.addEventListener('resize', syncState);
  window.addEventListener('orientationchange', syncState);
})();

/* ===== Gate disuasivo (NO seguridad real) ===== */
(() => {
  const USER="ffeeway", PASS="enproceso1", TRIES=3, OK_KEY="fw-ok";
  let left = TRIES;

  const html = document.documentElement;

  function showApp(){ html.classList.remove('needs-auth'); }

  function mount(){
    const o = document.createElement('div');
    o.className = 'fw-gate-overlay';
    o.innerHTML = `
      <div class="fw-gate-card" role="dialog" aria-modal="true" aria-labelledby="fw-title">
        <h2 id="fw-title" class="fw-gate-title">Acceso a Ffee Way</h2>
        <p class="fw-gate-sub">The way to find coffee</p>
        <div class="fw-gate-row">
          <input id="fw-user" class="fw-gate-input" placeholder="Usuario" autocomplete="username">
          <input id="fw-pass" class="fw-gate-input" placeholder="Contraseña" type="password" autocomplete="current-password">
        </div>
        <div class="fw-gate-err" id="fw-err"></div>
        <div class="fw-gate-actions">
          <span class="fw-gate-tries" id="fw-tries"></span>
          <div>
            <button class="fw-gate-btn" id="fw-ok">Entrar</button>
            <button class="fw-gate-btn secondary" id="fw-cancel">Cancelar</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(o);
    return o;
  }

  function deny(overlay){
    left--;
    const err   = overlay.querySelector('#fw-err');
    const tries = overlay.querySelector('#fw-tries');
    const pass  = overlay.querySelector('#fw-pass');

    err.textContent   = "Usuario o contraseña incorrectos.";
    tries.textContent = "Intentos restantes: " + Math.max(left, 0);
    pass.value = '';

    // Evitar auto-zoom: no forzar focus en móvil
    if (!isMobile()) pass.focus();

    if (left <= 0) {
      overlay.querySelectorAll('input,button').forEach(el => el.disabled = true);
      let s = 3;
      err.textContent = "Acceso denegado. Reintentando en " + s + "…";
      const timer = setInterval(() => {
        s--;
        if (s <= 0) { clearInterval(timer); location.reload(); }
        else { err.textContent = "Acceso denegado. Reintentando en " + s + "…"; }
      }, 1000);
    }
  }

  function bind(overlay){
    const user   = overlay.querySelector('#fw-user');
    const pass   = overlay.querySelector('#fw-pass');
    const ok     = overlay.querySelector('#fw-ok');
    const cancel = overlay.querySelector('#fw-cancel');
    const tries  = overlay.querySelector('#fw-tries');

    tries.textContent = "Intentos restantes: " + left;

    const go = () => {
      if (user.value === USER && pass.value === PASS) {
        sessionStorage.setItem(OK_KEY, '1');
        overlay.remove();
        showApp();
      } else {
        deny(overlay);
      }
    };

    ok.addEventListener('click', go);
    cancel.addEventListener('click', () => location.reload());
    pass.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    user.addEventListener('keydown', e => { if (e.key === 'Enter') pass.focus(); });

    // Evitar auto-zoom: solo enfocamos en desktop
    if (!isMobile()) user.focus();
  }

  if (sessionStorage.getItem(OK_KEY) === '1') {
    showApp();
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => bind(mount()));
    } else {
      bind(mount());
    }
  }
})();
