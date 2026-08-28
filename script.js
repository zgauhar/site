const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open)});
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

document.querySelector('#contactForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  const note=e.currentTarget.querySelector('.form-note');
  note.textContent='Thanks — your message is ready to be sent. Connect this form to your preferred form service for GitHub Pages.';
});
