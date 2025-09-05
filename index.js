// Mobile nav toggle + scrollspy básico
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Cerrar menú al hacer click en un link (mobile)
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Scrollspy con IntersectionObserver
const links = Array.from(document.querySelectorAll('#site-nav a'));
const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

const spy = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = '#' + entry.target.id;
    const link = links.find(a => a.getAttribute('href') === id);
    if (link) {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });

sections.forEach(sec => spy.observe(sec));

// Placeholders de montaje (para que “se vea” algo mientras tanto)
const mountStore = document.getElementById('mount-store');
if (mountStore) {
  mountStore.textContent = 'Aquí irá el catálogo inicial de Ffee Way (ej.: 4 productos destacados).';
}

const mountReviews = document.getElementById('mount-reviews');
if (mountReviews) {
  const sample = [
    { user: 'Fausti', text: 'Flat white impecable y baristas muy amables.', rating: 5 },
    { user: 'Nico', text: 'Buen espresso; acidez brillante. Volvería.', rating: 4 },
  ];
  mountReviews.innerHTML = sample.map(r =>
    `<div class="mount-placeholder" style="min-height:auto;padding:12px;text-align:left;">
       <b>${r.user}</b> — ${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}<br>
       <span style="opacity:.9">${r.text}</span>
     </div>`
  ).join('');
}

// === Gate disuasivo (modal) ===
(function(){
  var USER="ffeeway", PASS="enproceso1", TRIES=3, left=TRIES;

  function showApp(){ document.documentElement.classList.remove('needs-auth'); }

  function mount(){
    var o=document.createElement('div');
    o.className='fw-gate-overlay';
    o.innerHTML=`
      <div class="fw-gate-card" role="dialog" aria-modal="true" aria-labelledby="fw-title">
        <h2 id="fw-title" class="fw-gate-title">Acceso a Ffee Way</h2>
        <p class="fw-gate-sub">The way to find coffee</p>
        <div class="fw-gate-row">
          <input id="fw-user" class="fw-gate-input" placeholder="Usuario" autocomplete="off" autofocus>
          <input id="fw-pass" class="fw-gate-input" placeholder="Contraseña" type="password" autocomplete="off">
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
    document.body.appendChild(o); return o;
  }

function deny(overlay){
  left--;

  const err   = overlay.querySelector('#fw-err');
  const tries = overlay.querySelector('#fw-tries');
  const pass  = overlay.querySelector('#fw-pass');

  // mensaje e intentos restantes
  err.textContent   = "Usuario o contraseña incorrectos.";
  tries.textContent = "Intentos restantes: " + Math.max(left, 0);

  // limpiar y enfocar
  pass.value = '';
  pass.focus();

  // si se agotaron los intentos -> bloquear y recargar
  if (left <= 0) {
    // bloquear inputs y botones
    overlay.querySelectorAll('input,button').forEach(el => el.disabled = true);

    let s = 3; // segundos
    err.textContent = "Acceso denegado. Reintentando en " + s + "…";
    const timer = setInterval(() => {
      s--;
      if (s <= 0) {
        clearInterval(timer);
        location.reload();
      } else {
        err.textContent = "Acceso denegado. Reintentando en " + s + "…";
      }
    }, 1000);
  }
}

  function bind(overlay){
    var user=overlay.querySelector('#fw-user'),
        pass=overlay.querySelector('#fw-pass'),
        ok=overlay.querySelector('#fw-ok'),
        cancel=overlay.querySelector('#fw-cancel'),
        tries=overlay.querySelector('#fw-tries');
    tries.textContent="Intentos restantes: "+left;

    function go(){
      if(user.value===USER && pass.value===PASS){ overlay.remove(); showApp(); }
      else{ deny(overlay); }
    }
    ok.addEventListener('click',go);
    cancel.addEventListener('click',()=>location.reload());
    pass.addEventListener('keydown',e=>{ if(e.key==='Enter') go(); });
    user.addEventListener('keydown',e=>{ if(e.key==='Enter') pass.focus(); });
    user.focus();
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>bind(mount()));
  }else{ bind(mount()); }
})();
