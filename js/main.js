/* main.js — behavior for Veloura */
const PRODUCTS = [
  {id:1, name:'Meloncat Hoodie', price:185000, img:'assets/product1.svg', best:true},
  {id:2, name:'Velvet Scarf', price:95000, img:'assets/product2.svg', best:true},
  {id:3, name:'Rose Gold Pin', price:45000, img:'assets/product3.svg', best:true},
  {id:4, name:'Dusty Mauve Tote', price:125000, img:'assets/product4.svg', best:true},
  {id:5, name:'Charcoal Beanie', price:85000, img:'assets/product5.svg', best:true},
  {id:6, name:'Vintage Tee', price:99000, img:'assets/product6.svg', best:false},
];

const slider = document.getElementById('product-slider');
const productsGrid = document.getElementById('products');
const cartBtn = document.getElementById('cart');
const cartDrawer = document.getElementById('cart-drawer');
const cartCount = document.getElementById('cart-count');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');
const progressFill = document.getElementById('progress-fill');
const steps = Array.from(document.querySelectorAll('.step'));
const playBtn = document.getElementById('play-progress');
const confirmBtn = document.getElementById('confirm-order');

let cart = [];

// utility rupiah
function formatRp(v){ return 'Rp' + v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }

// populate slider (max 5)
function buildSlider(){
  const best = PRODUCTS.filter(p=>p.best).slice(0,5);
  best.forEach(p=>{
    const el = document.createElement('div');
    el.className = 'slide';
    el.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h4>${p.name}</h4>
      <div class="price">${formatRp(p.price)}</div>
      <button class="btn" data-id="${p.id}">Tambah ke keranjang</button>
    `;
    slider.appendChild(el);
  });
}

// populate products grid
function buildProducts(){
  PRODUCTS.forEach(p=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" style="height:160px;object-fit:contain;border-radius:8px"/>
      <h4>${p.name}</h4>
      <div class="price">${formatRp(p.price)}</div>
      <div style="margin-top:auto;display:flex;gap:8px">
        <button class="btn primary" data-id="${p.id}">Beli Sekarang</button>
        <button class="btn" data-id="${p.id}" aria-label="Tambah ke keranjang">+</button>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}

// add to cart with "meloncat" animation
function animateToCart(imgSrc, fromEl){
  // create flying image
  const f = document.createElement('img');
  f.src = 'assets/meloncat.svg';
  f.style.position = 'fixed';
  f.style.width='80px';
  f.style.zIndex=9999;
  const r = fromEl.getBoundingClientRect();
  f.style.left = r.left + 'px';
  f.style.top = r.top + 'px';
  document.body.appendChild(f);
  // target: cart button
  const target = cartBtn.getBoundingClientRect();
  const dx = target.left - r.left;
  const dy = target.top - r.top;
  f.animate([
    {transform: 'translate(0,0) scale(1)', opacity:1},
    {transform: `translate(${dx}px, ${dy}px) scale(.4) rotate(30deg)`, opacity:0.6}
  ], {duration:700, easing:'cubic-bezier(.2,.8,.2,1)'});
  setTimeout(()=> f.remove(),800);
}

function addToCart(id, sourceEl){
  const p = PRODUCTS.find(x=>x.id===Number(id));
  const existing = cart.find(i=>i.id===p.id);
  if(existing) existing.qty++;
  else cart.push({id:p.id, name:p.name, price:p.price, qty:1});
  updateCartUI();
  animateToCart(p.img, sourceEl);
}

function updateCartUI(){
  cartCount.textContent = cart.reduce((s,i)=>s+i.qty,0);
  cartItemsEl.innerHTML = '';
  let total=0;
  cart.forEach(it=>{
    total += it.price * it.qty;
    const div = document.createElement('div'); div.className='item';
    div.innerHTML = `<div>${it.name} x${it.qty}</div><div>${formatRp(it.price*it.qty)}</div>`;
    cartItemsEl.appendChild(div);
  });
  cartTotalEl.textContent = formatRp(total);
}

// events
document.addEventListener('click', e=>{
  const id = e.target.getAttribute('data-id');
  if(id){
    addToCart(id, e.target);
  }
  if(e.target.closest('#cart')) cartDrawer.classList.toggle('open');
  if(e.target.id==='shop-now') window.scrollTo({top:700, behavior:'smooth'});
  if(e.target.id==='prev') slider.scrollBy({left:-220, behavior:'smooth'});
  if(e.target.id==='next') slider.scrollBy({left:220, behavior:'smooth'});
  if(e.target.id==='checkout-btn') {
    checkoutModal.classList.remove('hidden'); checkoutModal.setAttribute('aria-hidden','false');
  }
});

buildSlider();
buildProducts();
updateCartUI();

// testimonials functionality
const testiList = document.getElementById('testi-list');
const testiForm = document.getElementById('testi-form');
let TESTIS = [
  {name:'Anita', msg:'Kualitas bagus, packaging cantik!'},
  {name:'Riko', msg:'Pengiriman cepat, suka banget.'}
];
function renderTestis(){ testiList.innerHTML=''; TESTIS.forEach(t=>{ const d=document.createElement('div'); d.className='testi'; d.innerHTML=`<strong>${t.name}</strong><p>${t.msg}</p>`; testiList.appendChild(d); }) }
testiForm.addEventListener('submit', e=>{
  e.preventDefault();
  const name = document.getElementById('name').value || 'Anon';
  const msg = document.getElementById('message').value;
  TESTIS.unshift({name,msg});
  renderTestis();
  testiForm.reset();
});
renderTestis();

// feedback form
const fbForm = document.getElementById('feedback-form');
const fbResult = document.getElementById('fb-result');
fbForm.addEventListener('submit', e=>{
  e.preventDefault();
  const name = document.getElementById('fb-name').value || 'Anon';
  const msg = document.getElementById('fb-message').value;
  fbResult.textContent = `Terima kasih ${name}! Kritik & saran Anda telah kami terima.`;
  fbForm.reset();
});

// checkout progress game
let progress = 0;
function setProgress(p){
  progress = Math.max(0, Math.min(100, p));
  progressFill.style.width = progress + '%';
  steps.forEach((s,i)=> s.classList.toggle('active', progress >= (i+1)*25));
}
steps.forEach((s,idx)=> s.addEventListener('click', ()=> setProgress((idx+1)*25)));
document.addEventListener('keydown', (e)=>{ if(e.code==='Space') { e.preventDefault(); setProgress(progress+12); }});
playBtn.addEventListener('click', ()=>{
  // mini-game: fast-fill animation then slow down
  let p = progress;
  const iv = setInterval(()=>{
    p += Math.random()*8 + 6;
    setProgress(p);
    if(p>=100){ clearInterval(iv); }
  },120);
});
confirmBtn.addEventListener('click', ()=>{
  alert('Pesanan terkonfirmasi! Terima kasih telah berbelanja di Veloura.');
  checkoutModal.classList.add('hidden');
  checkoutModal.setAttribute('aria-hidden','true');
  cart = []; updateCartUI();
});

// close modal
document.getElementById('close-checkout').addEventListener('click', ()=>{ checkoutModal.classList.add('hidden'); checkoutModal.setAttribute('aria-hidden','true'); });

// initial accessibility tweaks
document.querySelectorAll('.btn').forEach(b=> b.setAttribute('role','button'));
