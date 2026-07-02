
gsap.registerPlugin(ScrollTrigger);

/* Nav shrink on scroll */
const header = document.getElementById('siteHeader');
ScrollTrigger.create({
  start: 'top -80',
  end: 99999,
  toggleClass: {targets: header, className: 'scrolled'}
});

/* Hero load-in sequence */
gsap.timeline({defaults:{ease:'power3.out'}})
  .to('.hero h1.reveal', {opacity:1, y:0, duration:.9})
  .to('.hero p.lead.reveal', {opacity:1, y:0, duration:.8}, '-=.55')
  .to('.hero-tags.reveal', {opacity:1, y:0, duration:.7}, '-=.5')
  .to('.hero-cta.reveal', {opacity:1, y:0, duration:.7}, '-=.5')
  .to('.hero-rating.reveal', {opacity:1, y:0, duration:.6}, '-=.45')
  .to('.hero-media.reveal', {opacity:1, y:0, duration:1, x:0}, '-=.9');

/* Generic scroll reveals */
gsap.utils.toArray('.reveal').forEach((el) => {
  if (el.closest('.hero')) return; // hero handled by intro timeline
  gsap.fromTo(el, {opacity:0, y:36}, {
    opacity:1, y:0, duration:.9, ease:'power3.out',
    scrollTrigger:{ trigger:el, start:'top 88%' }
  });
});

/* Stagger cards within grids */
[['.why-grid','.card'], ['.services-grid','.service-card'], ['.reviews-grid','.review-card'], ['.contact-grid','.contact-card'], ['.gallery-grid','figure']].forEach(([parentSel, childSel])=>{
  const parent = document.querySelector(parentSel);
  if(!parent) return;
  gsap.fromTo(parent.querySelectorAll(childSel), {opacity:0, y:34}, {
    opacity:1, y:0, duration:.8, ease:'power3.out', stagger:.12,
    scrollTrigger:{ trigger:parent, start:'top 85%' }
  });
});

/* Count-up stats */
document.querySelectorAll('[data-count]').forEach((el)=>{
  const target = +el.dataset.count;
  const suffix = el.dataset.suffix || '';
  const obj = {val:0};
  ScrollTrigger.create({
    trigger: el, start:'top 90%', once:true,
    onEnter: () => {
      gsap.to(obj, {
        val: target, duration:1.8, ease:'power2.out',
        onUpdate: () => el.textContent = Math.floor(obj.val).toLocaleString() + suffix
      });
    }
  });
});

/* Process route: truck travels along the dashed line, steps light up as it passes */
function initProcess(){
  const track = document.getElementById('processTrack');
  const steps = gsap.utils.toArray('.step', track);
  const line = document.getElementById('lineFill');
  const truck = document.getElementById('truckMarker');
  if(window.innerWidth <= 1024) return; // line hidden on smaller screens

  const dots = steps.map(s => s.querySelector('.dot'));
  const positions = () => dots.map(d => d.getBoundingClientRect().left - track.getBoundingClientRect().left + d.offsetWidth/2);

  ScrollTrigger.create({
    trigger: track,
    start: 'top 70%',
    end: 'bottom 60%',
    scrub: .6,
    onUpdate: (self) => {
      const pos = positions();
      const trackWidth = track.getBoundingClientRect().width;
      const x = self.progress * trackWidth;
      line.style.width = (self.progress*100) + '%';
      truck.style.left = x + 'px';

      steps.forEach((step, i) => {
        step.classList.toggle('active', x >= pos[i] - 4);
      });
    }
  });
}
window.addEventListener('load', initProcess);
window.addEventListener('resize', () => ScrollTrigger.refresh());

/* Mobile menu (basic toggle) */
const toggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
toggle?.addEventListener('click', () => {
  const open = navLinks.style.display === 'flex';
  navLinks.style.display = open ? 'none' : 'flex';
  navLinks.style.cssText += open ? '' : 'position:absolute; top:100%; left:0; right:0; background:#fff; flex-direction:column; padding:20px 32px; box-shadow:0 20px 30px -20px rgba(11,46,89,.3);';
});