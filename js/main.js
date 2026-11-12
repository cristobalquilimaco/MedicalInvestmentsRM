/* ===== MEDICAL INVESTMENTS R.M. — Lógica principal ===== */
(() => {
'use strict';

/* ---------- CONFIGURACIÓN (editar) ---------- */
const CONFIG = {
  whatsapp: '573000000000',          // ← número real con indicativo, sin +
  currency: 'COP',
  shipping: 0,                        // costo de envío fijo (0 = a convenir)
  pageSize: 8
};

/* ---------- PRODUCTOS (precios de ejemplo: reemplazar) ---------- */
const A = 'https://athlon.com.co/cdn/shop/files/';
const O = 'https://www.orangemedicalstore.com/wp-content/uploads/';
const PRODUCTS = [
  {id:1,name:'Mota Blanca 500 und',cat:'Desechables',price:28000,img:O+'2023/02/Mota-Blanca-500-und-600x600-1-300x300.jpg',badge:'Más vendido',desc:'Mota desechable blanca, presentación x500 unidades. Ideal para uso clínico y estético.'},
  {id:2,name:'Bata Desechable Manga Corta',cat:'Desechables',price:3500,img:O+'2023/02/bata-desechable-manga-corta-300x300.png',desc:'Bata desechable de manga corta, liviana y de barrera práctica para procedimientos.'},
  {id:3,name:'Bata Manga Larga',cat:'Desechables',price:4200,img:O+'2020/09/bata-manga-larga-300x300.png',desc:'Bata de manga larga con mayor cobertura para áreas clínicas y laboratorio.'},
  {id:4,name:'Rollo de Algodón x 500',cat:'Curación',price:18500,img:O+'2023/02/rollo-de-algodon-x-500-300x300.jpg',desc:'Rollo de algodón x500, absorbente y suave para curación e higiene.'},
  {id:5,name:'Bloques Azules',cat:'Curación',price:24000,img:A+'BloquesAzules.png?v=1749561953&width=360',badge:'Nuevo',desc:'Bloques azules de uso médico y estético, resistentes y fáciles de manipular.'},
  {id:6,name:'Media Bambú Compresión Caqui',cat:'Compresión',price:46000,img:A+'MediaBammboCompresionCaki.png?v=1755882245&width=360',badge:'Bambú',desc:'Media de compresión en fibra de bambú, transpirable y antibacterial natural.'},
  {id:7,name:'Medias de Compresión en Algodón Colores',cat:'Compresión',price:42000,img:A+'MediasDeCompresionenAlgodonColores.png?v=1749578373&width=360',desc:'Medias de compresión graduada en algodón, disponibles en varios colores.'},
  {id:8,name:'Calcetín Compresión Bambú 215 Gris',cat:'Compresión',price:44000,img:A+'CalcetinCompresionBambuAthlon215Gris.png?v=1769725766&width=360',desc:'Calcetín de compresión en bambú, referencia 215, color gris.'},
  {id:9,name:'Medias para Pies Sensibles / Pie Diabético',cat:'Compresión',price:39000,img:A+'MediasParaPiesSensiblesPieDiabetico.png?v=1749578600&width=360',badge:'Pie diabético',desc:'Sin costuras ni elásticos apretados, pensadas para pies sensibles y diabéticos.'},
  {id:10,name:'Textil Médico Ref. 17001',cat:'Insumos y Textiles',price:35000,img:A+'1_17001-1_cb233226-bcdc-4b9c-bb6d-4ffb157fb0d6.png?v=1748033141&width=360',desc:'Insumo textil médico, referencia 17001.'},
  {id:11,name:'Textil Médico Ref. 11320',cat:'Insumos y Textiles',price:35000,img:A+'17_11320.png?v=1748036203&width=360',desc:'Insumo textil médico, referencia 11320.'},
  {id:12,name:'Textil Médico Ref. 11370',cat:'Insumos y Textiles',price:35000,img:A+'3_11370_hover.png?v=1755619911&width=360',desc:'Insumo textil médico, referencia 11370.'},
  {id:13,name:'Textil Médico Ref. 11383',cat:'Insumos y Textiles',price:35000,img:A+'11_11383.png?v=1748035043&width=360',desc:'Insumo textil médico, referencia 11383.'},
  {id:14,name:'Textil Médico Ref. 15101',cat:'Insumos y Textiles',price:35000,img:A+'16_15101.png?v=1748036004&width=360',desc:'Insumo textil médico, referencia 15101.'},
  {id:15,name:'Textil Médico Ref. F-24',cat:'Insumos y Textiles',price:35000,img:A+'19_F-24.png?v=1748036527&width=360',desc:'Insumo textil médico, referencia F-24.'}
];
const byId = id => PRODUCTS.find(p => p.id === +id);
const money = n => new Intl.NumberFormat('es-CO',{style:'currency',currency:CONFIG.currency,maximumFractionDigits:0}).format(n);
const $ = (s,r=document) => r.querySelector(s);
const $$ = (s,r=document) => [...r.querySelectorAll(s)];

const IC={truck:'<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></svg>',chat:'<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/></svg>',lock:'<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',box:'<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/></svg>',heal:'<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-35 12 12)"/><path d="M10 10h.01M14 14h.01"/></svg>',heart:'<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/></svg>',grid:'<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16v16H4z"/><path d="M4 9h16M4 15h16M9 4v16M15 4v16"/></svg>'};
const BASE = document.body.dataset.base || '';
const PAGE = document.body.dataset.page || 'home';

/* ---------- CARRITO (localStorage) ---------- */
const Cart = {
  get(){ try{return JSON.parse(localStorage.getItem('mirm_cart'))||[]}catch{return []} },
  save(c){ try{localStorage.setItem('mirm_cart',JSON.stringify(c))}catch{} ; render(); },
  add(id,q=1){ const c=this.get(),i=c.find(x=>x.id===id); i?i.q+=q:c.push({id,q}); this.save(c); toast('Añadido al carrito'); bump(); },
  set(id,q){ let c=this.get(); q<=0 ? c=c.filter(x=>x.id!==id) : c.find(x=>x.id===id).q=q; this.save(c); },
  clear(){ this.save([]); },
  lines(){ return this.get().map(x=>({...byId(x.id),q:x.q})).filter(x=>x.name) },
  count(){ return this.get().reduce((a,b)=>a+b.q,0) },
  subtotal(){ return this.lines().reduce((a,b)=>a+b.price*b.q,0) }
};

/* ---------- ESTRUCTURA COMPARTIDA ---------- */
const WA_SVG='<svg viewBox="0 0 32 32"><path d="M16 3C8.8 3 3 8.8 3 16c0 2.3.6 4.5 1.7 6.4L3 29l6.8-1.8A13 13 0 1 0 16 3zm0 23.7c-2 0-3.9-.6-5.5-1.6l-.4-.2-4 1 1.1-3.9-.3-.4A10.7 10.7 0 1 1 16 26.7zm5.9-8c-.3-.2-1.9-.9-2.200-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.200-.2.2-.4.2-.7.1-.3-.2-1.400-.5-2.600-1.600-1-.9-1.600-1.900-1.800-2.200-.2-.3 0-.5.1-.7l.5-.5c.1-.2.200-.3.300-.5.1-.2 0-.4 0-.5l-1-2.300c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1.100 1.100-1.100 2.600s1.100 3 1.300 3.200c.2.200 2.200 3.400 5.300 4.700.7.3 1.300.5 1.800.7.700.2 1.400.2 2 .1.600-.1 1.900-.8 2.200-1.500.3-.7.3-1.400.2-1.500-.1-.2-.3-.2-.6-.4z"/></svg>';
function shell(){
  const links=[['Inicio',BASE+'index.html','home'],['Tienda',BASE+'tienda/index.html','shop'],['Carrito',BASE+'carrito/index.html','cart'],['Checkout',BASE+'checkout/index.html','checkout']];
  const catLinks=['Desechables','Curación','Compresión','Insumos y Textiles'].map(c=>`<a href="${BASE}tienda/index.html?cat=${encodeURIComponent(c)}">${c}</a>`).join('');
  const header=`<header class="site-header"><div class="topbar">${IC.truck} Envíos a todo el país · ${IC.chat} Asesoría y cotizaciones por <a href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></div>
    <div class="container nav">
    <a class="brand" href="${BASE}index.html" aria-label="Medical Investments R.M. - Inicio"><img src="${BASE}img/logo.png" alt="Medical Investments R.M." width="180" height="46"></a>
    <form class="search" role="search" action="${BASE}tienda/index.html" method="get"><input type="search" name="q" placeholder="¿Qué insumo médico buscas?" aria-label="Buscar insumos médicos"><button type="submit" aria-label="Buscar"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg></button></form>
    <div class="nav-actions"><button class="cart-btn" id="openCart" aria-label="Abrir carrito"><svg viewBox="0 0 24 24"><path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6 5 3H2"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg><span class="cart-count" id="cartCount">0</span></button></div></div>
    <nav class="catnav" aria-label="Categorías"><button class="cn-arrow" data-cn="-1" aria-label="Anterior"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button><div class="cn-scroll"><div class="container"><a href="${BASE}tienda/index.html" class="${PAGE==='shop'?'active':''}">Todos los productos</a>${catLinks}<a class="hl" href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener">Cotizar por WhatsApp</a></div></div><button class="cn-arrow" data-cn="1" aria-label="Siguiente"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button></nav></header>`;
  const footer=`<footer class="site-footer"><div class="container"><div class="foot-grid">
    <div class="foot-brand"><img src="${BASE}img/favicon.png" alt="Medical Investments R.M." width="72" height="72" loading="lazy"><p>SOLUCIONES QUE CUIDAN VIDAS.<br>Insumos y textiles médicos de confianza.</p></div>
    <div><h4>Navegar</h4><a href="${BASE}index.html">Inicio</a><a href="${BASE}tienda/index.html">Tienda</a><a href="${BASE}carrito/index.html">Carrito</a><a href="${BASE}checkout/index.html">Checkout</a></div>
    <div><h4>Categorías</h4>${['Desechables','Curación','Compresión','Insumos y Textiles'].map(c=>`<a href="${BASE}tienda/index.html?cat=${encodeURIComponent(c)}">${c}</a>`).join('')}</div>
    <div><h4>Contacto</h4><a href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener">WhatsApp</a><a href="mailto:ventas@medicalinvestmentsrm.com">ventas@medicalinvestmentsrm.com</a></div>
  </div><div class="foot-bottom"><span>© ${new Date().getFullYear()} MEDICAL INVESTMENTS R.M. Todos los derechos reservados.</span><span>Productos de uso médico: consulte a su profesional de salud.</span></div></div></footer>`;
  const extras=`<div class="drawer-bg" id="drawerBg"></div>
    <aside class="drawer" aria-label="Mini carrito"><header>Tu carrito <button class="close" id="closeCart" aria-label="Cerrar">✕</button></header><div class="drawer-body" id="drawerBody"></div>
    <footer><div class="sum-row total" style="border:0;margin:0;padding:0"><span>Subtotal</span><span id="drawerTotal"></span></div><a class="btn btn-ghost" href="${BASE}carrito/index.html">Ver carrito</a><a class="btn btn-primary" href="${BASE}checkout/index.html">Finalizar compra</a></footer></aside>
    <div class="modal" id="modal" role="dialog" aria-modal="true"><div class="modal-box" id="modalBox"></div></div>
    <div class="toast" id="toast" role="status"></div>
    <a class="wa" href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Hola, quiero información sobre sus productos.')}" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp"><span class="wa-tip">¿Necesitas ayuda? Escríbenos</span>${WA_SVG}</a>`;
  document.body.insertAdjacentHTML('afterbegin',header);
  document.body.insertAdjacentHTML('beforeend',footer+extras);
}

/* ---------- UI HELPERS ---------- */
let tT; function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tT);tT=setTimeout(()=>t.classList.remove('show'),2000)}
function bump(){const c=$('#cartCount');c.classList.remove('bump');void c.offsetWidth;c.classList.add('bump')}
const openDrawer=()=>document.body.classList.add('drawer-open');
const closeDrawer=()=>document.body.classList.remove('drawer-open');

function cardHTML(p,i=0){
  return `<article class="card reveal" style="--d:${(i%4)*.07}s">${p.badge?`<span class="badge">${p.badge}</span>`:''}
  <div class="media" data-view="${p.id}"><img src="${p.img}" alt="${p.name}" loading="lazy" width="300" height="300"></div>
  <span class="cat-tag">${p.cat}</span><h3>${p.name}</h3>
  <div class="row"><span class="price">${money(p.price)}</span><button class="add" data-add="${p.id}">Añadir</button></div></article>`;
}
function openModal(id){
  const p=byId(id); if(!p) return;
  $('#modalBox').innerHTML=`<button class="close" data-close-modal aria-label="Cerrar">✕</button>
    <div class="media"><img src="${p.img}" alt="${p.name}"></div>
    <div class="modal-info"><span class="eyebrow">${p.cat}</span><h2 style="font-size:1.7rem">${p.name}</h2><p class="lead" style="font-size:1rem">${p.desc}</p>
    <span class="price">${money(p.price)}</span><button class="btn btn-primary" data-add="${p.id}">Añadir al carrito</button>
    <a class="btn btn-ghost" target="_blank" rel="noopener" href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Hola, me interesa: '+p.name)}">Consultar por WhatsApp</a></div>`;
  $('#modal').classList.add('open');
}
const closeModal=()=>$('#modal').classList.remove('open');

/* ---------- RENDER CARRITO (contador, drawer, página) ---------- */
function render(){
  $('#cartCount').textContent=Cart.count();
  const L=Cart.lines();
  $('#drawerBody').innerHTML=L.length?L.map(l=>`<div class="drawer-item"><img src="${l.img}" alt="" loading="lazy"><div><strong>${l.name}</strong><div class="qty"><button data-dec="${l.id}" aria-label="Menos">−</button><span>${l.q}</span><button data-inc="${l.id}" aria-label="Más">+</button></div></div><strong>${money(l.price*l.q)}</strong></div>`).join(''):'<p class="empty">Tu carrito está vacío.</p>';
  $('#drawerTotal').textContent=money(Cart.subtotal());
  if(PAGE==='cart') renderCartPage();
  if(PAGE==='checkout') renderCheckoutSummary();
}
function totals(){const s=Cart.subtotal();return {s,ship:L0()?CONFIG.shipping:0,t:s+(L0()?CONFIG.shipping:0)}}
const L0=()=>Cart.lines().length>0;
function renderCartPage(){
  const L=Cart.lines(),box=$('#cartItems'),sm=$('#cartSummary'); if(!box) return;
  box.innerHTML=L.length?L.map(l=>`<div class="cart-item"><img src="${l.img}" alt="${l.name}"><div><h3>${l.name}</h3><small>${l.cat} · ${money(l.price)}</small><div class="qty"><button data-dec="${l.id}">−</button><span>${l.q}</span><button data-inc="${l.id}">+</button></div></div><div class="end"><strong class="price">${money(l.price*l.q)}</strong><button class="remove" data-rm="${l.id}">Eliminar</button></div></div>`).join(''):`<div class="empty"><h3>Tu carrito está vacío</h3><p style="margin:1rem 0 1.5rem">Explora nuestro catálogo y añade productos.</p><a class="btn btn-primary" href="../tienda/index.html">Ir a la tienda</a></div>`;
  const t=totals();
  sm.innerHTML=`<h3>Resumen</h3><div class="sum-row"><span>Subtotal</span><span>${money(t.s)}</span></div><div class="sum-row"><span>Envío</span><span>${CONFIG.shipping?money(t.ship):'A convenir'}</span></div><div class="sum-row total"><span>Total</span><span>${money(t.t)}</span></div>
  <a class="btn btn-primary" href="../checkout/index.html" ${L.length?'':'style="pointer-events:none;opacity:.5"'}>Proceder al pago</a><p class="secure">${IC.lock} Compra segura · Atención por WhatsApp</p>`;
}
function renderCheckoutSummary(){
  const box=$('#coSummary'); if(!box) return; const t=totals();
  box.innerHTML=Cart.lines().map(l=>`<div class="mini-line"><span>${l.q} × ${l.name}</span><strong>${money(l.price*l.q)}</strong></div>`).join('')+
  `<div class="sum-row"><span>Envío</span><span>${CONFIG.shipping?money(t.ship):'A convenir'}</span></div><div class="sum-row total"><span>Total</span><span>${money(t.t)}</span></div>`;
}

/* ---------- TIENDA: filtros + paginación ---------- */
function initShop(){
  const grid=$('#grid'); if(!grid) return;
  const params=new URLSearchParams(location.search);
  const ld=document.createElement('script'); ld.type='application/ld+json';
  ld.textContent=JSON.stringify({'@context':'https://schema.org','@type':'ItemList',itemListElement:PRODUCTS.map((p,i)=>({'@type':'ListItem',position:i+1,item:{'@type':'Product',name:p.name,image:p.img,description:p.desc,category:p.cat,brand:{'@type':'Brand',name:'Medical Investments R.M.'},offers:{'@type':'Offer',priceCurrency:CONFIG.currency,price:p.price,availability:'https://schema.org/InStock'}}}))});
  document.head.appendChild(ld);
  
  const st={cat:params.get('cat')||'Todas',q:(params.get('q')||'').toLowerCase(),sort:'rel',page:1};
  const cats=['Todas',...new Set(PRODUCTS.map(p=>p.cat))];
  const draw=()=>{
    let L=PRODUCTS.filter(p=>(st.cat==='Todas'||p.cat===st.cat)&&p.name.toLowerCase().includes(st.q));
    if(st.sort==='asc')L.sort((a,b)=>a.price-b.price); if(st.sort==='desc')L.sort((a,b)=>b.price-a.price); if(st.sort==='az')L.sort((a,b)=>a.name.localeCompare(b.name));
    const pages=Math.max(1,Math.ceil(L.length/CONFIG.pageSize)); st.page=Math.min(st.page,pages);
    const slice=L.slice((st.page-1)*CONFIG.pageSize,st.page*CONFIG.pageSize);
    grid.innerHTML=slice.length?slice.map(cardHTML).join(''):'<p class="empty">No encontramos productos con esos filtros.</p>';
    $('#count').textContent=L.length+' productos';
    $('#cats').innerHTML=cats.map(c=>`<button class="chip ${c===st.cat?'active':''}" data-cat="${c}"><span>${c}</span><span>${c==='Todas'?PRODUCTS.length:PRODUCTS.filter(p=>p.cat===c).length}</span></button>`).join('');
    $('#pager').innerHTML=pages>1?Array.from({length:pages},(_,i)=>`<button class="${i+1===st.page?'active':''}" data-page="${i+1}">${i+1}</button>`).join(''):'';
    observe();
  };
  document.addEventListener('click',e=>{
    const c=e.target.closest('[data-cat]'),p=e.target.closest('[data-page]');
    if(c){st.cat=c.dataset.cat;st.page=1;draw()} if(p){st.page=+p.dataset.page;draw();scrollTo({top:0,behavior:'smooth'})}
  });
  $('#search').addEventListener('input',e=>{st.q=e.target.value.trim().toLowerCase();st.page=1;draw()});
  $('#sort').addEventListener('change',e=>{st.sort=e.target.value;draw()});
  $('#search').value=st.q; $('#filterToggle').addEventListener('click',()=>$('#filters').classList.toggle('open'));
  draw();
}

/* ---------- HOME: destacados ---------- */
function initHome(){
  const cg=$('#catGrid'); if(!cg) return;
  const em={'Desechables':IC.box,'Curación':IC.heal,'Compresión':IC.heart,'Insumos y Textiles':IC.grid};
  cg.innerHTML=Object.keys(em).map(c=>`<a class="catcard reveal" href="${BASE}tienda/index.html?cat=${encodeURIComponent(c)}">${em[c]}<span>${c}</span><small>${PRODUCTS.filter(p=>p.cat===c).length} productos</small></a>`).join('');
  const row=(sel,ids)=>{const e=$(sel); if(e) e.insertAdjacentHTML('beforeend',ids.map(id=>cardHTML(byId(id))).join(''))};
  row('#rowA',[6,7,8,9]); row('#rowB',[1,2,3,4,5]);
  const sl=$$('.slide'),dots=$$('.dot'); let i=0;
  const go=n=>{i=(n+sl.length)%sl.length; sl.forEach((x,k)=>x.classList.toggle('on',k===i)); dots.forEach((d,k)=>d.classList.toggle('on',k===i))};
  dots.forEach((d,k)=>d.addEventListener('click',()=>go(k)));
  if(sl.length>1) setInterval(()=>go(i+1),5500);
}

/* ---------- CHECKOUT: envío por WhatsApp ---------- */
function initCheckout(){
  const f=$('#coForm'); if(!f) return;
  f.addEventListener('submit',e=>{
    e.preventDefault();
    if(!L0()){toast('Tu carrito está vacío');return}
    const d=Object.fromEntries(new FormData(f)); const t=totals();
    const msg=`*NUEVO PEDIDO — Medical Investments R.M.*\n\n`+Cart.lines().map(l=>`• ${l.q} × ${l.name} — ${money(l.price*l.q)}`).join('\n')+
    `\n\n*Total:* ${money(t.t)}\n\n*Cliente:* ${d.nombre}\n*Documento:* ${d.doc}\n*Teléfono:* ${d.tel}\n*Email:* ${d.email}\n*Dirección:* ${d.dir}, ${d.ciudad}\n*Pago:* ${d.pago}\n*Notas:* ${d.notas||'—'}`;
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`,'_blank','noopener');
    Cart.clear(); f.reset(); $('#coDone').hidden=false; f.hidden=true;
  });
}

/* ---------- ANIMACIONES ---------- */
let io;
function observe(){
  if(!('IntersectionObserver' in window)){$$('.reveal').forEach(e=>e.classList.add('in'));return}
  io=io||new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  $$('.reveal:not(.in)').forEach(e=>io.observe(e));
}

/* ---------- EVENTOS GLOBALES ---------- */
function events(){
  document.addEventListener('click',e=>{
    const t=e.target;
    const add=t.closest('[data-add]'); if(add){Cart.add(+add.dataset.add)}
    const view=t.closest('[data-view]'); if(view)openModal(view.dataset.view);
    const inc=t.closest('[data-inc]'); if(inc){const l=Cart.get().find(x=>x.id==inc.dataset.inc);Cart.set(+inc.dataset.inc,l.q+1)}
    const dec=t.closest('[data-dec]'); if(dec){const l=Cart.get().find(x=>x.id==dec.dataset.dec);Cart.set(+dec.dataset.dec,l.q-1)}
    const rm=t.closest('[data-rm]'); if(rm)Cart.set(+rm.dataset.rm,0);
    const cn=t.closest('[data-cn]'); if(cn)$('.cn-scroll').scrollBy({left:cn.dataset.cn*220,behavior:'smooth'});
    if(t.closest('#openCart'))openDrawer();
    if(t.closest('#closeCart')||t.id==='drawerBg')closeDrawer();
    if(t.closest('[data-close-modal]')||t.id==='modal')closeModal();
    if(t.closest('#burger'))$('#nav').classList.toggle('open');
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeDrawer();closeModal()}});
  const h=$('.site-header'); addEventListener('scroll',()=>h.classList.toggle('scrolled',scrollY>8),{passive:true});
  addEventListener('storage',render);
}

/* ---------- INIT ---------- */
shell(); events(); render(); initHome(); initShop(); initCheckout(); observe();
})();