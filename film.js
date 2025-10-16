// Jahr im Footer
document.getElementById('year').textContent = new Date().getFullYear();

// Hilfsfunktionen
const qs = (s, r = document) => r.querySelector(s);
const fmtDur = (min) => `${min} Min`;
const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

// Robust laden: setzt Fallback, wenn Hotlinking blockiert wird
function safeLoadImg(imgEl, src) {
  imgEl.loading = 'lazy';
  imgEl.decoding = 'async';
  imgEl.src = src;
  imgEl.addEventListener(
    'error',
    () => {
      imgEl.setAttribute('aria-broken', 'true');
      imgEl.removeAttribute('src'); // zeigt unseren CSS-Gradient
    },
    { once: true }
  );
}

// --- Filmdaten (mit individuellen Postern) ---
const MOVIES = [
  { id:'m1', title:'Neon Nights', rating:'FSK 12', dur:122, formats:['2D','OV'],
    genres:['Thriller','Action','Crime'], release:'2025-09-18',
    poster:'https://wallpapers.com/images/hd/mysterious-noir-detective-smoking-in-foggy-alley-p5sg0z8slwalzjuj.jpg',
    tagline:'In den Schatten der Stadt entscheidet ein Funke über das Schicksal.',
    credits:'A K MORENO • L TANAKA • K ØSTBERG',
    overview:'Detective Ryo Tanaka jagt in den Straßen ... Moral in einer Welt, in der alles käuflich scheint.',
    cast:[['Regie','A. K. Moreno'],['Hauptrolle','L. Tanaka'],['Musik','K. Østberg']],
    cities:['Berlin','Hamburg','München'], times:['12:30','15:15','18:00','20:45'], soldOut:['18:00']
  },
  { id:'m2', title:'Quiet Skies', rating:'FSK 6', dur:105, formats:['2D'], genres:['Drama'],
    release:'2025-08-07',
    poster:'https://images.pexels.com/photos/629168/pexels-photo-629168.jpeg?cs=srgb&dl=pexels-eberhardgross-629168.jpg&fm=jpg',
    overview:'Zwei Geschwister verbringen nach dem Verlust ihrer Mutter ... über Familie, Verlust und Hoffnung.',
    cast:[['Regie','M. Novak'],['Hauptrolle','E. Hartmann']],
    cities:['Berlin','Hamburg'], times:['13:00','16:00','19:30'], soldOut:[]
  },
  { id:'m3', title:'Galactic Run', rating:'FSK 16', dur:131, formats:['2D','OV'],
    genres:['Sci-Fi','Adventure'], release:'2025-10-01',
    poster:'https://img2.wallspic.com/crops/4/2/4/3/4/143424/143424-flug-verkehrsflugzeug-himmel-luft_und_raumfahrttechnik-flugreise-3840x2160.jpg',
    overview:'Im Jahr 2398 ist das „Galactic Run“ das gefährlichste Rennen ... voller Tempo und Herz.',
    cast:[['Regie','S. Rahman'],['Hauptrolle','J. Ortega']],
    cities:['Hamburg','München'], times:['14:00','17:00','20:00','22:30'], soldOut:['20:00','22:30']
  },
  { id:'m4', title:'Little Giants', rating:'FSK 0', dur:94, formats:['2D'], genres:['Familie','Animation'],
    release:'2025-07-10',
    poster:'https://cdn.prod.website-files.com/601dc4639d384b60c94af395/63228575930aee1de85a1c11_DC%20League%20Of%20Superpets.jpg',
    overview:'Als der beliebte Stadtpark abgerissen werden soll ... Freundschaft, Zusammenhalt und die Kraft, an das Gute zu glauben.',
    cast:[['Regie','Y. Kim'],['Stimmen','D. Berg / S. Klein']],
    cities:['Berlin','Dresden','Frankfurt'], times:['11:00','13:30','16:15'], soldOut:[]
  },
  { id:'m5', title:'Edge of Echo', rating:'FSK 12', dur:118, formats:['2D'], genres:['Mystery','Thriller'],
    release:'2025-06-26',
    poster:'https://images.handelsblatt.com/YBzT5ws5t-z1/cover/1400/934/0/0/142/142/0.5/0.5/vermisst.jpeg',
    overview:'Eine Ermittlerin wird von den Stimmen einer alten Vermisstenmeldung ... bis zur letzten Sekunde in Atem.',
    cast:[['Regie','C. Almeida'],['Hauptrolle','M. Ren']],
    cities:['Frankfurt','Hamburg','München'], times:['15:45','19:00','21:45'], soldOut:['21:45']
  },
  { id:'m6', title:'Midnight Horizon', rating:'FSK 16', dur:128, formats:['2D','OV'],
    genres:['Action','Sci-Fi'], release:'2025-10-08',
    poster:'https://static.vecteezy.com/system/resources/previews/025/489/577/large_2x/exploding-alien-spaceship-creates-mystery-in-star-field-atmosphere-generated-by-ai-free-photo.jpg',
    overview:'In einer fernen Zukunft herrscht Krieg zwischen den Kolonien ... Ein düsteres Sci-Fi-Abenteuer voller Spannung und Emotion.',
    cast:[['Regie','T. Kawamura'],['Hauptrolle','R. Cole']],
    cities:['Berlin','Hamburg','München'], times:['17:00','20:00','22:45'], soldOut:['22:45']
  },
  { id:'m7', title:'Whispering Woods', rating:'FSK 12', dur:110, formats:['2D'], genres:['Fantasy','Drama'],
    release:'2025-05-15',
    poster:'https://media.desenio.com/site_images/68b98eda9ff41a89f78cbd24_526715612_CAN11254-5_variant_main_image_ds.jpg?auto=compress%2Cformat&fit=max&w=3840',
    overview:'Die junge Botanikerin Elara entdeckt in einem abgeschiedenen Wald ... über Verlust, Vergebung und das Hören auf das, was zwischen den Zeilen klingt.',
    cast:[['Regie','I. Šimić'],['Hauptrolle','T. Varela']],
    cities:['Frankfurt','Dresden'], times:['14:30','18:15','21:00'], soldOut:[]
  },
  { id:'m8', title:'Ocean Deep', rating:'FSK 0', dur:95, formats:['2D'], genres:['Dokumentation','Abenteuer'],
    release:'2025-03-27',
    poster:'https://mim.p7s1.io/pis/ld/bcedzChLCVyZ-c1vEwXZAanB-DJ78rnq2V2gRWTHzVV6NywNWMSJCEGmZ4YSENP-WRL0b9lo2z78GmGphRwkMiQ4AqTv6UM2hR5PzEf8k1XCy8QQY9c048waIREpp-ZENl8007SjuU4/profile:original?w=1200&rect=213%2C0%2C854%2C854',
    overview:'Eine internationale Forschergruppe begibt sich ... Abenteuer voller Staunen und Erkenntnis.',
    cast:[['Regie','N. Patel']],
    cities:['Hamburg','Berlin','Frankfurt'], times:['12:00','15:00','18:00'], soldOut:[]
  },
  { id:'m9', title:'Crimson Vengeance', rating:'FSK 18', dur:134, formats:['2D'], genres:['Thriller','Crime'],
    release:'2025-09-05',
    poster:'https://mojtv.hr/images/2018-09/0866d0d6-989c-4dd0-8be2-5aad78.jpg',
    overview:'Ein ehemaliger Auftragskiller schwört Rache ... Ein Rache-Epos, das unter die Haut geht.',
    cast:[['Regie','H. Okafor'],['Hauptrolle','S. Bianchi']],
    cities:['München','Berlin'], times:['19:00','21:45','23:59'], soldOut:['23:59']
  },
  { id:'m10', title:'Starlight Serenade', rating:'FSK 6', dur:102, formats:['2D'], genres:['Musical','Romantik'],
    release:'2025-08-21',
    poster:'https://i.pinimg.com/736x/73/f2/1a/73f21a0ae2806bb93be9e56d27297247.jpg',
    overview:'Sängerin Lina träumt von einer großen Karriere ... Ein modernes Musical, das Herz und Ohr gleichermaßen berührt.',
    cast:[['Regie','E. Mendez'],['Hauptrolle','P. Yamamoto']],
    cities:['Dresden','Frankfurt','Hamburg'], times:['13:15','16:00','19:00'], soldOut:[]
  }
];

// URL-Param id lesen
const params = new URLSearchParams(location.search);
const id = params.get('id');
const film = MOVIES.find((m) => m.id === id) || MOVIES[0];

// Render Hero + Header-Infos
(function renderHero() {
  // Bilder
  const hero = qs('#hero-img');
  const cover = qs('#film-cover');
  safeLoadImg(hero, film.poster);
  safeLoadImg(cover, film.poster);

  // Overlay-Texte NUR für das kleine Cover
  qs('#cover-title').textContent   = film.title;
  qs('#cover-tagline').textContent = film.tagline || (film.genres ? film.genres.join(' • ') : '');
  const year = film.release ? new Date(film.release).getFullYear() : '';
  qs('#cover-credits').textContent =
    film.credits || `${(film.cast?.[0]?.[1] || '—')} • ${year || 'Coming Soon'}`;

  // FSK-Farb-Code rein
  (() => {
    const elFskNum  = qs('#fsk-number');
    const elFskText = qs('#fsk-text');
    const badge     = qs('#cover-fsk');
    if (!elFskNum || !elFskText || !badge) return;

    const m = (film.rating || '').match(/(\d+)/);
    const fskValue = m ? m[1] : '0';
    elFskNum.textContent  = fskValue;
    elFskText.textContent = 'freigegeben';
    badge.setAttribute('data-fsk', fskValue);
  })();

  // Texte
  qs('#film-title').textContent = film.title;
  qs('#film-meta').textContent = `${film.rating} • ${fmtDur(film.dur)} • ${film.genres.join(', ')}`;
  qs('#film-genres').innerHTML = film.genres.map((g) => `<span class="chip">${g}</span>`).join('');
  qs('#film-overview').textContent = film.overview || 'Keine Inhaltsangabe verfügbar.';
  qs('#fact-fsk').textContent = film.rating;
  qs('#fact-dur').textContent = fmtDur(film.dur);
  qs('#fact-release').textContent = film.release ? fmtDate(film.release) : '—';
  qs('#fact-format').textContent = film.formats?.length ? film.formats.join(' / ') : '2D';


  const trailerBtn = qs('#trailer-btn');
  if (film.trailer) {
    trailerBtn.href = film.trailer;
    trailerBtn.textContent = 'Trailer ansehen';
  } else {
    trailerBtn.classList.add('muted');
    trailerBtn.textContent = 'Kein Trailer verfügbar';
    trailerBtn.removeAttribute('href');
  }

  // Cast
  const castWrap = qs('#film-cast');
  castWrap.innerHTML =
    (film.cast || [])
      .map(([role, name]) => `<div class="row"><span class="muted">${role}</span><strong>${name}</strong></div>`)
      .join('') || '<div class="muted">Keine Angaben</div>';
})();

// Datum (heute) für Filter
const todayISO = new Date().toISOString().slice(0, 10);
qs('#date').value = todayISO;

// Spielzeiten rendern
const showGrid = qs('#showtime-grid');
function renderTimes() {
  showGrid.innerHTML = '';
  const city = qs('#city').value;
  const cities = city ? [city] : film.cities || [];

  if (!cities.length) {
    showGrid.innerHTML = '<div class="muted">Keine Vorstellungen verfügbar.</div>';
    return;
  }

  cities.forEach((c) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-body">
        <div class="title">${film.title} – <span class="muted">${c}</span></div>
        <div class="meta">${film.rating} • ${fmtDur(film.dur)} • ${film.formats?.join(' / ') || '2D'}</div>
        <div class="times">
          ${film.times
            .map((t) => {
              const sold = film.soldOut?.includes(t);
              return `<button class="time ${sold ? 'sold' : ''}" ${sold ? 'disabled' : ''} data-time="${t}" data-city="${c}">${t}</button>`;
            })
            .join('')}
        </div>
      </div>`;
    showGrid.appendChild(card);
  });
}
renderTimes();
qs('#apply').addEventListener('click', renderTimes);

// Ticket-Click
showGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('.time');
  if (!btn || btn.disabled) return;
  const t = btn.dataset.time;
  const c = btn.dataset.city;
  alert(`Tickets für "${film.title}" – ${c} um ${t}. Platzwahl im nächsten Schritt.`);
});

// --- SIEHE AUCH: exakt 4 sichtbar, Blättern per Pfeile ---
function renderSeeAlso() {
  const track = document.getElementById('see-track');
  const prev = document.getElementById('see-prev');
  const next = document.getElementById('see-next');
  if (!track || !prev || !next) return;

  // Alle anderen Filme (aktuellen ausschließen)
  const allOthers = MOVIES.filter((m) => m.id !== film.id);

  // Zustand: Startindex der aktuellen „Seite“
  const PAGE = 4;
  let start = 0;

  function clampStart(i) {
    const maxStart = Math.max(0, allOthers.length - PAGE);
    return Math.min(Math.max(0, i), maxStart);
  }

  function renderPage() {
    const slice = allOthers.slice(start, start + PAGE);
    track.innerHTML = slice
      .map(
        (m) => `
      <article class="see-card">
        <a href="film.html?id=${m.id}" aria-label="${m.title}">
          <div class="see-cover">
            <img referrerpolicy="no-referrer" alt="${m.title} Poster"
                 onerror="this.setAttribute('aria-broken','true'); this.removeAttribute('src');"
                 src="${m.poster}">
          </div>
          <div class="see-body">
            <span class="see-title-text">${m.title}</span>
            <div class="see-meta">${m.rating} • ${m.dur} Min${m.formats ? ' • ' + m.formats.join(' / ') : ''}</div>
          </div>
        </a>
      </article>`
      )
      .join('');

    // Pfeile aktiv/deaktivieren
    prev.disabled = start <= 0;
    next.disabled = start >= allOthers.length - PAGE;
  }

  prev.addEventListener('click', () => {
    start = clampStart(start - PAGE);
    renderPage();
  });

  next.addEventListener('click', () => {
    start = clampStart(start + PAGE);
    renderPage();
  });

  // Initial
  renderPage();
}
renderSeeAlso();


 