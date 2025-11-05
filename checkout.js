// --- Daten laden (aus sessionStorage oder URL-Params als Fallback)
function getOrderFromStorage() {
  const p = new URLSearchParams(location.search);
  try {
    const raw = sessionStorage.getItem('ilumenOrder');
    if (raw) {
      const parsed = JSON.parse(raw);
      // merge with URL params for missing fields
      const merged = Object.assign({}, parsed);
      if (!merged.movieTitle) merged.movieTitle = p.get('movie') || '—';
      if (!merged.poster) merged.poster = p.get('poster') || '';
      if (!merged.city) merged.city = p.get('city') || '—';
      if (!merged.date) merged.date = p.get('date') || '—';
      if (!merged.time) merged.time = p.get('time') || '—';
      if (!merged.seats || !merged.seats.length) merged.seats = (p.get('seats') || '').split(',').filter(Boolean);
      if (typeof merged.is3D === 'undefined' || merged.is3D === null) merged.is3D = p.get('is3D') === '1';
      merged.prices = merged.prices || {};
      merged.prices.subtotal = Number(merged.prices.subtotal || p.get('subtotal') || 0);
      merged.prices.surcharge3d = Number(merged.prices.surcharge3d || p.get('surcharge3d') || 0);
      merged.prices.total = Number(merged.prices.total || p.get('total') || 0);
      return merged;
    }
  } catch(e){}

  // Fallback: minimale Daten aus URL
  return {
    movieTitle: p.get('movie') || '—',
    poster: p.get('poster') || '',
    city: p.get('city') || '—',
    date: p.get('date') || '—',
    time: p.get('time') || '—',
    seats: (p.get('seats') || '').split(',').filter(Boolean),
    is3D: p.get('is3D') === '1',
    prices: {
      subtotal: Number(p.get('subtotal')||0),
      surcharge3d: Number(p.get('surcharge3d')||0),
      total: Number(p.get('total')||0)
    }
  };
}

const order = getOrderFromStorage();

// --- UI füllen
function euro(n){ return (n||0).toFixed(2).replace('.', ',') + ' €'; }

function renderSummary(o){
  document.getElementById('sumTitleMovie').textContent = o.movieTitle || '—';
  document.getElementById('sumCity').textContent = o.city || '—';
  document.getElementById('sumDate').textContent = o.date || '—';
  document.getElementById('sumTime').textContent = o.time || '—';

  const img = document.getElementById('sumPoster');
  if (o.poster) { img.src = o.poster; } else { img.removeAttribute('src'); }

  const ul = document.getElementById('sumSeats');
  ul.innerHTML = '';
  const seats = Array.isArray(o.seats) ? o.seats : [];
  if (seats.length === 0) {
    const li = document.createElement('li'); li.textContent = 'keine'; li.style.opacity='.75'; ul.appendChild(li);
  } else {
    const sorted = [...seats].sort((a,b)=>{
      const re=/^([A-Za-zÄÖÜäöü]+)\s?(\d+)$/; const ma=a.match(re)||[,'',9e9]; const mb=b.match(re)||[,'',9e9];
      const ra=ma[1]||a, rb=mb[1]||b; const na=parseInt(ma[2]||'0',10), nb=parseInt(mb[2]||'0',10);
      return ra.localeCompare(rb, 'de') || na-nb;
    });
    sorted.forEach(s=>{ const li=document.createElement('li'); li.textContent=s; ul.appendChild(li); });
  }

  const ps = o.prices || {};
  document.getElementById('sumSubtotal').textContent = euro(ps.subtotal||0);
  document.getElementById('sum3D').textContent       = euro(ps.surcharge3d||0);
  document.getElementById('sumTotal').textContent    = euro(ps.total||0);
}

renderSummary(order);

// --- Zahlungsarten Umschalten
const panels = {
  card:  document.getElementById('cardForm'),
  paypal:document.getElementById('paypalForm'),
  sepa:  document.getElementById('sepaForm'),
};
document.querySelectorAll('input[name="pmethod"]').forEach(r=>{
  r.addEventListener('change', ()=>{
    for (const [k,el] of Object.entries(panels)) el.hidden = (r.value!==k);
    validateForm(); // Button-Zustand neu prüfen
  });
});

// --- Formatierung & Validierung (einfach)
const numOnly = s => s.replace(/[^\d]/g,'');
const luhn = num => {
  const arr = numOnly(num).split('').reverse().map(n=>+n);
  const sum = arr.reduce((acc, n, i)=> acc + (i%2 ? ((n*=2)>9?n-9:n) : n), 0);
  return sum % 10 === 0;
};

const cardNumber = document.getElementById('cardNumber');
if (cardNumber) cardNumber.addEventListener('input', e=>{
  let v = numOnly(e.target.value).slice(0,16);
  e.target.value = v.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  validateForm();
});

const cardExp = document.getElementById('cardExp');
if (cardExp) cardExp.addEventListener('input', e=>{
  let v = numOnly(e.target.value).slice(0,4);
  if (v.length>=3) v = v.slice(0,2) + '/' + v.slice(2);
  e.target.value = v;
  validateForm();
});

const cardCvc = document.getElementById('cardCvc');
if (cardCvc) cardCvc.addEventListener('input', e=>{
  e.target.value = numOnly(e.target.value).slice(0,4);
  validateForm();
});

['cardName','buyerEmail','buyerEmailPaypal','buyerEmailSepa','sepaName','sepaIban','acceptTerms'].forEach(id=>{
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', validateForm);
  if (el && el.type==='checkbox') el.addEventListener('change', validateForm);
});

function validateForm(){
  const method = document.querySelector('input[name="pmethod"]:checked')?.value || 'card';
  const accept = document.getElementById('acceptTerms').checked;
  let ok = accept;

  if (method==='card'){
    const name = document.getElementById('cardName').value.trim();
    const num  = cardNumber.value;
    const exp  = cardExp.value;
    const cvc  = cardCvc.value;
    const mail = document.getElementById('buyerEmail').value.trim();

    ok = ok && name.length>=2 && luhn(num) && /^\d{2}\/\d{2}$/.test(exp) && cvc.length>=3 && /\S+@\S+\.\S+/.test(mail);
  } else if (method==='paypal'){
    const mail = document.getElementById('buyerEmailPaypal').value.trim();
    ok = ok && /\S+@\S+\.\S+/.test(mail);
  } else if (method==='sepa'){
    const name = document.getElementById('sepaName').value.trim();
    const iban = document.getElementById('sepaIban').value.replace(/\s+/g,'').toUpperCase();
    const mail = document.getElementById('buyerEmailSepa').value.trim();
    ok = ok && name.length>=2 && /^([A-Z]{2}\d{2}[A-Z0-9]{10,30})$/.test(iban) && /\S+@\S+\.\S+/.test(mail);
  }

  document.getElementById('payNow').disabled = !ok;
  document.getElementById('formError').textContent = '';
  return ok;
}

validateForm();

// --- Submit (Demo-Flow)
document.getElementById('payForm').addEventListener('submit', e=>{
  e.preventDefault();
  if (!validateForm()){
    document.getElementById('formError').textContent = 'Bitte überprüfe deine Eingaben.';
    return;
  }

  // "Zahlung" erfolgt – Quittung speichern
  const orderNo = 'IL-' + Date.now().toString().slice(-8);
  const receipt = {
    orderNo,
    when: new Date().toISOString(),
    order
  };
  try { sessionStorage.setItem('ilumenReceipt', JSON.stringify(receipt)); } catch(e){}

  // Erfolgszustand zeigen
  document.getElementById('ordNo').textContent = orderNo;
  document.querySelector('.checkout-grid').style.display = 'none';
  document.getElementById('success').classList.remove('hidden');
});

// Text "Prüfe deine Buchung..." ausblenden, sobald Erfolg angezeigt wird
document.querySelector('.checkout .muted')?.remove();