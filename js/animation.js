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
const mobileMenuViewport = window.matchMedia('(max-width: 1023px)');
let previousMenuScroll = Math.max(0, window.scrollY);
window.addEventListener('scroll', () => {
  const currentScroll = Math.max(0, window.scrollY);
  if (mobileMenuViewport.matches && currentScroll > previousMenuScroll && navigation.classList.contains('is-open')) {
    closeMenu();
  }
  previousMenuScroll = currentScroll;
}, {passive:true});

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
  let syncReveals = () => {};
  gsap.matchMedia().add({
    desktop:'(min-width: 1024px)',
    mobile:'(max-width: 1023px)',
    reduced:'(prefers-reduced-motion: reduce)'
  }, context => {
    if (context.conditions.reduced) return;
    const mobile = context.conditions.mobile;
    if (!mobile) shells.forEach((shell,index) => {
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

    const revealSelectors = new Map([
      ['servicios', '.section-heading > *, .service-card, .service-next'],
      ['servicios-soporte', '.section-heading > *, .service-card'],
      ['proceso', '.section-heading > *, .steps > li'],
      ['cotizador-express', '.container > *'],
      ['preguntas', '.faq-grid > :first-child, .faq-list details'],
      ['redes-sociales', '.section-heading > *, .social-card']
    ]);
    if (mobile) revealSelectors.set('inicio', '.hero-tag, .hero-copy, .equipment-panel, .category-strip > *');

    const compact = matchMedia('(max-width: 767px)').matches;
    const revealCleanups = [];
    const pendingReveals = new Map();
    syncReveals = (panel) => {
      pendingReveals.forEach((state, element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top >= innerHeight * .85 || rect.bottom <= header.offsetHeight) return;
        if (element.contains(document.activeElement)) {
          state.tween.progress(1).pause();
          state.armed = false;
        } else if (state.armed || panel?.contains(element)) {
          state.armed = false;
          state.tween.restart(true);
        }
      });
    };
    // Entrada dentro de la pantalla; rearme sólo al salir por completo.
    // Los márgenes separados evitan reinicios al oscilar cerca del borde.
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const state = pendingReveals.get(entry.target);
        if (!state?.armed || entry.target.contains(document.activeElement)) return;
        state.armed = false;
        state.tween.restart(true);
      });
    }, {rootMargin:'0px 0px -15% 0px'});
    const exitObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const state = pendingReveals.get(entry.target);
        if (entry.isIntersecting || !state || state.armed) return;
        if (entry.target.contains(document.activeElement)) return;
        // Rearma fuera de pantalla, sin mostrar primero la tarjeta al regresar.
        state.tween.progress(1).pause();
        gsap.set(entry.target, {opacity:0});
        state.armed = true;
      });
    }, {rootMargin:'60px 0px 60px 0px'});
    function reveal(element, index, direction = 'up') {
      if (mobile) direction = 'left';
      const serviceEntry = element.matches('#servicios .service-card, #servicios-soporte .service-card');
      const distance = mobile ? 40 : (serviceEntry ? 150 : (compact ? 20 : 40));
      const x = direction === 'left' ? -distance : direction === 'right' ? distance : 0;
      const tween = gsap.fromTo(element, {
        opacity:0,
        x, y:x ? 0 : (compact ? 28 : 44)
      }, {
        opacity:1,
        x:0, y:0,
        duration:2,
        delay:serviceEntry ? index * .04 : (index % 3) * .14,
        ease:serviceEntry ? 'power4.out' : 'power2.inOut',
        paused:true,
        immediateRender:false,
        clearProps:'opacity,transform',
      });
      gsap.set(element, {opacity:0});
      pendingReveals.set(element, {tween, armed:true});
      revealObserver.observe(element);
      exitObserver.observe(element);
      // El teclado muestra inmediatamente el control enfocado y su contenido.
      const showOnFocus = () => {
        pendingReveals.get(element).armed = false;
        tween.progress(1).pause();
      };
      element.addEventListener('focusin', showOnFocus);
      revealCleanups.push(() => element.removeEventListener('focusin', showOnFocus));
    }

    panels.forEach(panel => {
      const selector = revealSelectors.get(panel.id) || (panel.classList.contains('closing') ? '.container > *' : '');
      if (!selector) return;

      panel.querySelectorAll(selector).forEach((element,index) => {
        let direction = 'up';
        let sequenceIndex = index;
        if (['servicios', 'servicios-soporte'].includes(panel.id) && element.matches('.service-card')) {
          // Variante lateral del ejemplo: x:150 hasta x:0 en ambas secciones.
          direction = 'right';
          const grid = element.parentElement;
          const columns = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
          sequenceIndex = [...grid.children].indexOf(element) % columns;
        } else if (element.parentElement.matches('.section-heading')) {
          direction = index % 2 ? 'right' : 'left';
        } else if (panel.id === 'preguntas') {
          direction = element.matches('details') ? 'right' : 'left';
        } else if (element.matches('.steps > li, .social-card')) {
          direction = index % 2 ? 'left' : 'right';
        }
        reveal(element, sequenceIndex, direction);
      });
    });

    const footerItems = document.querySelectorAll('.site-footer .footer-row > *');
    footerItems.forEach((element,index) => {
      reveal(element, index);
    });

    const hero = document.querySelector('#inicio');
    if (!mobile && hero && (!location.hash || location.hash === '#inicio')) {
      const heroTag = hero.querySelector('.hero-tag');
      const heroCopy = hero.querySelector('.hero-copy');
      const heroActions = hero.querySelectorAll('.actions > *');
      const heroNotes = hero.querySelectorAll('.hero-notes > *');
      const equipmentPanel = hero.querySelector('.equipment-panel');
      const categoryItems = hero.querySelectorAll('.category-strip > *');

      gsap.timeline({defaults:{ease:'power3.out'}})
        .fromTo(heroTag, {autoAlpha:0,y:16}, {
          autoAlpha:1,y:0,duration:.5,clearProps:'opacity,visibility,transform'
        }, 0)
        .fromTo(heroCopy?.querySelector('.eyebrow'), {autoAlpha:0,y:18}, {
          autoAlpha:1,y:0,duration:.5,clearProps:'opacity,visibility,transform'
        }, .1)
        .fromTo(hero.querySelector('.heading-tilt'), {autoAlpha:0,y:24}, {
          autoAlpha:1,y:0,duration:.7,clearProps:'opacity,visibility,transform'
        }, .2)
        .fromTo(heroCopy?.querySelector('.lead'), {autoAlpha:0,y:18}, {
          autoAlpha:1,y:0,duration:.55,clearProps:'opacity,visibility,transform'
        }, .35)
        .fromTo(heroActions, {autoAlpha:0,y:16}, {
          autoAlpha:1,y:0,duration:.45,stagger:.1,clearProps:'opacity,visibility,transform'
        }, .5)
        .fromTo(equipmentPanel, {autoAlpha:0,y:24,scale:.97}, {
          autoAlpha:1,y:0,scale:1,duration:.75,clearProps:'opacity,visibility,transform'
        }, .2)
        .fromTo(heroNotes, {autoAlpha:0,y:12}, {
          autoAlpha:1,y:0,duration:.4,stagger:.08,clearProps:'opacity,visibility,transform'
        }, .8)
        .fromTo(categoryItems, {autoAlpha:0,y:16}, {
          autoAlpha:1,y:0,duration:.45,stagger:.08,clearProps:'opacity,visibility,transform'
        }, .9);
    }
    return () => {
      revealObserver.disconnect();
      exitObserver.disconnect();
      pendingReveals.clear();
      syncReveals = () => {};
      revealCleanups.forEach(cleanup => cleanup());
    };
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
    requestAnimationFrame(() => {
      ScrollTrigger.update();
      syncReveals(panels[index]);
    });
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
  requestAnimationFrame(() => syncReveals());
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
