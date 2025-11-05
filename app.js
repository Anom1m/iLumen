// Dummy Daten 
const MOVIES = [
  {
    id: 'm1',
    title: 'Dark Nights',
    rating: 'FSK 12', dur: 122,
    genres: ['Thriller','Action','Crime'],
    poster: 'https://wallpapers.com/images/hd/mysterious-noir-detective-smoking-in-foggy-alley-p5sg0z8slwalzjuj.jpg',
    cities: ['Berlin','Hamburg','München'],
    times: ['12:30','15:15','18:00','20:45'],
    soldOut: ['18:00']
  },
  {
    id: 'm2',
    title: 'Quiet Skies',
    rating: 'FSK 6', dur: 105,
    genres: ['Drama'],
    poster: 'https://images.pexels.com/photos/629168/pexels-photo-629168.jpeg?cs=srgb&dl=pexels-eberhardgross-629168.jpg&fm=jpg',
    times: ['13:00','16:00','19:30'],
    soldOut: []
  },
  {
    id: 'm3',
    title: 'Galactic Run',
    rating: 'FSK 16', dur: 131, 
    genres: ['Sci-Fi','Adventure'],
    poster: 'https://img2.wallspic.com/crops/4/2/4/3/4/143424/143424-flug-verkehrsflugzeug-himmel-luft_und_raumfahrttechnik-flugreise-3840x2160.jpg',
    cities: ['Hamburg','München'],
    times: ['14:00','17:00','20:00','22:30'],
    soldOut: ['20:00','22:30']
  },
  {
    id: 'm4',
    title: 'Little Giants',
    rating: 'FSK 0', dur: 94,
    genres: ['Familie','Animation'],
    poster: 'https://cdn.prod.website-files.com/601dc4639d384b60c94af395/63228575930aee1de85a1c11_DC%20League%20Of%20Superpets.jpg',
    cities: ['Berlin','Dresden','Frankfurt'],
    times: ['11:00','13:30','16:15'],
    soldOut: []
  },
  {
    id: 'm5',
    title: 'Edge of Echo',
    rating: 'FSK 12', dur: 118,
    genres: ['Mystery','Thriller'],
    poster: 'https://images.handelsblatt.com/YBzT5ws5t-z1/cover/1400/934/0/0/142/142/0.5/0.5/vermisst.jpeg',
    cities: ['Frankfurt','Hamburg','München'],
    times: ['15:45','19:00','21:45'],
    soldOut: ['21:45']
  },
  {
    id: 'm6',
    title: 'Midnight Horizon',
    rating: 'FSK 16', dur: 128,
    genres: ['Action','Sci-Fi'],
    poster: 'https://static.vecteezy.com/system/resources/previews/025/489/577/large_2x/exploding-alien-spaceship-creates-mystery-in-star-field-atmosphere-generated-by-ai-free-photo.jpg',
    cities: ['Berlin','Hamburg','München'],
    times: ['17:00','20:00','22:45'],
    soldOut: ['22:45']
  },
  {
    id: 'm7',
    title: 'Whispering Woods',
    rating: 'FSK 12', dur: 110,
    genres: ['Fantasy','Drama'],
    poster: 'https://media.desenio.com/site_images/68b98eda9ff41a89f78cbd24_526715612_CAN11254-5_variant_main_image_ds.jpg?auto=compress%2Cformat&fit=max&w=3840',
    cities: ['Frankfurt','Dresden'],
    times: ['14:30','18:15','21:00'],
    soldOut: []
  },
  {
    id: 'm8',
    title: 'Ocean Deep',
    rating: 'FSK 0', dur: 95,
    genres: ['Dokumentation','Abenteuer'],
    poster: 'https://mim.p7s1.io/pis/ld/bcedzChLCVyZ-c1vEwXZAanB-DJ78rnq2V2gRWTHzVV6NywNWMSJCEGmZ4YSENP-WRL0b9lo2z78GmGphRwkMiQ4AqTv6UM2hR5PzEf8k1XCy8QQY9c048waIREpp-ZENl8007SjuU4/profile:original?w=1200&rect=213%2C0%2C854%2C854',
    cities: ['Hamburg','Berlin','Frankfurt'],
    times: ['12:00','15:00','18:00'],
    soldOut: []
  },
  {
    id: 'm9',
    title: 'Crimson Vengeance',
    rating: 'FSK 18', dur: 134,
    genres: ['Thriller','Crime'],
    poster: 'https://mojtv.hr/images/2018-09/0866d0d6-989c-4dd0-8be2-5aad78.jpg',
    cities: ['München','Berlin'],
    times: ['19:00','21:45','23:59'],
    soldOut: ['23:59']
  },
  {
    id: 'm10',
    title: 'Starlight Serenade',
    rating: 'FSK 6', dur: 102,
    genres: ['Musical','Romantik'],
    poster: 'https://i.pinimg.com/736x/73/f2/1a/73f21a0ae2806bb93be9e56d27297247.jpg',
    cities: ['Dresden','Frankfurt','Hamburg'],
    times: ['13:15','16:00','19:00'],
    soldOut: []
  }
];

// 🔸 Filme für die Booking-Seite verfügbar machen
try { localStorage.setItem("MOVIES", JSON.stringify(MOVIES)); } catch(e){}

// --- Schedules automatisch für jede Film-Instanz erzeugen (Datum + Uhrzeiten)
// -> jede Vorstellung an verschiedenen Tagen und zu verschiedenen Uhrzeiten
function generateSchedules(movies, days = 10) {
  const today = new Date();
  movies.forEach((m, idx) => {
    const baseTimes = Array.isArray(m.times) && m.times.length ? m.times.slice() : ['13:00','16:00','19:00'];
    m.schedule = [];

    // Stabile rotation: verschiebe start-Offset nach Index damit Filme an unterschiedlichen Tagen starten
    const startOffset = idx % 3; // 0..2

    for (let d = 0; d < days; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + d + startOffset);
      const iso = date.toISOString().slice(0,10);

      // Pick 2-4 times per day by rotating baseTimes and slicing
      const rot = (d + idx) % baseTimes.length;
      const times = [];
      const count = 2 + ((d + idx) % 3); // 2..4 times
      for (let t = 0; t < count; t++) {
        times.push(baseTimes[(rot + t) % baseTimes.length]);
      }

      // avoid duplicate schedule entries
      m.schedule.push({ date: iso, times });
    }
  });
}

generateSchedules(MOVIES, 30);
// zwischen Speicherung für Booking-Seite
try { localStorage.setItem("MOVIES", JSON.stringify(MOVIES)); } catch(e){}

// nur für Slideshow
const COMING_SOON = [
  {
    id: 'u1',
    title: 'Interstellar',
    rating: 'FSK 12', dur: 119,
    genres: ['Sci-Fi','Drama'],
    release: '2025-10-18',
    poster: 'https://getwallpapers.com/wallpaper/full/6/2/e/1267879-movie-poster-wallpaper-1920x1080-for-hd.jpg'
  },
  {
    id: 'u2',
    title: 'Race',
    rating: 'FSK 16', dur: 128,
    genres: ['Action','Romantik'],
    release: '2025-11-02',
    poster: 'https://4kwallpapers.com/images/wallpapers/f1-the-movie-8k-3840x2160-22458.jpg'
  },
  {
    id: 'u3',
    title: 'The Mission',
    rating: 'FSK 6', dur: 101,
    genres: ['Action','Thriller'],
    release: '2025-12-05',
    poster: 'https://www.zastavki.com/pictures/originals/2023/Movies_Poster_for_the_new_movie_Mission_Impossible__Deadly_Reckoning._Part_1_161924_.jpg'
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

// Standard: kein voreingestelltes Datum – wenn Nutzer kein Datum wählt, zeigen wir alle Filme
const todayISO = new Date().toISOString().slice(0,10);

// leave date input empty by default so the page shows all movies until the user filters by date
dateInp.value = '';

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
  // Use schedule for the currently selected date
  const selDate = dateInp.value || todayISO;
  const sched = (m.schedule || []).find(s => s.date === selDate);
  const timesHtml = (sched && sched.times && sched.times.length)
    ? sched.times.map(t=>{
        const sold = (m.soldOut || []).includes(t);
        return `<button class="time ${sold?'sold':''}" ${sold?'disabled':''} data-movie="${m.id}" data-time="${t}">${t}</button>`;
      }).join('')
    : `<div class="muted">Keine Vorstellung am ${selDate}</div>`;

  body.innerHTML = `
    <div class="title">${m.title}</div>
    <div class="meta">${m.rating} • ${m.dur} Min • <span class="muted">${m.cities?.join(', ') || ''}</span></div>
    <div class="times">${timesHtml}</div>
  `;
  el.append(body);
  return el;
}

function render(){
  grid.innerHTML = '';
  showGrid.innerHTML = '';

  const city = citySel.value;
  const q = qInp.value.trim().toLowerCase();
  // Use the raw value from the date input. If empty, we want to show all movies.
  const date = dateInp.value;

  const filtered = MOVIES.filter(m =>
    (!city || m.cities?.includes(city)) &&
    (!q || m.title.toLowerCase().startsWith(q)) &&
    // only apply the date filter when the user actually selected a date
    (!date || (m.schedule && m.schedule.some(s => s.date === date)))
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
// react to date or city changes immediately
dateInp.addEventListener('change', render);
citySel.addEventListener('change', render);

// Klick auf Spielzeit -> Booking-Seite (Film, City, Datum übernehmen)
showGrid.addEventListener('click', (e)=>{
  const btn = e.target.closest('.time');
  if(!btn || btn.disabled) return;
  const movieId = btn.dataset.movie;
  const time = btn.dataset.time;
  const movie = MOVIES.find(m => m.id === movieId);
  const city = citySel.value || (movie?.cities?.[0] || '');
  const date = dateInp.value || todayISO;
  // include movietitle as a fallback (used when localStorage isn't available)
  const url = `booking.html?movie=${encodeURIComponent(movieId)}&movietitle=${encodeURIComponent(movie?.title||'')}&moviePoster=${encodeURIComponent(movie?.poster||'')}&time=${encodeURIComponent(time)}&city=${encodeURIComponent(city)}&date=${encodeURIComponent(date)}`;
  window.location.href = url;
});

// Initiale Darstellung
render();

// Header-Scroll
const header = document.querySelector("header.top");
window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
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

// Slides + Timeline 
heroMovies.forEach((m, i) => {
  const slide = document.createElement("div");
  slide.className = "hero-slide" + (i === 0 ? " active" : "");
  slide.style.backgroundImage = `url('${m.poster}')`;


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


