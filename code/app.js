/* Maison Alba — lightweight interactions. All editable menu data is in config.js. */
const config = window.MAISON_CONFIG;
const imageUrls = {"dining": "../assets/dining.jpg", "kitchen": "../assets/kitchen.jpg", "risotto": "../assets/risotto.jpg", "duck": "../assets/duck.jpg", "paella": "../assets/paella.jpg", "burrata": "../assets/burrata.jpg", "beef": "../assets/beef.jpg", "tart": "../assets/tart.jpg", "bar": "../assets/bar.jpg", "terrace": "../assets/terrace.jpg"};
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// The brand name can be changed centrally without editing the page copy.
if (config.name !== 'Maison Alba') {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.filter(node => !['SCRIPT','STYLE'].includes(node.parentElement.tagName)).forEach(node => {
    node.textContent = node.textContent.replaceAll('Maison Alba', config.name).replaceAll('maison alba', config.name.toLowerCase());
  });
  document.title = document.title.replace('Maison Alba', config.name);
}

// Sample phone numbers are intentionally not dialable.
$$('[data-phone]').forEach(link => {
  link.childNodes.forEach(node => { if (node.nodeType === 3 && node.textContent.trim()) node.textContent = ` ${config.phoneDisplay} `; });
  if (config.phoneHref) link.href = config.phoneHref;
  else link.setAttribute('aria-label', 'Sample phone number — replace before launch');
});
$('#year').textContent = new Date().getFullYear();

// Mobile navigation closes on link selection, Escape, and outside clicks.
const navToggle = $('.menu-toggle');
const navigation = $('#navigation');
function closeNav() { navigation.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); navToggle.setAttribute('aria-label', 'Open menu'); }
navToggle.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('open', open); navToggle.setAttribute('aria-expanded', String(open)); navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
$$('a', navigation).forEach(link => link.addEventListener('click', closeNav));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && navigation.classList.contains('open')) { closeNav(); navToggle.focus(); } });
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeNav(); });
window.matchMedia('(min-width: 1024px)').addEventListener('change', closeNav);

// Signature cards.
$('#dish-grid').innerHTML = config.dishes.map(dish => `<article class="dish-card reveal"><div class="dish-photo"><img src="${escapeHTML(imageUrls[dish.image])}" alt="${escapeHTML(dish.alt)}" loading="lazy" width="900" height="600"></div><div class="dish-copy"><div class="dish-title"><h3>${escapeHTML(dish.name)}</h3><span>€${escapeHTML(dish.price)}</span></div><p>${escapeHTML(dish.description)}</p></div></article>`).join('');

// Tabs support arrow keys, Home and End as well as clicks.
const tabs = $$('[role="tab"]');
function selectTab(tab) {
  tabs.forEach(item => { const selected = item === tab; item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1; });
  const panel = $('#menu-panel'); panel.setAttribute('aria-labelledby', tab.id);
  panel.innerHTML = config.menus[tab.dataset.category].map(([name,description,price,tags]) => `<article class="menu-item"><div class="menu-item-title"><h3>${escapeHTML(name)} ${tags.split(', ').filter(Boolean).map(tag => `<span class="diet">${escapeHTML(tag)}</span>`).join('')}</h3><span>€${escapeHTML(price)}</span></div><p>${escapeHTML(description)}</p></article>`).join('');
}
tabs.forEach((tab,index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault(); selectTab(tabs[next]); tabs[next].focus();
  });
});
selectTab(tabs[0]);

// Native dialog supplies focus trapping, Escape support and focus restoration.
$('#gallery-grid').innerHTML = config.gallery.map(([image,title,alt],index) => `<button class="gallery-photo reveal" data-photo="${index}" aria-label="Open photo: ${escapeHTML(title)}"><img src="${escapeHTML(imageUrls[image])}" alt="${escapeHTML(alt)}" loading="lazy" width="900" height="700"></button>`).join('');
const lightbox = $('#lightbox'); let photoIndex = 0;
function showPhoto(index) {
  photoIndex = (index + config.gallery.length) % config.gallery.length;
  const [file,title,alt] = config.gallery[photoIndex];
  $('#lightbox-image').src = imageUrls[file]; $('#lightbox-image').alt = alt;
  $('#lightbox-caption').textContent = `${title} · ${photoIndex + 1} / ${config.gallery.length}`;
}
$$('[data-photo]').forEach(button => button.addEventListener('click', () => { showPhoto(Number(button.dataset.photo)); lightbox.showModal(); document.body.classList.add('modal-open'); }));
$('.lightbox-close').addEventListener('click', () => lightbox.close());
$('.lightbox-prev').addEventListener('click', () => showPhoto(photoIndex - 1));
$('.lightbox-next').addEventListener('click', () => showPhoto(photoIndex + 1));
lightbox.addEventListener('close', () => document.body.classList.remove('modal-open'));
lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
lightbox.addEventListener('keydown', event => { if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(photoIndex - 1); } if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(photoIndex + 1); } });

// Local-date validation avoids UTC date boundary errors.
function localDate(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
const form = $('#reservation-form'); const dateInput = $('#date'); dateInput.min = localDate();
const validationFields = ['name','phone','email','date','time','guests'];
validationFields.forEach(id => { const input = $(`#${id}`); input.setAttribute('aria-describedby', `${id}-error`); input.addEventListener('input', () => { input.removeAttribute('aria-invalid'); $(`#${id}-error`).textContent = ''; $('#reservation-status').textContent = ''; }); });
dateInput.addEventListener('change', () => {
  const sunday = new Date(`${dateInput.value}T12:00:00`).getDay() === 0;
  $$('#time option').forEach(option => { if (option.value) option.disabled = sunday && option.value > '20:00'; });
  if ($('#time').selectedOptions[0].disabled) $('#time').value = '';
});
form.addEventListener('submit', async event => {
  event.preventDefault(); const data = Object.fromEntries(new FormData(form));
  Object.keys(data).forEach(key => data[key] = data[key].trim());
  const errors = {};
  if (data.name.length < 2) errors.name = 'Please enter your full name.';
  if (!/^[+\d\s().-]{7,30}$/.test(data.phone) || data.phone.replace(/\D/g,'').length < 7) errors.phone = 'Please enter a valid phone number.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Please enter a valid email address.';
  const chosenDate = new Date(`${data.date}T12:00:00`);
  if (!data.date || Number.isNaN(chosenDate.getTime()) || data.date < localDate()) errors.date = 'Choose today or a future date.';
  else if (chosenDate.getDay() === 1) errors.date = 'We rest on Mondays. Choose Tuesday to Sunday.';
  const allowedTimes = $$('#time option').filter(option => option.value && !option.disabled).map(option => option.value);
  if (!allowedTimes.includes(data.time)) errors.time = 'Please choose an available dinner time.';
  else if (data.date === localDate() && new Date(`${data.date}T${data.time}:00`) <= new Date()) errors.time = 'Please choose a time later than now.';
  if (!/^[1-8]$/.test(data.guests)) errors.guests = 'Please select 1 to 8 guests.';
  validationFields.forEach(id => { const input = $(`#${id}`); $(`#${id}-error`).textContent = errors[id] || ''; input.setAttribute('aria-invalid', String(Boolean(errors[id]))); });
  if (Object.keys(errors).length) { $(`#${Object.keys(errors)[0]}`).focus(); return; }
  const status = $('#reservation-status');
  if (!config.reservationEndpoint) {
    status.textContent = `Your details look good, ${data.name.split(' ')[0]}. Demo complete for ${data.guests} ${data.guests==='1'?'guest':'guests'} on ${chosenDate.toLocaleDateString(undefined,{day:'numeric',month:'long'})} at ${data.time}. No reservation has been sent or confirmed.`;
    status.focus(); return;
  }
  const submit = $('button[type="submit"]', form); submit.disabled = true;
  try {
    const response = await fetch(config.reservationEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    if (!response.ok) throw new Error('Request failed');
    status.textContent = 'Thank you. Your reservation request has been sent. Our team will contact you to confirm availability.'; form.reset();
  } catch { status.textContent = 'We could not send your request. Please try again or contact the restaurant directly.'; }
  finally { submit.disabled = false; status.focus(); }
});

// Newsletter is a clearly labelled demo until a real provider is connected.
$('#newsletter-form').addEventListener('submit', event => {
  event.preventDefault(); const input = $('#newsletter-email'); const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
  input.setAttribute('aria-invalid', String(!valid)); input.setAttribute('aria-describedby','newsletter-status');
  $('#newsletter-status').textContent = valid ? 'Thank you — demo complete. No subscription has been created.' : 'Please enter a valid email address.';
  if (!valid) input.focus();
});

// Progressive enhancement: content remains visible if JS or observers fail.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), {threshold: .08});
  $$('.reveal').forEach(element => observer.observe(element));
}
