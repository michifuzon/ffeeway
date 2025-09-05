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

const mountMap = document.getElementById('mount-map');
if (mountMap) {
  mountMap.textContent = 'Mapa embebido (SDK) — cafeterías cercanas y filtros.';
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
