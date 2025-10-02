// --- Dummy-Daten ---
const MOVIES = [
  {
    id: 'm1',
    title: 'Neon Nights',
    rating: 'FSK 12', dur: 122,
    genres: ['Thriller','Action','Crime'],
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmiLd5UAeJ8629mWZNdQUCmk0MAzx-Mc-JFA&s',
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

// --- COMING SOON (nur für Slideshow) ---
const COMING_SOON = [
  {
    id: 'u1',
    title: 'Aurora Rising',
    rating: 'FSK 12', dur: 119,
    genres: ['Sci-Fi','Drama'],
    release: '2025-10-18',
    poster: 'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg'
  },
  {
    id: 'u2',
    title: 'Velvet Storm',
    rating: 'FSK 16', dur: 128,
    genres: ['Action','Thriller'],
    release: '2025-11-02',
    poster: 'https://images.pexels.com/photos/799137/pexels-photo-799137.jpeg'
  },
  {
    id: 'u3',
    title: 'Echoes of Eden',
    rating: 'FSK 6', dur: 101,
    genres: ['Abenteuer','Familie'],
    release: '2025-12-05',
    poster: 'https://images.pexels.com/photos/1118869/pexels-photo-1118869.jpeg'
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

  // Overlay + Button für "Mehr Infos"
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  const btn = document.createElement("button");
  btn.className = "btn-info";
  btn.textContent = "Mehr Infos";
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    window.location.href = `film.html?id=${m.id}`;
  });
  overlay.appendChild(btn);

  el.appendChild(poster);
  el.appendChild(overlay);

  const body = document.createElement('div');
  body.className = 'card-body';
  body.innerHTML = `
    <div class="title">${m.title}</div>
    <div class="meta">${m.rating} • ${m.dur} Min</div>
    <div class="chips">${m.genres.map(g=>`<span class="chip">${g}</span>`).join('')}</div>
  `;
  el.append(body);
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

// Klick auf Spielzeit -> nur Film-Info öffnen
showGrid.addEventListener('click', (e)=>{
  const btn = e.target.closest('.time');
  if(!btn || btn.disabled) return;
  const movieId = btn.dataset.movie;
  window.location.href = `film.html?id=${movieId}`;
});

// Initiale Darstellung
render();

// Header-Scroll
const header = document.querySelector("header.top");
window.addEventListener("scroll", () => {
  if (window.scrollY > 350) {
    header.style.transform = "translateY(-100%)";
  } else {
    header.style.transform = "translateY(0)";
  }
});

// --- Hero Slideshow ---
const heroMovies = COMING_SOON;
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

  slide.addEventListener("click", () => {
    window.location.href = `film.html?id=${m.id}`;
  });

  slidesContainer.appendChild(slide);

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

function showHeroInfo(index) {
  const m = heroMovies[index];
  heroTitle.innerHTML = `<span class="badge-upcoming">Demnächst</span><br/>${m.title}`;
  heroMeta.textContent  = `${m.rating} • ${m.dur} Min • ${m.genres.join(", ")}`;
}

function resetTimeline() {
  document.querySelectorAll(".hero-timeline .marker").forEach(el => {
    el.style.transition = "none";
    el.style.width = "0%";
  });
}

function clearAllBars() {
  document.querySelectorAll(".hero-timeline .fill, .hero-timeline .marker").forEach(el => {
    el.style.transition = "none";
    el.style.width = "0%";
  });
  void document.body.offsetHeight;
}

function startTimeline(index) {
  const bar = document.querySelectorAll(".hero-timeline .bar")[index];
  if (!bar) return;

  const fill = bar.querySelector(".fill");
  const marker = bar.querySelector(".marker");

  fill.style.transition = "none";
  marker.style.transition = "none";
  fill.style.width = "0%";
  marker.style.width = "0%";

  void fill.offsetWidth;

  requestAnimationFrame(() => {
    fill.style.transition = `width ${intervalTime}ms linear`;
    marker.style.transition = `width ${intervalTime}ms linear`;
    fill.style.width = "100%";
    marker.style.width = "100%";
  });
}

showHeroInfo(currentSlide);
startTimeline(currentSlide);

setInterval(() => {
  const slides = document.querySelectorAll(".hero-slide");
  slides[currentSlide]?.classList.remove("active");

  const next = (currentSlide + 1) % heroMovies.length;
  currentSlide = next;

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
