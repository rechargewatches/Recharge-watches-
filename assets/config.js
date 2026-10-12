// Recharge — public config (publishable key is safe in the browser; data is protected by RLS)
window.RC = {
  url: 'https://mlncwxzugxjulxxuhmsd.supabase.co',
  key: 'sb_publishable_RtZHLhzm4qLWYbIGIU54Eg_Schs3Nxy',
  bucket: 'shop-images',
  currency: 'ج.م',
  categories: { men: 'رجالي', women: 'حريمي', unisex: 'للجنسين' },
  statuses: {
    new: 'جديد', confirmed: 'متأكد', shipped: 'اتشحن', delivered: 'اتسلم', cancelled: 'ملغي'
  }
};
window.RC.money = (n) => Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' ' + window.RC.currency;
window.RC.finalPrice = (p) => (p.sale_price != null && Number(p.sale_price) < Number(p.price)) ? Number(p.sale_price) : Number(p.price);
window.RC.discountPct = (p) => (p.sale_price != null && Number(p.sale_price) < Number(p.price)) ? Math.round((1 - p.sale_price / p.price) * 100) : 0;
window.RC.esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
window.RC.logo = (cls = '') => `<svg class="rc-mark ${cls}" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="100" cy="100" r="88" stroke-width="2"/>
  <g stroke-width="3"><line x1="100" y1="14" x2="100" y2="24"/><line x1="100" y1="176" x2="100" y2="186"/><line x1="14" y1="100" x2="24" y2="100"/><line x1="176" y1="100" x2="186" y2="100"/></g>
  <g stroke-width="1.8"><line x1="143" y1="25.5" x2="139" y2="32.4"/><line x1="174.5" y1="57" x2="167.6" y2="61"/><line x1="174.5" y1="143" x2="167.6" y2="139"/><line x1="143" y1="174.5" x2="139" y2="167.6"/><line x1="57" y1="174.5" x2="61" y2="167.6"/><line x1="25.5" y1="143" x2="32.4" y2="139"/><line x1="25.5" y1="57" x2="32.4" y2="61"/><line x1="57" y1="25.5" x2="61" y2="32.4"/></g>
  <path d="M100 103 V40" stroke-width="5.5"/><path d="M100 40 H111 A15 15 0 0 1 111 70 H100" stroke-width="3"/><path d="M108 70 L134 100" stroke-width="3"/>
  <path d="M134 100 V40 H157 M134 70 H153" stroke-width="3"/><path d="M100 100 H164" stroke-width="4.5"/><path d="M159 95.5 L164.5 100 L159 104.5" stroke-width="3"/>
  <g class="rc-sec"><line x1="113" y1="92.5" x2="44" y2="132" stroke="var(--amber, #b07a3a)" stroke-width="2.2"/></g>
  <circle cx="100" cy="100" r="5" fill="currentColor" stroke="none"/><circle cx="100" cy="100" r="2" fill="var(--amber, #b07a3a)" stroke="none"/>
</svg>`;
