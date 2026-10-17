// DAQQA Watches — shared storefront logic (header, footer, search, cart, checkout)
(function () {
  const { money, finalPrice, discountPct, esc, categories } = RC;
  const sb = supabase.createClient(RC.url, RC.key, { auth: { persistSession: false } });
  const $ = (s, r = document) => r.querySelector(s);
  const FALLBACK = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#20160E"/><circle cx="200" cy="200" r="84" fill="none" stroke="#4A3828" stroke-width="10"/><path d="M200 200V140M200 200L250 250" stroke="#4A3828" stroke-width="8" stroke-linecap="round"/></svg>');
  const ICON = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M10 17h10"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    gem: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M9 6h14l5 7-12 14L4 13z"/><path d="M4 13h24M12 6l-3 7 7 14 7-14-3-7"/></svg>',
    gear: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="16" cy="16" r="4.5"/><path d="M16 4v4M16 24v4M4 16h4M24 16h4M7.5 7.5l2.8 2.8M21.7 21.7l2.8 2.8M7.5 24.5l2.8-2.8M21.7 10.3l2.8-2.8"/></svg>',
    shield: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M16 4l10 4v8c0 6-4.5 10-10 12-5.5-2-10-6-10-12V8z"/><path d="M11.5 16l3 3 6-6"/></svg>',
    truck: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M3 9h16v12H3zM19 13h6l4 5v3H19"/><circle cx="9" cy="23" r="2.5"/><circle cx="23" cy="23" r="2.5"/></svg>',
    sun: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="16" cy="16" r="5.5"/><path d="M16 3v4M16 25v4M3 16h4M25 16h4M6.8 6.8l2.8 2.8M22.4 22.4l2.8 2.8M6.8 25.2l2.8-2.8M22.4 9.6l2.8-2.8"/></svg>',
    leaf: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M26 5C12 5 6 12 6 20c0 3 1 5 2 7 9 0 18-6 18-22z"/><path d="M8 27c4-8 9-12 13-15"/></svg>',
    eye: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 16s5-8 13-8 13 8 13 8-5 8-13 8S3 16 3 16z"/><circle cx="16" cy="16" r="4"/></svg>',
    link: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M13 19l6-6M11 15l-3 3a4.2 4.2 0 0 0 6 6l3-3M21 17l3-3a4.2 4.2 0 0 0-6-6l-3 3"/></svg>',
    gift: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M5 12h22v5H5zM7 17h18v11H7zM16 12v16"/><path d="M16 12c-2-5-8-6-8-2 0 2 4 2 8 2zM16 12c2-5 8-6 8-2 0 2-4 2-8 2z"/></svg>',
    star: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M16 4l3.6 7.6 8.4 1-6.2 5.8 1.6 8.3L16 22.6l-7.4 4.1 1.6-8.3L4 12.6l8.4-1z"/></svg>'
  };
  const GOV = ['القاهرة','الجيزة','القليوبية','الإسكندرية','الشرقية','الدقهلية','الغربية','المنوفية','البحيرة','كفر الشيخ','دمياط','بورسعيد','الإسماعيلية','السويس','الفيوم','بني سويف','المنيا','أسيوط','سوهاج','قنا','الأقصر','أسوان','البحر الأحمر','مطروح','شمال سيناء','جنوب سيناء','الوادي الجديد'];

  const DQ = window.DQ = { sb, FALLBACK, ICON, products: [], settings: {}, cart: [] };
  try { DQ.cart = JSON.parse(localStorage.getItem('dq-cart') || localStorage.getItem('rc-cart') || '[]') } catch (e) {}

  /* ---------- small helpers ---------- */
  DQ.toast = (msg, type = '') => { const t = document.createElement('div'); t.className = 'toast ' + type; t.textContent = msg; $('#toasts').appendChild(t); setTimeout(() => { t.style.transition = 'opacity .3s'; t.style.opacity = 0; setTimeout(() => t.remove(), 300) }, 2800); };
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: .12, rootMargin: '0px 0px -8% 0px' });
  DQ.reveal = () => document.querySelectorAll('.reveal:not(.in), .op:not(.in)').forEach(el => io.observe(el));
  // gentle parallax for section backgrounds (data-parallax) — one rAF per frame, skipped for reduced motion
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let ticking = false;
    addEventListener('scroll', () => { if (ticking) return; ticking = true; requestAnimationFrame(() => {
      ticking = false; const vh = innerHeight;
      document.querySelectorAll('[data-parallax].in').forEach(el => { const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) return;
        const t = (r.top + r.height / 2 - vh / 2) / vh; el.style.setProperty('--py', (t * -60).toFixed(1) + 'px'); });
    }); }, { passive: true });
  }
  DQ.priceHTML = (p) => { const off = discountPct(p); return `<div class="prices"><span class="price-new">${money(finalPrice(p))}</span>${off ? `<span class="price-old">${money(p.price)}</span>` : ''}</div>`; };
  DQ.img = (p, i = 0) => esc((p.images && p.images[i]) || FALLBACK);
  DQ.favs = new Set(); try { DQ.favs = new Set(JSON.parse(localStorage.getItem('dq-favs') || '[]')) } catch (e) {}
  function renderFavs() {
    $('#favCount').textContent = DQ.favs.size; $('#favCount').classList.toggle('show', DQ.favs.size > 0);
    const list = DQ.products.filter(p => DQ.favs.has(p.id));
    $('#favRes').innerHTML = list.length ? list.map(p => `<a href="${RC.productUrl(p)}"><img src="${DQ.img(p)}" alt="" onerror="this.src='${FALLBACK}'"><span><b class="en">${esc(p.name)}</b><br><small>${RC.kinds[RC.kindOf(p)].ar}</small></span>${DQ.priceHTML(p)}</a>`).join('') : `<div class="empty">لسه مفيش حاجة في المفضلة. دوس على القلب في أي منتج.</div>`;
    document.querySelectorAll('[data-fav]').forEach(b => { const on = DQ.favs.has(+b.dataset.fav); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  }
  DQ.toggleFav = id => { DQ.favs.has(id) ? DQ.favs.delete(id) : DQ.favs.add(id); try { localStorage.setItem('dq-favs', JSON.stringify([...DQ.favs])) } catch (e) {} renderFavs(); DQ.toast(DQ.favs.has(id) ? 'اتضافت للمفضلة' : 'اتشالت من المفضلة'); };
  DQ.renderFavs = renderFavs;
  DQ.card = (p, i = 0) => {
    const off = discountPct(p), url = RC.productUrl(p), cols = RC.colors(p), fav = DQ.favs && DQ.favs.has(p.id);
    return `<article class="card reveal" style="transition-delay:${Math.min(i, 8) * 50}ms">
      <a class="ph" href="${url}" tabindex="-1" aria-hidden="true"><img loading="lazy" src="${DQ.img(p)}" alt="" onerror="this.src='${FALLBACK}'">${p.images && p.images[1] ? `<img class="alt" loading="lazy" src="${DQ.img(p, 1)}" alt="">` : ''}
        ${off ? `<span class="badge-off">-${off}%</span>` : ''}${p.stock <= 0 ? `<div class="out">نفدت الكمية</div>` : ''}</a>
      <button class="fav ${fav ? 'on' : ''}" data-fav="${p.id}" aria-pressed="${fav}" aria-label="أضف ${esc(p.name)} للمفضلة">${ICON.heart}</button>
      <div class="bd"><h3 class="en"><a href="${url}">${esc(p.name)}</a></h3>
        <span class="sku en">${RC.sku(p)}${p.style ? ' · ' + esc(p.style) : ''}</span>
        <div class="row">${DQ.priceHTML(p)}${p.stock > 0 ? `<button class="add" data-add="${p.id}" aria-label="أضف ${esc(p.name)} للسلة">${ICON.plus}</button>` : ''}</div>
        ${cols.length ? `<div class="sw">${cols.map(c => `<i style="background:${c}"></i>`).join('')}</div>` : ''}
      </div></article>`;
  };
  DQ.wa = () => (DQ.settings.whatsapp || '').replace(/\D/g, '');

  /* ---------- chrome: header, sheets, footer, drawer ---------- */
  function chrome(active) {
    const nav = [['./', 'الرئيسية', 'home'], ['./#watches', 'الساعات', 'watches'], ['./#glasses', 'النضارات', 'glasses'], ['./#accessories', 'الاكسسوارات', 'accessories']];
    $('#hdr').innerHTML = `<div class="announce" id="announce"></div>
      <header class="nav-bar"><div class="wrap nav">
        <a href="./" class="brand" aria-label="DAQQA — الرئيسية"><span class="m">${RC.logo()}</span><span class="wm"><b>DAQQA</b><small>ACCESSORIES</small></span></a>
        <nav class="links" aria-label="القائمة">${nav.map(([h, l, k]) => `<a href="${h}" data-kind="${k}" class="${k === active ? 'on' : ''}">${l}</a>`).join('')}</nav>
        <div class="actions">
          <button class="icon-btn" id="searchBtn" aria-label="بحث">${ICON.search}</button>
          <button class="icon-btn" id="favBtn" aria-label="المفضلة">${ICON.heart}<span class="cart-count" id="favCount">0</span></button>
          <button class="icon-btn" id="cartBtn" aria-label="السلة">${ICON.bag}<span class="cart-count" id="cartCount">0</span></button>
          <button class="icon-btn menu-btn" id="menuBtn" aria-label="القائمة">${ICON.menu}</button>
        </div></div></header>
      <div class="sheet" id="menuSheet" role="dialog" aria-label="القائمة"><div class="wrap sheet-head"><a href="./" class="brand"><span class="m">${RC.logo()}</span><span class="wm"><b>DAQQA</b><small>ACCESSORIES</small></span></a><button class="icon-btn" data-close aria-label="إغلاق">${ICON.close}</button></div>
        <div class="wrap sheet-body"><nav class="menu-list">${nav.map(([h, l, k]) => `<a href="${h}" data-kind="${k}" data-close>${l}<span class="en">${RC.kinds[k] ? RC.kinds[k].en.toUpperCase() : '→'}</span></a>`).join('')}</nav></div></div>
      <div class="sheet" id="favSheet" role="dialog" aria-label="المفضلة"><div class="wrap sheet-head"><b style="font-size:18px">المفضلة</b><button class="icon-btn" data-close aria-label="إغلاق">${ICON.close}</button></div><div class="wrap sheet-body"><div class="search-res" id="favRes"></div></div></div>
      <div class="sheet" id="searchSheet" role="dialog" aria-label="بحث"><div class="wrap sheet-head"><b style="font-size:18px">بحث</b><button class="icon-btn" data-close aria-label="إغلاق">${ICON.close}</button></div>
        <div class="wrap sheet-body"><input class="input search-input" id="searchInput" placeholder="دوّر على ساعة، نضارة أو اكسسوار…" autocomplete="off"><div class="search-res" id="searchRes"></div></div></div>`;
    $('#ftr').innerHTML = `<footer class="site-foot"><div class="wrap">
      <div class="foot-grid">
        <div class="foot-brand"><a href="./" class="brand"><span class="m">${RC.logo()}</span><span class="wm"><b>DAQQA</b><small>ACCESSORIES</small></span></a>
          <p>دقّة — ساعات ونضارات واكسسوارات مختارة بعناية، بأسعار واضحة وعروض حقيقية. الدفع عند الاستلام والشحن لكل مصر.</p></div>
        <div><h4 class="en">SHOP</h4><ul>${Object.entries(RC.kinds).map(([k, v]) => `<li data-kind="${k}"><a href="./#${k}">${v.ar}</a></li>`).join('')}</ul></div>
        <div><h4 class="en">HELP</h4><ul><li>الدفع عند الاستلام</li><li>شحن 2–5 أيام</li><li>استبدال خلال 14 يوم</li><li>ضمان على الماكينة</li></ul></div>
        <div><h4 class="en">CONTACT</h4><ul id="ftContact"><li>واتساب: <span class="en" id="ftWa">—</span></li><li><a href="https://www.instagram.com/" target="_blank" rel="noopener">Instagram</a></li><li><a href="https://www.tiktok.com/" target="_blank" rel="noopener">TikTok</a></li></ul></div>
      </div>
      <div class="foot-bottom"><span class="en">© ${new Date().getFullYear()} DAQQA Accessories</span><span>دقّة في كل ثانية.</span></div></div></footer>
      <div class="overlay" id="overlay"></div>
      <aside class="drawer" id="drawer" aria-label="السلة"><div class="dr-head"><h3 id="drTitle">السلة</h3><button class="icon-btn" data-close aria-label="إغلاق">${ICON.close}</button></div><div class="dr-body" id="drBody"></div><div class="dr-foot" id="drFoot"></div></aside>
      <div class="toast-wrap" id="toasts"></div>`;

    $('#cartBtn').onclick = () => DQ.openCart('cart');
    $('#menuBtn').onclick = () => openSheet('#menuSheet');
    $('#favBtn').onclick = () => { renderFavs(); openSheet('#favSheet'); };
    $('#searchBtn').onclick = () => { openSheet('#searchSheet'); setTimeout(() => $('#searchInput').focus(), 80); };
    $('#searchInput').oninput = e => renderSearch(e.target.value);
    $('#overlay').onclick = DQ.closeAll;
    document.addEventListener('click', e => {
      if (e.target.closest('[data-close]')) DQ.closeAll();
      const add = e.target.closest('[data-add]');
      if (add) { e.preventDefault(); DQ.addToCart(+add.dataset.add, 1); }
      const fv = e.target.closest('[data-fav]');
      if (fv) { e.preventDefault(); DQ.toggleFav(+fv.dataset.fav); }
    });
    addEventListener('keydown', e => { if (e.key === 'Escape') DQ.closeAll(); });
    $('#drBody').addEventListener('click', e => {
      const q = e.target.closest('[data-q]'), rm = e.target.closest('[data-rm]');
      if (q) { const l = DQ.cart.find(c => c.id === +q.dataset.q), p = DQ.byId(l.id); l.qty = Math.max(1, Math.min(p.stock, 20, l.qty + +q.dataset.d)); saveCart(); renderCart(); }
      if (rm) { DQ.cart = DQ.cart.filter(c => c.id !== +rm.dataset.rm); saveCart(); renderCart(); }
    });
  }
  function openSheet(id) { DQ.closeAll(); $(id).classList.add('on'); document.body.style.overflow = 'hidden'; }
  function renderSearch(q) {
    q = q.trim().toLowerCase();
    const list = q ? DQ.products.filter(p => (p.name + ' ' + (p.brand || '') + ' ' + (categories[p.category] || '') + ' ' + RC.kinds[RC.kindOf(p)].ar + ' ' + RC.kinds[RC.kindOf(p)].en + ' ' + (p.description || '')).toLowerCase().includes(q)) : DQ.products.slice(0, 6);
    $('#searchRes').innerHTML = list.length ? list.slice(0, 12).map(p => `<a href="${RC.productUrl(p)}"><img src="${DQ.img(p)}" alt="" onerror="this.src='${FALLBACK}'"><span><b class="en">${esc(p.name)}</b><br><small>${RC.kinds[RC.kindOf(p)].ar} · ${esc(categories[p.category] || '')}</small></span>${DQ.priceHTML(p)}</a>`).join('') : `<div class="empty">مفيش منتج بالاسم ده.</div>`;
  }

  /* ---------- data ---------- */
  DQ.byId = id => DQ.products.find(p => p.id === id);
  DQ.liveKinds = () => Object.keys(RC.kinds).filter(k => DQ.products.some(p => RC.kindOf(p) === k && p.images && p.images.length));
  function syncKinds() { const live = DQ.liveKinds(); document.querySelectorAll('[data-kind]').forEach(el => { if (RC.kinds[el.dataset.kind]) el.hidden = !live.includes(el.dataset.kind); }); }
  DQ.load = async () => {
    const [p, s] = await Promise.all([
      sb.from('shop_products').select('*').eq('active', true).order('sort').order('id'),
      sb.from('shop_settings').select('*').eq('id', 1).maybeSingle()
    ]);
    if (p.error) throw p.error;
    DQ.products = p.data || []; DQ.settings = s.data || {};
    $('#announce').textContent = DQ.settings.announcement || '';
    if (DQ.wa()) $('#ftWa').innerHTML = `<a href="https://wa.me/${DQ.wa()}" target="_blank" rel="noopener">${esc(DQ.settings.whatsapp)}</a>`;
    renderCart(); renderSearch(''); syncKinds(); renderFavs();
  };

  /* ---------- cart ---------- */
  let view = 'cart';
  function saveCart() { try { localStorage.setItem('dq-cart', JSON.stringify(DQ.cart)) } catch (e) {} }
  const lines = () => DQ.cart.map(c => ({ ...c, p: DQ.byId(c.id) })).filter(c => c.p);
  DQ.addToCart = (id, qty, silent) => {
    const p = DQ.byId(id); if (!p || p.stock <= 0) return;
    const line = DQ.cart.find(c => c.id === id);
    const next = Math.min((line ? line.qty : 0) + qty, p.stock, 20);
    if (line) line.qty = next; else DQ.cart.push({ id, qty: next });
    saveCart(); renderCart();
    const b = $('#cartBtn'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
    if (!silent) DQ.toast('اتضافت للسلة ✓', 'ok');
  };
  function totals() {
    const ls = lines();
    const sub = ls.reduce((s, l) => s + finalPrice(l.p) * l.qty, 0);
    const orig = ls.reduce((s, l) => s + Number(l.p.price) * l.qty, 0);
    const fso = DQ.settings.free_shipping_over != null ? Number(DQ.settings.free_shipping_over) : null;
    const ship = !ls.length ? 0 : (fso != null && sub >= fso ? 0 : Number(DQ.settings.shipping_fee || 0));
    return { ls, sub, save: orig - sub, ship, total: sub + ship, fso };
  }
  function renderCart() {
    if (DQ.products.length) DQ.cart = DQ.cart.filter(c => DQ.products.some(p => p.id === c.id && p.stock > 0));
    const n = DQ.cart.reduce((s, c) => s + c.qty, 0);
    $('#cartCount').textContent = n; $('#cartCount').classList.toggle('show', n > 0);
    if (view === 'done') return;
    const t = totals();
    if (!t.ls.length) {
      $('#drTitle').textContent = 'السلة';
      $('#drBody').innerHTML = `<div class="empty" style="padding:80px 10px"><div style="width:72px;height:74px;margin:0 auto 16px;opacity:.5">${RC.logo()}</div>السلة فاضية.</div>`;
      $('#drFoot').innerHTML = `<a class="btn btn-primary" href="./" data-close>تسوّق دلوقتي</a>`; return;
    }
    const sum = `${t.save > 0 ? `<div class="sum save"><span>وفّرت</span><b>− ${money(t.save)}</b></div>` : ''}
      <div class="sum"><span>المنتجات</span><b>${money(t.sub)}</b></div>
      <div class="sum"><span>الشحن</span><b>${t.ship ? money(t.ship) : 'مجاني'}</b></div>
      <div class="sum total"><span>الإجمالي</span><b>${money(t.total)}</b></div>`;
    if (view === 'cart') {
      $('#drTitle').textContent = `السلة (${n})`;
      $('#drBody').innerHTML = t.ls.map(l => `<div class="ci"><a href="${RC.productUrl(l.p)}"><img src="${DQ.img(l.p)}" alt="" onerror="this.src='${FALLBACK}'"></a>
        <div><h4 class="en"><a href="${RC.productUrl(l.p)}">${esc(l.p.name)}</a></h4>${DQ.priceHTML(l.p)}<div class="qty"><button data-q="${l.id}" data-d="-1" aria-label="تقليل">−</button><span>${l.qty}</span><button data-q="${l.id}" data-d="1" aria-label="زيادة">+</button></div></div>
        <button class="rm" data-rm="${l.id}">حذف</button></div>`).join('') +
        (t.fso != null && t.sub < t.fso ? `<div style="margin-top:16px"><div class="ship-note">ضيف ${money(t.fso - t.sub)} كمان والشحن يبقى مجاني</div><div class="ship-bar"><i style="width:${Math.min(100, t.sub / t.fso * 100)}%"></i></div></div>` : '');
      $('#drFoot').innerHTML = sum + `<button class="btn btn-amber" id="goCheckout">إتمام الطلب</button>`;
      $('#goCheckout').onclick = () => { view = 'checkout'; renderCart(); };
    } else if (view === 'checkout') {
      $('#drTitle').textContent = 'بيانات الطلب';
      let saved = {}; try { saved = JSON.parse(localStorage.getItem('dq-cust') || localStorage.getItem('rc-cust') || '{}') } catch (e) {}
      $('#drBody').innerHTML = `<form class="form-grid" id="coForm" autocomplete="on">
        <div class="field"><label for="f-name">الاسم *</label><input id="f-name" class="input" name="name" required value="${esc(saved.name || '')}" autocomplete="name"></div>
        <div class="field"><label for="f-phone">رقم الموبايل *</label><input id="f-phone" class="input en" name="phone" required inputmode="tel" pattern="[0-9+ ]{10,15}" value="${esc(saved.phone || '')}" autocomplete="tel" dir="ltr" style="text-align:right"></div>
        <div class="field"><label for="f-city">المحافظة *</label><select id="f-city" class="input" name="city" required><option value="">اختار المحافظة</option>${GOV.map(c => `<option ${c === saved.city ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
        <div class="field"><label for="f-addr">العنوان بالتفصيل *</label><textarea id="f-addr" class="input" name="address" required rows="2">${esc(saved.address || '')}</textarea></div>
        <div class="field"><label for="f-notes">ملاحظات</label><textarea id="f-notes" class="input" name="notes" rows="2" placeholder="اختياري"></textarea></div></form>`;
      $('#drFoot').innerHTML = sum + `<span class="ship-note">الدفع كاش عند الاستلام.</span><div style="display:flex;gap:8px"><button class="btn btn-ghost" id="back">رجوع</button><button class="btn btn-amber" id="place" style="flex:1">تأكيد الطلب · ${money(t.total)}</button></div>`;
      $('#back').onclick = () => { view = 'cart'; renderCart(); };
      $('#place').onclick = placeOrder;
    }
  }
  async function placeOrder() {
    const f = $('#coForm'); if (!f.reportValidity()) return;
    const d = Object.fromEntries(new FormData(f));
    try { localStorage.setItem('dq-cust', JSON.stringify({ name: d.name, phone: d.phone, city: d.city, address: d.address })) } catch (e) {}
    const btn = $('#place'); btn.disabled = true; btn.textContent = 'جاري الإرسال...';
    const { data, error } = await sb.rpc('shop_place_order', { customer: d, items: DQ.cart.map(c => ({ id: c.id, qty: c.qty })) });
    if (error) { btn.disabled = false; btn.textContent = 'تأكيد الطلب'; DQ.toast(error.message || 'حصل خطأ، جرّب تاني', 'err'); DQ.load(); return; }
    const ls = lines(); DQ.cart = []; saveCart(); view = 'done';
    $('#cartCount').classList.remove('show'); $('#drTitle').textContent = 'تم الطلب';
    const msg = encodeURIComponent(`طلب جديد ${data.code} — DAQQA\n${ls.map(l => `${l.p.name} × ${l.qty}`).join('\n')}\nالإجمالي: ${money(data.total)}\nالاسم: ${d.name}`);
    $('#drBody').innerHTML = `<div class="success"><div class="m">${RC.logo()}</div><h3>طلبك وصل!</h3><p style="color:var(--muted)">هنكلمك قريب لتأكيد الطلب. رقم الطلب:</p><code class="en">${esc(data.code)}</code><p style="color:var(--muted)">الإجمالي: <b class="en" style="color:var(--ink)">${money(data.total)}</b></p></div>`;
    $('#drFoot').innerHTML = (DQ.wa() ? `<a class="btn btn-amber" target="_blank" rel="noopener" href="https://wa.me/${DQ.wa()}?text=${msg}">أكّد على واتساب</a>` : '') + `<button class="btn btn-ghost" data-close>كمّل تسوّق</button>`;
    DQ.load().then(() => DQ.onRefresh && DQ.onRefresh());
  }
  DQ.openCart = (v = 'cart') => { DQ.closeAll(); view = v; renderCart(); $('#drawer').classList.add('on'); $('#overlay').classList.add('on'); document.body.style.overflow = 'hidden'; };
  DQ.closeAll = () => {
    ['#drawer', '#overlay', '#menuSheet', '#searchSheet', '#favSheet'].forEach(s => $(s) && $(s).classList.remove('on'));
    document.body.style.overflow = '';
    if (view === 'done') { view = 'cart'; setTimeout(renderCart, 400); }
  };

  DQ.start = async (active, onReady) => {
    chrome(active);
    try { await DQ.load(); } catch (e) { console.error(e); DQ.loadError = true; }
    onReady && onReady();
    DQ.reveal();
  };
})();
