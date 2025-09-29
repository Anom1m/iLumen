// --- Dummy-Daten ---
const MOVIES = [
  {
    id: 'm1',
    title: 'Neon Nights',
    rating: 'FSK 12', dur: 122,
    genres: ['Thriller','Action','Crime'],
    poster: 'https://images.pexels.com/photos/30135207/pexels-photo-30135207.jpeg?cs=srgb&dl=pexels-jesserphotonyc-30135207.jpg&fm=jpg',
    times: ['12:30','15:15','18:00','20:45'],
    soldOut: ['18:00']
  },
  {
    id: 'm2',
    title: 'Quiet Skies',
    rating: 'FSK 6', dur: 105,
    genres: ['Drama'],
    poster: 'https://images.pexels.com/photos/30135207/pexels-photo-30135207.jpeg?cs=srgb&dl=pexels-jesserphotonyc-30135207.jpg&fm=jpg',
    times: ['13:00','16:00','19:30'],
    soldOut: []
  },
  {
    id: 'm3',
    title: 'Galactic Run',
    rating: 'FSK 16', dur: 131, 
    genres: ['Sci-Fi','Adventure'],
    poster: 'https://images.pexels.com/photos/30135207/pexels-photo-30135207.jpeg?cs=srgb&dl=pexels-jesserphotonyc-30135207.jpg&fm=jpg',
    cities: ['Hamburg','München'],
    times: ['14:00','17:00','20:00','22:30'],
    soldOut: ['20:00','22:30']
  },
  {
    id: 'm4',
    title: 'Little Giants',
    rating: 'FSK 0', dur: 94,
    genres: ['Familie','Animation'],
    poster: '',
    cities: ['Berlin','Dresden','Frankfurt'],
    times: ['11:00','13:30','16:15'],
    soldOut: []
  },
  {
    id: 'm5',
    title: 'Edge of Echo',
    rating: 'FSK 12', dur: 118,
    genres: ['Mystery','Thriller'],
    poster: '',
    cities: ['Frankfurt','Hamburg','München'],
    times: ['15:45','19:00','21:45'],
    soldOut: ['21:45']
  },

  {
    id: 'm6',
    title: 'Midnight Horizon',
    rating: 'FSK 16', dur: 128,
    genres: ['Action','Sci-Fi'],
    poster: '',
    cities: ['Berlin','Hamburg','München'],
    times: ['17:00','20:00','22:45'],
    soldOut: ['22:45']
  },
  {
    id: 'm7',
    title: 'Whispering Woods',
    rating: 'FSK 12', dur: 110,
    genres: ['Fantasy','Drama'],
    poster: '',
    cities: ['Frankfurt','Dresden'],
    times: ['14:30','18:15','21:00'],
    soldOut: []
  },
  {
    id: 'm8',
    title: 'Ocean Deep',
    rating: 'FSK 0', dur: 95,
    genres: ['Dokumentation','Abenteuer'],
    poster: '',
    cities: ['Hamburg','Berlin','Frankfurt'],
    times: ['12:00','15:00','18:00'],
    soldOut: []
  },
  {
    id: 'm9',
    title: 'Crimson Vengeance',
    rating: 'FSK 18', dur: 134,
    genres: ['Thriller','Crime'],
    poster: '',
    cities: ['München','Berlin'],
    times: ['19:00','21:45','23:59'],
    soldOut: ['23:59']
  },
  {
    id: 'm10',
    title: 'Starlight Serenade',
    rating: 'FSK 6', dur: 102,
    genres: ['Musical','Romantik'],
    poster: '',
    cities: ['Dresden','Frankfurt','Hamburg'],
    times: ['13:15','16:00','19:00'],
    soldOut: []
  }
];

// Elemente
const grid = document.getElementById('movie-grid');
const showGrid = document.getElementById('showtime-grid');
const citySel = document.getElementById('city');
const dateInp = document.getElementById('date');
const qInp = document.getElementById('q');
const applyBtn = document.getElementById('apply');
const resultCount = document.getElementById('result-count');

// Jahr im Footer
document.getElementById('year').textContent = new Date().getFullYear();
// Standard: heutiges Datum
const todayISO = new Date().toISOString().slice(0,10);
dateInp.value = todayISO;

function createMovieCard(m){
  const el = document.createElement('article');
  el.className = 'card';
  const poster = document.createElement('div');
  poster.className = 'poster';
  poster.style.backgroundImage = `url('${m.poster}')`;
  poster.role = 'img';
  poster.ariaLabel = `${m.title} Poster`;
  const body = document.createElement('div');
  body.className = 'card-body';
  body.innerHTML = `
    <div class="title">${m.title}</div>
    <div class="meta">${m.rating} • ${m.dur} Min</div>
    <div class="chips">${m.genres.map(g=>`<span class="chip">${g}</span>`).join('')}</div>
  `;
  el.append(poster, body);
  return el;
}

function createShowCard(m){
  const el = document.createElement('article');
  el.className = 'card';
  const body = document.createElement('div');
  body.className = 'card-body';
  body.innerHTML = `
    <div class="title">${m.title}</div>
    <div class="meta">${m.rating} • ${m.dur} Min • <span class="muted">${m.cities?.join(', ') || ''}</span></div>
    <div class="times">${m.times.map(t=>{
      const sold = m.soldOut.includes(t);
      return `<button class="time ${sold?'sold':''}" ${sold?'disabled':''} data-movie="${m.id}" data-time="${t}">${t}</button>`;
    }).join('')}</div>
  `;
  el.append(body);
  return el;
}

function render(){
  grid.innerHTML = '';
  showGrid.innerHTML = '';

  const city = citySel.value;
  const q = qInp.value.trim().toLowerCase();

  const filtered = MOVIES.filter(m =>
    (!city || m.cities?.includes(city)) &&
    (!q || m.title.toLowerCase().startsWith(q))
  );

  // Now Playing
  filtered.forEach(m => grid.appendChild(createMovieCard(m)));

  // Showtimes
  filtered.forEach(m => showGrid.appendChild(createShowCard(m)));

  resultCount.textContent = filtered.length
    ? `${filtered.length} Filme gefunden`
    : 'Keine Treffer – Filter anpassen';
}

applyBtn.addEventListener('click', render);
qInp.addEventListener('keydown', (e)=>{ if(e.key==='Enter') render(); });

// Ticket-Click
showGrid.addEventListener('click', (e)=>{
  const btn = e.target.closest('.time');
  if(!btn || btn.disabled) return;
  const time = btn.dataset.time;
  const movie = MOVIES.find(x=>x.id===btn.dataset.movie);
  alert(`Tickets für "${movie.title}" um ${time} – Platzwahl im nächsten Schritt.`);
});

// Initiale Darstellung
render();

const header = document.querySelector("header.top");
window.addEventListener("scroll", () => {
  if (window.scrollY > 350) {      // ab 350px Scrolltiefe
    header.style.transform = "translateY(-100%)"; // nach oben raus
  } else {
    header.style.transform = "translateY(0)";     // wieder sichtbar
  }
});

// --- Hero Slideshow ---
const heroMovies = MOVIES.slice(0, 3); 
const slidesContainer = document.querySelector(".slides");
const heroTitle = document.getElementById("hero-title");
const heroMeta  = document.getElementById("hero-meta");
const heroTimeline = document.getElementById("hero-timeline");

let currentSlide = 0;
const intervalTime = 10000; // 10 Sekunden pro Banner

// Slides + Timeline erstellen
heroMovies.forEach((m, i) => {
  const slide = document.createElement("div");
  slide.className = "hero-slide" + (i === 0 ? " active" : "");
  slide.style.backgroundImage = `url('${m.poster}')`;

  // Ganze Bannerfläche klickbar
  slide.addEventListener("click", () => {
    window.location.href = `film.html?id=${m.id}`;
  });

  slidesContainer.appendChild(slide);

  // Timeline-Bar
  const bar = document.createElement("div");
  bar.className = "bar";

  const fill = document.createElement("div");
  fill.className = "fill";
  bar.appendChild(fill);

  const marker = document.createElement("div");
  marker.className = "marker";
  bar.appendChild(marker);

  heroTimeline.appendChild(bar);
});

// Infos anzeigen
function showHeroInfo(index) {
  const m = heroMovies[index];
  heroTitle.textContent = m.title;
  heroMeta.textContent  = `${m.rating} • ${m.dur} Min • ${m.genres.join(", ")}`;
}

// Nur Marker resetten
function resetTimeline() {
  document.querySelectorAll(".hero-timeline .marker").forEach(el => {
    el.style.transition = "none";
    el.style.width = "0%";
  });
}

// Alle Bars hart resetten (inkl. Fill) + Reflow erzwingen
function clearAllBars() {
  document.querySelectorAll(".hero-timeline .fill, .hero-timeline .marker").forEach(el => {
    el.style.transition = "none";
    el.style.width = "0%";
  });
  void document.body.offsetHeight; // Reflow
}

// Startet Fill + Marker neu
function startTimeline(index) {
  const bar = document.querySelectorAll(".hero-timeline .bar")[index];
  if (!bar) return;

  const fill = bar.querySelector(".fill");
  const marker = bar.querySelector(".marker");

  // Reset auf 0
  fill.style.transition = "none";
  marker.style.transition = "none";
  fill.style.width = "0%";
  marker.style.width = "0%";

  void fill.offsetWidth; // Reflow erzwingen

  // Jetzt animieren
  requestAnimationFrame(() => {
    fill.style.transition = `width ${intervalTime}ms linear`;
    marker.style.transition = `width ${intervalTime}ms linear`;
    fill.style.width = "100%";   // Rot wächst
    marker.style.width = "100%"; // Weißer Marker läuft drüber
  });
}

// Initial
showHeroInfo(currentSlide);
startTimeline(currentSlide);

// Loop
setInterval(() => {
  const slides = document.querySelectorAll(".hero-slide");
  slides[currentSlide]?.classList.remove("active");

  const next = (currentSlide + 1) % heroMovies.length;
  currentSlide = next;

  // Wenn alle Slides durch → alles resetten
  if (currentSlide === 0) {
    clearAllBars();
  }

  slides[currentSlide]?.classList.add("active");
  showHeroInfo(currentSlide);

  requestAnimationFrame(() => {
    resetTimeline();
    startTimeline(currentSlide);
  });
}, intervalTime);
