import PRODUCTS from './data.js';

const grid = document.getElementById('product-grid');
const cartBtn = document.getElementById('open-cart');
const cartDrawer = document.getElementById('cart-drawer');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsEl = document.getElementById('cart-items');
const cartCountEl = document.getElementById('cart-count');
const cartTotalEl = document.getElementById('cart-total');
const gotoCheckout = document.getElementById('goto-checkout');

const checkoutBtn = document.getElementById('checkout-btn');
const modal = document.getElementById('checkout-modal');
const closeModal = document.getElementById('close-modal');
const stepsEl = document.getElementById('progress-steps');
const progressFill = document.getElementById('progress-fill');
const modalBody = document.getElementById('checkout-body');
const prevStepBtn = document.getElementById('prev-step');
const nextStepBtn = document.getElementById('next-step');

document.getElementById('year').textContent = new Date().getFullYear();

/* Money format */
const money = n => 'Rp' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/* CART STATE */
let CART = JSON.parse(localStorage.getItem('v_cart') || '[]');
function saveCart(){ localStorage.setItem('v_cart', JSON.stringify(CART)); }
function cartCount(){ return CART.reduce((a,c)=> a+c.qty, 0); }
function cartTotal(){ return CART.reduce((a,c)=> a+c.qty*c.price, 0); }

function addToCart(prod, qty=1){
  const found = CART.find(i => i.id === prod.id);
  if(found){ found.qty += qty; }
  else{ CART.push({...prod, qty}); }
  saveCart();
  renderCart();
}

function removeFromCart(id){
  CART = CART.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

function changeQty(id, delta){
  const item = CART.find(i => i.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0){ removeFromCart(id); } else { saveCart(); renderCart(); }
}

/* Render cart */
function renderCart(){
  cartItemsEl.innerHTML = '';
  CART.forEach(item => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = \`
      <img src="\${item.img}" alt="\${item.name}">
      <div>
        <div><strong>\${item.name}</strong></div>
        <div class="muted small">\${money(item.price)}</div>
        <div class="qty">
          <button data-act="dec" data-id="\${item.id}">-</button>
          <span>\${item.qty}</span>
          <button data-act="inc" data-id="\${item.id}">+</button>
          <button data-act="rm" data-id="\${item.id}" style="margin-left:.5rem">Hapus</button>
        </div>
      </div>
      <div><strong>\${money(item.price*item.qty)}</strong></div>
    \`;
    cartItemsEl.appendChild(el);
  });
  cartTotalEl.textContent = money(cartTotal());
  cartCountEl.textContent = cartCount();
}
renderCart();

cartItemsEl.addEventListener('click', e=>{
  const id = e.target.getAttribute('data-id');
  const act = e.target.getAttribute('data-act');
  if(!id || !act) return;
  if(act==='inc') changeQty(id, +1);
  if(act==='dec') changeQty(id, -1);
  if(act==='rm') removeFromCart(id);
});

/* Drawer */
cartBtn.addEventListener('click', ()=>{ cartDrawer.classList.add('open'); cartDrawer.setAttribute('aria-hidden','false'); });
closeCartBtn.addEventListener('click', ()=>{ cartDrawer.classList.remove('open'); cartDrawer.setAttribute('aria-hidden','true'); });
gotoCheckout.addEventListener('click', ()=>{ cartDrawer.classList.remove('open'); openCheckout(); });

/* Product grid */
function productCard(p){
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = \`
    <div class="thumb"><img src="\${p.img}" alt="\${p.name}"></div>
    <h4>\${p.name}</h4>
    <div class="meta">
      <span class="tag">\${p.tag}</span>
      <span class="price">\${money(p.price)}</span>
    </div>
    <button class="btn secondary add-btn" data-id="\${p.id}">Tambah ke keranjang</button>
  \`;
  return el;
}
function mountGrid(){
  grid.innerHTML = '';
  PRODUCTS.forEach(p => grid.appendChild(productCard(p)));
}
mountGrid();

/* Fly-to-cart animation */
function flyToCart(fromImg){
  const rect = fromImg.getBoundingClientRect();
  const cartRect = document.getElementById('open-cart').getBoundingClientRect();
  const clone = fromImg.cloneNode(true);
  clone.classList.add('fly-clone');
  clone.style.left = rect.left + 'px';
  clone.style.top = rect.top + 'px';
  clone.style.width = rect.width + 'px';
  clone.style.height = rect.height + 'px';
  document.body.appendChild(clone);
  requestAnimationFrame(()=>{
    const dx = cartRect.left - rect.left;
    const dy = cartRect.top - rect.top;
    clone.style.transform = \`translate(\${dx}px, \${dy}px) scale(.2)\`;
    clone.style.opacity = .2;
  });
  setTimeout(()=> clone.remove(), 700);
}

document.body.addEventListener('click', e=>{
  const btn = e.target.closest('.add-btn');
  if(!btn) return;
  const id = btn.getAttribute('data-id');
  const prod = PRODUCTS.find(p => p.id === id);
  if(!prod) return;
  // find image to animate
  const card = btn.closest('.card, .slide');
  const img = card.querySelector('img');
  if(img) flyToCart(img);
  addToCart(prod, 1);
});

/* Checkout Modal with steps */
const steps = ['Keranjang','Alamat','Pembayaran','Review','Selesai'];
let stepIndex = 0;

function renderStep(){
  progressFill.style.width = ((stepIndex+1)/steps.length*100)+'%';
  [...stepsEl.querySelectorAll('.step')].forEach((s,i)=> s.classList.toggle('active', i===stepIndex));
  if(stepIndex===0){
    modalBody.innerHTML = \`
      <h4>Ringkasan Keranjang</h4>
      \${CART.length ? '<ul>'+CART.map(i=>\`<li>\${i.qty}× \${i.name} — <strong>\${money(i.price*i.qty)}</strong></li>\`).join('')+'</ul>' : '<p>Keranjang kosong.</p>'}
      <p><strong>Total: \${money(cartTotal())}</strong></p>
    \`;
  } else if(stepIndex===1){
    modalBody.innerHTML = \`
      <h4>Alamat Pengiriman</h4>
      <label>Nama Lengkap <input id="addr-name" required></label>
      <label>Telepon <input id="addr-phone" required></label>
      <label>Alamat <textarea id="addr-line" rows="3" required></textarea></label>
    \`;
  } else if(stepIndex===2){
    modalBody.innerHTML = \`
      <h4>Pembayaran</h4>
      <label><input type="radio" name="pay" checked> Transfer Bank</label><br/>
      <label><input type="radio" name="pay"> E-Wallet</label><br/>
      <label><input type="radio" name="pay"> COD</label>
    \`;
  } else if(stepIndex===3){
    modalBody.innerHTML = \`
      <h4>Review & Konfirmasi</h4>
      <p>Pastikan data sudah benar. Klik "Lanjut" untuk menyelesaikan checkout.</p>
    \`;
  } else {
    modalBody.innerHTML = \`
      <div style="text-align:center">
        <h3>✨ Pesananmu diproses!</h3>
        <p>Terima kasih telah berbelanja di Veloura.</p>
      </div>
    \`;
  }
  prevStepBtn.style.visibility = stepIndex===0 ? 'hidden' : 'visible';
  nextStepBtn.textContent = stepIndex===steps.length-1 ? 'Tutup' : 'Lanjut →';
}

function openCheckout(){
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  stepIndex = 0;
  renderStep();
}
function closeCheckout(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
}

checkoutBtn.addEventListener('click', openCheckout);
document.getElementById('goto-checkout').addEventListener('click', openCheckout);
closeModal.addEventListener('click', closeCheckout);
prevStepBtn.addEventListener('click', ()=>{ if(stepIndex>0){ stepIndex--; renderStep(); } });
nextStepBtn.addEventListener('click', ()=>{
  if(stepIndex < steps.length-1){ stepIndex++; renderStep(); }
  else { closeCheckout(); }
});

/* Testimonials (with localStorage) */
const defaultTesti = [
  {name:'Amara', rating:5, msg:'Produk cantik & pengiriman cepat. Love the vibes!'},
  {name:'Dita', rating:4, msg:'Kemasannya aesthetic, bakal repeat order.'},
  {name:'Raka', rating:5, msg:'Necklace-nya elegan banget. Worth it!'}
];

function loadTesti(){
  let list = JSON.parse(localStorage.getItem('v_testi') || 'null');
  if(!list){ list = defaultTesti; localStorage.setItem('v_testi', JSON.stringify(list)); }
  return list;
}
function saveTesti(list){ localStorage.setItem('v_testi', JSON.stringify(list)); }
function renderTesti(){
  const list = loadTesti();
  const wrap = document.getElementById('testi-list');
  wrap.innerHTML = '';
  list.forEach(t=>{
    const el = document.createElement('div');
    el.className = 'card testi';
    el.innerHTML = \`
      <div class="stars">\${'★'.repeat(t.rating)}\${'☆'.repeat(5-t.rating)}</div>
      <div><strong>\${t.name}</strong></div>
      <p class="muted">\${t.msg}</p>
    \`;
    wrap.appendChild(el);
  });
}
renderTesti();

document.getElementById('testi-form').addEventListener('submit', e=>{
  e.preventDefault();
  const name = document.getElementById('tname').value.trim() || 'Anonim';
  const rating = +document.getElementById('trating').value;
  const msg = document.getElementById('tmsg').value.trim();
  if(!msg) return;
  const list = loadTesti();
  list.unshift({name, rating, msg});
  saveTesti(list);
  renderTesti();
  e.target.reset();
});

/* Feedback (kritik & saran) saved locally */
const feedbackForm = document.getElementById('feedback-form');
const feedbackItems = document.getElementById('feedback-items');
function loadFeedback(){ return JSON.parse(localStorage.getItem('v_feedback') || '[]'); }
function saveFeedback(v){ localStorage.setItem('v_feedback', JSON.stringify(v)); }
function renderFeedback(){
  const list = loadFeedback();
  feedbackItems.innerHTML = list.length ? '' : '<li class="muted small">Belum ada masukan.</li>';
  list.forEach(f => {
    const li = document.createElement('li');
    li.innerHTML = '<strong>'+(f.name||'Anonim')+':</strong> '+ f.msg;
    feedbackItems.appendChild(li);
  });
}
renderFeedback();
feedbackForm.addEventListener('submit', e=>{
  e.preventDefault();
  const name = document.getElementById('fname').value.trim();
  const msg = document.getElementById('fmsg').value.trim();
  if(!msg) return;
  const list = loadFeedback();
  list.unshift({name, msg, at: Date.now()});
  saveFeedback(list);
  renderFeedback();
  e.target.reset();
});
