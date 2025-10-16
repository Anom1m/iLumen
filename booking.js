// Query-Parameter auslesen
const params = new URLSearchParams(window.location.search);
const movieId = params.get("movie");
const showTime = params.get("time");

// Titel einsetzen
document.getElementById("showTime").textContent = showTime || "–";

// Film aus MOVIES suchen
importMovies();

function importMovies(){
  const MOVIES = JSON.parse(localStorage.getItem("MOVIES") || "[]");
  const movie = MOVIES.find(m => m.id === movieId);
  if(movie){
    document.getElementById("movieTitle").textContent = movie.title;
  } else {
    document.getElementById("movieTitle").textContent = "Unbekannter Film";
  }
}

// Elemente
const seatMap = document.getElementById("seatMap");
const selectedSeatsEl = document.getElementById("selectedSeats");
const totalPriceEl = document.getElementById("totalPrice");
const priceTypeEl = document.getElementById("priceType");
const is3DEl = document.getElementById("is3D");

// Mehr Sitze im Saal
const rows = 12, cols = 18;

// Zufällige belegte Sitze erzeugen
function generateOccupied(rows, cols, percentage = 0.2) {
  const occ = new Set();
  const totalSeats = rows * cols;
  const count = Math.floor(totalSeats * percentage);

  while (occ.size < count) {
    const r = Math.floor(Math.random() * rows) + 1;
    const c = Math.floor(Math.random() * cols) + 1;
    occ.add(`${r}-${c}`);
  }
  return occ;
}

const occupied = generateOccupied(rows, cols, 0.2);

// Hilfsfunktion: Zeilennummer in Buchstaben
function rowToLetter(row) {
  // Umdrehen: Reihe 1 unten soll A sein
  const fromBottom = rows - row + 1;
  return String.fromCharCode(64 + fromBottom);
}

// Sitze rendern
function renderSeats(){
  for(let r=1;r<=rows;r++){
    for(let c=1;c<=cols;c++){
      const seat = document.createElement("div");
      seat.className = "seat";
      seat.dataset.pos = `${r}-${c}`;
      seat.title = `Reihe ${rowToLetter(r)}, Platz ${c}`;

      // Premium-Logen: die oberen 3 Reihen
      if(r > rows - 2){
        seat.classList.add("premium");
      }

      if(occupied.has(`${r}-${c}`)) seat.classList.add("occupied");
      seatMap.appendChild(seat);
    }
  }
}

renderSeats();

let selected = [];

// Klick auf Sitz
seatMap.addEventListener("click", e=>{
  if(!e.target.classList.contains("seat") || e.target.classList.contains("occupied")) return;
  e.target.classList.toggle("selected");
  const pos = e.target.dataset.pos;
  if(selected.includes(pos)){
    selected = selected.filter(x=>x!==pos);
  } else {
    selected.push(pos);
  }
  updateSummary();
});

// Zusammenfassung aktualisieren
function updateSummary(){
  const basePrice = parseFloat(priceTypeEl.value) || 0;
  const extra3D = is3DEl.checked ? 3.0 : 0;
  const totalPerSeat = basePrice + extra3D;
  const total = selected.length * totalPerSeat;

  // Sitze in Klartext "Reihe X, Platz Y"
  const seatLabels = selected.map(pos => {
    const [r, c] = pos.split("-").map(Number);
    return `Reihe ${rowToLetter(r)}, Platz ${c}`;
  });

  selectedSeatsEl.textContent = seatLabels.length ? seatLabels.join(" | ") : "keine";
  totalPriceEl.textContent = total.toFixed(2).replace(".",",")+" €";
}

// Event-Listener für Preisoptionen
priceTypeEl.addEventListener("change", updateSummary);
is3DEl.addEventListener("change", updateSummary);

// Checkout
document.getElementById("checkout").addEventListener("click", ()=>{
  if(!selected.length) return alert("Bitte mindestens einen Sitz auswählen!");
  alert(`Du hast ${selected.length} Sitz(e) gewählt: ${selected.map(pos=>{
    const [r,c] = pos.split("-").map(Number);
    return `Reihe ${rowToLetter(r)}, Platz ${c}`;
  }).join(", ")}`);
});


// Header-Scroll
const header = document.querySelector("header.top");
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    header.style.transform = "translateY(-100%)";
  } else {
    header.style.transform = "translateY(0)";
  }
});