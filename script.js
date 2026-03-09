/* ════════════════════════════════════════════════════════════
   KIME TIME — script.js
   Funciones:
   1. NAV SCROLL      → oscurece el navbar al hacer scroll
   2. HAMBURGER MENU  → abre/cierra el menú mobile y anima el ícono
   3. CERRAR MENÚ     → cierra el menú al hacer click en un link
   4. SCROLL REVEAL   → anima secciones cuando entran en el viewport
   5. VIDEO PLACEHOLDER → reemplaza el placeholder por iframe al hacer click
   6. NAV ACTIVE STATE → resalta el link del nav según la sección visible
════════════════════════════════════════════════════════════ */


/* ─────────────────────────────────────────────────
   1. NAV SCROLL
   Escucha el evento scroll de la ventana.
   Si el usuario scrolleó más de 60px agrega la clase "scrolled" al navbar,
   lo que en CSS cambia el fondo a más oscuro y agrega sombra roja.
───────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  // classList.toggle(clase, condición): agrega si es true, quita si es false
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});


/* ─────────────────────────────────────────────────
   2. HAMBURGER MENU
   Llamada desde el onclick del botón hamburger en el HTML.
   Alterna la clase "open" en la lista de links → el menú aparece fullscreen.
   Alterna la clase "active" en el hamburger → anima las 3 líneas a una X.
   También actualiza el aria-expanded para accesibilidad.
───────────────────────────────────────────────── */
function toggleMenu() {
  const navLinks  = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');

  const isOpen = navLinks.classList.toggle('open');   // true = abierto
  hamburger.classList.toggle('active', isOpen);

  // Accesibilidad: informa a lectores de pantalla si el menú está abierto
  hamburger.setAttribute('aria-expanded', isOpen);

  // Bloquea el scroll del body mientras el menú está abierto
  // (evita que el fondo se mueva detrás del overlay)
  document.body.style.overflow = isOpen ? 'hidden' : '';
}


/* ─────────────────────────────────────────────────
   3. CERRAR MENÚ AL HACER CLICK EN UN LINK
   En mobile, al hacer click en cualquier link del nav,
   se cierra el menú automáticamente (sin tener que
   tocar el hamburger de nuevo).
───────────────────────────────────────────────── */
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    const navLinks  = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');

    // Solo cierra si está abierto (evita ejecutar lógica innecesaria en desktop)
    if (navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = ''; // Restaura el scroll del body
    }
  });
});


/* ─────────────────────────────────────────────────
   4. SCROLL REVEAL
   Usa IntersectionObserver para detectar cuándo un elemento
   con clase "reveal" entra en el viewport.
   Al entrar, le agrega la clase "visible" que en CSS
   hace la transición de opacidad y posición (fadeUp).
   Una vez visible, deja de observar ese elemento (mejora el rendimiento).
───────────────────────────────────────────────── */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // Deja de observar una vez animado
    }
  });
}, {
  threshold: 0.1  // El elemento se activa cuando el 10% ya es visible
});

revealElements.forEach(el => revealObserver.observe(el));


/* ─────────────────────────────────────────────────
   5. VIDEO PLACEHOLDER (opcional)
   Si en el HTML hay un elemento con clase "video-placeholder"
   (alternativa al iframe de YouTube), al hacer click
   lo reemplaza con un iframe con autoplay activado.
   Actualmente el HTML usa iframe directo, pero se mantiene
   por si se quiere usar el placeholder en el futuro.
───────────────────────────────────────────────── */
const videoPlaceholder = document.querySelector('.video-placeholder');

if (videoPlaceholder) {
  videoPlaceholder.addEventListener('click', function () {
    const iframe = document.createElement('iframe');

    // Reemplazá 'VIDEO_ID' con el ID del video de YouTube
    iframe.src = 'https://www.youtube.com/embed/gRkoZYOV7eY?autoplay=1';
    iframe.allow = 'autoplay; encrypted-media';
    iframe.allowFullscreen = true;
    iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0';

    this.style.position = 'relative';
    this.innerHTML = '';      // Borra el contenido del placeholder
    this.appendChild(iframe); // Inserta el iframe de YouTube
  });
}


/* ─────────────────────────────────────────────────
   6. NAV ACTIVE STATE (resaltar link activo)
   Al hacer scroll, detecta qué sección está actualmente visible
   comparando la posición de cada sección con el scroll actual.
   El link del nav cuya href coincida con esa sección se colorea de rojo.

   Nota: se usa un offset de 120px para activar el link
   un poco antes de llegar exactamente al tope de la sección,
   mejorando la sensación visual.
───────────────────────────────────────────────── */
const pageSections = document.querySelectorAll('section[id], footer[id]');
const navLinkItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let currentSection = '';

  // Recorre cada sección y detecta cuál es la más reciente que pasó el offset
  pageSections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      currentSection = section.id;
    }
  });

  // Actualiza el color de cada link del nav
  navLinkItems.forEach(link => {
    const isActive = link.getAttribute('href') === '#' + currentSection;
    link.style.color = isActive ? 'var(--red)' : ''; // Vacío = usa el color del CSS
  });
});