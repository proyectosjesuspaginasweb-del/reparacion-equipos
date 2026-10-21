'use strict';
// WhatsApp del técnico: México (+52), 55 9878 7720.
const businessWhatsApp = '525598787720';
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-navigation');
function closeMenu() {
  navigation.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
}
 toggle.addEventListener('click', () => {
  toggle.setAttribute('aria-expanded', String(navigation.classList.toggle('is-open')));
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    toggle.focus();
  }
});
window.matchMedia('(min-width: 1024px)').addEventListener('change', closeMenu);

/* Asistente guiado local: las respuestas permanecen en esta pestaña. */
const launcher = document.querySelector('#chat-launcher');
const chat = document.querySelector('#support-chat');
const log = document.querySelector('#chat-log');
const chatForm = document.querySelector('#chat-form');
const answer = document.querySelector('#chat-answer');
const summary = document.querySelector('#chat-summary');
const summaryText = document.querySelector('#chat-summary-text');
const chatStatus = document.querySelector('#chat-status');
const feedback = document.querySelector('#chat-feedback');
const review = document.querySelector('#chat-review');
const wa = document.querySelector('#chat-whatsapp');
const choices = document.createElement('div');
choices.className = 'chat-choices';
chatForm.before(choices);
let steps = [];
let responses = [];
let category = '';
let step = 0;
let returnFocus = launcher;
function bubble(text, user = false) {
  const p = document.createElement('p');
  p.className = user ? 'chat-bubble user' : 'chat-bubble';
  p.textContent = text;
  log.append(p);
  log.scrollTop = log.scrollHeight;
}
function updateWhatsApp() {
  wa.href = `https://wa.me/${businessWhatsApp}?text=${encodeURIComponent(summaryText.value)}`;
  wa.hidden = !summaryText.value.trim();
}
function prepareSummary() {
  summaryText.value = 'Hola TechFix Pro. Solicito atención técnica:\n\nÁrea: ' + category + '\n' + steps.map((item,i) => `${item.label}: ${responses[i]}`).join('\n');
  updateWhatsApp();
  summary.hidden = false;
  chat.classList.add('is-reviewing');
  review.hidden = false;
  review.textContent = 'Ver mis respuestas';
  chatStatus.textContent = 'Revisa o corrige los datos. WhatsApp abrirá el mensaje para el técnico al 55 9878 7720; confirma allí el envío.';
  summaryText.focus({preventScroll:true});
}
function ask() {
  bubble(steps[step].question);
  feedback.textContent = `Pregunta ${step + 1} de ${steps.length}`;
  answer.focus({preventScroll:true});
}
function selectCategory(value) {
  category = value;
  bubble(value, true);
  choices.replaceChildren();
  choices.hidden = true;
  steps = value === 'Desarrollo web' ? [
    {label:'Negocio',question:'¿Cómo se llama tu negocio y a qué se dedica?'},
    {label:'Página solicitada',question:'¿Qué tipo de página necesitas? Por ejemplo: informativa, catálogo o tienda.'},
    {label:'Funciones',question:'¿Qué secciones o funciones te gustaría incluir?'},
    {label:'Fecha deseada',question:'¿Para cuándo la necesitas? Puedes decir “sin fecha”.'},
    {label:'Nombre',question:'¿Con qué nombre te presentamos al técnico? Puedes decir “prefiero omitirlo”.'}
  ] : [
    {label:'Equipo y modelo',question:'¿Cuál es la marca y el modelo del equipo? Si no lo sabes, descríbelo.'},
    {label:'Servicio o falla',question:'¿Qué servicio necesitas o qué falla presenta? Por ejemplo: pantalla, batería, RAM, disco o limpieza.'},
    {label:'Antecedentes',question:'¿Desde cuándo sucede y qué ocurrió antes? Si es mantenimiento, puedes indicar “preventivo”.'},
    {label:'Fecha deseada',question:'¿Para cuándo necesitas el servicio? Puedes decir “sin fecha”.'},
    {label:'Nombre',question:'¿Con qué nombre te presentamos al técnico? Puedes decir “prefiero omitirlo”.'}
  ];
  chatForm.hidden = false;
  ask();
}
function restart() {
  steps = []; responses = []; category = ''; step = 0;
  chat.classList.remove('is-reviewing');
  log.replaceChildren(); summary.hidden = true; review.hidden = true; chatForm.hidden = true;
  answer.value = ''; summaryText.value = ''; wa.removeAttribute('href'); wa.hidden = true;
  feedback.textContent = ''; chatStatus.textContent = '';
  bubble('¡Hola! Soy el asistente de TechFix Pro. Te haré unas preguntas básicas para preparar tu solicitud. No compartas contraseñas ni datos sensibles.');
  bubble('¿En qué área necesitas ayuda? Selecciona una opción.');
  choices.hidden = false;
  choices.replaceChildren();
  ['Computadora o laptop','Celular','Desarrollo web','Otro servicio'].forEach(value => {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = value;
    button.addEventListener('click',() => selectCategory(value));
    choices.append(button);
  });
}
function openChat(event) {
  returnFocus = event?.currentTarget || launcher;
  chat.hidden = false; launcher.setAttribute('aria-expanded','true');
  if (!log.childElementCount) restart();
  (category ? (step >= steps.length ? review : answer) : choices.querySelector('button')).focus({preventScroll:true});
}
function closeChat() {
  chat.hidden = true; launcher.setAttribute('aria-expanded','false');
  returnFocus.focus({preventScroll:true});
}
launcher.addEventListener('click',event => chat.hidden ? openChat(event) : closeChat());
document.querySelector('#chat-close').addEventListener('click',closeChat);
document.querySelector('#chat-restart').addEventListener('click',() => {restart(); choices.querySelector('button').focus();});
document.addEventListener('keydown',event => {if(event.key === 'Escape' && !chat.hidden) closeChat();});
document.querySelectorAll('[data-open-chat],a[href="#cotizador-express"]:not(#main-navigation a)').forEach(link => link.addEventListener('click',event => {event.preventDefault(); openChat(event);}));
chatForm.addEventListener('submit',event => {
  event.preventDefault(); const value = answer.value.trim();
  if (!value || !category || step >= steps.length) return;
  responses.push(value); bubble(value,true); answer.value = ''; step++;
  if (step < steps.length) ask();
  else { chatForm.hidden = true; feedback.textContent = ''; bubble('Listo. Revisa tu resumen antes de compartirlo con el técnico. El costo y el tiempo se confirman después de la revisión.'); prepareSummary(); }
});
review.addEventListener('click',() => {
  summary.hidden = !summary.hidden;
  chat.classList.toggle('is-reviewing',!summary.hidden);
  review.textContent = summary.hidden ? 'Volver al resumen' : 'Ver mis respuestas';
  if (!summary.hidden) summaryText.focus({preventScroll:true});
});
summaryText.addEventListener('input',updateWhatsApp);
document.querySelector('#chat-copy').addEventListener('click',async () => {
  try {await navigator.clipboard.writeText(summaryText.value); chatStatus.textContent = 'Resumen copiado. No se ha enviado ningún mensaje.';}
  catch {summaryText.focus(); summaryText.select(); chatStatus.textContent = 'Seleccionamos el resumen para que lo copies.';}
});

// Inclinación 3D y desplazamiento del título según la posición del cursor.
function initHeadingTilt() {
  if (!window.gsap) return;
  const { gsap } = window;
  const area = document.querySelector('#inicio');
  const outer = area?.querySelector('.logo-outer');
  const title = area?.querySelector('.logo');
  if (!area || !outer || !title) return;
  gsap.matchMedia().add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    const options = { ease: 'power3', duration: 0.5 };
    const outerRX = gsap.quickTo(outer, 'rotationX', options);
    const outerRY = gsap.quickTo(outer, 'rotationY', options);
    const innerX = gsap.quickTo(title, 'x', options);
    const innerY = gsap.quickTo(title, 'y', options);
    function move(event) {
      if (event.pointerType === 'touch') return;
      const bounds = area.getBoundingClientRect();
      const x = gsap.utils.clamp(0, 1, (event.clientX - bounds.left) / bounds.width);
      const y = gsap.utils.clamp(0, 1, (event.clientY - bounds.top) / bounds.height);
      outerRX(gsap.utils.interpolate(15, -15, y));
      outerRY(gsap.utils.interpolate(-15, 15, x));
      innerX(gsap.utils.interpolate(-30, 30, x));
      innerY(gsap.utils.interpolate(-30, 30, y));
    }
    function reset() { outerRX(0); outerRY(0); innerX(0); innerY(0); }
    area.addEventListener('pointermove', move);
    area.addEventListener('pointerleave', reset);
    window.addEventListener('blur', reset);
    return () => {
      area.removeEventListener('pointermove', move);
      area.removeEventListener('pointerleave', reset);
      window.removeEventListener('blur', reset);
    };
  });
}
initHeadingTilt();

// Mejora progresiva: sin JavaScript se conserva la tarjeta y su enlace originales.
document.querySelectorAll('.service-card').forEach((card, index) => {
  const heading = card.querySelector('h3');
  const description = card.querySelector('p');
  const link = card.querySelector('.service-link');
  const metadata = card.querySelector('.card-top');
  if (!heading || !description || !link || !metadata) return;
  const cover = document.createElement('div');
  cover.className = 'service-cover';
  const front = document.createElement('div');
  front.className = 'service-front';
  const back = document.createElement('div');
  back.className = 'service-back';
  back.id = `service-details-${index}`;
  const hint = document.createElement('p');
  hint.className = 'service-front-hint';
  hint.textContent = 'Conoce los detalles del servicio';
  const backTitle = document.createElement('p');
  backTitle.className = 'service-back-title';
  backTitle.textContent = heading.textContent;
  const flip = document.createElement('button');
  flip.type = 'button';
  flip.className = 'service-flip';
  flip.setAttribute('aria-controls', back.id);
  flip.setAttribute('aria-label', `Ver detalles: ${heading.textContent}`);
  front.append(metadata, heading, hint);
  back.append(backTitle, description, link);
  cover.append(front, back);
  card.append(cover, flip);
  card.classList.add('service-card-3d');
  function setFlipped(value) {
    card.classList.toggle('is-flipped', value);
    front.inert = value;
    back.inert = !value;
    front.setAttribute('aria-hidden', String(value));
    back.setAttribute('aria-hidden', String(!value));
    flip.setAttribute('aria-expanded', String(value));
    flip.textContent = value ? 'Volver ↶' : 'Ver detalles ↗';
    flip.setAttribute('aria-label', `${value ? 'Volver' : 'Ver detalles'}: ${heading.textContent}`);
  }
  flip.addEventListener('click', () => setFlipped(!card.classList.contains('is-flipped')));
  card.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse' && matchMedia('(hover: hover)').matches) setFlipped(true);
  });
  card.addEventListener('pointerleave', () => {
    if (!card.contains(document.activeElement)) setFlipped(false);
  });
  card.addEventListener('focusout', event => {
    if (!card.contains(event.relatedTarget) && !card.matches(':hover')) setFlipped(false);
  });
  card.addEventListener('keydown', event => {
    if (event.key === 'Escape') { flip.focus(); setFlipped(false); }
  });
  setFlipped(false);
});

// Cada panel conserva su altura; la transición comienza después de leer su contenido.
async function initSectionScroll() {
  if (!window.gsap || !window.ScrollTrigger) return;
  await document.fonts.ready;
  const {gsap, ScrollTrigger} = window;
  gsap.registerPlugin(ScrollTrigger);
  const panels = [...document.querySelectorAll('main > section.section')];
  const header = document.querySelector('.site-header');
  const shells = panels.map(panel => {
    const shell = document.createElement('div');
    shell.className = 'scroll-shell'; panel.before(shell); shell.append(panel);
    return shell;
  });
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    shells.forEach((shell,index) => {
      if(index === shells.length - 1) return;
      const panel = panels[index];
      gsap.fromTo(panel, {scale:1, opacity:1}, {
        scale:0.78, opacity:0.35, ease:'none',
        transformOrigin:'center bottom',
        scrollTrigger:{
          id:'panel-' + panel.id, trigger:shell,
          start:'bottom bottom',
          end:() => '+=' + Math.max(200, innerHeight-header.offsetHeight),
          pin:shell, pinSpacing:false, scrub:true, invalidateOnRefresh:true
        }
      });
    });
  });
  // Usa la posición natural del panel, incluso mientras está fijado.
  function navigateToPanel(id) {
    ScrollTrigger.refresh();
    const index = panels.findIndex(panel => panel.id === id);
    if(index < 0) return false;
    const trigger = ScrollTrigger.getById('panel-' + id);
    const top = trigger ? trigger.start - shells[index].offsetHeight + innerHeight : shells[index].getBoundingClientRect().top + scrollY;
    window.scrollTo({top:id === 'inicio' ? 0 : Math.max(0,top-header.offsetHeight),behavior:'instant'});
    // Sincroniza los paneles fijados en el mismo frame del salto de navegación.
    ScrollTrigger.refresh();
    requestAnimationFrame(() => ScrollTrigger.update());
    return true;
  }
  document.querySelectorAll('#main-navigation a, a[href="#servicios"], a[href="#servicios-soporte"], a[href="#inicio"]').forEach(link => {
    link.addEventListener('click',event => {
      const id = link.hash.slice(1);
      if (panels.some(panel => panel.id === id)) {
        event.preventDefault();
        navigateToPanel(id);
        history.replaceState(null,'',link.hash);
      }
    });
  });
  document.querySelectorAll('.faq-list details').forEach(item => item.addEventListener('toggle',() => ScrollTrigger.refresh()));
  window.addEventListener('hashchange', () => navigateToPanel(location.hash.slice(1)));
  ScrollTrigger.refresh();
  if(location.hash) navigateToPanel(location.hash.slice(1));
}
initSectionScroll();

// Luz ambiental local: sigue al puntero sin interceptar enlaces ni controles.
function initPointerLight() {
  const preference = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const surfaces = [...document.querySelectorAll('main > .scroll-shell > .section, main > section.section, .site-footer')];
  let frame = 0;
  let point = null;
  function draw() {
    frame = 0;
    surfaces.forEach(surface => {
      const rect = surface.getBoundingClientRect();
      const visible = point && rect.width && rect.height && point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
      surface.classList.toggle('has-pointer-light', Boolean(visible));
      if (!visible) return;
      // Las coordenadas porcentuales respetan la escala de los paneles de GSAP.
      surface.style.setProperty('--light-x', `${(point.x - rect.left) / rect.width * 100}%`);
      surface.style.setProperty('--light-y', `${(point.y - rect.top) / rect.height * 100}%`);
    });
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(draw); }
  function move(event) {
    if (!preference.matches || event.pointerType !== 'mouse') return;
    point = {x:event.clientX, y:event.clientY}; schedule();
  }
  function hide() { point = null; schedule(); }
  function configure() {
    hide();
    surfaces.forEach(surface => surface.classList.toggle('pointer-light-surface',preference.matches));
  }
  document.addEventListener('pointermove',move,{passive:true});
  document.documentElement.addEventListener('pointerleave',hide);
  window.addEventListener('blur',hide);
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  document.addEventListener('visibilitychange',() => {if(document.hidden) hide();});
  preference.addEventListener('change',configure);
  configure();
}
initPointerLight();
