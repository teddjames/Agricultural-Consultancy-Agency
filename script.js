/* THE TJ HUB / interactive navigation and accessible editorial panels */
'use strict';
document.documentElement.classList.add('js');
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const hover = matchMedia('(hover: hover) and (pointer: fine)');
const previews = {
  about: ['01','OUR PHILOSOPHY','Good things|grow together.','Sustainable farming, expert guidance and agricultural projects with purpose. From the field to the future.','avocadoimage4.jpeg','holdingavocado1.jpg','Cultivated farm','Fresh avocado held in a hand'],
  services: ['02','OUR EXPERTISE','Cultivate|with confidence.','Consultations, farm visits and practical support for avocado and bee start-ups.','avocadoimage4.jpeg','honeyimage1.jpg','Farm under cultivation','Honey and honeycomb'],
  products: ['03','OUR PRODUCE','Nature at|its finest.','Discover avocados, honey and honeycomb, available to order directly from The TJ Hub.','honeyjar1.jpg','avocadoimage5.jpg','Honey flowing into a jar','Fresh avocados'],
  projects: ['04','FIELD ARCHIVE','See growth|in motion.','Explore project films and a closer look at our agricultural practices and harvests.','project-1.jpg','project-4.jpg','Still from a project film','Still from the harvested honey film'],
  feedback: ['05','FARMER STORIES','Good growth.|Shared voices.','Hear from farmers about their experiences working with The TJ Hub.','holdingavocado2.jpg','avocadoimage4.jpeg','Fresh avocado held in a hand','Farm under cultivation'],
  contact: ['06','LET’S CONNECT','Start something|good.','Reach out for farm guidance, product inquiries or your next agricultural project.','honeyimage1.jpg','flick honey.jpeg','Honeycomb and honey','Jars of honey']
};
const preview = $('.preview');
const scene = $('#scene');
let previewKey = 'about', previewTimer;
function updatePreview(key) {
  if (!previews[key] || key === previewKey) return;
  previewKey = key;
  $$('.nav-item').forEach(button => button.classList.toggle('active', button.dataset.open === key));
  clearTimeout(previewTimer);
  preview.classList.add('changing');
  previewTimer = setTimeout(() => {
    const [n,kicker,title,description,photo,mini,alt,miniAlt] = previews[key];
    $('#preview-index').textContent = `${n} / 06`;
    $('#preview-kicker').textContent = `${n} — ${kicker}`;
    $('#photo-label').textContent = `FIELD NOTES / ${n}`;
    const heading = $('#preview-title');
    heading.replaceChildren();
    title.split('|').forEach((line,i) => { if (i) heading.append(document.createElement('br')); heading.append(line); });
    $('#preview-description').textContent = description;
    $('#preview-image').src = `images/${encodeURIComponent(photo)}`;
    $('#preview-image').alt = alt;
    $('#mini-image').src = `images/${encodeURIComponent(mini)}`;
    $('#mini-image').alt = miniAlt;
    preview.classList.remove('changing');
  }, reduced.matches ? 0 : 130);
}
// Preload the small still images after the first view, not the project videos.
window.addEventListener('load', () => { new Set(Object.values(previews).flatMap(p => [p[4],p[5]])).forEach(file => { const image = new Image(); image.src = `images/${encodeURIComponent(file)}`; }); });
$$('.nav-item').forEach(button => {
  button.addEventListener('pointerenter', () => { if (hover.matches) updatePreview(button.dataset.open); });
  button.addEventListener('focus', () => updatePreview(button.dataset.open));
});
scene.addEventListener('pointermove', event => {
  if (!hover.matches || reduced.matches) return;
  const rect = scene.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - .5;
  const y = (event.clientY - rect.top) / rect.height - .5;
  scene.style.setProperty('--rx', `${-y*12}deg`);
  scene.style.setProperty('--ry', `${x*14}deg`);
  scene.style.setProperty('--tx', `${x*15}px`);
  scene.style.setProperty('--ty', `${y*15}px`);
});
scene.addEventListener('pointerleave', () => ['--rx','--ry','--tx','--ty'].forEach(prop => scene.style.removeProperty(prop)));
let currentSheet = null, lastTrigger = null, closing = false, observer = null;
const sheetIds = Object.keys(previews);
function revealSheet(sheet) {
  observer?.disconnect();
  const elements = $$('.reveal', sheet);
  if (!('IntersectionObserver' in window) || reduced.matches) { elements.forEach(el => el.classList.add('in-view')); return; }
  observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
  }), {root:sheet,threshold:.08});
  elements.forEach(el => observer.observe(el));
}
function stopVideos(sheet) { $$('video', sheet).forEach(video => video.pause()); }
function openSheet(key, trigger = null) {
  const sheet = document.getElementById(key);
  if (!sheet || !sheetIds.includes(key) || closing || currentSheet === sheet) return;
  if (currentSheet) { stopVideos(currentSheet); currentSheet.classList.remove('visible'); currentSheet.close(); }
  else lastTrigger = trigger || $(`.nav-item[data-open="${key}"]`);
  updatePreview(key);
  currentSheet = sheet;
  sheet.showModal();
  sheet.scrollTop = 0;
  $('.close',sheet).focus({preventScroll:true});
  revealSheet(sheet);
  requestAnimationFrame(() => requestAnimationFrame(() => { if(currentSheet === sheet) sheet.classList.add('visible'); }));
}
function closeSheet() {
  if (!currentSheet || closing) return;
  closing = true;
  const sheet = currentSheet;
  stopVideos(sheet);
  sheet.classList.remove('visible');
  const finish = () => {
    if (!closing || currentSheet !== sheet) return;
    sheet.close();
    observer?.disconnect();
    currentSheet = null;
    closing = false;
    lastTrigger?.focus({preventScroll:true});
  };
  if (reduced.matches) finish(); else setTimeout(finish, 530);
}
$$('[data-open]').forEach(button => button.addEventListener('click', () => openSheet(button.dataset.open, button)));
$$('[data-close]').forEach(button => button.addEventListener('click', closeSheet));
$$('.sheet').forEach(sheet => {
  sheet.addEventListener('cancel', event => {event.preventDefault();closeSheet();});
  sheet.addEventListener('click', event => {if (event.target !== sheet) return;const r=sheet.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeSheet();});
});
$$('video').forEach(video => video.addEventListener('play', () => $$('video').filter(other => other !== video).forEach(other => other.pause())));
const messages = {
  'Consultation Session': "Hello, I'd like to book a Consultation Session.",
  'Farm visit/tour': "Hello, I'd like a farm visit.",
  'Avocado Farm Start-up': "Hello, I'd like to inquire about an Avocado Farm Start-up.",
  'Bee Farm Start-up': "Hello, I'd like to inquire about a Bee Farm Start-up.",
  'Avocado': "Hello, I'd like to buy Avocados.",
  'Honey': "Hello, I'd like to buy Honey.",
  'Honey Comb': "Hello, I'd like to buy Honey Comb."
};
$$('[data-wa]').forEach(link => {link.href = `https://wa.me/254724483626?text=${encodeURIComponent(messages[link.dataset.wa] || 'Hello, I have a general inquiry on The TJ Hub.')}`;});


/* Opening sequence: wait for critical landing images, never for project videos. */
(function initIntro() {
  const root = document.documentElement;
  if (!root.classList.contains('intro-loading')) return;
  const start = performance.now();
  const minimum = 1300;
  const maximum = 3400;
  let finished = false;
  let deadline;
  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(deadline);
    document.getElementById('intro-status').textContent = 'READY TO GROW';
    root.classList.add('intro-exit');
    setTimeout(() => root.classList.remove('intro-loading', 'intro-exit'), 750);
  }
  function waitForImage(image) {
    if (!image) return Promise.resolve();
    if (typeof image.decode === 'function') return image.decode().catch(() => {});
    if (image.complete) return Promise.resolve();
    return new Promise(resolve => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    });
  }
  deadline = setTimeout(finish, maximum);
  Promise.all(['#preview-image', '#mini-image', '.brand img'].map(selector => waitForImage(document.querySelector(selector))))
    .then(() => setTimeout(finish, Math.max(0, minimum - (performance.now() - start))));
  // Avoid replaying the intro when restoring a page from the back-forward cache.
  window.addEventListener('pageshow', event => {
    if (event.persisted) {
      finished = true;
      clearTimeout(deadline);
      root.classList.remove('intro-loading', 'intro-exit');
    }
  });
})();
