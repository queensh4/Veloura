import PRODUCTS, { TOP_PICKS } from './data.js';

const sliderEl = document.getElementById('slider');
const prev = document.getElementById('prev-slide');
const next = document.getElementById('next-slide');

function money(n){
  return 'Rp' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function renderSlide(item){
  const el = document.createElement('div');
  el.className = 'slide';
  el.innerHTML = \`
    <img src="\${item.img}" alt="\${item.name}">
    <h4>\${item.name}</h4>
    <div class="price">\${money(item.price)}</div>
    <button class="btn secondary add-btn" data-id="\${item.id}">Tambah ke keranjang</button>
  \`;
  return el;
}

let index = 0;
function mount(){
  sliderEl.innerHTML = '';
  TOP_PICKS.forEach(p => sliderEl.appendChild(renderSlide(p)));
}

function slide(dir){
  index = (index + dir + TOP_PICKS.length) % TOP_PICKS.length;
  sliderEl.scrollBy({left: dir * (sliderEl.clientWidth/3), behavior:'smooth'});
}

prev.addEventListener('click', ()=>slide(-1));
next.addEventListener('click', ()=>slide(1));

let auto = setInterval(()=>slide(1), 3500);
sliderEl.addEventListener('pointerenter', ()=>clearInterval(auto));
sliderEl.addEventListener('pointerleave', ()=>auto = setInterval(()=>slide(1), 3500));

mount();
