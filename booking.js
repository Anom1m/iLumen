const params = new URLSearchParams(window.location.search);
const movieId = params.get("movie");
const showTime = params.get("time");
const city = params.get("city") || "";
const dateISO = params.get("date") || "";

// --- Elemente ---
const seatRowsEl = document.getElementById("seatRows");
const selectedSeatsEl = document.getElementById("selectedSeats");
const subtotalEl = document.getElementById("subtotal");
const surcharge3dEl = document.getElementById("surcharge3d");
const totalPriceEl = document.getElementById("totalPrice");
const is3DEl = document.getElementById("is3D");

// Header-Infos
document.getElementById("showTime").textContent = showTime || "—";
document.getElementById("cityName").textContent = city || "—";
const showDateEl = document.getElementById("showDate");
if (dateISO) {
  const d = new Date(dateISO);
  showDateEl.textContent = d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
} else showDateEl.textContent = "—";

// Film aus Storage
let MOVIES = [];
try { MOVIES = JSON.parse(localStorage.getItem("MOVIES") || "[]"); } catch {}
const movie = MOVIES.find(m => m.id === movieId) || {};
const fallbackTitle = params.get('movietitle');
const title = movie.title || decodeURIComponent(fallbackTitle || movieId || "Unbekannter Film");
document.getElementById("movieTitle").textContent = title;
document.getElementById("ticketTitle").textContent = title;
document.getElementById("ticketCity").textContent = city;
document.getElementById("ticketTime").textContent = showTime;
document.getElementById("ticketDate").textContent = showDateEl.textContent;

// Poster
const ticketPoster = document.getElementById("ticketPoster");
const posterParam = params.get('moviePoster');
if (movie.poster) {
  ticketPoster.src = movie.poster;
} else if (posterParam) {
  try { ticketPoster.src = decodeURIComponent(posterParam); } catch { ticketPoster.src = posterParam; }
} else {
  // no poster available - keep empty (CSS shows fallback background)
}

// --- Saalaufbau ---
const rows = 12, cols = 18;
const PREMIUM_PRICE = 14.9;
const STANDARD_PRICE = 11.5;
const SURCHARGE_3D = 3.0;

function generateOccupied(rows, cols, perc = 0.2) {
  const occ = new Set();
  const total = rows * cols;
  const count = Math.floor(total * perc);
  while (occ.size < count) occ.add(`${Math.ceil(Math.random()*rows)}-${Math.ceil(Math.random()*cols)}`);
  return occ;
}
const occupied = generateOccupied(rows, cols, 0.2);

// Buchstaben
const rowToLetter = row => String.fromCharCode(64 + (rows - row + 1));

// Render Seats (gerade Reihen)
for (let r = 1; r <= rows; r++) {
  const rowEl = document.createElement("div");
  rowEl.className = "seat-row";
  for (let c = 1; c <= cols; c++) {
    const seat = document.createElement("div");
    seat.className = "seat";
    seat.dataset.pos = `${r}-${c}`;
    seat.title = `Reihe ${rowToLetter(r)}, Platz ${c}`;
    if (r > rows - 2) seat.classList.add("premium");
    if (occupied.has(`${r}-${c}`)) seat.classList.add("occupied");
    rowEl.appendChild(seat);
  }
  seatRowsEl.appendChild(rowEl);
}

// Auswahl
let selected = [];
seatRowsEl.addEventListener("click", e => {
  const seat = e.target.closest(".seat");
  if (!seat || seat.classList.contains("occupied")) return;
  seat.classList.toggle("selected");
  const pos = seat.dataset.pos;
  selected = seat.classList.contains("selected")
    ? [...selected, pos]
    : selected.filter(x => x !== pos);
  updateSummary();
});
is3DEl.addEventListener("change", updateSummary);

// Preislogik
function isPremium(pos) {
  const [r] = pos.split("-").map(Number);
  return r > rows - 2;
}
function calcPrices() {
  let base = 0, extra = 0;
  for (const pos of selected) {
    const seatPrice = isPremium(pos) ? PREMIUM_PRICE : STANDARD_PRICE;
    base += seatPrice;
    if (is3DEl.checked) extra += SURCHARGE_3D;
  }
  return { base, extra, total: base + extra };
}
function updateSummary() {
  const labels = selected.map(pos => {
    const [r, c] = pos.split("-").map(Number);
    const label = `${rowToLetter(r)}${c}`; // z. B. H14
return label; // Zusatz "(Premium)" nicht anzeigen – im Mock war es clean

  });
  renderSelectedSeatsList(labels);
  const { base, extra, total } = calcPrices();
  subtotalEl.textContent = base.toFixed(2).replace(".", ",") + " €";
  surcharge3dEl.textContent = extra.toFixed(2).replace(".", ",") + " €";
  totalPriceEl.textContent = total.toFixed(2).replace(".", ",") + " €";
}
updateSummary();



// Header-Scroll
const header = document.querySelector("header.top");
window.addEventListener("scroll", () => {
  header.style.transform = window.scrollY > 100 ? "translateY(-100%)" : "translateY(0)";
});


/* Hilfsfunktion: ausgewählte Sitzplätze in Liste anzeigen */

function renderSelectedSeatsList(selectedSeatLabels){
  const list = document.getElementById('selectedSeatsList');
  if (!list) return;
  list.innerHTML = '';

  if (!selectedSeatLabels || selectedSeatLabels.length === 0){
    const li = document.createElement('li');
    li.textContent = 'keine';
    li.style.opacity = '.75';
    list.appendChild(li);
    return;
  }

  // Sortierung wie H14, H15, …
  const sorted = [...selectedSeatLabels].sort((a,b) => {
    const re = /^([A-Za-zÄÖÜäöü]+)\s?(\d+)$/;
    const ma = a.match(re) || [,'',Number.MAX_SAFE_INTEGER];
    const mb = b.match(re) || [,'',Number.MAX_SAFE_INTEGER];
    const ra = ma[1] || a, rb = mb[1] || b;
    const na = parseInt(ma[2] || '0', 10);
    const nb = parseInt(mb[2] || '0', 10);
    return ra.localeCompare(rb, 'de') || na - nb;
  });

  for (const label of sorted){
    const li = document.createElement('li');
    li.textContent = label; // z.B. "H14"
    list.appendChild(li);
  }
}

document.getElementById('checkout').addEventListener('click', () => {
  // Sammle die nötigen Daten aus deiner bestehenden State/UI:
  const movieTitle = document.getElementById('ticketTitle')?.textContent?.trim() || '—';
  const poster = document.getElementById('ticketPoster')?.getAttribute('src') || '';
  const city = document.getElementById('ticketCity')?.textContent?.trim() || '—';
  const date = document.getElementById('ticketDate')?.textContent?.trim() || '—';
  const time = document.getElementById('ticketTime')?.textContent?.trim() || '—';
  const is3D = document.getElementById('is3D')?.checked || false;

  // Build readable seat labels from the internal `selected` array (e.g. H14)
  const seats = selected.map(pos => {
    const [r,c] = pos.split('-').map(Number);
    const label = `${rowToLetter(r)}${c}`;
    return label;
  });

  // Hole vorhandene Zahlen aus deiner Preislogik
  const subtotal   = parseFloat((document.getElementById('subtotal')?.textContent||'0').replace(/[^\d,.-]/g,'').replace(',','.')) || 0;
  const surcharge3d= parseFloat((document.getElementById('surcharge3d')?.textContent||'0').replace(/[^\d,.-]/g,'').replace(',','.')) || 0;
  const total      = parseFloat((document.getElementById('totalPrice')?.textContent||'0').replace(/[^\d,.-]/g,'').replace(',','.')) || 0;

  const order = { movieTitle, poster, city, date, time, seats, is3D, prices:{ subtotal, surcharge3d, total } };
  try { sessionStorage.setItem('ilumenOrder', JSON.stringify(order)); } catch(e){}

  // Weiter zur Kasse
  window.location.href = 'checkout.html';
});
