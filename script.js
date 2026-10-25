(() => {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let width, height, particles = [], pointer = {x: -1000, y: -1000};
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = width * dpr; canvas.height = height * dpr;
    canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(90, Math.floor(width / 15));
    particles = Array.from({length: count}, () => ({x: Math.random()*width, y: Math.random()*height, vx:(Math.random()-.5)*.22, vy:(Math.random()-.5)*.22, r:Math.random()*1.4+.35}));
  }
  function draw() {
    ctx.clearRect(0,0,width,height);
    for (let i=0;i<particles.length;i++) {
      const p=particles[i]; p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>width)p.vx*=-1; if(p.y<0||p.y>height)p.vy*=-1;
      const dx=pointer.x-p.x, dy=pointer.y-p.y, dist=Math.hypot(dx,dy);
      if(!reduced && dist<130){p.x-=dx*.0007;p.y-=dy*.0007;}
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(214,181,109,.62)';ctx.fill();
      for(let j=i+1;j<particles.length;j++){const q=particles[j],d=Math.hypot(p.x-q.x,p.y-q.y);if(d<95){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle='rgba(214,181,109,'+(1-d/95)*.12+')';ctx.lineWidth=.6;ctx.stroke();}}
    }
    if(!reduced) requestAnimationFrame(draw);
  }
  resize(); draw(); window.addEventListener('resize', resize);
  window.addEventListener('pointermove', e => {pointer.x=e.clientX;pointer.y=e.clientY;}, {passive:true});
  const stage=document.getElementById('portraitStage'), frame=document.querySelector('.portrait-frame');
  if(stage && frame && !reduced && window.matchMedia('(pointer:fine)').matches){
    stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;frame.style.transform='rotateY('+(-7+x*12)+'deg) rotateX('+(2-y*8)+'deg) translateZ(8px)';});
    stage.addEventListener('pointerleave',()=>frame.style.transform='rotateY(-7deg) rotateX(2deg)');
  }
  const observer = new IntersectionObserver(entries => entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.12});
  document.querySelectorAll('.section-index,.about-grid,.principles,.work-heading,.project-card,.stack-layout,.contact-inner h2,.contact-copy').forEach(el=>{el.classList.add('reveal');observer.observe(el);});
  const toggle=document.querySelector('.menu-toggle'), links=document.querySelector('.nav-links');
  toggle?.addEventListener('click',()=>{const open=links.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
  links?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{links.classList.remove('open');toggle?.setAttribute('aria-expanded','false');}));
  document.getElementById('year').textContent=new Date().getFullYear();
})();