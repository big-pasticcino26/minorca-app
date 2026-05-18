// ─── IMAGES (real Minorca photos) ────────────────────────────────────────────
// Strategia: foto personali caricate sul repo GitHub `minorca-photos` come
// SCELTA PRIMARIA, con fallback automatico a Wikimedia Commons se la foto
// personale non esiste ancora. Convenzione: `chiave-NN.jpg` (es. sonparc-01.jpg).
//
// Foto personali servite via jsDelivr CDN (caching globale, no rate limit).
// Repo: https://github.com/big-pasticcino26/minorca-photos
const GH_PHOTOS_USER = 'big-pasticcino26';
const GH_PHOTOS_REPO = 'minorca-photos';
const GH_PHOTOS_BRANCH = 'main';
const _gh = (filename) =>
  `https://cdn.jsdelivr.net/gh/${GH_PHOTOS_USER}/${GH_PHOTOS_REPO}@${GH_PHOTOS_BRANCH}/${encodeURIComponent(filename)}`;

// Wikimedia Commons hotlinking (fallback)
// We use the Special:FilePath redirect — the OFFICIAL Wikimedia endpoint for
// external hotlinking — which auto-resolves to the correct upload.wikimedia.org
// thumbnail. Documented at:
// https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia/technical
const _wm = (filename, width=1200) =>
  'https://commons.wikimedia.org/wiki/Special:FilePath/' +
  encodeURIComponent(filename) + '?width=' + width;

// Each entry has [primary, ...fallbacks]. Le foto personali GitHub (_gh) sono
// elencate per prime: se mancano, il sistema di fallback in window._imgFail
// passa automaticamente alle Wikimedia (_wm). Carica le foto sul repo seguendo
// la convenzione di naming e diventano automaticamente la prima scelta.
const _IMGS = {
  // BEACHES (north coast)
  // Son Parc = Arenal de Son Saura del Nord — foto più luminose e canoniche per prime
  sonparc:    [_gh('sonparc-01.jpg'), _gh('sonparc-02.jpg'), _gh('sonparc-03.jpg'),
               _wm('Arenal de Son Saura 3.jpg', 1400),
               _wm('Arenal de Son Saura 6.jpg', 1400),
               _wm('Arenal de Son Saura 1.jpg', 1400),
               _wm('Arenal de Son Saura 5.jpg', 1400),
               _wm('Arenal de Son Saura 8.jpg', 1400),
               _wm('Son Sauda del nord.jpg')],
  // Arenal d'en Castell — Wikidata main image (panoramic shot of the bay)
  arenal:     [_gh('arenal-01.jpg'), _gh('arenal-02.jpg'),
               _wm("Arenal d'en Castell (27 de julio de 2017, es Mercadal).jpg", 1600),
               _wm("De Arenal d'en Castell a Son Saura (25 de julio de 2017, es Mercadal) 04.jpg", 1400)],
  tirant:     [_gh('tirant-01.jpg'),
               _wm('Cala Tirant (4 de agosto de 2015, es Mercadal) 02.jpg')],
  binimella:  [_gh('binimella-01.jpg'),
               _wm('Playa de Binimel-là Es Mercadal Menorca.jpg')],
  // BEACHES (south coast)
  // Cala Galdana — vista canonica dal Mirador des Riu come primaria
  galdana:    [_gh('galdana-01.jpg'), _gh('galdana-02.jpg'),
               _wm('G1 Cala Galdana des del mirador des Riu.JPG', 1400),
               _wm('Cala Galdana Panorama banner.jpg', 1600),
               _wm('Es Pas Vermell.jpg', 1400)],
  sonbou:     [_gh('sonbou-01.jpg'),
               _wm('Playa de Son Bou (Menorca, 31 de julio de 2014) 01.JPG')],
  porter:     [_gh('porter-01.jpg'),
               _wm("Cala'n Porter (Menorca).JPG")],
  // Cova d'en Xoroi — grotta-bar a strapiombo sul mare (diversa dalla spiaggia di Cala en Porter)
  xoroi:      [_gh('xoroi-01.jpg'),
               _wm("Calan n Porter, Cueva d'en Xoroi - panoramio.jpg", 1400),
               _wm('Caves of Xoroi, Cala en Porter IMG 4205 - panoramio.jpg', 1400)],
  // Es Grau villaggio e spiaggia — foto luminose della spiaggia/baia
  esgrau:     [_gh('esgrau-01.jpg'), _gh('esgrau-02.jpg'),
               _wm('Sa Platja des Grau.jpg', 1400),
               _wm('Platja des Grau.jpg', 1400),
               _wm('Entorno playa des Grau.jpg', 1400),
               _wm("Badia d'es Grau (2 de agosto de 2014, Maó).JPG", 1400),
               _wm('Es Grau (2 de agosto de 2014, Maó).JPG')],
  // s'Albufera des Grau — Parco Naturale (zona umida UNESCO) — vista aerea + sentieri
  albufera:   [_gh('albufera-01.jpg'),
               _wm('Albufera des Grau from the air.jpg', 1400),
               _wm('Albufera de Es Grau 20180703 190927 Richtone(HDR).jpg', 1400),
               _wm("Little beach in Albufera d'es Grau.jpg", 1400),
               _wm("Indicación del Camí de Cavalls (2 de agosto de 2014, Parc Natural de s'Albufera des Grau).jpg", 1400)],
  // Cale del sud-ovest (Macarella, Macarelleta, Mitjana) - icone della costa sud
  // Cala Macarella — Wikidata canonical + foto panoramica verificate
  macarella:  [_gh('macarella-01.jpg'),
               _wm('Macarella.JPG', 1400),
               _wm('Macarella3.jpg', 1600),
               _wm('Man-made caves near Cala Macarella (16394774576).jpg', 1400)],
  // Cala Macarelleta — file verificati dalla categoria Macarelleta
  macarelleta:[_gh('macarelleta-01.jpg'),
               _wm('Cala Macarelleta.JPG', 1400),
               _wm('Cala Macarelleta a Menorca.JPG', 1400),
               _wm('Path to Cala macarelleta (30017914052).jpg', 1400)],
  // Cala Mitjana — Wikidata canonical + foto verificate dalla categoria
  mitjana:    [_gh('mitjana-01.jpg'),
               _wm('Cala Mitjana.jpg', 1400),
               _wm('2016-09-Menorca Cala Mitjana2.jpg', 1400),
               _wm('Cala Mitjana - panoramio.jpg', 1400),
               _wm('Cala Mitjana (29503984994).jpg', 1600)],
  // v34: aggiunta — cale del sud-ovest vicino a Ciutadella
  turqueta:   [_gh('turqueta-01.jpg'),
               _wm("E04 Cala d'en Turqueta.JPG", 1400),
               _wm("Cala en Turqueta (16234699877).jpg", 1400),
               _wm("G03 Cala d'en Turqueta.JPG", 1400),
               _wm("Llegando a Turqueta.jpg", 1400)],
  // Cala en Bosch — foto Flickr della spiaggia/baia (non l'urbanizzazione)
  calanbosch: [_gh('calanbosch-01.jpg'),
               _wm('Cala en Bosc (23556080868).jpg', 1400),
               _wm('Cala en Bosc (37377389802).jpg', 1400),
               _wm('Cala en Bosc (37360858016).jpg', 1400),
               _wm('Cala en Bosc (37377390422).jpg', 1400),
               _wm("E03 Urbanització de la cala d'en Bosc.JPG", 1400)],
  // VILLAGES & LANDMARKS
  fornells:   [_gh('fornells-01.jpg'),
               _wm('Vista de la entrada de la Bahía de Fornells 20180628 112518 Richtone(HDR).jpg')],
  cavalleria: [_gh('cavalleria-01.jpg'),
               _wm('Faro de Cavalleria.JPG')],
  // Ciutadella — Wikidata image of port + travel banner of old town
  ciutadella: [_gh('ciutadella-01.jpg'),
               _wm('Puerto de Ciudadela2.jpg', 1400),
               _wm('Ciutadella WV banner.jpg', 1600)],
  // Ciutadella centro storico — Cattedrale di Santa Maria + Plaça des Born + Ses Voltes
  ciutadellacentro: [_gh('ciutadellacentro-01.jpg'), _gh('ciutadellacentro-02.jpg'),
                     _wm('Minorque Ciutadella Catedrale - panoramio.jpg', 1400),
                     _wm('Ses Voltes Ciudadela Menorca 20180701 225015 LLS.jpg', 1400),
                     _wm('Plaza de la Catedral Ciudadela 20180701 224828 LLS.jpg', 1400),
                     _wm('Minorque Ciutadella Place Born Ayuntamiento Obelisque 21062015 - panoramio.jpg', 1400),
                     _wm('Ciutadella WV banner.jpg', 1600)],
  // Maó — Wikidata image (Town Hall) + travel page banner
  mahon:      [_gh('mahon-01.jpg'),
               _wm('Mahon Page Banner.jpg', 1600),
               _wm('Ayuntamiento de Mahón, en Menorca (Baleares, España).jpg', 1400),
               _wm('Ses Voltes Mahon Minorca - panoramio.jpg')],
  // Monte Toro — sanctuary at the summit, Wikidata-confirmed file
  montetoro:  [_gh('montetoro-01.jpg'),
               _wm('El Toro Monastry (36698898444).jpg', 1400),
               _wm('El Toro Monastry (37360828466).jpg', 1400),
               _wm('Monte Toro.JPG')],
  // Aeroporto di Maó — vista aerea panoramica dell'isola (feel di partenza)
  arrival:    [_gh('arrival-01.jpg'),
               _wm('Menorca, Spain - 4 May 2023 (52948884259).jpg', 1600),
               _wm('Mahon Page Banner.jpg', 1600),
               _wm('Ayuntamiento de Mahón, en Menorca (Baleares, España).jpg', 1400)],
};
// Public IMG map (just primary URLs, kept for backward compatibility)
const IMG = Object.fromEntries(
  Object.entries(_IMGS).map(([k, list]) => [k, list[0]])
);
// Generic last-resort fallback — Faro de Cavalleria (verified, well-known Menorca coastline)
const IMG_GENERIC = _wm('Faro de Cavalleria.JPG', 1400);

// ─── PWA: espone la lista completa delle foto per il precaching offline ─────
// Letta da pwa.js per il bottone "Scarica foto per uso offline".
(function exposePwaPhotos() {
  try {
    const urls = new Set();
    Object.values(_IMGS).forEach(arr => {
      if (Array.isArray(arr)) arr.forEach(u => { if (typeof u === 'string') urls.add(u); });
    });
    urls.add(IMG_GENERIC);
    window.__MNC_ALL_PHOTOS = [...urls];
  } catch (e) {
    window.__MNC_ALL_PHOTOS = [];
  }
})();

// Centralized image fallback system. Each <img> is rendered with a unique data-id
// and its full fallback chain is stored in window._imgChains. When an image fails
// to load, _imgFail() advances to the next URL in the chain.
window._imgChains = {};
window._imgCounter = 0;
window._imgFail = function(el) {
  const id = el.dataset.imgid;
  const chain = window._imgChains[id] || [];
  let idx = parseInt(el.dataset.idx || '0', 10);
  if (idx < chain.length) {
    el.src = chain[idx];
    el.dataset.idx = idx + 1;
  } else {
    el.onerror = null;
    el.style.display = 'none';
  }
};

// imgTag(): renders an <img> with onerror fallback chain.
function imgTag(key, cls='', alt='') {
  const list = _IMGS[key] || [IMG_GENERIC];
  const primary = list[0];
  const chain = [...list.slice(1), IMG_GENERIC];
  const id = 'img' + (++window._imgCounter);
  window._imgChains[id] = chain;
  return `<img class="${cls}" src="${primary}" alt="${alt}" loading="lazy" data-imgid="${id}" onerror="window._imgFail(this)">`;
}

// ─── ICONS (inline SVGs, contextual) ─────────────────────────────────────────
const ICO = {
  pin:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  car:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg>',
  parking:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>',
  clock:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  users:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  baby:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h.01M15 12h.01M9.5 16a3.5 3.5 0 0 0 5 0"/><circle cx="12" cy="12" r="10"/></svg>',
  heart:  '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  star:   '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="0"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  wind:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>',
  sun:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
  swap:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3l4 4-4 4M3 7h18M7 21l-4-4 4-4M21 17H3"/></svg>',
  close:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
  check:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  arrow:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
  plane:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 21 4s-2 0-3.5 1.5L14 9 5.8 7.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 1 1 3 1-1v-3l3-2 3.5 3.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>',
  pharm:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="10"/></svg>',
  cart:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
  fork:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>',
  info:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
  building:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>',
  wifi:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>',
  coffee: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>',
  shop:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></svg>',
  // v20 additions — used only by the day-detail view
  back:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  ext:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>',
  compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
  ticket:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/><path d="M13 5v2M13 17v2M13 11v2"/></svg>',
  euro:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10h12M4 14h9"/><path d="M19 5a7 7 0 1 0 0 14"/></svg>',
  alert:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
  tag:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><path d="M7 7h.01"/></svg>',
  // v4 — icone Piano Meteo
  flip:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
  merge:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7l4-4 4 4M8 17l4 4 4-4M3 12h18"/></svg>',
};

// ─── IMAGE MAPS (mapped by index/name, return keys for imgTag) ──────────────
const DAY_IMG = [
  'sonparc',    // G1 - Arrivo + Son Parc
  'arenal',     // G2 - Arenal d'en Castell
  'esgrau',     // G3 - Es Grau & s'Albufera
  'galdana',    // G4 - Cala Galdana
  'sonbou',     // G5 - Son Bou & Cova d'en Xoroi
  'cavalleria', // G6 - Cavalleria
  'ciutadella', // G7 - Ciutadella + Monte Toro
  'sonparc',    // G8 - Ultimi tuffi
];
const BEACH_IMG = {
  "Son Parc": 'sonparc',
  "Arenal d'en Castell": 'arenal',
  "Cala Galdana": 'galdana',
  "Es Grau": 'esgrau',
  "Son Bou": 'sonbou',
  "Cala en Porter": 'porter',
  "Cala Tirant": 'tirant',
  "Binimel·là": 'binimella',
  "Cala en Turqueta": 'turqueta',
  "Cala en Bosch": 'calanbosch',
  "Cala Macarella": 'macarella',
  "Cala Macarelleta": 'macarelleta',
  "Cala Mitjana": 'mitjana',
};
// Place names that match a context image (used for stop thumbnails)
const STOP_IMG = {
  "Son Parc Beach":          'sonparc',
  "Fornells (sera)":          'fornells',
  "Fornells — mattina":       'fornells',
  "Fornells — tutta la giornata": 'fornells',
  "Fornells — aperitivo serale":  'fornells',
  "Arenal d'en Castell":      'arenal',
  "Arenal d'en Castell — mattina": 'arenal',
  "Cala Tirant — pomeriggio": 'tirant',
  "Cala Galdana":             'galdana',
  "Cala Macarella":           'macarella',
  "s'Albufera des Grau — sentiero mattutino": 'albufera',
  "Es Grau — laguna e villaggio": 'esgrau',
  "Es Grau — laguna riparata": 'esgrau',
  "Son Bou — mattina e pranzo": 'sonbou',
  "Cova d'en Xoroi — visita pomeridiana": 'xoroi',
  "Monte Toro — mattina":     'montetoro',
  "Monte Toro — stop al rientro": 'montetoro',
  "Porto di Maó + Mercat des Claustre": 'mahon',
  "Faro di Cavalleria":       'cavalleria',
  "Binimel·là":               'binimella',
  "Son Parc Beach — mattina relax": 'sonparc',
  "Son Parc Beach — mattina":  'sonparc',
  "Son Parc Beach — tardo pomeriggio": 'sonparc',
  "Centro storico Ciutadella": 'ciutadellacentro',
  "Porto di Ciutadella":       'ciutadella',
  "Aeroporto di Maó":          'arrival',
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const DAYS = [
  { n:1, date:"Gio 4 Giu", emoji:"✈️", title:"Arrivo & Primo Tuffo",
    mood:"Atterrate, sistemate i bagagli e prendetevi il ritmo dell'isola",
    departure:"Nessuna fretta — oggi è giorno di assestamento",
    crowd:"Bassa", toddler:5, protected:true, coast:"north",
    sunrise:"06:24", sunset:"21:13",
    windNote:"Son Parc è naturalmente riparata da ogni direzione. Il vento non cambia i piani oggi.",
    plan:{ label:"☀️ Programma del giorno",
      stops:[
        { name:"Son Parc Beach", drive:"2 min a piedi", parking:"Hotel", maps:"Son+Parc+Beach+Minorca",
          tip:"La vostra spiaggia di casa: baia riparata, acqua bassissima per 30m, sabbia fine. Perfetta per il primo bagno di Bubi senza stress.",
          extra:"🚗 Noleggio auto: valuta Nuracar (nuracar.es) — operatore locale, prezzi migliori dei grandi circuiti." },
        { name:"Fornells (sera)", drive:"10 min", parking:"Facile in paese", maps:"Fornells+Menorca",
          tip:"Villaggio di pescatori pittoresco. Passeggiata sul molo all'ora d'oro. Ottimo per il bimbo: spazio aperto, gabbiani, barche colorate." }
      ],
      restaurant:{ name:"Sa Llagosta — Fornells", note:"Ristorante storico con specialità di aragosta. Prenota in anticipo. Piatti semplici anche per bimbi." }
    },
    extra:"📱 Appena arrivi: scarica Google Maps offline dell'isola. Compra acqua abbondante all'Eroski di Mercadal (10 min)." },

  { n:2, date:"Ven 5 Giu", emoji:"🏖️", title:"Arenal d'en Castell",
    mood:"La spiaggia più family-friendly del nord — baia circolare protetta",
    departure:"Partenza entro 9:30",
    crowd:"Media", toddler:5, protected:true, coast:"north",
    sunrise:"06:24", sunset:"21:14",
    windNote:"Arenal è una baia a 270° — protetta dal vento da nord per sua natura. Nessuna modifica necessaria.",
    plan:{ label:"☀️ Programma del giorno",
      stops:[
        { name:"Arenal d'en Castell", drive:"12 min", parking:"Ampio, arriva entro 10:00", maps:"Arenal+den+Castell+Minorca",
          tip:"Baia a 270° che blocca il vento. L'acqua è bassissima per quasi 50 metri — Bubi può giocare in totale sicurezza. Bar, noleggio ombrelloni, docce. Il lato sinistro della baia è meno affollato.",
          extra:"🏊 Acqua chiarissima già a giugno: visibilità fino a 5 metri. Porta maschera e boccaglio per adulti." }
      ],
      restaurant:{ name:"Bar sulla spiaggia + cena a Mercadal", note:"Pranzo leggero in loco. Mercadal ha ottimi ristoranti rustici a 10 min per la cena." }
    },
    extra:"🌆 Sera consigliata: cena e passeggiata sul porto di Maó (~25 min). Lungomare basso percorribile col passeggino, gelateria Amedeo storica, atmosfera al tramonto. Vedi 'Cosa vedere' in dettaglio." },

  { n:3, date:"Sab 6 Giu", emoji:"🦩", title:"Es Grau & s'Albufera",
    mood:"Laguna piatta come uno specchio e Riserva della Biosfera UNESCO",
    departure:"Partenza 9:15 — sentiero al fresco prima del caldo",
    crowd:"Bassissima", toddler:5, protected:true, coast:"east",
    sunrise:"06:24", sunset:"21:15",
    windNote:"Es Grau è una laguna riparata da ogni direzione di vento — la giornata regge anche con tramontana forte. Una delle più resistenti del viaggio.",
    plan:{ label:"☀️ Programma del giorno",
      stops:[
        { name:"s'Albufera des Grau — sentiero mattutino", drive:"25 min", parking:"Centro visite Rodríguez Femenías", maps:"Centro+visitantes+s+Albufera+Menorca",
          tip:"Cuore del Parco Naturale di Minorca e Riserva della Biosfera UNESCO. Sentiero di legno pianeggiante (passeggino sportivo o marsupio, indifferente). Ingresso libero, centro visite con pannelli per bambini. Aironi, cormorani, anatre — a giugno occasionali fenicotteri di passaggio.",
          extra:"🦩 Mattina presto è il momento giusto: uccelli più attivi, fresco, sentiero in ombra. Porta binocolo se ce l'hai." },
        { name:"Es Grau — laguna e villaggio", drive:"5 min", parking:"Sterrato all'ingresso del paese", maps:"Es+Grau+Menorca",
          tip:"Piccolo borgo di pescatori, case bianche e un paio di bar sull'acqua. Spiaggia di sabbia fine con acqua bassissima per decine di metri — la più sicura dell'isola per Bubi. Pranzo al bar (panini, paella, gelato) e bagno in laguna nel pomeriggio quando il sole è più dolce." }
      ],
      restaurant:{ name:"Bar Tamarindos / Es Grau", note:"Cucina semplice — panini, paella, pesce del giorno. Atmosfera familiare, niente prenotazione, tavoli all'aperto sulla laguna." }
    },
    extra:"🦞 Fornells + Cala Tirant restano come Piano B alternativo. La cena a Fornells (Es Cranc o Sa Llagosta) è imperdibile — pianificala in una serata su misura, magari nel giorno di Cavalleria (G6) se c'è tramontana." },

  { n:4, date:"Dom 7 Giu", emoji:"🌿", title:"Cala Galdana — Il Gioiello",
    mood:"La spiaggia più bella e attrezzata — vale ogni minuto di auto",
    departure:"PARTENZA ENTRO 8:45 — Domenica si riempie prima delle 10",
    crowd:"Alta (domenica!)", toddler:5, protected:true, coast:"south",
    sunrise:"06:23", sunset:"21:15",
    windNote:"Galdana è sul lato SUD: super protetta dalla tramontana ma esposta al vento da sud (raro a giugno). Con vento forte da sud meglio spostarsi a nord (Es Grau, Arenal).",
    plan:{ label:"☀️ Programma del giorno",
      stops:[
        { name:"Cala Galdana", drive:"40 min", parking:"Arriva prima delle 9:30 o usa la navetta dal paese", maps:"Cala+Galdana+Minorca",
          tip:"Baia a mezzaluna incorniciata dai pini. Acque turchesi 1-2m, progressiva. Noleggio canoe, bar, ristoranti. Posizionati sul lato destro della baia (meno affollato).",
          extra:"🛶 Noleggio canoe sulla spiaggia: circa 10-15€/ora. Con Bubi sul davanti è un'esperienza indimenticabile." },
        { name:"Cala Macarella", drive:"15 min + 15 min a piedi", parking:"Parcheggio Cala Galdana, poi sentiero", maps:"Cala+Macarella+Menorca",
          tip:"Se Bubi regge, una delle cale più iconiche dell'isola — la cartolina di Minorca. Sentiero costiero ombreggiato dai pini, fattibile col marsupio. Macarelleta (gemella più piccola) è 5 min più avanti." }
      ],
      restaurant:{ name:"Ristorante Vista Galdana", note:"Sul promontorio destro — vista mozzafiato. Prenota. Alternativa: paninoteca vicino al parcheggio." }
    },
    windSouthPlan:{ label:"💨 Programma adattato al vento da sud",
      stops:[
        { name:"Es Grau — laguna riparata", drive:"35 min", parking:"Sterrato all'ingresso del paese", maps:"Es+Grau+Menorca",
          tip:"Nei rari giorni di vento da sud, le cale del sud (Galdana, Macarella) si agitano. Es Grau è una laguna piatta nel parco naturale s'Albufera des Grau — Bubi può sguazzare in totale calma.",
          extra:"🦆 Riserva naturale: aironi, fenicotteri di passaggio. Rinviate Galdana al primo giorno di calma." },
        { name:"Arenal d'en Castell — pomeriggio", drive:"25 min", parking:"Ampio", maps:"Arenal+den+Castell+Minorca",
          tip:"Baia a 270° protetta da ogni direzione del vento. Acqua bassissima, attrezzata, perfetta per Bubi." }
      ],
      restaurant:{ name:"Restaurante Mercadal", note:"Sulla strada del ritorno verso Son Parc. Cucina minorchina autentica." }
    },
    extra:"🎒 Porta pranzo al sacco per non dipendere dai tempi dei ristoranti con il bimbo." },

  { n:5, date:"Lun 8 Giu", emoji:"🏖️", title:"Son Bou & Cova d'en Xoroi",
    mood:"Il chilometro di sabbia più lungo dell'isola e il bar nella scogliera",
    departure:"Partenza 10:00 — Son Bou è grande, nessuna fretta da parcheggio",
    crowd:"Media", toddler:5, protected:false, coast:"south",
    sunrise:"06:23", sunset:"21:16",
    windNote:"Lato sud — riparato dalla tramontana, funziona perfettamente con vento da nord. Con vento sud (raro a giugno) Son Bou si agita: piano B verso una baia nord protetta.",
    plan:{ label:"☀️ Programma del giorno",
      stops:[
        { name:"Son Bou — mattina e pranzo", drive:"35 min", parking:"Parcheggi ampi est e ovest", maps:"Son+Bou+Beach+Menorca",
          tip:"La spiaggia più lunga di Minorca (~2.5 km). Sabbia fine, fondale che entra in mare gradualmente — perfetto per Bubi. Lato ovest più attrezzato (lettini, bar, ristoranti), lato est più tranquillo. Beach club Bambú o Sa Caleta per pranzo all'ombra.",
          extra:"⛱️ Lettini con ombrellone ~20€ giornata: a giugno con un 2 anni è investimento sensato. Siesta sotto l'ombrellone dopo pranzo." },
        { name:"Cova d'en Xoroi — visita pomeridiana", drive:"15 min", parking:"Aparcamiento Cala en Porter", maps:"Cova+d+en+Xoroi+Cala+en+Porter+Menorca",
          tip:"Bar dentro le grotte a strapiombo sul mare. Apre alle 16:00 — andateci verso le 16:30 appena ha aperto: sole ancora alto, vista mozzafiato, foto pazzesche, pochissima gente. Drink veloce, 45-60 min, rientro a casa per cena normale. ⚠️ Scalini scavati nella scogliera — Bubi in braccio o per mano.",
          extra:"💡 Saltiamo di proposito il tramonto delle 21:15: troppo tardi per Bubi, scalini stancanti, dopo le 22 parte la musica del club." }
      ],
      restaurant:{ name:"Beach club Son Bou (Bambú / Sa Caleta)", note:"Pranzo informale, ombra garantita. Cena rilassata a Son Parc al rientro." }
    },
    windSouthPlan:{ label:"💨 Programma adattato al vento da sud",
      stops:[
        { name:"Arenal d'en Castell — mattina", drive:"12 min", parking:"Ampio", maps:"Arenal+den+Castell+Minorca",
          tip:"Con vento sud (raro a giugno) Son Bou si agita. Ripiega su Arenal — baia a 270° totalmente protetta. Mattina di mare tranquillo, pranzo al bar sulla spiaggia.",
          extra:"🏊 Acqua chiarissima e bassissima, perfetta per Bubi." },
        { name:"Cova d'en Xoroi — visita pomeridiana", drive:"30 min", parking:"Aparcamiento Cala en Porter", maps:"Cova+d+en+Xoroi+Cala+en+Porter+Menorca",
          tip:"Le grotte sono al riparo dal vento sud. Visita early alle 16:30 come da piano principale." }
      ],
      restaurant:{ name:"Cena a Son Parc", note:"Rientro rilassato, cena tranquilla in struttura." }
    },
    extra:"🌅 La versione 'tramonto vero' alla Cova d'en Xoroi (~21:00) la teniamo come opzione adulti per una serata in cui Bubi resta in hotel con baby-sitting." },

  { n:6, date:"Mar 9 Giu", emoji:"🌊", title:"Nord Selvaggio — Cavalleria",
    mood:"Paesaggi mozzafiato e spiagge nascoste per i più avventurosi",
    departure:"Partenza 9:30",
    crowd:"Bassissima", toddler:2, protected:false, coast:"north",
    sunrise:"06:23", sunset:"21:17",
    windNote:"Zona molto esposta. Con tramontana forte l'itinerario cambia automaticamente con una giornata relax.",
    plan:{ label:"☀️ Programma con tempo calmo",
      stops:[
        { name:"Faro di Cavalleria", drive:"15 min", parking:"Piccolo sterrato", maps:"Far+de+Cavalleria+Minorca",
          tip:"Scogliere spettacolari, vista panoramica su tutto il nord. Foto incredibili. ⚠️ Tieni Bubi per mano — i bordi sono liberi.",
          extra:"🦅 Zona ricca di uccelli marini. Avvistamento gabbiani reali, cormorani. Porta binocolo se ce l'hai." },
        { name:"Binimel·là", drive:"20 min da Son Parc (sterrato)", parking:"Sterrato, 5 min a piedi", maps:"Binimel+la+Minorca",
          tip:"Spiaggia di ciottoli rossi ferrosi — unica al mondo visivamente. Acqua cristallina ma ciottoli non ideali per bimbi. Porta scarpe da scoglio." }
      ],
      restaurant:{ name:"Bar Binimel·là + pranzo al sacco", note:"Il bar può essere chiuso. Porta sempre pranzo al sacco." }
    },
    windNorthPlan:{ label:"💨 Programma adattato alla tramontana",
      stops:[
        { name:"Son Parc Beach — mattina relax", drive:"2 min a piedi", parking:"Hotel", maps:"Son+Parc+Beach+Minorca",
          tip:"Giornata relax. Cavalleria e Binimel·là con tramontana sono impraticabili. Son Parc è riparata — Bubi gioca tranquillo. Godetevi la lentezza.",
          extra:"🏊 Giornata ideale per la piscina dell'hotel. Meno faticoso per Bubi dopo 5 giorni intensi." },
        { name:"Fornells — aperitivo serale", drive:"10 min", parking:"Facile", maps:"Fornells+Menorca",
          tip:"Pomeriggio in piscina, poi aperitivo sul porto di Fornells al tramonto. Un gelato per Bubi, calice di vino per voi." }
      ],
      restaurant:{ name:"Sa Llagosta o Es Cranc — Fornells", note:"Se non avete ancora cenato qui, è l'occasione perfetta. Prenota appena sai che il giorno è di relax." }
    },
    extra:"🚗 La strada per Binimel·là è sterrata ma percorribile con qualsiasi auto. Velocità max 20 km/h." },

  { n:7, date:"Mer 10 Giu", emoji:"🏰", title:"Ciutadella & Monte Toro",
    mood:"Architettura medievale, porto incantevole e il tetto dell'isola al rientro",
    departure:"Partenza 9:30 — sono 50 min",
    crowd:"Media", toddler:3, protected:true, coast:"west",
    sunrise:"06:23", sunset:"21:18",
    windNote:"Ciutadella è sulla costa ovest — relativamente riparata dalla tramontana. Il programma non cambia.",
    plan:{ label:"☀️ Programma del giorno",
      stops:[
        { name:"Centro storico Ciutadella", drive:"50 min", parking:"Parcheggio Pl. dels Pins (fuori porta)", maps:"Ciutadella+Menorca+centro",
          tip:"La città più bella di Minorca. Vicoli medievali, Cattedrale gotica, palazzo del Born. Centro percorribile col passeggino. Più pittoresca di Maó.",
          extra:"🛍️ Mercado Municipal coperto (centro): aperto Lun-Sab mattina. È qui che trovate formaggio Mahón DOP, gin Xoriguer, sobrassada e prodotti freschi locali. Il mercato di Plaça des Born invece è solo venerdì-sabato." },
        { name:"Porto di Ciutadella", drive:"5 min a piedi", parking:"—", maps:"Port+Ciutadella+Menorca",
          tip:"Porto incassato tra le rocce — scenografico. Ristorantini di pesce direttamente sull'acqua. Bubi adorerà le barche a vela." },
        { name:"Monte Toro — stop al rientro", drive:"40 min da Ciutadella", parking:"Ampio gratuito in cima", maps:"Monte+Toro+Menorca",
          tip:"Il punto più alto dell'isola (358m), geograficamente sulla via del rientro a Son Parc. Salita in auto fino al santuario, nessun sentiero obbligatorio. Vista a 360° su tutta Minorca, ancora più suggestiva a fine pomeriggio con la luce dorata.",
          extra:"📸 Nelle giornate limpide si vede la Sardegna. Bar/ristorante in cima per un caffè veloce. 30-40 min di stop, poi via verso casa." }
      ],
      restaurant:{ name:"Sa Clau / Sul porto", note:"Pranzo a Ciutadella (sul porto o in vicolo). Cena rilassata a Son Parc dopo lo stop al Monte Toro." }
    },
    extra:"🍦 Gelateria Crem & Color a Ciutadella: gusti figues (fichi) e formatge (formaggio di Minorca) — unici!" },

  { n:8, date:"Gio 11 Giu", emoji:"🧳", title:"Ultimi Tuffi & Partenza",
    mood:"Raccogliete i ricordi, salutate il mare e portate a casa il sole",
    departure:"Check-out + aeroporto (30 min)",
    crowd:"Bassa", toddler:5, protected:true, coast:"north",
    sunrise:"06:23", sunset:"21:18",
    windNote:"Oggi si torna a casa — qualunque vento ci sia, un ultimo tuffo a Son Parc e via!",
    plan:{ label:"☀️ Programma del giorno",
      stops:[
        { name:"Son Parc Beach — mattina", drive:"2 min a piedi", parking:"—", maps:"Son+Parc+Beach+Minorca",
          tip:"Ultimo bagno sulla vostra spiaggia di casa. Bubi raccoglie conchiglie come souvenir. Foto di famiglia." },
        { name:"Aeroporto di Maó", drive:"30 min", parking:"Aeroporto — arriva 2h prima", maps:"Aeropuerto+Menorca",
          tip:"Ultima gelateria a Fornells se avete tempo prima di partire. Snack e succhi per Bubi in aereo." }
      ],
      restaurant:{ name:"Ultima colazione in hotel", note:"Goditela con calma. Foto di famiglia!" }
    },
    extra:"🎁 Souvenir: formaggio Mahón DOP, gin Xoriguer, sobrassada. Tutti nei supermercati." }
];

// ─── DAY DETAILS — v20 (additive) ─────────────────────────────────────────
// Dettagli approfonditi per ogni giorno. Indice 0..7 corrisponde all'indice
// originale del giorno in DAYS (NON allo slot riordinato).
//
// ⚠️ VERIFICA LINK PRIMA DEL VIAGGIO — operatori piccoli e orari cambiano.
// I link esterni puntano a:
//  - mapsUrl(): Google Maps (sempre stabile)
//  - searchUrl(): Google Search con query intelligente (fallback sicuro per
//    operatori senza sito ufficiale stabile o di cui non vogliamo "inventare"
//    l'URL preciso)
//  - URL diretti SOLO per siti istituzionali noti e stabili.
const searchUrl = q => 'https://www.google.com/search?q=' + encodeURIComponent(q);

const DAY_DETAILS = [
  // ─── G1 — Arrivo & Primo Tuffo ───────────────────────────────────────────
  {
    intro: "Giornata di assestamento. <strong>Niente programmi rigidi</strong>: dopo il volo e il ritiro auto, la cosa più sensata è prendere possesso della casa, fare la spesa di benvenuto all'Eroski di Mercadal e regalarvi il primo tuffo a Son Parc al tramonto. La sera, una passeggiata leggera sul porto di Fornells.",
    sections: [
      {
        kind:'discover', title:'Cosa vedere', icon: ICO.pin,
        items: [
          { name:"Son Parc Beach", tag:"MUST", tagKind:"must",
            meta:[{ico:ICO.car, text:"2 min a piedi dall'hotel"},{ico:ICO.users, text:"Bassissima affluenza"}],
            desc:"La vostra spiaggia di casa: baia semicircolare riparata da ogni vento, acqua bassissima per 30m, sabbia fine dorata. Il primo bagno di Bubi senza stress. Bar e docce a disposizione.",
            actions:[
              {kind:'map', label:"Apri in Maps", url: mapsUrl("Son+Parc+Beach+Minorca")}
            ],
            parking:[
              {name:"Hotel Royal Son Parc", q:"Hotel+Royal+Son+Parc+Menorca"},
              {name:"Parking Son Parc Beach", q:"Son+Parc+Beach+parking+Menorca"}
            ]},
          { name:"Porto di Fornells (sera)",
            meta:[{ico:ICO.car, text:"10 min in auto"},{ico:ICO.clock, text:"Tramonto ~21:00 a giugno"}],
            desc:"Villaggio di pescatori bianchissimo affacciato sulla baia naturale più grande dell'isola. Passeggiata sul molo, gabbiani, barche colorate. La luce dorata di fine giornata è perfetta per le prime foto.",
            actions:[
              {kind:'map', label:"Apri in Maps", url: mapsUrl("Fornells+Menorca")}
            ],
            parking:[
              {name:"Aparcamiento Fornells centro", q:"Aparcamiento+Fornells+centro+Menorca"},
              {name:"Carrer Major Fornells", q:"Carrer+Major+Fornells+Menorca"}
            ]},
          { name:"Faro de Favàritx — paesaggio lunare", mode:"full",
            meta:[{ico:ICO.car, text:"25 min da Son Parc"},{ico:ICO.clock, text:"Bello al tramonto"}],
            desc:"Solo se atterrate presto e Bubi regge: faro su un capo di rocce nere a strapiombo, paesaggio lunare unico sull'isola. Strada panoramica nel parco s'Albufera. Niente sentieri lunghi, si arriva con l'auto fino in cima.",
            actions:[
              {kind:'map', label:"Apri in Maps", url: mapsUrl("Faro+Favaritx+Menorca")}
            ]},
          { name:"Cena al porto di Maó", mode:"full",
            meta:[{ico:ICO.car, text:"30 min da Son Parc"},{ico:ICO.euro, text:"€€"}],
            desc:"Variante intensa al primo giorno: invece di passeggiata serale leggera, scendete a Maó e cenate sul porto naturale (uno dei più grandi del Mediterraneo). Tavoli all'aperto, atmosfera, luci sull'acqua. Parcheggio a Es Cos o Plaça de S'Esplanada (la ZTL del centro storico è la sera).",
            actions:[
              {kind:'map', label:"Apri in Maps", url: mapsUrl("Port+de+Mao+Menorca")}
            ]}
        ]
      },
      {
        kind:'eat', title:'Dove mangiare', icon: ICO.fork,
        items: [
          { name:"Sa Llagosta — Fornells", tag:"MUST", tagKind:"must",
            meta:[{ico:ICO.euro, text:"€€€"},{ico:ICO.tag, text:"Aragosta"}],
            desc:"Ristorante storico di Fornells specializzato in caldereta de llagosta (zuppa di aragosta). A giugno serve prenotare con largo anticipo. Piatti semplici disponibili anche per i bimbi.",
            actions:[
              {kind:'book', label:"Prenota", url: "https://www.guiarepsol.com/es/fichas/restaurante/sa-llagosta-60220/"},
              {kind:'info', label:"Info & menu", url: searchUrl("Sa Llagosta Fornells Menorca menu")},
              {kind:'map',  label:"Mappa", url: mapsUrl("Sa+Llagosta+Fornells+Menorca")}
            ]},
          { name:"Es Cranc — Fornells", tag:"MUST", tagKind:"must",
            meta:[{ico:ICO.euro, text:"€€€"},{ico:ICO.star, text:"Spesso considerato il migliore dell'isola"}],
            desc:"L'altro tempio dell'aragosta, ambiente più rustico e autentico. Si prenota con settimane di anticipo — se siete riusciti, una serata indimenticabile.",
            actions:[
              {kind:'book', label:"Prenota", url: "http://www.escranc.com/reserva.html"},
              {kind:'map',  label:"Mappa", url: mapsUrl("Es+Cranc+Fornells+Menorca")}
            ]}
        ]
      },
      {
        kind:'tips', title:'Da fare oggi', icon: ICO.alert,
        items: [
          { name:"Spesa di benvenuto — Eroski Mercadal", tag:"TIP", tagKind:"tip",
            meta:[{ico:ICO.car, text:"10 min da Son Parc"},{ico:ICO.clock, text:"Lun-Sab 9:00-21:00"}],
            desc:"Fate la spesa grande il primo giorno: acqua (1.5L/persona/giorno), frutta, yogurt e biscotti per colazione, pasta/riso/verdure per i pasti in struttura, aloe vera, crema solare 50+ di scorta.",
            actions:[
              {kind:'map', label:"Apri Eroski in Maps", url: mapsUrl("Eroski+Es+Mercadal+Menorca")}
            ]},
          { name:"Google Maps offline", tag:"TIP", tagKind:"tip",
            desc:"Scaricate ora la mappa offline dell'isola di Minorca: vi salva la connessione nelle zone rurali (Cavalleria, Binimel·là, Cami de Cavalls). In Google Maps: profilo → 'Mappe offline' → seleziona area → scarica.",
            actions:[]}
        ]
      }
    ]
  },

  // ─── G2 — Arenal d'en Castell ──────────────────────────────────────────────
  {
    intro: "La spiaggia <strong>più family-friendly del nord</strong>. Una baia ad anfiteatro a 270° che blocca il vento per natura. Acqua bassissima per 50 metri: Bubi può giocare in completa autonomia. Giornata da vivere lenta — un'unica meta, niente trasferimenti complicati.",
    sections: [
      {
        kind:'discover', title:'Cosa vedere', icon: ICO.pin,
        items: [
          { name:"Arenal d'en Castell — la baia", tag:"MUST", tagKind:"must",
            meta:[{ico:ICO.car, text:"12 min in auto"},{ico:ICO.parking, text:"Parcheggio ampio (entro 10:00)"},{ico:ICO.users, text:"Media affluenza"}],
            desc:"Baia a 270° che blocca strutturalmente il vento da nord. Sabbia dorata compatta, fondali bassissimi per oltre 50 metri, acqua chiarissima a giugno (visibilità fino a 5 metri). Il lato sinistro è sempre meno affollato.",
            actions:[
              {kind:'map', label:"Apri in Maps", url: mapsUrl("Arenal+den+Castell+Minorca")}
            ],
            parking:[
              {name:"Aparcamiento Arenal d'en Castell", q:"Aparcamiento+Arenal+den+Castell+Menorca"},
              {name:"Avinguda Es Pla (street)", q:"Avinguda+Es+Pla+Arenal+den+Castell"}
            ]},
          { name:"Cap d'es Forcat — punto panoramico",
            tag:"EXTRA", tagKind:"extra",
            meta:[{ico:ICO.car, text:"Breve passeggiata dal parcheggio"}],
            desc:"Sul promontorio est della baia, sentiero breve (~10 min) che porta a una scogliera con vista a 270° sull'Arenal. Foto dall'alto della baia ad anfiteatro. Tieni Bubi per mano: bordi rocciosi.",
            actions:[
              {kind:'map', label:"Apri in Maps", url: mapsUrl("Cap+den+Forcat+Menorca")}
            ],
            parking:[
              {name:"Aparcamiento Arenal d'en Castell", q:"Aparcamiento+Arenal+den+Castell+Menorca"}
            ]},
          { name:"Es Mercadal — borgo bianco nell'entroterra", mode:"full",
            meta:[{ico:ICO.car, text:"10 min da Arenal"},{ico:ICO.tag, text:"Aperitivo o pre-cena"}],
            desc:"Il borgo più autentico del centro Minorca, case bianche e atmosfera lenta. Calle del centro percorribili col passeggino. È un'aggiunta naturale di fine giornata: passeggiata, gelato per Bubi, aperitivo per voi prima di cena.",
            actions:[
              {kind:'map', label:"Apri in Maps", url: mapsUrl("Es+Mercadal+Menorca+centro")}
            ],
            parking:[
              {name:"Aparcamiento Es Mercadal centro", q:"Aparcamiento+Es+Mercadal+centro+Menorca"}
            ]},
          { name:"Maó — cena al porto e passeggiata", tag:"MUST", tagKind:"must",
            mode:"full",
            meta:[{ico:ICO.car, text:"25 min da Arenal / Son Parc"},{ico:ICO.parking, text:"Es Cos (a pagamento, comodo)"},{ico:ICO.clock, text:"Tramonto ~21:14"}],
            desc:"<strong>L'opzione serata della giornata</strong>. Dopo mare + nanna pomeridiana, alle 18:00 si scende a Maó: lungomare del porto (uno dei più profondi del Mediterraneo) percorribile col passeggino, gelateria Amedeo storica, cena al Moll de Llevant con tavoli quasi sull'acqua — Bubi adorerà le barche illuminate. Rientro a Son Parc per le 21:30. Alternativa con parcheggio facilissimo: <strong>Cales Fonts</strong> a Es Castell, 5 min da Maó, porticciolo a ferro di cavallo con ristoranti sull'acqua.",
            actions:[
              {kind:'map', label:"Porto di Maó", url: mapsUrl("Port+Mahon+Menorca")},
              {kind:'map', label:"Cales Fonts (Es Castell)", url: mapsUrl("Cales+Fonts+Es+Castell+Menorca")}
            ],
            parking:[
              {name:"Aparcamiento Es Cos (Maó)", q:"Aparcamiento+Es+Cos+Mahon+Menorca"},
              {name:"Plaça de S'Esplanada (Maó)", q:"Aparcamiento+Placa+Esplanada+Mahon+Menorca"},
              {name:"Aparcamiento Cales Fonts", q:"Aparcamiento+Cales+Fonts+Es+Castell+Menorca"}
            ]},
          { name:"Mercat des Claustre & gin Xoriguer (se di giorno)", mode:"full",
            tag:"EXTRA", tagKind:"extra",
            meta:[{ico:ICO.clock, text:"Mercat 10-14 / 17-21"},{ico:ICO.tag, text:"Tappa pomeridiana opzionale"}],
            desc:"Se decidete di anticipare e scendere a Maó nel tardo pomeriggio invece che a cena: <strong>Mercat des Claustre</strong> (mercato gastronomico nell'ex convento, street food, formaggi, gin) e la <strong>distilleria gin Xoriguer</strong> (visita gratuita 15-20 min). Si abbina bene a una cena breve al porto subito dopo.",
            actions:[
              {kind:'info', label:"Mercat des Claustre", url: searchUrl("Mercat des Claustre Mahon orari")},
              {kind:'info', label:"Gin Xoriguer", url: searchUrl("Gin Xoriguer Mahon distilleria visita")}
            ]}
        ]
      },
      {
        kind:'act', title:'Attività', icon: ICO.compass,
        items: [
          { name:"Snorkeling lato sinistro della baia",
            meta:[{ico:ICO.tag, text:"Adatto a tutti"}],
            desc:"L'acqua è chiarissima e i fondali sabbiosi rendono lo snorkeling rilassante. Maschera e boccaglio bastano — niente correnti. Pesci visibili già a 1m di profondità sui bordi rocciosi della baia.",
            actions:[]}
        ]
      },
      {
        kind:'eat', title:'Dove mangiare', icon: ICO.fork,
        items: [
          { name:"Es Port — sul lungomare di Arenal",
            meta:[{ico:ICO.euro, text:"€€"},{ico:ICO.star, text:"4/5"}],
            desc:"Direttamente sulla baia. Pesce fresco, paella, tapas. Terrazza con vista. Famiglie benvenute, menù bambini disponibile.",
            actions:[
              {kind:'book', label:"Prenota", url: searchUrl("Restaurante Es Port Arenal den Castell prenotazione")},
              {kind:'map',  label:"Mappa", url: mapsUrl("Restaurant+Es+Port+Arenal+den+Castell+Menorca")}
            ]},
          { name:"Restaurante Mercadal — Es Mercadal (10 min)",
            tag:"TIP", tagKind:"tip",
            meta:[{ico:ICO.euro, text:"€€"}],
            desc:"Cucina minorchina tradizionale nel borgo di Mercadal. Caldereta e formaggio Mahón. Più autentico e meno turistico — perfetto per la cena dopo una giornata di mare.",
            actions:[
              {kind:'book', label:"Prenota", url: searchUrl("Restaurante Es Mercadal Menorca prenotazione")},
              {kind:'map',  label:"Mappa", url: mapsUrl("Restaurante+Es+Mercadal+Menorca")}
            ]},
          { name:"El Varadero — Porto di Maó (sera)", tag:"MUST", tagKind:"must",
            meta:[{ico:ICO.euro, text:"€€"},{ico:ICO.star, text:"4/5"}],
            desc:"Per la serata-Maó: tavoli quasi sull'acqua sul Moll de Llevant, pesce fresco, atmosfera informale, family-friendly. Tramonto vista porto. Prenotare in alta stagione.",
            actions:[
              {kind:'book', label:"Prenota", url: searchUrl("El Varadero Mahon prenotazione")},
              {kind:'map',  label:"Mappa", url: mapsUrl("El+Varadero+Mahon+Menorca")}
            ]},
          { name:"Cales Fonts (Es Castell) — alternativa cena", tag:"TIP", tagKind:"tip",
            meta:[{ico:ICO.euro, text:"€€"},{ico:ICO.tag, text:"Parcheggio molto facile"}],
            desc:"5 min da Maó, porticciolo a ferro di cavallo con una serie di ristoranti che hanno i tavoli sull'acqua. Atmosfera magica al tramonto, parcheggio facile (a differenza del centro di Maó). Bubi vede le barche illuminate. Sceglietene uno e sedetevi.",
            actions:[
              {kind:'map', label:"Apri Cales Fonts", url: mapsUrl("Cales+Fonts+Es+Castell+Menorca")}
            ]},
          { name:"Gelateria Amedeo — Maó", tag:"EXTRA", tagKind:"extra",
            meta:[{ico:ICO.euro, text:"€"}],
            desc:"La più storica dell'isola, sul lungomare di Maó. Tappa obbligatoria se siete in zona porto — anche solo per Bubi prima di cena.",
            actions:[
              {kind:'map', label:"Mappa", url: mapsUrl("Gelateria+Amedeo+Mahon+Menorca")}
            ]}
        ]
      },
      {
        kind:'tips', title:'Pratico', icon: ICO.alert,
        items: [
          { name:"Crema solare 50+ ogni 90 minuti",
            desc:"Il riflesso dell'acqua moltiplica i raggi UV a giugno. A 2 anni la pelle di Bubi è ancora sottilissima — riapplicate dopo ogni bagno, anche con cielo coperto.",
            actions:[]},
          { name:"Lloc de Menorca — piano B se Bubi è saturo", tag:"EXTRA", tagKind:"extra",
            meta:[{ico:ICO.car, text:"15 min da Arenal"},{ico:ICO.euro, text:"~14€ adulti, gratis sotto 3 anni"},{ico:ICO.clock, text:"Generalmente 10:00-19:00"}],
            desc:"Mini-zoo e fattoria didattica vicino Alaior: animali da fattoria, voliera, percorsi ombreggiati. Se a metà giornata Bubi non vuole più mare, in 15 minuti siete qui e cambiate completamente registro. Verifica orari prima.",
            actions:[
              {kind:'info', label:"Info & orari", url: searchUrl("Lloc de Menorca Alaior orari biglietti")},
              {kind:'map', label:"Mappa", url: mapsUrl("Lloc+de+Menorca+Alaior")}
            ]}
        ]
      }
    ]
  },

  // ─── G3 — Es Grau & s'Albufera ─────────────────────────────────────────────
  {
    intro: "Una giornata <strong>su misura per Bubi</strong>: il sentiero pianeggiante della Riserva della Biosfera UNESCO al mattino (uccelli, ombra, fresco) e nel pomeriggio la <strong>laguna di Es Grau</strong> — acqua bassissima per decine di metri, sabbia fine, niente folla. Es Grau è naturalmente riparata da ogni vento: una delle giornate più resistenti del viaggio. Fornells e Cala Tirant restano come Piano B alternativo (vedi sotto).",
    sections: [
      {
        kind:'discover', title:'Cosa vedere', icon: ICO.pin,
        items: [
          { name:"s'Albufera des Grau — Parco Naturale", tag:"MUST", tagKind:"must",
            meta:[{ico:ICO.car, text:"25 min da Son Parc"},{ico:ICO.tag, text:"Sentiero pianeggiante in legno"},{ico:ICO.ticket, text:"Ingresso libero"}],
            desc:"Il <strong>cuore del Parco Naturale di Minorca</strong> e Riserva della Biosfera UNESCO. Stagno costiero salmastro abitato da aironi, cormorani, anatre, occasionalmente fenicotteri di passaggio. Sentiero di legno completamente pianeggiante, fattibile col passeggino sportivo o con marsupio. <strong>Centro visite Rodríguez Femenías</strong> all'ingresso, gratuito, con pannelli pensati per bambini. 1.5-2h al ritmo di Bubi.",
            actions:[
              {kind:'info', label:"Info parco", url: searchUrl("Parc Natural s'Albufera des Grau Menorca centro visite orari")},
              {kind:'map',  label:"Apri in Maps", url: mapsUrl("Parc+Natural+s+Albufera+des+Grau+Menorca")}
            ],
            parking:[
              {name:"Centro visite s'Albufera", q:"Centro+visitantes+s+Albufera+Menorca"},
              {name:"Aparcamiento Es Grau", q:"Aparcamiento+Es+Grau+Menorca"}
            ]},
          { name:"Es Grau — laguna e villaggio", tag:"MUST", tagKind:"must",
            meta:[{ico:ICO.car, text:"5 min dal centro visite"},{ico:ICO.parking, text:"Sterrato all'ingresso del paese"},{ico:ICO.users, text:"Affluenza bassissima"}],
            desc:"Piccolo borgo di pescatori affacciato su una laguna piatta come uno specchio: <strong>la spiaggia perfetta per Bubi</strong>. Acqua bassissima per decine di metri, sabbia fine, niente folla. Una manciata di case bianche e bar sull'acqua. Riparata da quasi ogni vento — il piano regge anche con tramontana.",
            actions:[
              {kind:'map', label:"Apri in Maps", url: mapsUrl("Es+Grau+Menorca")}
            ],
            parking:[
              {name:"Aparcamiento Es Grau", q:"Aparcamiento+Es+Grau+Menorca"}
            ]},
          { name:"Illa d'en Colom — extra in kayak", mode:"full",
            tag:"EXTRA", tagKind:"extra",
            meta:[{ico:ICO.car, text:"Noleggio kayak a Es Grau"},{ico:ICO.tag, text:"Solo se Bubi è in forma"}],
            desc:"Piccola isola disabitata davanti a Es Grau, raggiungibile in kayak (~30 min, mare piatto). Sulla riva sud una caletta sabbiosa quasi sempre deserta. Esperienza memorabile — ma solo se la giornata è perfettamente calma e Bubi è riposato.",
            actions:[
              {kind:'info', label:"Noleggi kayak", url: searchUrl("noleggio kayak Es Grau Menorca")},
              {kind:'map',  label:"Apri in Maps", url: mapsUrl("Illa+d+en+Colom+Menorca")}
            ]},
          { name:"Piano B: Fornells + Cala Tirant", mode:"full",
            tag:"EXTRA", tagKind:"extra",
            meta:[{ico:ICO.car, text:"10 min da Son Parc"},{ico:ICO.alert, text:"Cala Tirant esposta a tramontana"}],
            desc:"Se per qualche motivo Es Grau non vi convince — o lo avete già visto e volete cambiare — questa è la giornata di scorta. <strong>Fornells mattina</strong>: porto, gelato, kayak nella laguna del golfo (anche con tramontana è piatto). <strong>Cala Tirant pomeriggio</strong>: spiaggia grande sabbiosa, zona kitesurf, spettacolo per Bubi — ma solo se non c'è vento forte da nord. La cena a Fornells (Es Cranc o Sa Llagosta) è da prenotare comunque su qualche serata della settimana.",
            actions:[
              {kind:'map', label:"Fornells", url: mapsUrl("Fornells+Menorca")},
              {kind:'map', label:"Cala Tirant", url: mapsUrl("Cala+Tirant+Minorca")}
            ],
            parking:[
              {name:"Aparcamiento Fornells centro", q:"Aparcamiento+Fornells+centro+Menorca"},
              {name:"Aparcamiento Cala Tirant", q:"Aparcamiento+Cala+Tirant+Menorca"}
            ]}
        ]
      },
      {
        kind:'act', title:'Attività', icon: ICO.compass,
        items: [
          { name:"Birdwatching nel parco",
            meta:[{ico:ICO.tag, text:"Mattina presto"}],
            desc:"L'alba e la prima mattina sono i momenti d'oro per gli uccelli acquatici. Garzette, aironi cinerini, anatre, cormorani. A giugno qualche fenicottero di passaggio. Binocolo consigliato — al centro visite a volte li prestano gratuitamente.",
            actions:[]},
          { name:"Pranzo lento al bar di Es Grau", tag:"TIP", tagKind:"tip",
            meta:[{ico:ICO.euro, text:"€"},{ico:ICO.tag, text:"Niente prenotazione"}],
            desc:"Il rito del giorno: panini, paella, frittura piccola, gelato. Tavoli all'aperto fronte laguna, atmosfera rilassata, locali e turisti consapevoli. Bubi può sgambettare in sicurezza tra un tavolo e l'altro.",
            actions:[]}
        ]
      },
      {
        kind:'eat', title:'Dove mangiare', icon: ICO.fork,
        items: [
          { name:"Bar Tamarindos — Es Grau", tag:"MUST", tagKind:"must",
            meta:[{ico:ICO.euro, text:"€"},{ico:ICO.star, text:"4/5"}],
            desc:"Sulla spiaggia di Es Grau, atmosfera familiare. Panini, paella, pesce del giorno semplice. Niente prenotazione, tavoli all'aperto. Perfetto per pranzo dopo il sentiero.",
            actions:[
              {kind:'map', label:"Mappa", url: mapsUrl("Bar+Tamarindos+Es+Grau+Menorca")}
            ]},
          { name:"Cena a Fornells (su un'altra serata)", tag:"TIP", tagKind:"tip",
            meta:[{ico:ICO.euro, text:"€€€"},{ico:ICO.star, text:"5/5"}],
            desc:"Es Cranc o Sa Llagosta. Caldereta de llagosta — il piatto-simbolo dell'isola. Prenota con largo anticipo per una serata libera della settimana. Es Pla è l'alternativa più informale ed economica.",
            actions:[
              {kind:'book', label:"Prenota Es Cranc", url: "http://www.escranc.com/reserva.html"},
              {kind:'book', label:"Prenota Sa Llagosta", url: "https://www.guiarepsol.com/es/fichas/restaurante/sa-llagosta-60220/"}
            ]}
        ]
      },
      {
        kind:'tips', title:'Da sapere', icon: ICO.alert,
        items: [
          { name:"Ordine consigliato: sentiero prima, laguna dopo",
            tag:"TIP", tagKind:"tip",
            desc:"Mattina (9:30-11:30): sentiero del parco — fresco, ombra, uccelli più attivi. Pranzo al bar di Es Grau. Pomeriggio: laguna e bagno quando il sole è più dolce. Rientro 17:30-18:00.",
            actions:[]},
          { name:"Insetti nei mesi caldi",
            desc:"Vicino agli stagni a giugno possono esserci zanzare, soprattutto al tramonto. Spray repellente nello zaino, manica lunga leggera per Bubi se vi attardate.",
            actions:[]}
        ]
      }
    ]
  },

  // ─── G4 — Cala Galdana ─────────────────────────────────────────────────────
  {
    intro: "<strong>Il gioiello della costa sud</strong>. Baia a mezzaluna incorniciata dai pini, acque turchesi a 1-2 metri di profondità per decine di metri. Sempre protetta dalla tramontana — la scelta migliore nei giorni di vento forte. Domenica si riempie presto: <strong>partenza entro 8:45</strong>. Da qui parte il sentiero verso Macarella e Macarelleta.",
    sections: [
      {
        kind:'discover', title:'Cosa vedere', icon: ICO.pin,
        items: [
          { name:"Cala Galdana", tag:"MUST", tagKind:"must",
            meta:[{ico:ICO.car, text:"40 min in auto"},{ico:ICO.parking, text:"Pieno entro le 9:30 domenica"},{ico:ICO.users, text:"Alta affluenza"}],
            desc:"Sabbia bianca finissima, fondali progressivi, pini fino a riva. Posizionatevi sul lato destro: meno affollato, ombra naturale dei pini al pomeriggio. Bandiera Blu, salvamento attivo.",
            actions:[
              {kind:'map', label:"Apri in Maps", url: mapsUrl("Cala+Galdana+Minorca")}
            ],
            parking:[
              {name:"Aparcamiento Cala Galdana", q:"Aparcamiento+Cala+Galdana+Menorca"},
              {name:"Parking Mirador (alto)", q:"Mirador+Cala+Galdana+parking"}
            ]},
          { name:"Mirador des Riu — vista dall'alto", tag:"EXTRA", tagKind:"extra",
            meta:[{ico:ICO.tag, text:"5 min a piedi dal parcheggio"}],
            desc:"Sentierino breve che porta su una terrazza panoramica con vista a perdita d'occhio sulla baia. La foto-cartolina di Cala Galdana si scatta da qui. Sentiero pavimentato, fattibile col passeggino sportivo.",
            actions:[
              {kind:'map', label:"Mappa", url: mapsUrl("Mirador+des+Riu+Galdana+Menorca")}
            ],
            parking:[
              {name:"Parking Mirador des Riu", q:"Mirador+des+Riu+Galdana+parking"},
              {name:"Aparcamiento Cala Galdana", q:"Aparcamiento+Cala+Galdana+Menorca"}
            ]},
          { name:"Camí de Cavalls verso Cala Macarella",
            meta:[{ico:ICO.car, text:"~45 min a piedi"},{ico:ICO.alert, text:"Difficile col passeggino"}],
            desc:"Antico sentiero costiero del XIV secolo che collega le cale del sud. Da Galdana a Macarella in meno di un'ora a piedi. Con Bubi: marsupio o fascia, non passeggino. Se fate solo metà strada, il panorama è già spettacolare.",
            actions:[
              {kind:'info', label:"Info Cami de Cavalls", url: searchUrl("Cami de Cavalls Galdana Macarella sentiero")}
            ],
            parking:[
              {name:"Aparcamiento Cala Galdana (inizio)", q:"Aparcamiento+Cala+Galdana+Menorca"}
            ]},
          { name:"Cala en Turqueta — alternativa a Galdana", mode:"full",
            tag:"EXTRA", tagKind:"extra",
            meta:[{ico:ICO.car, text:"45 min, parcheggio a pagamento"},{ico:ICO.alert, text:"Niente servizi — pranzo al sacco"},{ico:ICO.users, text:"Bassa-media affluenza"}],
            desc:"Una delle cale più scenografiche del sud-ovest: acqua color piscina, scogliere bianche, pini. Parcheggio a pagamento (~5€) e poi 5-10 min di sentiero pianeggiante (passeggino sportivo ok, marsupio meglio). Niente bar, niente ombrelloni — porta tutto. <strong>Variante a Galdana</strong>: scegli Turqueta in giornate calme, quando vuoi la cala selvaggia invece della spiaggia attrezzata.",
            actions:[
              {kind:'map', label:"Apri in Maps", url: mapsUrl("Cala+en+Turqueta+Menorca")}
            ],
            parking:[
              {name:"Aparcamiento Cala en Turqueta", q:"Aparcamiento+Cala+en+Turqueta+Menorca"}
            ]},
          { name:"Son Saura — coppia con Turqueta", mode:"full",
            meta:[{ico:ICO.car, text:"5 min da Turqueta"},{ico:ICO.alert, text:"Niente servizi"}],
            desc:"Doppia spiaggia di sabbia bianca incorniciata da pini, a 5 minuti d'auto da Turqueta. Stesso parcheggio a pagamento (cumulativo). Più aperta e ventilata di Turqueta — ottima coppia da abbinare nella stessa giornata. Anche qui niente servizi: porta ombrellone, acqua, panini.",
            actions:[
              {kind:'map', label:"Apri in Maps", url: mapsUrl("Son+Saura+Ciutadella+Menorca")}
            ],
            parking:[
              {name:"Aparcamiento Son Saura", q:"Aparcamiento+Son+Saura+Ciutadella+Menorca"}
            ]}
        ]
      },
      {
        kind:'act', title:'Attività', icon: ICO.compass,
        items: [
          { name:"Noleggio canoe sulla spiaggia", tag:"MUST", tagKind:"must",
            meta:[{ico:ICO.euro, text:"10-15€/h"}],
            desc:"Canoe direttamente sulla sabbia. Con Bubi davanti, mezz'ora a remare lungo la costa è un'esperienza che ricorderete tutti. Acqua piattissima, niente correnti.",
            actions:[
              {kind:'info', label:"Info noleggio",  url: searchUrl("noleggio canoe Cala Galdana Menorca")}
            ]}
        ]
      },
      {
        kind:'eat', title:'Dove mangiare', icon: ICO.fork,
        items: [
          { name:"Mirador de Galdana", tag:"MUST", tagKind:"must",
            meta:[{ico:ICO.euro, text:"€€€"},{ico:ICO.star, text:"4/5"}],
            desc:"Sul promontorio destro con vista mozzafiato sulla baia. Cucina mediterranea curata. Prenotare assolutamente — i tavoli con vista vanno esauriti la mattina stessa.",
            actions:[
              {kind:'book', label:"Prenota", url: searchUrl("Mirador de Galdana ristorante prenotazione")},
              {kind:'map',  label:"Mappa", url: mapsUrl("Mirador+de+Galdana+Menorca")}
            ]},
          { name:"Pranzo al sacco sulla spiaggia",
            tag:"TIP", tagKind:"tip",
            desc:"Lo Spar di Ferreries sulla strada vende panini e frutta. Vi risparmiate code ai chioschi e mangiate sul vostro telo, con Bubi che continua a giocare.",
            actions:[
              {kind:'map', label:"Spar Ferreries", url: mapsUrl("Spar+Ferreries+Menorca")}
            ]}
        ]
      },
      {
        kind:'tips', title:'Pratico', icon: ICO.alert,
        items: [
          { name:"Domenica — strategia parcheggio",
            desc:"Se trovate il parcheggio principale pieno, c'è una navetta dal paese di Cala Galdana che scende alla baia. Costa pochi euro e vi evita di girare in cerca di posto. La domenica è il giorno più affollato della settimana — partenza entro 8:45 dall'hotel.",
            actions:[]}
        ]
      }
    ]
  },

  // ─── G5 — Son Bou & Cova d'en Xoroi ────────────────────────────────────────
  {
    intro: "<strong>Giornata di puro mare</strong>: la spiaggia più lunga dell'isola al mattino (sabbia, fondali bassissimi, attrezzata) e poi la chicca scenografica della <strong>Cova d'en Xoroi</strong> nel tardo pomeriggio — il bar dentro le grotte a strapiombo. Visita early alle 16:30 invece che al tramonto: a misura di Bubi, niente scalini su un bimbo stanco e niente musica da club. Cena rilassata a Son Parc.",
    sections: [
      {
        kind:'discover', title:'Cosa vedere', icon: ICO.pin,
        items: [
          { name:"Son Bou — la spiaggia più lunga di Minorca", tag:"MUST", tagKind:"must",
            meta:[{ico:ICO.car, text:"35 min in auto"},{ico:ICO.parking, text:"Parcheggi ampi est e ovest"},{ico:ICO.users, text:"Media affluenza"}],
            desc:"<strong>~2.5 km di sabbia fine</strong>, fondale che entra in mare con gradualità — la situazione ideale per Bubi. Lato ovest più attrezzato (lettini, beach club, ristoranti, docce), lato est più tranquillo e selvaggio. Bandiera blu, salvataggio in stagione. A 5 minuti a piedi dall'ingresso est si vede la <strong>Basilica paleocristiana di Son Bou</strong> (V sec d.C., resti visibili sulla sabbia).",
            actions:[
              {kind:'map', label:"Apri in Maps", url: mapsUrl("Son+Bou+Beach+Menorca")}
            ],
            parking:[
              {name:"Aparcamiento Son Bou ovest", q:"Aparcamiento+Son+Bou+oest+Menorca"},
              {name:"Aparcamiento Son Bou est (Sant Jaume)", q:"Aparcamiento+Sant+Jaume+Son+Bou+Menorca"}
            ]},
          { name:"Cova d'en Xoroi — early visit 16:30", tag:"MUST", tagKind:"must",
            meta:[{ico:ICO.car, text:"15 min da Son Bou"},{ico:ICO.clock, text:"Apre 16:00 — andateci alle 16:30"},{ico:ICO.euro, text:"Ingresso ~10€/persona, drink esclusi"},{ico:ICO.alert, text:"Scalini scavati nella scogliera"}],
            desc:"Bar dentro le grotte a strapiombo sul mare a Cala en Porter. Una delle esperienze più fotogeniche di Minorca. <strong>Andateci appena apre</strong> alle 16:30: sole ancora alto, vista mozzafiato, foto pazzesche, pochissima gente. Drink veloce, 45-60 min, rientro per cena normale. Bubi in braccio o per mano sulle scale. <strong>Saltiamo il tramonto delle 21:15</strong>: troppo tardi, scalini stancanti per un bimbo, dopo le 22 diventa locale con musica alta.",
            actions:[
              {kind:'info', label:"Info & orari", url: searchUrl("Cova d'en Xoroi Cala en Porter orari")},
              {kind:'map',  label:"Apri in Maps", url: mapsUrl("Cova+d+en+Xoroi+Cala+en+Porter+Menorca")}
            ],
            parking:[
              {name:"Aparcamiento Cala en Porter", q:"Aparcamiento+Cala+en+Porter+Menorca"}
            ]},
          { name:"Cova d'en Xoroi al tramonto — versione adulti", mode:"full",
            tag:"EXTRA", tagKind:"extra",
            meta:[{ico:ICO.clock, text:"Tramonto ~21:15"},{ico:ICO.tag, text:"Solo se Bubi resta in hotel"}],
            desc:"Se l'hotel ha servizio di baby-sitting serale (verificare in reception), si può fare una serata adulti alla Cova al tramonto vero: <strong>arrivare verso le 20:00</strong>, drink + cena leggera nel locale, tramonto in piazza, rientro entro le 22:00 prima che parta la musica forte. Esperienza diversa, magari su un'altra giornata della settimana.",
            actions:[
              {kind:'map', label:"Apri in Maps", url: mapsUrl("Cova+d+en+Xoroi+Cala+en+Porter+Menorca")}
            ]},
          { name:"Cala en Porter — bagno extra", mode:"full",
            meta:[{ico:ICO.car, text:"Sotto la Cova"},{ico:ICO.parking, text:"In paese"}],
            desc:"Se siete alla Cova d'en Xoroi e avanza tempo, la spiaggia di Cala en Porter è proprio sotto: sabbia, acque calme tra le scogliere. Aggiunta naturale di mezz'ora se Bubi non è ancora stanco.",
            actions:[
              {kind:'map', label:"Apri in Maps", url: mapsUrl("Cala+en+Porter+Menorca")}
            ]}
        ]
      },
      {
        kind:'act', title:'Attività', icon: ICO.compass,
        items: [
          { name:"Lettini con ombrellone a Son Bou", tag:"TIP", tagKind:"tip",
            meta:[{ico:ICO.euro, text:"~20€ giornata"},{ico:ICO.tag, text:"Ombra essenziale a giugno"}],
            desc:"A giugno con un 2 anni l'ombrellone è un investimento sensato: garantisce siesta sul posto dopo pranzo, riduce drasticamente il rischio scottature. Si affittano direttamente sulla spiaggia, niente prenotazione necessaria — arrivate entro le 11 per la prima fila.",
            actions:[]},
          { name:"Basilica paleocristiana di Son Bou",
            meta:[{ico:ICO.tag, text:"Ingresso libero"}],
            desc:"All'estremità est della spiaggia, resti di una basilica del V secolo d.C. visibili direttamente sulla sabbia. Visita rapida (10 min), curiosità più che attrazione. Bubi può curiosare tra le pietre.",
            actions:[
              {kind:'map', label:"Mappa", url: mapsUrl("Basilica+paleocristiana+Son+Bou+Menorca")}
            ]}
        ]
      },
      {
        kind:'eat', title:'Dove mangiare', icon: ICO.fork,
        items: [
          { name:"Beach club Bambú — Son Bou", tag:"MUST", tagKind:"must",
            meta:[{ico:ICO.euro, text:"€€"},{ico:ICO.star, text:"4/5"}],
            desc:"Beach club informale direttamente sulla sabbia. Pesce, insalate, paella, bibite fresche. Ombra garantita, atmosfera tropicale, ottimo per famiglie. Spesso musica chill ma non invadente.",
            actions:[
              {kind:'info', label:"Info & prenotazione", url: searchUrl("Bambu beach club Son Bou Menorca")},
              {kind:'map',  label:"Mappa", url: mapsUrl("Bambu+beach+club+Son+Bou+Menorca")}
            ]},
          { name:"Sa Caleta — Son Bou ovest",
            meta:[{ico:ICO.euro, text:"€€"},{ico:ICO.star, text:"4/5"}],
            desc:"Alternativa più classica al Bambú, sempre sulla spiaggia di Son Bou. Pesce alla griglia, paella, menù del giorno onesto. Terrazza coperta, tavoli all'ombra. Comodo per pranzo dopo il bagno.",
            actions:[
              {kind:'map', label:"Mappa", url: mapsUrl("Sa+Caleta+Son+Bou+Menorca")}
            ]},
          { name:"Drink alla Cova d'en Xoroi", tag:"EXTRA", tagKind:"extra",
            meta:[{ico:ICO.euro, text:"€€"}],
            desc:"Cocktail e bibite con vista mozzafiato dalle grotte. Niente cena vera e propria (snack solo), giusto per il rito del posto. Bibita per Bubi tranquillamente disponibile.",
            actions:[]}
        ]
      },
      {
        kind:'tips', title:'Pratico', icon: ICO.alert,
        items: [
          { name:"Perché early invece che tramonto alla Cova",
            tag:"TIP", tagKind:"tip",
            desc:"Tre motivi concreti con un 2 anni: <strong>1)</strong> il tramonto è alle 21:15 — un'ora abbondante oltre il bedtime tipico; <strong>2)</strong> gli scalini scavati nella scogliera sono ripidi e con un bimbo stanco diventano un rischio; <strong>3)</strong> dopo le 22 parte la musica da club. La versione 16:30 vi dà luce, vista, foto e tranquillità.",
            actions:[]},
          { name:"Maó di lunedì — fuori itinerario",
            desc:"Maó esce dall'itinerario principale di lunedì (Mercat des Peix chiuso, parecchie botteghe chiuse). Cena al porto di Maó è invece consigliata in serata al G2 — vedi dettagli del giorno 2. Se passate vicino a Maó in altri momenti, il Mercat des Claustre vale sempre una sosta veloce.",
            actions:[]},
          { name:"Ombra e idratazione",
            desc:"Son Bou ha pochissima ombra naturale (sabbia aperta). Ombrellone obbligatorio per un 2 anni, acqua abbondante nello zaino (1.5L a testa). Crema 50+ ogni 90 min, anche sotto l'ombrellone.",
            actions:[]}
        ]
      }
    ]
  },

  // ─── G6 — Cavalleria / Nord Selvaggio ─────────────────────────────────────
  {
    intro: "Il <strong>nord selvaggio</strong> di Minorca: scogliere a strapiombo, fari isolati, spiagge di ciottoli rossi. Zona molto esposta — con tramontana forte tutto cambia e diventa giorno relax. Strade sterrate ma percorribili a 20 km/h. Porta sempre pranzo al sacco: i bar sono incerti.",
    sections: [
      {
        kind:'discover', title:'Cosa vedere', icon: ICO.pin,
        items: [
          { name:"Es Grau — la laguna", pinned:true,
            meta:[{ico:ICO.car, text:"20 min in auto"},{ico:ICO.parking, text:"Sterrato all'ingresso del paese"},{ico:ICO.users, text:"Bassissima affluenza"}],
            desc:"Piccolo borgo di pescatori affacciato su una laguna piatta come uno specchio: <strong>la spiaggia perfetta per Bubi</strong>. Acqua bassissima per decine di metri, sabbia fine, niente folla. Riparata da quasi ogni vento. Il bar in paese fa panini e gelato. Una giornata di laguna invece che di mare aperto — ricordo che resta.",
            actions:[
              {kind:'map', label:"Apri in Maps", url: mapsUrl("Es+Grau+Menorca")}
            ],
            parking:[
              {name:"Aparcamiento Es Grau", q:"Aparcamiento+Es+Grau+Menorca"}
            ]},
          { name:"s'Albufera des Grau — riserva naturale", pinned:true,
            meta:[{ico:ICO.car, text:"All'ingresso di Es Grau"},{ico:ICO.tag, text:"Sentiero pianeggiante"},{ico:ICO.ticket, text:"Ingresso libero"}],
            desc:"Il <strong>cuore del Parco Naturale di Minorca</strong> e Riserva della Biosfera UNESCO. Stagno costiero salmastro abitato da aironi, cormorani, anatre, occasionalmente fenicotteri di passaggio. Sentiero di legno pianeggiante, fattibile col passeggino sportivo o marsupio. <strong>Centro visite</strong> Rodríguez Femenías all'ingresso, gratuito, con pannelli per bambini. Da abbinare a Es Grau nella stessa giornata.",
            actions:[
              {kind:'info', label:"Info parco", url: searchUrl("Parc Natural s'Albufera des Grau Menorca centro visite orari")},
              {kind:'map',  label:"Apri in Maps", url: mapsUrl("Parc+Natural+s+Albufera+des+Grau+Menorca")}
            ],
            parking:[
              {name:"Centro visite s'Albufera", q:"Centro+visitantes+s+Albufera+Menorca"},
              {name:"Aparcamiento Es Grau", q:"Aparcamiento+Es+Grau+Menorca"}
            ]},
          { name:"Faro di Cavalleria", tag:"MUST", tagKind:"must",
            meta:[{ico:ICO.car, text:"15 min in auto"},{ico:ICO.parking, text:"Sterrato vicino al faro"},{ico:ICO.alert, text:"Bordi liberi: tieni Bubi per mano"}],
            desc:"Scogliere spettacolari del nord, panorama che spazia dalle Baleari al canale verso la Sardegna. Foto incredibili al tramonto. Faro non visitabile, ma il piazzale e i sentieri intorno regalano la vista più selvaggia dell'isola.",
            actions:[
              {kind:'map', label:"Apri in Maps", url: mapsUrl("Far+de+Cavalleria+Minorca")}
            ],
            parking:[
              {name:"Aparcamiento Far de Cavalleria", q:"Aparcamiento+Far+de+Cavalleria+Menorca"}
            ]},
          { name:"Binimel·là", tag:"MUST", tagKind:"must",
            meta:[{ico:ICO.car, text:"20 min — strada sterrata"},{ico:ICO.alert, text:"Ciottoli: scarpe da scoglio"}],
            desc:"Spiaggia di ciottoli rossi ferrosi — visivamente unica al mondo. Acqua cristallina ma il fondo non è ideale per i piedini di Bubi. Da qui parte un sentiero di 30 min verso Cala Pregonda (vergine, scenografica).",
            actions:[
              {kind:'map', label:"Mappa", url: mapsUrl("Binimel+la+Minorca")}
            ],
            parking:[
              {name:"Aparcamiento Binimel·là (sterrato)", q:"Aparcamiento+Binimel+la+Menorca"}
            ]},
          { name:"Cala Pregonda — solo per esploratori", mode:"full",
            meta:[{ico:ICO.car, text:"30 min a piedi da Binimel·là"},{ico:ICO.alert, text:"Sentiero non passeggino"}],
            desc:"Una delle cale più scenografiche di Minorca, raggiungibile solo a piedi dal sentiero costiero. Fattibile con Bubi solo in marsupio/fascia. Sabbia rossa, faraglioni, atmosfera marziana.",
            actions:[
              {kind:'info', label:"Info Pregonda", url: searchUrl("Cala Pregonda Menorca sentiero")}
            ],
            parking:[
              {name:"Aparcamiento Binimel·là (poi a piedi)", q:"Aparcamiento+Binimel+la+Menorca"}
            ]}
        ]
      },
      {
        kind:'act', title:'Attività', icon: ICO.compass,
        items: [
          { name:"Birdwatching e fotografia",
            meta:[{ico:ICO.tag, text:"Mattina presto o tramonto"}],
            desc:"Cavalleria è una zona ricca di uccelli marini: gabbiani reali, cormorani, falchi pellegrini. Se hai un binocolo, portalo. La luce del primo mattino o del tramonto trasforma la costa rossa.",
            actions:[]}
        ]
      },
      {
        kind:'eat', title:'Dove mangiare', icon: ICO.fork,
        items: [
          { name:"Pranzo al sacco — il piano A", tag:"MUST", tagKind:"must",
            desc:"Il bar di Binimel·là può essere chiuso (stagionale, gestione informale). Compra panini, frutta, acqua all'Eroski di Mercadal prima di salire a nord. Tovaglietta sulla spiaggia — pasto migliore della giornata.",
            actions:[
              {kind:'map', label:"Eroski Mercadal", url: mapsUrl("Eroski+Es+Mercadal+Menorca")}
            ]},
          { name:"Cena a Fornells — se non l'avete fatta",
            desc:"Se è il giorno di tramontana e siete passati al programma 'aperitivo serale a Fornells', è l'occasione per Es Cranc o Sa Llagosta. Prenotate appena sapete che è un giorno di vento.",
            actions:[
              {kind:'book', label:"Prenota Es Cranc", url: "http://www.escranc.com/reserva.html"},
              {kind:'book', label:"Prenota Sa Llagosta", url: "https://www.guiarepsol.com/es/fichas/restaurante/sa-llagosta-60220/"}
            ]}
        ]
      },
      {
        kind:'tips', title:'Pratico', icon: ICO.alert,
        items: [
          { name:"Strada sterrata Binimel·là",
            desc:"Percorribile con qualsiasi auto a noleggio, ma piano: max 20 km/h, attenti alle pietre. Mai lasciare oggetti in vista nel parcheggio sterrato.",
            actions:[]},
          { name:"Crema solare e cappellini",
            desc:"Zona molto esposta, niente ombra. UV altissimi anche con vento. Cappello obbligatorio per Bubi.",
            actions:[]}
        ]
      }
    ]
  },

  // ─── G7 — Ciutadella & Monte Toro ──────────────────────────────────────────
  {
    intro: "<strong>La città più bella di Minorca</strong>. Architettura medievale, palazzi nobiliari, cattedrale gotica, porto incassato tra le rocce con i ristoranti a pelo d'acqua. Tutta percorribile col passeggino. Più pittoresca di Maó, meno turistica nella stagione di giugno. <strong>Sulla via del rientro, stop al Monte Toro</strong> (358m, il tetto dell'isola) alla luce dorata del tardo pomeriggio.",
    sections: [
      {
        kind:'discover', title:'Cosa vedere', icon: ICO.pin,
        items: [
          { name:"Cattedrale di Santa Maria", tag:"MUST", tagKind:"must",
            meta:[{ico:ICO.clock, text:"Lun-Sab generalmente 10:00-13:00 / 17:00-19:00 — verificare"},{ico:ICO.ticket, text:"Ingresso ~5€"}],
            desc:"Cattedrale gotica del XIV secolo, costruita sul sito della moschea principale dopo la riconquista catalana del 1287. Interno raccolto, vetrate notevoli. La piazza antistante è il cuore della città vecchia.",
            actions:[
              {kind:'info', label:"Orari & biglietti", url:"https://catedraldemenorca.com/"},
              {kind:'map',  label:"Mappa", url: mapsUrl("Catedral+Ciutadella+Menorca")}
            ],
            parking:[
              {name:"Plaça dels Pins (consigliato)", q:"Aparcamiento+Placa+dels+Pins+Ciutadella"},
              {name:"Parking Plaça des Born", q:"Parking+Placa+des+Born+Ciutadella"}
            ]},
          { name:"Plaça des Born", tag:"MUST", tagKind:"must",
            meta:[{ico:ICO.clock, text:"Mercato venerdì/sabato — voi siete qui di mercoledì"},{ico:ICO.tag, text:"Architettura"}],
            desc:"La piazza monumentale di Ciutadella, dominata dal palazzo del Born e dall'obelisco. Il mercato dei prodotti locali si tiene venerdì e sabato — voi siete qui di mercoledì, niente mercato ma piazza più tranquilla. Per i prodotti tipici (formaggio Mahón DOP, gin Xoriguer, sobrassada) andate al Mercado Municipal coperto poco distante.",
            actions:[
              {kind:'map', label:"Mappa", url: mapsUrl("Placa+des+Born+Ciutadella+Menorca")}
            ],
            parking:[
              {name:"Plaça dels Pins", q:"Aparcamiento+Placa+dels+Pins+Ciutadella"},
              {name:"Parking Plaça des Born", q:"Parking+Placa+des+Born+Ciutadella"}
            ]},
          { name:"Centro storico — vicoli medievali",
            meta:[{ico:ICO.tag, text:"Passeggino ok"}],
            desc:"Ses Voltes (le 'voltine'), Carrer Major des Born, palazzo Salort, palazzo Torresaura. Architettura aragonese-catalana intatta. Bubi adorerà i passaggi voltati e l'atmosfera fiabesca.",
            actions:[
              {kind:'map', label:"Centro storico", url: mapsUrl("Ciutadella+Menorca+centro+historico")}
            ],
            parking:[
              {name:"Plaça dels Pins (5 min a piedi)", q:"Aparcamiento+Placa+dels+Pins+Ciutadella"}
            ]},
          { name:"Porto incassato di Ciutadella", tag:"EXTRA", tagKind:"extra",
            meta:[{ico:ICO.car, text:"5 min a piedi dal centro"}],
            desc:"Stretto fiordo naturale tra le rocce, con i ristorantini di pesce direttamente sull'acqua. Bubi adorerà le barche a vela ormeggiate. Tramonto qui = imbarazzo della scelta.",
            actions:[
              {kind:'map', label:"Mappa", url: mapsUrl("Port+Ciutadella+Menorca")}
            ],
            parking:[
              {name:"Plaça dels Pins", q:"Aparcamiento+Placa+dels+Pins+Ciutadella"},
              {name:"Parking Port Ciutadella", q:"Parking+Port+Ciutadella+Menorca"}
            ]},
          { name:"Monte Toro — stop al rientro", tag:"MUST", tagKind:"must",
            meta:[{ico:ICO.car, text:"40 min da Ciutadella, sulla via di casa"},{ico:ICO.parking, text:"Ampio gratuito in cima"},{ico:ICO.clock, text:"Santuario ~9:00-19:00"}],
            desc:"<strong>Il tetto di Minorca</strong>: 358m, il punto più alto dell'isola. Santuario della Verge del Toro e panorama a 360° su tutta l'isola — nelle giornate limpide si vede la Sardegna. Salita in auto fino in cima, <strong>nessun sentiero obbligatorio</strong> (con Bubi è il vantaggio). 30-40 min di stop, bar/ristorante in cima per un caffè veloce, poi via verso Son Parc. Geograficamente è sulla strada del rientro da Ciutadella: deviazione minima, foto magnifica.",
            actions:[
              {kind:'info', label:"Info santuario", url: searchUrl("Santuari del Toro Menorca orari")},
              {kind:'map',  label:"Apri in Maps", url: mapsUrl("Monte+Toro+Menorca")}
            ],
            parking:[
              {name:"Aparcamiento Santuari del Toro", q:"Aparcamiento+Santuari+del+Toro+Menorca"}
            ]},
          { name:"Naveta des Tudons — extra archeologico",
            meta:[{ico:ICO.car, text:"10 min in auto verso Maó"},{ico:ICO.ticket, text:"~3€"}],
            desc:"Tomba megalitica del XIV-X sec a.C., una delle più antiche d'Europa. Visita rapida (20 min). Se l'archeologia vi piace, sosta sulla via del ritorno.",
            actions:[
              {kind:'info', label:"Info Naveta", url: searchUrl("Naveta des Tudons Menorca orari")},
              {kind:'map',  label:"Mappa", url: mapsUrl("Naveta+des+Tudons+Menorca")}
            ],
            parking:[
              {name:"Aparcamiento Naveta des Tudons", q:"Aparcamiento+Naveta+des+Tudons+Menorca"}
            ]},
          { name:"Cala en Bosch — bagno pomeridiano", mode:"full",
            meta:[{ico:ICO.car, text:"10 min da Ciutadella"},{ico:ICO.parking, text:"Ampio in paese"},{ico:ICO.users, text:"Media affluenza"}],
            desc:"Baia chiusa con marina turistica e spiaggia di sabbia attrezzata, fondali bassissimi: scelta perfetta per Bubi dopo la mattinata in centro a Ciutadella. Bar, ristoranti, docce, noleggio ombrelloni. È <strong>la combinazione naturale</strong> con Ciutadella in modalità Esteso: città la mattina, spiaggia nel primo pomeriggio.",
            actions:[
              {kind:'map', label:"Apri in Maps", url: mapsUrl("Cala+en+Bosch+Menorca")}
            ],
            parking:[
              {name:"Aparcamiento Cala en Bosch", q:"Aparcamiento+Cala+en+Bosch+Menorca"}
            ]},
          { name:"Faro d'Artrutx al tramonto", mode:"full",
            tag:"EXTRA", tagKind:"extra",
            meta:[{ico:ICO.car, text:"5 min da Cala en Bosch"},{ico:ICO.parking, text:"Sterrato vicino al faro"}],
            desc:"L'estremo sud-ovest dell'isola: faro a strisce bianche e nere, scogliere basse, vista aperta a ovest. Tramonti tra i più scenografici di Minorca. A 5 minuti da Cala en Bosch — chiusura naturale di una giornata 'tutta ovest'. Un piccolo bar/ristorante alla base del faro per un drink al tramonto.",
            actions:[
              {kind:'map', label:"Apri in Maps", url: mapsUrl("Far+d+Artrutx+Menorca")}
            ],
            parking:[
              {name:"Aparcamiento Far d'Artrutx", q:"Aparcamiento+Far+Artrutx+Menorca"}
            ]}
        ]
      },
      {
        kind:'eat', title:'Dove mangiare', icon: ICO.fork,
        items: [
          { name:"Sa Clau — fine dining", tag:"MUST", tagKind:"must",
            meta:[{ico:ICO.euro, text:"€€€"},{ico:ICO.star, text:"5/5"}],
            desc:"Cucina minorchina d'autore in un vicolo medievale. Atmosfera intima, ingredienti locali, presentazione raffinata. Per una serata da ricordare.",
            actions:[
              {kind:'book', label:"Prenota", url: searchUrl("Sa Clau Ciutadella prenotazione")},
              {kind:'map',  label:"Mappa", url: mapsUrl("Sa+Clau+Ciutadella+Menorca")}
            ]},
          { name:"Bar Tritón — sul porto", tag:"TIP", tagKind:"tip",
            meta:[{ico:ICO.euro, text:"€€"},{ico:ICO.star, text:"4/5"}],
            desc:"Direttamente sul porto incassato. Tapas, pesce, atmosfera rilassata. Spazio all'aperto: Bubi può sgambettare mentre voi cenate.",
            actions:[
              {kind:'map', label:"Mappa", url: mapsUrl("Bar+Triton+Port+Ciutadella+Menorca")}
            ]},
          { name:"Crem & Color — gelateria", tag:"EXTRA", tagKind:"extra",
            meta:[{ico:ICO.euro, text:"€"}],
            desc:"Gusti unici: figues (fichi), formatge (formaggio di Minorca), ensaïmada. Tappa obbligatoria — non li trovate da nessun'altra parte sull'isola.",
            actions:[
              {kind:'map', label:"Mappa", url: mapsUrl("Crem+Color+gelateria+Ciutadella+Menorca")}
            ]}
        ]
      },
      {
        kind:'tips', title:'Pratico', icon: ICO.alert,
        items: [
          { name:"Parcheggio Pl. dels Pins (fuori porta)",
            desc:"Parcheggio grande appena fuori il centro storico. 5 minuti a piedi e siete a Plaça des Born. Le strisce blu in centro sono limitate e a pagamento.",
            actions:[
              {kind:'map', label:"Mappa", url: mapsUrl("Placa+dels+Pins+Ciutadella+Menorca")}
            ]},
          { name:"Festa de Sant Joan — solo dal 23/24 giugno",
            desc:"La festa più famosa di Minorca con i cavalli che si impennano (jaleo) nelle piazze cade il 23-24 giugno. Voi ci siete il 10 giugno: niente festa, ma pochissima folla — vantaggio. Se invece doveste mai tornare a fine giugno, prenotate alloggio con 6+ mesi di anticipo.",
            actions:[]}
        ]
      }
    ]
  },

  // ─── G8 — Ultimi Tuffi & Partenza ─────────────────────────────────────────
  {
    intro: "L'ultima mattina si gusta lenta. Un ultimo bagno a Son Parc, raccogliete qualche conchiglia con Bubi, foto di famiglia. Se avete tempo, ultimo gelato a Fornells sulla strada per l'aeroporto. <strong>Riconsegna auto entro le 12:00, check-in chiude alle 13:20.</strong>",
    sections: [
      {
        kind:'discover', title:'Ultimi momenti', icon: ICO.pin,
        items: [
          { name:"Son Parc Beach — ultimo bagno",
            meta:[{ico:ICO.car, text:"2 min a piedi"}],
            desc:"La spiaggia di casa, l'ultima volta. Bubi raccoglie conchiglie come souvenir, foto di famiglia con il mare alle spalle. Niente fretta — il check-out arriva da solo.",
            actions:[
              {kind:'map', label:"Mappa", url: mapsUrl("Son+Parc+Beach+Minorca")}
            ],
            parking:[
              {name:"Hotel Royal Son Parc", q:"Hotel+Royal+Son+Parc+Menorca"},
              {name:"Parking Son Parc Beach", q:"Son+Parc+Beach+parking+Menorca"}
            ]},
          { name:"Punta Prima — bagno strategico vicino aeroporto", mode:"full",
            tag:"EXTRA", tagKind:"extra",
            meta:[{ico:ICO.car, text:"5 min dall'aeroporto"},{ico:ICO.parking, text:"Ampio in paese"},{ico:ICO.alert, text:"Pianifica i tempi"}],
            desc:"Sabbia fine, baia attrezzata, fondali bassi: <strong>l'ultimo tuffo prima del volo</strong>, a 5 minuti dall'aeroporto invece dei 30 minuti da Son Parc. <strong>Logistica</strong>: check-out hotel entro le 10, valigie in macchina, una breve sosta a Son Parc per i saluti, quindi guida diretta a Punta Prima per il bagno (~11-12), pranzo veloce in zona, riconsegna auto entro le 12:00 e check-in alle 13:20. È un'alternativa al lungo bagno di Son Parc — non si aggiunge.",
            actions:[
              {kind:'map', label:"Apri in Maps", url: mapsUrl("Punta+Prima+Menorca")}
            ],
            parking:[
              {name:"Aparcamiento Punta Prima", q:"Aparcamiento+Punta+Prima+Menorca"}
            ]},
          { name:"Gelateria Fornells — se c'è tempo", tag:"EXTRA", tagKind:"extra",
            meta:[{ico:ICO.car, text:"10 min, sulla strada per l'aeroporto"}],
            desc:"Ultimo gelato minorchino prima del volo. La deviazione vale la pena.",
            actions:[
              {kind:'map', label:"Mappa", url: mapsUrl("Gelateria+Fornells+Menorca")}
            ],
            parking:[
              {name:"Aparcamiento Fornells centro", q:"Aparcamiento+Fornells+centro+Menorca"},
              {name:"Carrer Major Fornells", q:"Carrer+Major+Fornells+Menorca"}
            ]}
        ]
      },
      {
        kind:'tips', title:'Souvenir & spesa finale', icon: ICO.alert,
        items: [
          { name:"Eroski Mercadal — souvenir alimentari", tag:"TIP", tagKind:"tip",
            meta:[{ico:ICO.car, text:"10 min, sulla strada per Maó"}],
            desc:"Ultima fermata strategica per portare a casa: formaggio Mahón DOP (sottovuoto), gin Xoriguer, sobrassada, ensaïmades. Tutto in un solo posto.",
            actions:[
              {kind:'map', label:"Eroski Mercadal", url: mapsUrl("Eroski+Es+Mercadal+Menorca")}
            ]},
          { name:"Aeroporto — 2h prima",
            meta:[{ico:ICO.clock, text:"Arrivo consigliato 13:20"}],
            desc:"L'aeroporto di Mahon è piccolo: 1 ora di anticipo basta. Per sicurezza con bambino piccolo arrivare 2h prima del volo (15:20 → 13:20). Riconsegna ACGcars entro le 12:00.",
            actions:[
              {kind:'map', label:"Aeroporto Maó", url: mapsUrl("Aeropuerto+Menorca")}
            ]}
        ]
      }
    ]
  }
];

// Date calendario fisse (legate allo slot, non al contenuto)
const CALENDAR_DATES = DAYS.map(d=>d.date);

const BEACHES = [
  { name:"Son Parc", emoji:"🏠", dist:"2 min a piedi", depth:"Bassissima (30m)", sand:"Sabbia fine dorata", family:5, crowd:"Bassa", wind:"Riparata", facs:["Bar vicino","Ombrelloni"], note:"La vostra base. Baia semicircolare riparata, acqua piattissima. Ideale per bambini 0-3 anni. Raramente affollata." },
  { name:"Arenal d'en Castell", emoji:"⭐", dist:"12 min", depth:"Bassa (50m piatto)", sand:"Sabbia dorata compatta", family:5, crowd:"Media", wind:"Protetta", facs:["Bar","Ristorante","Ombrelloni","Docce","Bagni"], note:"Baia a 270° — strutturalmente protetta dal vento. Fondali bassissimi per decine di metri. Il top del nord per famiglie." },
  { name:"Cala Galdana", emoji:"💎", dist:"40 min", depth:"Bassa-media", sand:"Sabbia bianca finissima", family:5, crowd:"Alta", wind:"Protetta (SUD)", facs:["Bar","Ristorante","Canoe","Docce","Salvamento"], note:"La più bella dell'isola. Pini fino alla sabbia, acque turchesi. Attrezzatissima. Arriva entro 9:30. Ideale anche con tramontana." },
  { name:"Es Grau", emoji:"🦆", dist:"20 min", depth:"Bassissima (laguna)", sand:"Sabbia + laguna", family:5, crowd:"Bassissima", wind:"Protetta", facs:["Bar"], note:"Parco naturale. Laguna piatta come uno specchio — paradiso per bimbi piccoli. Quasi sconosciuta ai turisti." },
  { name:"Cala Macarella", emoji:"📸", dist:"40 min + 15 min a piedi", depth:"Media", sand:"Sabbia bianca finissima", family:3, crowd:"Alta", wind:"Protetta (SUD)", facs:["Bar","Salvamento (estate)"], note:"La cartolina di Minorca. Acqua color piscina, scogliere bianche, pini. Si parcheggia a Cala Galdana e si cammina 15 min su sentiero ombreggiato (passeggino no, marsupio sì). Con Bubi vale solo se è in giornata buona." },
  { name:"Cala Macarelleta", emoji:"💙", dist:"45 min + 20 min a piedi", depth:"Media", sand:"Sabbia bianca", family:2, crowd:"Media-alta", wind:"Protetta (SUD)", facs:[], note:"La gemella più piccola e selvaggia di Macarella. Ancora 5 min di sentiero oltre Macarella. Niente servizi. Per Bubi sconsigliata: discesa ripida finale. Se la fate, marsupio obbligatorio." },
  { name:"Cala Mitjana", emoji:"🌲", dist:"35 min + 10 min a piedi", depth:"Media", sand:"Sabbia bianca", family:3, crowd:"Media", wind:"Protetta (SUD)", facs:[], note:"Cala selvaggia incorniciata da scogliere e pini. Sentiero pianeggiante 10 min dal parcheggio (passeggino no, ma marsupio facile). Acqua incredibile. Pranzo al sacco obbligatorio — niente servizi." },
  { name:"Cala en Turqueta", emoji:"💧", dist:"55 min + 10 min a piedi", depth:"Bassa-media", sand:"Sabbia bianca finissima", family:3, crowd:"Alta", wind:"Protetta (SUD)", facs:["Chiringuito al parcheggio","Bagni","Salvamento (estate)"], note:"La cartolina turchese del sud-ovest. Acqua color piscina divisa in due da una bassa scogliera, pini fino alla sabbia. Niente servizi sulla spiaggia stessa — solo un piccolo bar al parcheggio. Il parking si riempie entro le 9:00 (anche prima nei weekend): partenza da Son Parc entro le 7:30 o in alternativa bus 67 da Ciutadella. Marsupio per Bubi, sentiero ombreggiato di ~10 min." },
  { name:"Cala en Bosch", emoji:"⛵", dist:"55 min", depth:"Bassissima", sand:"Sabbia bianca fine", family:5, crowd:"Media-alta", wind:"Protetta (SUD)", facs:["Bar","Ristoranti","Ombrelloni","Docce","Bagni","Salvamento","Noleggio"], note:"La spiaggia del resort family-friendly del sud-ovest. Baia a U, sabbia bianca fine, fondali bassissimi e calmi: perfetta per Bubi. Marina pedonale a 5 min con ristoranti, gelaterie, parchi giochi (Aquarock). Parcheggio gratuito ma arriva entro le 10:30. Si combina bene con la visita a Ciutadella la mattina o il faro d'Artrutx al tramonto." },
  { name:"Son Bou", emoji:"🏄", dist:"35 min", depth:"Media", sand:"Sabbia, 2 km", family:4, crowd:"Media-alta", wind:"Semi-esposta", facs:["Bar","Ristorante","Noleggio","Docce","Salvamento"], note:"La più lunga dell'isola. Vicino alla spiaggia le rovine di una basilica paleocristiana del V secolo — tappa culturale interessante anche per bimbi." },
  { name:"Cala en Porter", emoji:"🏞️", dist:"35 min", depth:"Media", sand:"Sabbia bianca", family:4, crowd:"Media", wind:"Semi-protetta", facs:["Bar","Ristorante","Parco giochi"], note:"Baia con alte pareti rocciose ai lati — scenografica. Vicino all'ingresso c'è un parco giochi: ottimo per Bubi dopo il bagno! Sopra la cala c'è la Cova d'en Xoroi." },
  { name:"Cala Tirant", emoji:"🪁", dist:"10 min", depth:"Media", sand:"Sabbia grande", family:3, crowd:"Bassa", wind:"⚠️ Esposta al nord", facs:["Bar"], note:"Zona di kitesurf. Bella ma ventilata. Per bimbi piccoli non ideale con vento — con tramontana evitarla." },
  { name:"Binimel·là", emoji:"🔴", dist:"20 min (sterrato)", depth:"Media", sand:"Ciottoli rossi ferrosi", family:2, crowd:"Bassissima", wind:"⚠️ Esposta", facs:[], note:"La più selvaggia e fotogenica. Ciottoli non adatti per bimbi piccoli. Con tramontana impraticabile." }
];

const TIPS = [
  { icon:"🌡️", title:"Meteo di Giugno", bg:"#FEF3C7", border:"#F59E0B", txt:"Temperature 24-28°C di giorno, 18-20°C la sera. Il mare è già a 23°C. Giugno è il periodo ideale: molto meno folla rispetto a luglio/agosto (confermato da chi ci è stato), clima ventilato che rende sopportabile anche il pieno pomeriggio. UV altissimi — crema 50+ ogni 90 minuti per Bubi. Tramonto verso le 21:15 — cena con luce naturale fino a tardi." },
  { icon:"💨", title:"La Tramontana (vento da nord)", bg:"#EFF6FF", border:"#3B82F6", txt:"Il vento caratteristico di Minorca soffia da nord. Può essere forte al mattino e calmarsi nel pomeriggio. App consigliate: <a href='https://www.windfinder.com/#10/39.954/4.139/spot' target='_blank' rel='noopener' style='color:inherit;font-weight:700;text-decoration:underline'>Windfinder Minorca</a> e <a href='https://www.windy.com/?39.954,4.139,9' target='_blank' rel='noopener' style='color:inherit;font-weight:700;text-decoration:underline'>Windy (Menorca)</a>. Da entrambi puoi zoomare sul punto specifico dove sarai. Con tramontana imposta 'Nord' sul giorno corrispondente e l'app adatta automaticamente l'itinerario." },
  { icon:"👶", title:"Con Bubi (2 anni) — Essenziali", bg:"#F0FDF4", border:"#10B981", txt:"Portare: ombrellone proprio (quelli a noleggio sono piccoli), tappetino impermeabile da mare, scarpette da scoglio piccole, crema 50+ bambini, snack (crackers, frutta), cambio completo x2, pannolini extra, giochini da sabbia, fascia o marsupio per i sentieri (Macarella, Mitjana). Spiagge top per bimbi 2 anni: Son Parc, Arenal, Galdana, Es Grau." },
  { icon:"🛑", title:"Codice Strada Spagna (≠ Italia)", bg:"#FEF2F2", border:"#EF4444", txt:"Limiti: <strong>50 km/h centro abitato</strong>, <strong>90 km/h strade extraurbane</strong> (la Me-1 che usate quasi sempre), <strong>120 km/h autostrade</strong> (ma a Minorca non ce ne sono). Tasso alcolico: 0,5 g/L (0,3 per neopatentati). <strong>ZTL Maó</strong> nel centro storico la sera — parcheggia a Es Cos o Plaça de S'Esplanada. Multe inviate in Italia anche dopo mesi: piano coi limiti." },
  { icon:"🅿️", title:"Parcheggi — Regola d'oro", bg:"#FFF7ED", border:"#F97316", txt:"Nord (Arenal, Son Parc): arriva entro 10:00, quasi sempre posto. Sud (Galdana, Son Bou) nei weekend: ENTRO 9:30 o il parcheggio è pieno. Galdana ha una navetta dal paese — usala se trovi il parcheggio pieno. Mai lasciare oggetti in vista in auto nelle zone selvagge (Cavalleria, Binimel·là)." },
  { icon:"😴", title:"Siesta — 14:00 / 17:00", bg:"#F5F3FF", border:"#8B5CF6", txt:"Negozi piccoli, farmacie di paese, botteghe artigiane chiudono dalle 14 alle 17 (a volte fino alle 17:30). Pianifica le commissioni la mattina o dopo le 17. I supermercati grandi (Eroski Mercadal, Mercadona Maó) restano aperti tutto il giorno. Anche i ristoranti spesso non servono pranzo dopo le 15:30 — siate puntuali." },
  { icon:"💧", title:"Acqua del Rubinetto", bg:"#EFF6FF", border:"#0891B2", txt:"Tecnicamente potabile ma con sapore minerale forte (calcare). I locali bevono in bottiglia. All'Eroski compra <strong>casse da 1,5L o boccioni da 5L</strong>: 1,5L a persona al giorno (2L per Bubi quando fa caldo). Per cucinare e lavare i denti il rubinetto va benissimo." },
  { icon:"🛒", title:"Supermercati & Cucina in struttura", bg:"#F5F3FF", border:"#8B5CF6", txt:"Eroski a Mercadal (10 min da Son Parc) — grande, ottimo. Fai la spesa grande il primo giorno: acqua (1.5L/persona/giorno), frutta, yogurt e biscotti per colazione, pasta/riso/verdure per i pasti in struttura, aloe vera per scottature. Il piccolo market a Son Parc va bene solo per emergenze (prezzi alti)." },
  { icon:"🏥", title:"Emergenze Mediche", bg:"#FEF2F2", border:"#EF4444", txt:"<strong>Numero unico emergenze: 112</strong>. Ospedale Mateu Orfila a Maó (pronto soccorso H24). CAP (urgenze) anche a Ciutadella. Farmacia a Mercadal (10 min da Son Parc) e a Fornells. Porta certificato TEAM (ex EHIC) per cure gratuite. Per Bubi: il pediatra dell'ospedale parla solitamente inglese." },
  { icon:"🌊", title:"Spiagge Bandiera Blu", bg:"#EFF6FF", border:"#0891B2", txt:"Galdana, Arenal d'en Castell e Son Bou hanno la Bandiera Blu (acqua controllata, salvamento, strutture). Per un bimbo piccolo, privilegia sempre queste spiagge attrezzate quando vuoi maggiore sicurezza." },
  { icon:"🦟", title:"Insetti & Natura", bg:"#FEFCE8", border:"#CA8A04", txt:"Minorca ha pochi insetti fastidiosi. Porta comunque repellente per le serate. Meduse occasionali a giugno — controlla la bandiera e chiedi ai bagnini. Non toccare ricci di mare. Non perdere l'avvistamento di gabbiani reali, aironi e cormorani nelle zone selvagge." }
];

const CHECK_GROUPS = [
  { group:"🌅 Prima di uscire", items:["Crema solare 50+ bimbo applicata","Crema adulti applicata","Cappellini per tutti","Occhiali da sole","Acqua abbondante (1.5L+ p.p.)","Snack bimbo (frutta, crackers)"] },
  { group:"🎒 Borsa spiaggia", items:["Cambio completo per Bubi (x2)","Pannolini extra","Ombrellone / parasole","Telo mare","Scarpette da scoglio piccole","Giochini da sabbia"] },
  { group:"🚗 In auto", items:["Google Maps o navigazione ok","Orario partenza rispettato","Borsa frigo con acqua","Piano B verificato"] },
  { group:"🌙 Fine giornata", items:["Doposole / aloe vera","Prenotazione cena (se prevista)","Controlla meteo domani (Windy)","Imposta vento di domani nell'app"] }
];
const ALL_ITEMS = CHECK_GROUPS.flatMap(g=>g.items);

// v3.1: checklist separata pre-partenza (mostrata solo prima del viaggio)
const PRE_TRIP_GROUPS = [
  { group:"📄 Documenti", items:["Carta d'identità valida (tutti)","Tessera TEAM (ex EHIC) per Bubi","Patente per il guidatore","Copia digitale documenti su cloud","Voucher hotel + auto stampati","Codice prenotazione voli FV4P3J"] },
  { group:"💊 Salute & Bimbo", items:["Kit medicinali base (tachipirina, aspirina)","Termometro digitale","Cerotti, disinfettante, pomata punture","Crema solare 50+ bimbo (2 tubetti)","Cappellini, occhiali da sole bimbo","Costumini bimbo (3 cambi)"] },
  { group:"🔌 Tech & Connettività", items:["Caricatori telefono (presa EU ok)","Power bank","Adattatore se serve","Google Maps Minorca offline scaricato","Windfinder/Windy installati","App Ryanair check-in pronta"] },
  { group:"🎒 Bagaglio & Casa", items:["Bagaglio a mano 40×20×25 cm verificato","Pesato (max 10kg Ryanair)","Liquidi in busta trasparente","Chiavi casa lasciate a parente/vicino","Frigo svuotato, gas chiuso","Sveglia mattina volo impostata"] },
  { group:"🏨 Prenotazioni", items:["Conferma hotel Royal Son Parc","Conferma noleggio ACGcars #46574","Cena Es Cranc o Sa Llagosta prenotata","Cena Sa Clau a Ciutadella prenotata","Eventuale kayak Fornells contattato"] }
];
const PRE_TRIP_ITEMS = PRE_TRIP_GROUPS.flatMap(g=>g.items);

// SERVICES per giorno
const SERVICES = [
  { // G1 - Arrivo / Son Parc / Fornells
    farmacie:[
      { name:"Farmacia Mercadal", dist:"10 min da Son Parc", orario:"Lun-Sab 9:00-13:30 / 17:00-20:30", maps:"Farmacia+Es+Mercadal+Menorca", note:"La più vicina alla vostra struttura. Ottimo punto di riferimento per tutta la settimana." },
      { name:"Farmacia Fornells", dist:"10 min (sera)", orario:"Lun-Sab 9:00-13:00 / 17:00-20:00", maps:"Farmacia+Fornells+Menorca", note:"In paese, comoda se siete già a Fornells per la cena." }
    ],
    supermercati:[
      { name:"Eroski Mercadal", dist:"10 min", orario:"Lun-Sab 9:00-21:00, Dom 9:00-14:00", maps:"Eroski+Es+Mercadal+Menorca", note:"Grande supermercato — fa la spesa grande qui il primo giorno: acqua, colazione, prodotti per Bubi, aloe vera.", top:true },
      { name:"Market Son Parc", dist:"2 min a piedi", orario:"9:00-13:00 / 17:00-21:00", maps:"Supermercado+Son+Parc+Menorca", note:"Piccolo market sotto l'hotel. Prezzi alti — solo per emergenze e pane fresco la mattina." }
    ],
    ristoranti:[
      { name:"Sa Llagosta", zona:"Fornells", prezzo:"€€€", stelle:"★★★★☆", note:"Il ristorante storico di Fornells. Specialità: caldereta de llagosta (zuppa di aragosta). Prenota con settimane di anticipo. Piatti del giorno per bambini disponibili.", maps:"Sa+Llagosta+Fornells+Menorca" },
      { name:"Es Cranc", zona:"Fornells", prezzo:"€€€", stelle:"★★★★★", note:"Considerato il migliore dell'isola. Aragosta e frutti di mare freschi. Ambiente rustico e autentico. Prenota assolutamente prima.", maps:"Es+Cranc+Fornells+Menorca" },
      { name:"Es Pla", zona:"Fornells", prezzo:"€€", stelle:"★★★★☆", note:"Ottimo rapporto qualità-prezzo. Menu più accessibile rispetto agli altri due. Pesce fresco del giorno. Buono per famiglie con bimbi.", maps:"Restaurant+Es+Pla+Fornells+Menorca" }
    ]
  },
  { // G2 - Arenal d'en Castell
    farmacie:[
      { name:"Farmacia Mercadal", dist:"15 min da Arenal", orario:"Lun-Sab 9:00-13:30 / 17:00-20:30", maps:"Farmacia+Es+Mercadal+Menorca", note:"La più vicina alla zona nord-est. Tienila come riferimento per questa giornata." },
      { name:"Farmacia Fornells", dist:"20 min da Arenal", orario:"Lun-Sab 9:00-13:00", maps:"Farmacia+Fornells+Menorca", note:"Alternativa se siete diretti verso Fornells nel pomeriggio." }
    ],
    supermercati:[
      { name:"Eroski Mercadal", dist:"15 min da Arenal", orario:"Lun-Sab 9:00-21:00", maps:"Eroski+Es+Mercadal+Menorca", note:"Fermati qui sulla via del ritorno per rifornire acqua e cibo per domani.", top:true },
      { name:"Bar/market Arenal", dist:"Sulla spiaggia", orario:"9:00-20:00 (stagionale)", maps:"Arenal+den+Castell+bar+Menorca", note:"Bar sulla spiaggia: panini, bibite, gelati. Comodo per il pranzo senza spostarsi." }
    ],
    ristoranti:[
      { name:"Es Port", zona:"Arenal d'en Castell", prezzo:"€€", stelle:"★★★★☆", note:"Direttamente sul lungomare di Arenal. Pesce fresco, paella, tapas. Terrazza con vista baia. Ottimo per famiglie.", maps:"Restaurant+Es+Port+Arenal+den+Castell+Menorca" },
      { name:"La Ola", zona:"Arenal d'en Castell", prezzo:"€€", stelle:"★★★★☆", note:"Menu vario con piatti di pesce e carne. Molto frequentato dai locali — buon segno. Porzioni abbondanti.", maps:"La+Ola+Arenal+den+Castell+Menorca" },
      { name:"Restaurante Mercadal", zona:"Es Mercadal (10 min)", prezzo:"€€", stelle:"★★★★☆", note:"Cucina minorchina tradizionale nel borgo di Mercadal. Ottima caldereta e formaggio locale. Più autentico e meno turistico.", maps:"Restaurante+Es+Mercadal+Menorca" }
    ]
  },
  { // G3 - Es Grau & s'Albufera
    farmacie:[
      { name:"Farmacia Maó (centro)", dist:"15 min da Es Grau", orario:"Lun-Sab 9:00-21:00", maps:"Farmacia+Centro+Mahon+Menorca", note:"La più vicina a Es Grau in caso di necessità. Sulla strada del rientro se passate per Maó." },
      { name:"Farmacia Mercadal", dist:"20 min da Es Grau", orario:"Lun-Sab 9:00-13:30 / 17:00-20:30", maps:"Farmacia+Es+Mercadal+Menorca", note:"Riferimento per il rientro verso Son Parc." }
    ],
    supermercati:[
      { name:"Eroski Mercadal", dist:"20 min", orario:"Lun-Sab 9:00-21:00", maps:"Eroski+Es+Mercadal+Menorca", note:"Fai scorta sulla via del ritorno per i giorni seguenti.", top:true },
      { name:"Spar / market Maó", dist:"15 min", orario:"Lun-Sab 9:00-21:00", maps:"Supermercado+Mahon+Menorca", note:"Se siete in zona Maó per cena o passaggio veloce." }
    ],
    ristoranti:[
      { name:"Bar Tamarindos", zona:"Es Grau", prezzo:"€", stelle:"★★★★☆", note:"Pranzo informale sulla laguna. Panini, paella, pesce semplice. Tavoli all'aperto, niente prenotazione. Atmosfera familiare perfetta con Bubi.", maps:"Bar+Tamarindos+Es+Grau+Menorca" },
      { name:"Es Cranc", zona:"Fornells (cena su altra serata)", prezzo:"€€€", stelle:"★★★★★", note:"Il migliore dell'isola per aragosta. Pianifica una serata della settimana per la cena qui — prenota con largo anticipo.", maps:"Es+Cranc+Fornells+Menorca" },
      { name:"Sa Llagosta", zona:"Fornells (cena su altra serata)", prezzo:"€€€", stelle:"★★★★☆", note:"Storico, sul porto di Fornells. Caldereta de llagosta. Alternativa a Es Cranc se non trovi posto.", maps:"Sa+Llagosta+Fornells+Menorca" }
    ]
  },
  { // G4 - Cala Galdana
    farmacie:[
      { name:"Farmacia Ferreries", dist:"15 min da Galdana", orario:"Lun-Ven 9:00-13:30 / 17:00-20:00", maps:"Farmacia+Ferreries+Menorca", note:"Il paese più vicino a Galdana. Tienila come riferimento per la giornata al sud." },
      { name:"Farmacia Maó", dist:"40 min", orario:"H24 (turno)", maps:"Farmacia+Guardia+Mahon+Menorca", note:"In caso di urgenza fuori orario, Maó ha farmacie di turno H24." }
    ],
    supermercati:[
      { name:"Spar Ferreries", dist:"15 min da Galdana", orario:"Lun-Sab 9:00-21:00", maps:"Spar+Ferreries+Menorca", note:"Fermati qui ad acquistare il pranzo al sacco prima di scendere a Galdana — ti eviti le code ai bar.", top:true },
      { name:"Bar/chioschi Galdana", dist:"Sulla spiaggia", orario:"9:00-20:00", maps:"Cala+Galdana+bar+Menorca", note:"Vari chioschi e bar sulla spiaggia. Prezzi da spiaggia turistica — porta il pranzo da casa." }
    ],
    ristoranti:[
      { name:"Mirador de Galdana", zona:"Cala Galdana", prezzo:"€€€", stelle:"★★★★☆", note:"Sul promontorio destro con vista mozzafiato sulla baia. Cucina mediterranea. Prenota assolutamente — i tavoli con vista vanno esauriti.", maps:"Mirador+de+Galdana+Menorca" },
      { name:"Timón Galdana", zona:"Cala Galdana", prezzo:"€€", stelle:"★★★★☆", note:"Direttamente sulla spiaggia. Pesce fresco, tapas, sangria. Atmosfera rilassata e family-friendly.", maps:"Timon+Galdana+Menorca" },
      { name:"Sa Barrera", zona:"Cala Galdana", prezzo:"€€", stelle:"★★★☆☆", note:"Più economico, vicino al parcheggio. Comodo per un pasto veloce senza troppe pretese. OK per bambini.", maps:"Sa+Barrera+Galdana+Menorca" }
    ]
  },
  { // G5 - Son Bou & Cova d'en Xoroi
    farmacie:[
      { name:"Farmacia Alaior", dist:"10 min da Son Bou", orario:"Lun-Sab 9:00-13:30 / 17:00-20:30", maps:"Farmacia+Alaior+Menorca", note:"La più vicina a Son Bou. Borgo bianco di Alaior è proprio sopra la spiaggia." },
      { name:"Farmacia Centro Maó", dist:"20 min", orario:"Lun-Sab 9:00-21:00", maps:"Farmacia+Centro+Mahon+Menorca", note:"Backup centrale, ben fornita. Comoda se passate da Maó." }
    ],
    supermercati:[
      { name:"Eroski Alaior", dist:"10 min da Son Bou", orario:"Lun-Sab 9:00-21:00", maps:"Eroski+Alaior+Menorca", note:"Comodo per acqua e snack prima di scendere a Son Bou.", top:true },
      { name:"Mercadona Maó", dist:"20 min", orario:"Lun-Sab 9:00-21:30", maps:"Mercadona+Mahon+Menorca", note:"Il più grande dell'isola. Ottimo per fare scorta di metà settimana se passate da Maó." }
    ],
    ristoranti:[
      { name:"Bambú beach club", zona:"Son Bou", prezzo:"€€", stelle:"★★★★☆", note:"Pranzo informale sulla sabbia. Pesce, paella, insalate, bibite fresche. Ombra garantita, atmosfera tropicale. Family-friendly.", maps:"Bambu+beach+club+Son+Bou+Menorca" },
      { name:"Sa Caleta", zona:"Son Bou ovest", prezzo:"€€", stelle:"★★★★☆", note:"Alternativa più classica al Bambú. Pesce alla griglia, menù del giorno, terrazza coperta.", maps:"Sa+Caleta+Son+Bou+Menorca" },
      { name:"Cova d'en Xoroi (drink, non cena)", zona:"Cala en Porter", prezzo:"€€", stelle:"★★★★☆", note:"Bar nelle grotte a strapiombo. Cocktail e snack, non cena vera. Andateci alle 16:30 quando apre, per ~1h.", maps:"Cova+d+en+Xoroi+Cala+en+Porter+Menorca" }
    ]
  },
  { // G6 - Cavalleria / Relax
    farmacie:[
      { name:"Farmacia Mercadal", dist:"10 min da Son Parc", orario:"Lun-Sab 9:00-13:30 / 17:00-20:30", maps:"Farmacia+Es+Mercadal+Menorca", note:"Riferimento principale per la zona nord. Con tramontana e giornata relax, comoda da raggiungere." },
      { name:"Farmacia Fornells", dist:"10 min", orario:"Lun-Sab 9:00-13:00", maps:"Farmacia+Fornells+Menorca", note:"Se sei a Fornells per l'aperitivo serale." }
    ],
    supermercati:[
      { name:"Eroski Mercadal", dist:"10 min", orario:"Lun-Sab 9:00-21:00", maps:"Eroski+Es+Mercadal+Menorca", note:"Rifornimento di metà settimana — acqua, frutta, colazione per gli ultimi giorni.", top:true }
    ],
    ristoranti:[
      { name:"Es Cranc", zona:"Fornells", prezzo:"€€€", stelle:"★★★★★", note:"Se non ci sei ancora andato, questa è l'ultima occasione! Con giornata relax hai tutto il tempo per una cena lunga.", maps:"Es+Cranc+Fornells+Menorca" },
      { name:"Sa Llagosta", zona:"Fornells", prezzo:"€€€", stelle:"★★★★☆", note:"Alternativa storica. Aragosta e pesce fresco in un ambiente elegante ma familiare.", maps:"Sa+Llagosta+Fornells+Menorca" },
      { name:"Bar Binimel·là", zona:"Binimel·là (solo con calma)", prezzo:"€", stelle:"★★★☆☆", note:"Piccolo bar sulla spiaggia selvaggia. Panini e bibite. Aperto non sempre — porta pranzo al sacco come backup.", maps:"Bar+Binimel+la+Menorca" }
    ]
  },
  { // G7 - Ciutadella
    farmacie:[
      { name:"Farmacia Ciutadella Centro", dist:"Centro città", orario:"Lun-Sab 9:00-21:00", maps:"Farmacia+Ciutadella+Menorca", note:"Più farmacie nel centro di Ciutadella. Quella in Carrer Maó è la più centrale." },
      { name:"Farmacia Ferreries (ritorno)", dist:"30 min da Ciutadella", orario:"Lun-Ven 9:00-13:30", maps:"Farmacia+Ferreries+Menorca", note:"Sulla strada del ritorno verso Son Parc." }
    ],
    supermercati:[
      { name:"Eroski Ciutadella", dist:"Periferia Ciutadella", orario:"Lun-Sab 9:00-21:00", maps:"Eroski+Ciutadella+Menorca", note:"Fermati qui per fare l'ultima grande spesa della settimana — souvenir alimentari inclusi.", top:true },
      { name:"Mercado Municipal Ciutadella", dist:"Centro città", orario:"Lun-Sab 8:00-14:00", maps:"Mercado+Municipal+Ciutadella+Menorca", note:"Mercato coperto con prodotti freschi locali. Ottimo per comprare formaggio Mahón e prodotti tipici." }
    ],
    ristoranti:[
      { name:"Sa Clau", zona:"Ciutadella", prezzo:"€€€", stelle:"★★★★★", note:"Cucina minorchina d'autore. Uno dei migliori dell'isola. Atmosfera romantica in un vicolo medievale. Prenota.", maps:"Sa+Clau+Ciutadella+Menorca" },
      { name:"Cas Ferrer de sa Font", zona:"Ciutadella", prezzo:"€€€", stelle:"★★★★★", note:"In un palazzo del '700 restaurato. Cucina creativa e locale. Menù degustazione eccellente. Prenota con anticipo.", maps:"Cas+Ferrer+de+sa+Font+Ciutadella+Menorca" },
      { name:"Sul Porto — Bar Tritón", zona:"Porto Ciutadella", prezzo:"€€", stelle:"★★★★☆", note:"Direttamente sull'acqua nel porto incassato. Tapas, pesce, atmosphere rilassata. Ideale con Bubi — spazio all'aperto.", maps:"Bar+Triton+Port+Ciutadella+Menorca" }
    ]
  },
  { // G8 - Partenza
    farmacie:[
      { name:"Farmacia Aeroporto Maó", dist:"Aeroporto", orario:"Orari voli", maps:"Farmacia+Aeroport+Menorca", note:"Se ti manca qualcosa all'ultimo momento." },
      { name:"Farmacia Mercadal", dist:"10 min da Son Parc", orario:"Lun-Sab 9:00-13:30", maps:"Farmacia+Es+Mercadal+Menorca", note:"Ultima possibilità prima di partire per acquistare prodotti difficili da trovare in Italia." }
    ],
    supermercati:[
      { name:"Eroski Mercadal", dist:"10 min, sulla strada per Maó", orario:"Lun-Sab 9:00-21:00", maps:"Eroski+Es+Mercadal+Menorca", note:"Ultima tappa per comprare souvenir alimentari: formaggio Mahón DOP, gin Xoriguer, sobrassada, ensaïmades.", top:true }
    ],
    ristoranti:[
      { name:"Colazione in hotel", zona:"Son Parc", prezzo:"€", stelle:"★★★★☆", note:"Goditela con calma — è l'ultima mattina!", maps:"Son+Parc+Menorca" },
      { name:"Gelateria Fornells", zona:"Fornells (10 min)", prezzo:"€", stelle:"★★★★☆", note:"Ultimo gelato a Minorca prima del volo. 10 min dall'hotel, sulla strada per l'aeroporto. Merita la deviazione.", maps:"Gelateria+Fornells+Menorca" },
      { name:"Bar Aeroporto Maó", zona:"Aeroporto", prezzo:"€€", stelle:"★★★☆☆", note:"Per un ultimo caffè e brioche minorchina prima del volo. Prezzi aeroportuali ma la brioche con formaggio è autentica.", maps:"Aeropuerto+Menorca+bar" }
    ]
  }
];


// ─── STATE ───────────────────────────────────────────────
// v3.1: aggiungo favorites (cuori), notes (textarea per giornata),
// today auto-detection, pre-trip checklist separata.
const TRIP_START = new Date(2026, 5, 4);  // 4 Giu 2026 (mese è 0-indexed)
const TRIP_END   = new Date(2026, 5, 11); // 11 Giu 2026
function getTripDayIndex(){
  const today = new Date();
  today.setHours(0,0,0,0);
  const start = new Date(TRIP_START); start.setHours(0,0,0,0);
  const end = new Date(TRIP_END); end.setHours(0,0,0,0);
  if (today < start) return -1;          // pre-viaggio
  if (today > end)   return -2;          // post-viaggio
  const diff = Math.round((today - start) / (1000*60*60*24));
  return Math.max(0, Math.min(7, diff)); // 0..7 = slot del giorno corrente
}
const S = {
  tab:'itinerary',
  day: (function(){ const i = getTripDayIndex(); return i >= 0 ? i : 0; })(),
  bfilter:'all',
  windPerDay: loadWind(),
  checks: loadChecks(),
  preChecks: loadPreChecks(),
  dayOrder: loadDayOrder(),
  showSwap: false,
  favs: loadFavs(),
  notes: loadNotes(),
  checkTab: undefined, // v3.1: 'pre' | 'daily' — auto-set in renderChecklist
  dayDetailIdx: null,  // v20: indice DAYS originale del giorno aperto in dettaglio (null = chiuso)
  mode: loadMode(),     // v3.2: 'relax' | 'full' — intensità della giornata
  // v4 — Piano Meteo: 'good' (default), 'half-rain', 'full-rain' per ogni slot 0..7
  weatherPerDay: loadWeather(),
  // v4 — Storia degli scambi auto, per banner undo
  swapHistory: loadSwapHistory(),
  // v4 — Overlay sottopagina Piano Meteo (riferimento statico)
  weatherDetailOpen: false,
  // v4 — Quando l'utente apre il picker meteo, è lo slot del giorno corrente
  weatherPicker: null
};
function loadChecks(){ try{const s=localStorage.getItem('mnc_checks');if(s){const a=JSON.parse(s);if(a.length===ALL_ITEMS.length)return a;}}catch(e){} return ALL_ITEMS.map(()=>false); }
function saveChecks(){ try{localStorage.setItem('mnc_checks',JSON.stringify(S.checks));}catch(e){} }
function loadPreChecks(){ try{const s=localStorage.getItem('mnc_pre_checks');if(s){const a=JSON.parse(s);if(a.length===PRE_TRIP_ITEMS.length)return a;}}catch(e){} return PRE_TRIP_ITEMS.map(()=>false); }
function savePreChecks(){ try{localStorage.setItem('mnc_pre_checks',JSON.stringify(S.preChecks));}catch(e){} }
function loadWind(){ try{const s=localStorage.getItem('mnc_wind');if(s){const a=JSON.parse(s);if(a.length===8)return a;}}catch(e){} return DAYS.map(()=>'none'); }
function saveWind(){ try{localStorage.setItem('mnc_wind',JSON.stringify(S.windPerDay));}catch(e){} }
// v4 — Piano Meteo state
function loadWeather(){ try{const s=localStorage.getItem('mnc_weather');if(s){const a=JSON.parse(s);if(a.length===8)return a;}}catch(e){} return DAYS.map(()=>'good'); }
function saveWeather(){ try{localStorage.setItem('mnc_weather',JSON.stringify(S.weatherPerDay));}catch(e){} }
function loadSwapHistory(){ try{const s=localStorage.getItem('mnc_swaphistory');if(s){const a=JSON.parse(s);if(Array.isArray(a))return a;}}catch(e){} return []; }
function saveSwapHistory(){ try{localStorage.setItem('mnc_swaphistory',JSON.stringify(S.swapHistory));}catch(e){} }
function loadDayOrder(){ try{const s=localStorage.getItem('mnc_order');if(s){const a=JSON.parse(s);if(a.length===8)return a;}}catch(e){} return DAYS.map((_,i)=>i); }
function saveDayOrder(){ try{localStorage.setItem('mnc_order',JSON.stringify(S.dayOrder));}catch(e){} }
function loadFavs(){ try{const s=localStorage.getItem('mnc_favs');if(s){return JSON.parse(s);}}catch(e){} return {}; }
function saveFavs(){ try{localStorage.setItem('mnc_favs',JSON.stringify(S.favs));}catch(e){} }
function loadNotes(){ try{const s=localStorage.getItem('mnc_notes');if(s){return JSON.parse(s);}}catch(e){} return {}; }
function saveNotes(){ try{localStorage.setItem('mnc_notes',JSON.stringify(S.notes));}catch(e){} }
// v3.2: modalità Pieno/Relax — preserva ciò che esiste, modula solo il dettaglio.
function loadMode(){ try{const v=localStorage.getItem('mnc_mode'); if(v==='full'||v==='relax') return v;}catch(e){} return 'relax'; }
function saveMode(){ try{localStorage.setItem('mnc_mode',S.mode);}catch(e){} }
function setMode(v){ if(v!=='relax'&&v!=='full') return; S.mode=v; saveMode(); render(); }
function set(u){ Object.assign(S,u); if('checks' in u) saveChecks(); if('preChecks' in u) savePreChecks(); render(); }
function setWind(i,v){ const w=[...S.windPerDay]; w[i]=v; S.windPerDay=w; saveWind(); render(); }
function swapDays(i,j){ const o=[...S.dayOrder]; const tmp=o[i]; o[i]=o[j]; o[j]=tmp; S.dayOrder=o; saveDayOrder(); set({showSwap:false}); }
function resetOrder(){ S.dayOrder=DAYS.map((_,i)=>i); saveDayOrder(); set({showSwap:false}); }

// ═══════════════════════════════════════════════════════════════════════
// v4 — PIANO METEO (Weather Plan)
// Sistema di adattamento del programma al maltempo. Per ogni "slot" (0..7) del
// viaggio si può impostare uno stato meteo. Quando si imposta 'full-rain' su
// uno slot sensibile, il sistema auto-scambia con un giorno "jolly" disponibile,
// con possibilità di annullare via banner. La pagina di riferimento Piano Meteo
// (overlay) spiega resilienza dei giorni e kit pioggia universali.
// ═══════════════════════════════════════════════════════════════════════

// Resilienza dei giorni — indicizzata per posizione originale in DAYS[].
// tag: 'jolly' | 'wind' | 'med' | 'high' | 'flex'
const DAY_RESILIENCE = [
  { tag:'flex',  label:'Flessibile',       em:'🔄' },  // G1 Arrivo
  { tag:'flex',  label:'Comprimibile',     em:'🔄' },  // G2 Arenal
  { tag:'med',   label:'Medio',            em:'🟡' },  // G3 Es Grau & s'Albufera
  { tag:'wind',  label:'Anti-tramontana',  em:'🌬️' }, // G4 Cala Galdana
  { tag:'med',   label:'Medio',            em:'🟡' },  // G5 Son Bou & Cova d'en Xoroi
  { tag:'high',  label:'Sensibile',        em:'⚠️' }, // G6 Cavalleria
  { tag:'jolly', label:'Jolly',            em:'☂️' }, // G7 Ciutadella & Monte Toro
  { tag:'flex',  label:'Flessibile',       em:'🔄' }   // G8 Partenza
];

// Stati meteo possibili per giorno
const WEATHER_STATES = {
  'good':       { em:'',    label:'Sereno',                short:'',         color:'transparent' },
  'half-rain':  { em:'⛅',  label:'Pioggia mezza giornata', short:'½ pioggia', color:'#DBEAFE' },
  'full-rain':  { em:'☔',  label:'Pioggia tutto il giorno',short:'Pioggia',   color:'#EDE9FE' }
};

// Imposta lo stato meteo per uno slot e applica eventuale scambio automatico.
// idx = posizione nello S.dayOrder (slot 0..7), non l'indice DAYS originale.
function setWeather(idx, value){
  if (!(value in WEATHER_STATES)) return;
  const prev = S.weatherPerDay[idx];
  const newWeather = [...S.weatherPerDay];
  newWeather[idx] = value;
  S.weatherPerDay = newWeather;
  saveWeather();
  S.weatherPicker = null;

  // Auto-swap solo se 'full-rain' su giorno sensibile/medio
  // E solo se non era già stato impostato (evita scambi ripetuti)
  if (value === 'full-rain' && prev !== 'full-rain') {
    const dayIdx = S.dayOrder[idx];
    const res = DAY_RESILIENCE[dayIdx];
    if (res && (res.tag === 'high' || res.tag === 'med')) {
      // Cerca uno slot "jolly" libero (con meteo 'good') diverso da questo
      const jollySlot = S.dayOrder.findIndex((dIdx, slotIdx) =>
        slotIdx !== idx &&
        DAY_RESILIENCE[dIdx] && DAY_RESILIENCE[dIdx].tag === 'jolly' &&
        S.weatherPerDay[slotIdx] === 'good'
      );
      if (jollySlot >= 0) {
        // Applica lo scambio
        const newOrder = [...S.dayOrder];
        const tmp = newOrder[idx];
        newOrder[idx] = newOrder[jollySlot];
        newOrder[jollySlot] = tmp;
        S.dayOrder = newOrder;
        saveDayOrder();
        // Salva in history per undo (mantieni solo gli ultimi 5)
        const fromTitle = DAYS[tmp].title;
        const toTitle = DAYS[newOrder[idx]].title;
        S.swapHistory = [...S.swapHistory, {
          ts: Date.now(),
          slotA: idx,
          slotB: jollySlot,
          fromTitle: fromTitle,
          toTitle: toTitle
        }].slice(-5);
        saveSwapHistory();
      }
    }
  }
  render();
}

// Annulla l'ultimo scambio automatico
function undoLastSwap(){
  if (!S.swapHistory || !S.swapHistory.length) return;
  const last = S.swapHistory[S.swapHistory.length - 1];
  // Riapplica lo scambio inverso
  const newOrder = [...S.dayOrder];
  const tmp = newOrder[last.slotA];
  newOrder[last.slotA] = newOrder[last.slotB];
  newOrder[last.slotB] = tmp;
  S.dayOrder = newOrder;
  saveDayOrder();
  // Reset meteo dello slot che aveva triggerato lo scambio
  const newWeather = [...S.weatherPerDay];
  newWeather[last.slotA] = 'good';
  S.weatherPerDay = newWeather;
  saveWeather();
  // Rimuovi entry
  S.swapHistory = S.swapHistory.slice(0, -1);
  saveSwapHistory();
  render();
}

// Apri/chiudi la sottopagina Piano Meteo (riferimento)
function openWeatherDetail(){
  S.weatherDetailOpen = true;
  if (location.hash !== '#piano-meteo') {
    history.pushState({wd:1}, '', '#piano-meteo');
  }
  render();
  setTimeout(()=>window.scrollTo({top:0, behavior:'instant'}), 0);
}
function closeWeatherDetail(fromPop){
  if (!fromPop && location.hash === '#piano-meteo') {
    history.back();
    return;
  }
  S.weatherDetailOpen = false;
  if (location.hash === '#piano-meteo') {
    history.replaceState({}, '', location.pathname + location.search);
  }
  render();
}

// Apri/chiudi il picker meteo per uno specifico slot
function openWeatherPicker(slotIdx){
  S.weatherPicker = slotIdx;
  render();
}
function closeWeatherPicker(){
  S.weatherPicker = null;
  render();
}
function toggleFav(key){
  const f={...S.favs};
  if(f[key]) delete f[key]; else f[key]=true;
  S.favs=f; saveFavs(); render();
}
function saveNote(idx, text){
  const n={...S.notes};
  if(text && text.trim()) n[idx]=text.trim();
  else delete n[idx];
  S.notes=n; saveNotes();
  // Non rifaccio render qui: la textarea perderebbe il focus
}
// Debounced input handler per la textarea note: salva 500ms dopo l'ultimo
// carattere e mostra il feedback "Salvato" per 1.2s.
let _noteSaveTimer = null;
function onNoteInput(idx, el){
  if (_noteSaveTimer) clearTimeout(_noteSaveTimer);
  _noteSaveTimer = setTimeout(() => {
    saveNote(idx, el.value);
    const saved = document.getElementById('dd-note-saved-'+idx);
    if (saved) {
      saved.classList.add('show');
      setTimeout(() => saved.classList.remove('show'), 1200);
    }
  }, 500);
}

// ─── DAY DETAIL navigation (v20) ──────────────────────────
// Apre il dettaglio del giorno e spinge un nuovo stato in cronologia,
// così il tasto indietro del browser/telefono lo richiude naturalmente.
function openDayDetail(idx){
  S.dayDetailIdx = idx;
  const dayN = DAYS[idx].n;
  if (location.hash !== '#giorno-'+dayN) {
    history.pushState({dd:idx}, '', '#giorno-'+dayN);
  }
  render();
  // riporta lo scroll all'inizio dell'overlay
  setTimeout(()=>window.scrollTo({top:0, behavior:'instant'}), 0);
}
function closeDayDetail(fromPop){
  // Se chiamato dall'utente (non da popstate) e l'hash riflette il dettaglio aperto,
  // fai un history.back(): sarà popstate a chiudere e a chiamare render.
  // NB: NON azzerare S.dayDetailIdx qui prima — altrimenti popstate vedrà già
  // lo stato a null e salterà il render (bug: serviva un secondo tap).
  if (!fromPop && location.hash.startsWith('#giorno-')) {
    history.back();
    return;
  }
  S.dayDetailIdx = null;
  if (location.hash.startsWith('#giorno-')) {
    history.replaceState({}, '', location.pathname + location.search);
  }
  render();
}
window.addEventListener('popstate', () => {
  // v4: chiusura overlay Piano Meteo se l'hash non è più #piano-meteo
  if (S.weatherDetailOpen && location.hash !== '#piano-meteo') {
    S.weatherDetailOpen = false;
    render();
    return;
  }
  // Se l'hash non è più di tipo #giorno-N, chiudi il dettaglio
  if (!location.hash.startsWith('#giorno-')) {
    if (S.dayDetailIdx !== null) { S.dayDetailIdx = null; render(); }
  } else {
    const m = location.hash.match(/^#giorno-(\d+)$/);
    if (m) {
      const n = parseInt(m[1], 10);
      const idx = DAYS.findIndex(d => d.n === n);
      if (idx >= 0 && S.dayDetailIdx !== idx) { S.dayDetailIdx = idx; render(); }
    }
  }
});

// ─── HELPERS ──────────────────────────────────────────────
function stars(n,max=5){ let s=''; for(let i=0;i<max;i++) s+=`<span class="star${i<n?'':' e'}">★</span>`; return s; }
function badge(t,bg='#E0F2FE',c='#0369A1'){ return `<span class="badge" style="background:${bg};color:${c}">${t}</span>`; }
function mapsUrl(q){ return `https://www.google.com/maps/search/?api=1&query=${q}`; }
function getActivePlan(d){
  const wind=S.windPerDay[S.day];
  // Vento da nord: i giorni esposti a nord (non protetti) cambiano piano
  if(wind==='north' && !d.protected && d.windNorthPlan) return {plan:d.windNorthPlan,isModified:true};
  // Vento da sud: i giorni sulla costa sud cambiano piano (raro a giugno)
  if(wind==='south' && d.coast==='south' && d.windSouthPlan) return {plan:d.windSouthPlan,isModified:true};
  return {plan:d.plan,isModified:false};
}

// ─── RENDER ───────────────────────────────────────────────
function renderHeader(){
  const tripIdx = getTripDayIndex();
  let eyebrow = 'Son Parc · Giu 2026';

  // Eyebrow: dipende dalla fase del viaggio
  if (tripIdx === -1) {
    const today = new Date(); today.setHours(0,0,0,0);
    const start = new Date(TRIP_START); start.setHours(0,0,0,0);
    const days = Math.round((start - today) / (1000*60*60*24));
    eyebrow = `Son Parc · ${days===1?'Domani':days+' giorni'} alla partenza`;
  } else if (tripIdx === -2) {
    eyebrow = 'Son Parc · Giugno 2026';
  } else {
    const dayN = DAYS[S.dayOrder[tripIdx]].n;
    eyebrow = `Son Parc · Oggi è il giorno ${dayN}/8`;
  }

  // Badge: fix v3.3 — un solo significato coerente su TUTTE le sezioni, guidato
  // da S.checkTab (che l'utente cambia dalla sezione Check). Default time-based:
  // pre-partenza prima del viaggio, giornaliera durante. Post-viaggio mostra
  // "Bentornati" indipendentemente.
  if (S.checkTab === undefined) {
    S.checkTab = (tripIdx === -1) ? 'pre' : 'daily';
  }

  let badge;
  if (tripIdx === -2) {
    badge = `<div class="hdr-badge" style="background:var(--coral-soft);color:var(--coral-deep);border-color:rgba(255,107,71,.25)">${ICO.heart} Bentornati</div>`;
  } else if (S.checkTab === 'daily') {
    const d = S.checks.filter(Boolean).length, t = S.checks.length;
    const p = Math.round((d/t)*100);
    if (tripIdx >= 0) {
      const dayN = DAYS[S.dayOrder[tripIdx]].n;
      badge = `<div class="hdr-badge">G${dayN} · ${p}%</div>`;
    } else {
      badge = `<div class="hdr-badge">Oggi · ${p}%</div>`;
    }
  } else {
    const d = S.preChecks.filter(Boolean).length;
    const p = Math.round((d / PRE_TRIP_ITEMS.length) * 100);
    badge = `<div class="hdr-badge">${p}% pronto</div>`;
  }

  return `<div class="hdr">
    <div class="hdr-left">
      <div class="hdr-avatar">🏝️</div>
      <div>
        <div class="hdr-eyebrow">${eyebrow}</div>
        <div class="hdr-title"><em>Minorca</em> in Famiglia</div>
      </div>
    </div>
    ${badge}
  </div>`;
}

function renderNav(){
  const icons={
    itinerary:`<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke-linecap="round"/></svg>`,
    beaches:`<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12a10 10 0 0 0-20 0Z"/><path d="M12 12v7a2 2 0 0 0 4 0"/><path d="M12 2v1"/></svg>`,
    flights:`<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 21 4s-2 0-3.5 1.5L14 9 5.8 7.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 1 1 3 1-1v-3l3-2 3.5 3.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    tips:`<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><path d="M12 2a7 7 0 015 11.95V17a2 2 0 01-2 2H9a2 2 0 01-2-2v-3.05A7 7 0 0112 2z" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 21h6" stroke-linecap="round"/></svg>`,
    checklist:`<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  };
  const tabs=[
    ['itinerary','Itinerario'],
    ['beaches','Spiagge'],
    ['flights','Voli'],
    ['tips','Consigli'],
    ['checklist','Check']
  ];
  return `<nav class="nav">${tabs.map(([id,lbl])=>`
    <button class="nbtn${S.tab===id?' on':''}" onclick="set({tab:'${id}'})">
      <span class="nbtn-ico">${icons[id]}</span>
      <span class="nbtn-lbl">${lbl}</span>
    </button>`).join('')}</nav>`;
}

function renderItinerary(){
  const slot=S.day;
  const contentIdx=S.dayOrder[slot];
  const d=DAYS[contentIdx];
  const calDate=CALENDAR_DATES[slot];
  const isSwapped=(contentIdx!==slot);
  const isLocked=(slot===0||slot===7);
  const wind=S.windPerDay[slot];
  const {plan,isModified}=getActivePlan(d);
  const hdrClass=(d.protected||wind==='none'||wind==='south')?'calm':wind;
  const heroImg=DAY_IMG[contentIdx];

  // v33: Day chips with single unified "modified" indicator (was 2 dots)
  const dayBtns=DAYS.map((day,i)=>{
    const w=S.windPerDay[i];
    const ci=S.dayOrder[i];
    const swapped=(ci!==i);
    const hasWind=(w==='north'||w==='south');
    const isMod=(swapped||hasWind);
    const dd=DAYS[ci];
    return `<button class="dchip${S.day===i?' on':''}" onclick="set({day:${i},showSwap:false})">
      <span class="dchip-g">G${day.n}</span>
      <span class="dchip-d">${CALENDAR_DATES[i].split(' ')[0]}</span>
      <span class="dchip-dots">
        <span class="dot${isMod?' mod':''}"></span>
      </span>
    </button>`;
  }).join('');

  const anyMod = S.windPerDay.some(w=>w!=='none') || S.dayOrder.some((v,i)=>v!==i);

  // Banner — feedback contestuale chiaro su vento e meta (logica conservata)
  let bannerHtml='';
  if(isModified && wind==='north') bannerHtml=`<div class="banner north">${ICO.wind} Itinerario adattato per la tramontana</div>`;
  else if(isModified && wind==='south') bannerHtml=`<div class="banner south">${ICO.wind} Itinerario adattato per il vento da sud</div>`;
  else if(wind==='north' && d.protected) bannerHtml=`<div class="banner ok">${ICO.check} Meta protetta dalla tramontana</div>`;
  else if(wind==='north' && d.coast==='south') bannerHtml=`<div class="banner ok">${ICO.check} Costa sud: ideale con tramontana</div>`;
  else if(wind==='south' && d.coast==='north') bannerHtml=`<div class="banner ok">${ICO.check} Costa nord: ideale con vento da sud</div>`;
  else if(wind==='south' && d.coast==='inland') bannerHtml=`<div class="banner ok">${ICO.check} Entroterra: il vento non disturba</div>`;
  else if(wind==='south') bannerHtml=`<div class="banner info">${ICO.wind} Vento da sud — meglio le coste a nord</div>`;
  else if(wind==='north') bannerHtml=`<div class="banner info">${ICO.wind} Tramontana — meglio il sud o l'entroterra</div>`;
  else bannerHtml=`<div class="banner ok">${ICO.sun} Tempo calmo — piano originale</div>`;

  // v33: Compact swap toggle + panel — replaces the heavy swap-card.
  // Vento resta sempre visibile (uso quotidiano); swap è collassato (uso strategico).
  let swapHtml='';
  if(!isLocked){
    const anySwap=S.dayOrder.some((v,i)=>v!==i);
    let gridBtns='';
    for(let i=0;i<8;i++){
      if(i===0||i===7){ gridBtns+=`<button class="swap-day-btn locked" disabled>🔒 G${DAYS[i].n}</button>`; continue; }
      const dd=DAYS[S.dayOrder[i]];
      const isCurr=(i===slot);
      const onclick=isCurr?'':'swapDays('+slot+','+i+')';
      gridBtns+=`<button class="swap-day-btn${isCurr?' current':''}" onclick="${onclick}">${dd.emoji} G${DAYS[i].n}<br><span style="font-size:9px">${CALENDAR_DATES[i].split(' ')[0]}</span></button>`;
    }
    const toggleLabel = isSwapped ? 'Giorno spostato — modifica scambio' : 'Scambia con un altro giorno';
    swapHtml=`
      <button class="adapt-toggle${S.showSwap?' open':''}" onclick="set({showSwap:${!S.showSwap}})">
        ${ICO.swap}<span>${toggleLabel}</span>
        <span class="adapt-toggle-chevron">${S.showSwap?ICO.close:ICO.arrow}</span>
      </button>
      ${S.showSwap?`<div class="adapt-panel">
        <div class="swap-grid">${gridBtns}</div>
        ${anySwap?`<div class="swap-reset-row"><button class="swap-reset-btn" onclick="resetOrder()">Ripristina ordine originale</button></div>`:''}
      </div>`:''}`;
  }

  const stops=plan.stops.map((s,idx)=>{
    const stopKey=STOP_IMG[s.name]||DAY_IMG[contentIdx];
    return `
    <div class="stop${isModified?' alt':''}">
      <div class="stop-img-wrap">
        ${imgTag(stopKey, 'stop-img', s.name)}
        <span class="stop-num">${idx+1}</span>
        <div class="stop-img-name">${ICO.pin}<span>${s.name}</span></div>
      </div>
      <div class="stop-content">
        <div class="stop-logistics">
          <span>${ICO.car}${s.drive}</span>
          ${s.parking&&s.parking!=='—'?`<span>${ICO.parking}${s.parking}</span>`:''}
        </div>
      </div>
    </div>`;
  }).join('');

  const tagLabel=hdrClass==='calm'?(ICO.sun+' Calmo'):hdrClass==='north'?(ICO.wind+' Tramontana'):(ICO.wind+' Vento sud');

  return `
    <!-- v33: Mode strip globale, slim, in cima — fuori dalla card del giorno -->
    <div class="mode-strip">
      <span class="mode-strip-lbl">Ritmo</span>
      <div class="mode-strip-btns">
        <button class="msbtn${S.mode==='relax'?' on relax':''}" onclick="setMode('relax')">🌿 Relax</button>
        <button class="msbtn${S.mode==='full'?' on full':''}" onclick="setMode('full')">✦ Esteso</button>
      </div>
    </div>

    <div class="dpick">${dayBtns}</div>
    ${anyMod ? `<div class="dpick-legend"><span class="dpick-legend-item"><span class="dpick-legend-dot mod"></span>Giornata modificata (vento o ordine)</span></div>` : ''}

    <div class="day-card">
      <div class="day-hero">
        ${imgTag(heroImg, 'day-hero-img', d.title)}
        <button class="day-hero-fav${S.favs['day_'+contentIdx]?' on':''}" onclick="event.stopPropagation();toggleFav('day_${contentIdx}')" aria-label="Aggiungi ai preferiti">${ICO.heart}</button>
        <div class="day-hero-content">
          <div class="day-hero-meta">
            <span class="day-hero-date">${calDate}${isSwapped?` · prog. ${CALENDAR_DATES[contentIdx].split(' ')[0]}`:''}</span>
            <span class="day-hero-tag ${hdrClass}">${tagLabel}</span>
          </div>
          <div class="day-hero-title">${d.title}</div>
          <div class="day-hero-mood">${d.mood}</div>
        </div>
      </div>

      <div class="day-info">
        <!-- v33: pill-row alleggerita — solo essenziali (orario partenza, kid-rating, alba/tramonto). Modalità è fuori, folla va nel dettaglio. -->
        <div class="pill-row">
          <span class="pill gold">${ICO.clock}${d.departure}</span>
          <span class="pill">${ICO.baby}${stars(d.toddler)} per bimbi</span>
          ${d.sunrise && d.sunset ? `<span class="pill">${ICO.sun}${d.sunrise} – ${d.sunset}</span>` : ''}
          ${(() => {
            // v4 — pill meteo del giorno (sempre visibile, cliccabile per aprire picker)
            const w = S.weatherPerDay[slot] || 'good';
            const st = WEATHER_STATES[w];
            const isActive = w !== 'good';
            const cls = `day-weather-pill${isActive?' active '+w:''}`;
            const label = isActive
              ? `<span class="em">${st.em}</span>${st.short}`
              : `<span class="em">🌦️</span><span class="lbl-default">Meteo</span>`;
            return `<button class="${cls}" onclick="openWeatherPicker(${slot})" aria-label="Imposta meteo del giorno">${label}</button>`;
          })()}
        </div>

        <!-- Vento di oggi: resta visibile perché è il controllo tattico quotidiano -->
        <div class="wind-card">
          <div class="wind-card-head">
            <span class="wind-card-lbl">${ICO.wind} Vento di oggi</span>
            <a class="wind-card-link" href="https://www.windfinder.com/#10/39.954/4.139/spot" target="_blank" rel="noopener noreferrer" aria-label="Apri Windfinder centrato su Minorca">
              ${ICO.ext}<span>Verifica</span>
            </a>
          </div>
          <div class="wind-btns">
            ${(() => {
              const northActive = !d.protected && !!d.windNorthPlan;
              const southActive = d.coast === 'south' && !!d.windSouthPlan;
              const nClass = northActive ? '' : ' disabled';
              const sClass = southActive ? '' : ' disabled';
              const nTitle = northActive ? '' : 'title="Oggi il programma non cambia con la tramontana"';
              const sTitle = southActive ? '' : 'title="Oggi il programma non cambia con vento da sud"';
              const nClick = northActive ? `onclick="setWind(${slot},'north')"` : '';
              const sClick = southActive ? `onclick="setWind(${slot},'south')"` : '';
              return `
                <button class="wbtn${wind==='none'?' on calm':''}" onclick="setWind(${slot},'none')">${ICO.sun} Calmo</button>
                <button class="wbtn${wind==='north'?' on north':''}${nClass}" ${nClick} ${nTitle}>${ICO.wind} Nord</button>
                <button class="wbtn${wind==='south'?' on south':''}${sClass}" ${sClick} ${sTitle}>${ICO.wind} Sud</button>
              `;
            })()}
          </div>
        </div>

        ${swapHtml}

        <button class="explore-cta" onclick="openDayDetail(${contentIdx})" aria-label="Esplora la giornata in dettaglio">
          <span class="explore-cta-l">
            <span class="explore-cta-ico">${ICO.compass}</span>
            <span class="explore-cta-txt">
              <span class="explore-cta-title">Esplora la giornata</span>
              <span class="explore-cta-sub">Cosa vedere, attività, prenotazioni e orari</span>
            </span>
          </span>
          <span class="explore-cta-arrow">${ICO.arrow}</span>
        </button>
      </div>

      ${bannerHtml}

      <div class="day-body">
        <div class="sec-label">${ICO.sun}<span>${plan.label.replace(/^[☀️💨]\s*/,'')}</span></div>
        ${stops}
        <div class="resto-block">
          <div class="resto-icon">${ICO.fork}</div>
          <div class="resto-text">
            <div class="resto-name">${plan.restaurant.name}</div>
            <div class="resto-note">${plan.restaurant.note}</div>
          </div>
        </div>
      </div>
    </div>`;
}

// ─── DAY DETAIL render (v20) ───────────────────────────────────────────────

// v21: helper per fondere SERVICES dentro il dettaglio del giorno.
// SERVICES diventa la fonte canonica per farmacie, supermercati e per i dati
// strutturati dei ristoranti (prezzi €€/€€€, stelle ★, zona).
function _eatItemFromService(r){
  // Costruisce un item della vista dettaglio a partire da un ristorante di SERVICES.
  const meta = [];
  if (r.prezzo) meta.push({ico: ICO.euro, text: r.prezzo});
  if (r.zona)   meta.push({ico: ICO.pin,  text: r.zona});
  if (r.stelle) meta.push({ico: ICO.star, text: r.stelle});
  return {
    name: r.name,
    meta: meta,
    desc: r.note,
    actions: [
      {kind:'book', label:"Prenota", url: searchUrl(r.name + " " + (r.zona||'') + " Menorca prenotazione")},
      {kind:'map',  label:"Mappa",   url: mapsUrl(r.maps)}
    ]
  };
}
function _farmaciaItem(f){
  return {
    name: f.name,
    meta: [
      {ico: ICO.car,   text: f.dist},
      {ico: ICO.clock, text: f.orario}
    ],
    desc: f.note,
    actions: [
      {kind:'map', label:"Naviga", url: mapsUrl(f.maps)}
    ]
  };
}
function _superItem(s){
  return {
    name: s.name,
    tag: s.top ? "CONSIGLIATO" : null,
    tagKind: s.top ? "tip" : null,
    meta: [
      {ico: ICO.car,   text: s.dist},
      {ico: ICO.clock, text: s.orario}
    ],
    desc: s.note,
    actions: [
      {kind:'map', label:"Naviga", url: mapsUrl(s.maps)}
    ]
  };
}

// Fonde curated (DAY_DETAILS) + canonical (SERVICES.ristoranti) per il giorno idx.
// Regola: se il nome del ristorante curato compare nei SERVICES, lo arricchisco con
// prezzo/stelle/zona. I ristoranti SERVICES non già curati vengono aggiunti in coda.
// Le voci curate che non sono ristoranti (gelaterie, "pranzo al sacco", ...) restano.
function _mergeEatItems(curatedItems, serviceRistoranti){
  const result = [];
  const consumed = new Set();   // indici di serviceRistoranti già usati
  const norm = s => (s||'').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

  curatedItems.forEach(it => {
    const nameKey = norm(it.name).split('—')[0];
    let matched = -1;
    serviceRistoranti.forEach((r, idx) => {
      if (consumed.has(idx)) return;
      const rKey = norm(r.name);
      // Match se il nome del ristorante SERVICES è contenuto nel nome curato o viceversa
      if (rKey.length >= 4 && (nameKey.includes(rKey) || rKey.includes(nameKey.slice(0, Math.min(nameKey.length, 18))))) {
        matched = idx;
      }
    });
    if (matched >= 0) {
      consumed.add(matched);
      const r = serviceRistoranti[matched];
      // Arricchisco l'item curato con i dati strutturati di SERVICES
      const enrichedMeta = [...(it.meta||[])];
      const hasEuro = enrichedMeta.some(m => m.text && m.text.includes('€'));
      if (!hasEuro && r.prezzo) enrichedMeta.unshift({ico: ICO.euro, text: r.prezzo});
      const hasStar = enrichedMeta.some(m => m.ico === ICO.star);
      if (!hasStar && r.stelle) enrichedMeta.push({ico: ICO.star, text: r.stelle});
      result.push({...it, meta: enrichedMeta});
    } else {
      result.push(it);
    }
  });

  // Aggiungo i ristoranti SERVICES non ancora consumati
  serviceRistoranti.forEach((r, idx) => {
    if (!consumed.has(idx)) result.push(_eatItemFromService(r));
  });

  return result;
}

function renderDayDetailItem(it){
  // v3.2: due tag aggiuntivi indipendenti dal tag custom esistente.
  // - "pinned": item imperdibile, sempre visibile, con stile evidenziato a sinistra.
  // - "full":   item che appare solo in modalità Esteso; badge discreto.
  const isPinned = it.pinned === true;
  const isFullOnly = it.mode === 'full';
  const customTag = it.tag
    ? `<span class="dd-item-tag ${it.tagKind||''}">${it.tag}</span>`
    : '';
  const pinnedTag = isPinned
    ? `<span class="dd-item-tag pinned">${ICO.star} Imperdibile</span>`
    : '';
  const fullTag = (isFullOnly && !isPinned)
    ? `<span class="dd-item-tag full">+ Esteso</span>`
    : '';
  const meta = (it.meta && it.meta.length)
    ? `<div class="dd-item-meta">${it.meta.map(m=>`<span>${m.ico||''}${m.text}</span>`).join('')}</div>`
    : '';
  const desc = it.desc ? `<div class="dd-item-desc">${it.desc}</div>` : '';
  const actions = (it.actions && it.actions.length)
    ? `<div class="dd-actions">${it.actions.map(a => {
        // Riconosce le 3 categorie: book / info / map
        const cls = (a.kind === 'book' || a.kind === 'info' || a.kind === 'map') ? a.kind : 'info';
        const icoMap = { book: ICO.ticket, info: ICO.info, map: ICO.pin };
        const ico = icoMap[cls];
        // Tutti gli action link sono esterni → target=_blank, rel sicurezza, icona ↗
        return `<a class="dd-act ${cls}" href="${a.url}" target="_blank" rel="noopener noreferrer">
          <span class="dd-act-i">${ico}</span>
          <span>${a.label}</span>
          <span class="dd-act-ext">${ICO.ext}</span>
        </a>`;
      }).join('')}</div>`
    : '';
  // Parcheggi vicini all'attività (1-2 suggerimenti con link diretto a Maps)
  const parking = (it.parking && it.parking.length)
    ? `<div class="dd-parking">
        <div class="dd-parking-lbl">${ICO.parking} Parcheggi vicini</div>
        <div class="dd-parking-list">${it.parking.map(p =>
          `<a class="dd-park" href="${mapsUrl(p.q)}" target="_blank" rel="noopener noreferrer">
            ${ICO.parking}
            <span>${p.name}</span>
            <span class="dd-park-ext">${ICO.ext}</span>
          </a>`
        ).join('')}</div>
      </div>`
    : '';
  return `<div class="dd-item${isPinned?' pinned':''}">
    <div class="dd-item-name">${it.name}${pinnedTag}${customTag}${fullTag}</div>
    ${meta}
    ${desc}
    ${actions}
    ${parking}
  </div>`;
}

function renderDayDetailSection(sec){
  const icoCls = sec.kind === 'eat'   ? 'eat'
              : sec.kind === 'act'    ? 'act'
              : sec.kind === 'tips'   ? 'tips'
              : sec.kind === 'pharm'  ? 'pharm'
              : sec.kind === 'shop'   ? 'shop' : '';
  const subLabel = sec.kind === 'discover' ? 'Da non perdere'
                : sec.kind === 'act'      ? 'Esperienze'
                : sec.kind === 'eat'      ? 'Selezione'
                : sec.kind === 'tips'     ? 'Buono a sapersi'
                : sec.kind === 'pharm'    ? 'In zona oggi'
                : sec.kind === 'shop'     ? 'Per la spesa' : '';
  // v3.2: filtro per modalità.
  // - mode === 'relax': mostro solo item senza mode === 'full' (gli item 'full' sono nascosti).
  // - mode === 'full':  mostro tutti gli item.
  // Servizi essenziali (farmacie, supermercati) non hanno mai mode → sempre visibili.
  const items = sec.items.filter(it => S.mode === 'full' || it.mode !== 'full');
  if (!items.length) return '';
  return `<div class="dd-section">
    <div class="dd-section-head">
      <span class="dd-section-ico ${icoCls}">${sec.icon||ICO.pin}</span>
      <span class="dd-section-title">${sec.title}</span>
      ${subLabel?`<span class="dd-section-sub">${subLabel}</span>`:''}
    </div>
    ${items.map(renderDayDetailItem).join('')}
  </div>`;
}

function renderDayDetail(){
  const idx = S.dayDetailIdx;
  if (idx == null) return '';
  const d = DAYS[idx];
  const detail = DAY_DETAILS[idx] || { intro:'', sections:[] };
  const heroImg = DAY_IMG[idx];
  const svc = SERVICES[idx] || { farmacie:[], supermercati:[], ristoranti:[] };

  // Date calendario: legate allo slot. Cerchiamo lo slot corrente per il dettaglio.
  const slot = S.dayOrder.indexOf(idx);
  const calDate = slot >= 0 ? CALENDAR_DATES[slot] : d.date;

  // v21: ricostruisco la lista delle sezioni:
  // - le sezioni curate restano
  // - la sezione "eat" viene arricchita coi dati strutturati di SERVICES.ristoranti
  //   (e i ristoranti non già curati vengono aggiunti)
  // - aggiungo in coda 2 sezioni nuove: "Farmacie" e "Spesa & supermercati",
  //   posizionate prima della sezione tips (se presente)
  const sections = [];
  let tipsSec = null;
  detail.sections.forEach(sec => {
    if (sec.kind === 'eat') {
      const merged = _mergeEatItems(sec.items, svc.ristoranti);
      sections.push({...sec, items: merged});
    } else if (sec.kind === 'tips') {
      tipsSec = sec;   // metti tips alla fine, dopo Farmacie/Spesa
    } else {
      sections.push(sec);
    }
  });

  // Se il giorno non aveva una sezione 'eat' curata ma SERVICES ha ristoranti,
  // ne creo una al volo dai SERVICES.
  const hadEat = detail.sections.some(s => s.kind === 'eat');
  if (!hadEat && svc.ristoranti.length) {
    sections.push({
      kind:'eat', title:'Dove mangiare', icon: ICO.fork,
      items: svc.ristoranti.map(_eatItemFromService)
    });
  }

  // Sezione Farmacie (auto-generata da SERVICES)
  if (svc.farmacie.length) {
    sections.push({
      kind:'pharm', title:'Farmacie', icon: ICO.pharm,
      items: svc.farmacie.map(_farmaciaItem)
    });
  }
  // Sezione Spesa & Supermercati (auto-generata da SERVICES)
  if (svc.supermercati.length) {
    sections.push({
      kind:'shop', title:'Spesa & supermercati', icon: ICO.cart,
      items: svc.supermercati.map(_superItem)
    });
  }

  // tips alla fine (consigli pratici del giorno)
  if (tipsSec) sections.push(tipsSec);

  // v3.2: conto gli item "full" presenti in questo giorno per il banner modalità.
  // Servono per dire "in modalità Esteso aggiungi N tappe extra".
  let fullCount = 0;
  sections.forEach(sec => {
    (sec.items || []).forEach(it => { if (it.mode === 'full') fullCount++; });
  });
  const modeBannerHtml = fullCount > 0
    ? (S.mode === 'relax'
        ? `<div class="dd-mode-banner relax">${ICO.compass}
            <span>Modalità <strong>Relax</strong> attiva — ${fullCount} ${fullCount===1?'tappa extra è nascosta':'tappe extra sono nascoste'}.</span>
            <button class="dd-mode-banner-cta" onclick="setMode('full')">✦ Passa a Esteso</button>
          </div>`
        : `<div class="dd-mode-banner full">${ICO.compass}
            <span>Modalità <strong>Esteso</strong> — vedi ${fullCount} ${fullCount===1?'tappa in più':'tappe in più'} contrassegnate "+ Esteso".</span>
            <button class="dd-mode-banner-cta" onclick="setMode('relax')">🌿 Passa a Relax</button>
          </div>`)
    : '';

  return `<div class="dd-overlay" role="dialog" aria-label="Dettagli del giorno ${d.n}">
    <div class="dd-topbar">
      <button class="dd-back" onclick="closeDayDetail(false)">${ICO.back} Torna al giorno</button>
      <div class="dd-topbar-title">${d.emoji} G${d.n} · ${d.title}</div>
    </div>
    <div class="dd-content">
      <div class="dd-hero">
        ${imgTag(heroImg, 'dd-hero-img', d.title)}
        <div class="dd-hero-content">
          <span class="dd-hero-eyebrow">${calDate}</span>
          <div class="dd-hero-title">${d.title}</div>
          <div class="dd-hero-mood">${d.mood}</div>
        </div>
      </div>
      ${detail.intro ? `<div class="dd-intro">${detail.intro}</div>` : ''}
      ${(d.windNote || d.extra) ? `<div class="dd-quicknotes">
        ${d.windNote ? `<div class="dd-quicknote wind">${ICO.wind}<span><span class="dd-quicknote-lbl">Vento & questa tappa:</span>${d.windNote}</span></div>` : ''}
        ${d.extra ? `<div class="dd-quicknote tip">${ICO.alert}<span><span class="dd-quicknote-lbl">Suggerimento del giorno:</span>${d.extra}</span></div>` : ''}
      </div>` : ''}
      ${modeBannerHtml}
      ${sections.map(renderDayDetailSection).join('')}

      <div class="dd-notes">
        <div class="dd-notes-head">
          <span class="dd-notes-ico">${ICO.heart}</span>
          <span class="dd-notes-title">Le nostre note</span>
          <span class="dd-notes-sub">Solo tue, salvate sul telefono</span>
        </div>
        <textarea
          class="dd-notes-textarea"
          id="dd-note-${idx}"
          placeholder="Scrivi qui i tuoi ricordi del giorno: cosa vi è piaciuto, cosa cambieresti, frasi divertenti di Bubi, posti da rivedere…"
          oninput="onNoteInput(${idx}, this)"
        >${(S.notes[idx]||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}</textarea>
        <span class="dd-notes-saved" id="dd-note-saved-${idx}">${ICO.check} Salvato</span>
      </div>

      <div class="dd-footnote">
        ${ICO.alert}
        <span><strong>Link e orari da verificare prima del viaggio.</strong> Operatori piccoli (kayak, barche, ristoranti) cambiano spesso modalità di prenotazione e disponibilità stagionale. Le mappe Google sono sempre stabili.</span>
      </div>
    </div>
  </div>`;
}

function renderBeaches(){
  const list=S.bfilter==='top'?BEACHES.filter(b=>b.family>=4):BEACHES;
  const tagInfo=(b)=> b.family>=4?{cls:'top',label:'TOP'}:b.family>=3?{cls:'ok',label:'OK'}:{cls:'hard',label:'AVANZATA'};
  return `
    <div class="filter-row">
      <button class="fbtn${S.bfilter==='all'?' on':''}" onclick="set({bfilter:'all'})">Tutte le spiagge</button>
      <button class="fbtn${S.bfilter==='top'?' on':''}" onclick="set({bfilter:'top'})">${ICO.star} Top famiglia</button>
    </div>
    ${list.map(b=>{
      const t=tagInfo(b);
      const beachKey=BEACH_IMG[b.name]||'sonparc';
      const windWarn=b.wind&&b.wind.includes('⚠');
      return `
      <div class="bcard">
        <div class="bcard-img">
          ${imgTag(beachKey, 'bcard-img-photo', b.name)}
          <div class="bcard-img-tag ${t.cls}">${t.cls==='top'?ICO.star:''} ${t.label}</div>
          <button class="bcard-img-fav${S.favs['beach_'+b.name]?' on':''}" onclick="event.stopPropagation();toggleFav('beach_${b.name.replace(/'/g,'_')}')" aria-label="Aggiungi ai preferiti">${ICO.heart}</button>
          <div class="bcard-img-name">
            <h3>${b.name}</h3>
            <div class="bcard-img-loc">${ICO.pin} Minorca · ${b.dist}</div>
          </div>
          <div class="bcard-rating">${ICO.star} ${b.family}.0</div>
        </div>
        <div class="bcard-body">
          <div class="bmeta">
            <span>${ICO.car}${b.dist}</span>
            <span>🌊 ${b.depth}</span>
            <span>🏖️ ${b.sand}</span>
            <span>${ICO.users}${b.crowd}</span>
            <span class="${windWarn?'warn':''}">${ICO.wind}${b.wind.replace('⚠️ ','')}</span>
          </div>
          ${b.facs.length?`<div class="bfacs">${b.facs.map(f=>`<span class="bfac">${f}</span>`).join('')}</div>`:''}
          <div class="bnote">${b.note}</div>
          <a class="nav-link" href="${mapsUrl(encodeURIComponent(b.name+' Minorca'))}" target="_blank">${ICO.pin} Naviga ${ICO.arrow}</a>
        </div>
      </div>`;
    }).join('')}`;
}

function renderTips(){
  return TIPS.map((t, idx)=>{
    // v4: la prima card (Meteo di Giugno) ha un CTA verso il Piano Meteo
    const cta = (idx === 0) ? `
      <button class="tcard-cta" onclick="openWeatherDetail()">
        <span class="tcard-cta-l">
          <span class="tcard-cta-ico">🌦️</span>
          <span class="tcard-cta-txt">
            <span class="tcard-cta-title">Esplora il Piano Meteo</span>
            <span class="tcard-cta-sub">Cosa fare se piove o tira tramontana</span>
          </span>
        </span>
        <span class="tcard-cta-arrow">›</span>
      </button>` : '';
    return `
    <div class="tcard">
      <span class="tcard-ico">${t.icon}</span>
      <div style="flex:1;min-width:0">
        <div class="tcard-title">${t.title}</div>
        <div class="tcard-txt">${t.txt}</div>
        ${cta}
      </div>
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════════════════════════════════════
// v4 — PIANO METEO — Render functions
// ═══════════════════════════════════════════════════════════════════════

// Picker meteo (modal sheet che si apre dalla pill nella card del giorno)
function renderWeatherPicker(){
  if (S.weatherPicker === null) return '';
  const slot = S.weatherPicker;
  const dayIdx = S.dayOrder[slot];
  const d = DAYS[dayIdx];
  const current = S.weatherPerDay[slot];
  return `
    <div class="wp-backdrop" onclick="if(event.target===this)closeWeatherPicker()">
      <div class="wp-modal" role="dialog" aria-label="Imposta meteo del giorno">
        <div class="wp-handle"></div>
        <div class="wp-title">Meteo previsto · G${d.n}</div>
        <div class="wp-sub">${d.title} — controlla windy.com la sera prima e imposta qui</div>
        <button class="wp-option ${current==='good'?'selected':''}" onclick="setWeather(${slot},'good')">
          <span class="wp-option-em">☀️</span>
          <span class="wp-option-body">
            <span class="wp-option-label">Sereno</span>
            <span class="wp-option-desc">Tutto come da programma</span>
          </span>
        </button>
        <button class="wp-option opt-half ${current==='half-rain'?'selected':''}" onclick="setWeather(${slot},'half-rain')">
          <span class="wp-option-em">⛅</span>
          <span class="wp-option-body">
            <span class="wp-option-label">Pioggia mezza giornata</span>
            <span class="wp-option-desc">Attiva Kit A — Mahón/Xoriguer al mattino, mare se schiarisce</span>
          </span>
        </button>
        <button class="wp-option opt-full ${current==='full-rain'?'selected':''}" onclick="setWeather(${slot},'full-rain')">
          <span class="wp-option-em">☔</span>
          <span class="wp-option-body">
            <span class="wp-option-label">Pioggia tutto il giorno</span>
            <span class="wp-option-desc">Auto-scambio con il giorno Jolly (G7) se possibile</span>
          </span>
        </button>
        <button class="wp-cancel" onclick="closeWeatherPicker()">Annulla</button>
      </div>
    </div>`;
}

// Banner undo: visualizzato in alto se c'è almeno uno scambio recente
function renderSwapBanner(){
  if (!S.swapHistory || !S.swapHistory.length) return '';
  const last = S.swapHistory[S.swapHistory.length - 1];
  return `
    <div class="swap-banner">
      <span class="swap-banner-em">🔀</span>
      <span class="swap-banner-txt">
        <strong>Scambio applicato</strong> · "${last.fromTitle}" ↔ "${last.toTitle}"
      </span>
      <button class="swap-banner-undo" onclick="undoLastSwap()">Annulla</button>
    </div>`;
}

// Overlay sottopagina Piano Meteo (riferimento statico)
function renderWeatherDetail(){
  // Genera lista giornate con badge resilienza, basata su DAYS originale
  const daysList = DAYS.map((d, dIdx) => {
    const res = DAY_RESILIENCE[dIdx];
    const badgeCls = `wd-badge-${res.tag}`;
    return `
      <div class="wd-day-row">
        <div class="wd-day-num">G${d.n}</div>
        <div class="wd-day-info">
          <div class="wd-day-title">${d.emoji} ${d.title}</div>
          <div class="wd-day-date">${d.date}</div>
        </div>
        <div class="wd-day-badge ${badgeCls}"><span class="em">${res.em}</span>${res.label}</div>
      </div>`;
  }).join('');

  return `
    <div class="wd-overlay" role="dialog" aria-label="Piano Meteo">
      <div class="wd-topbar">
        <button class="wd-back" onclick="closeWeatherDetail(false)">${ICO.back} Torna ai Consigli</button>
      </div>
      <div class="wd-content">

        <div class="wd-hero">
          <div class="wd-hero-eyebrow">Contingenza Viaggio</div>
          <div class="wd-hero-title">🌦️ Piano Meteo</div>
          <div class="wd-hero-sub">A Minorca a giugno raramente piove un giorno intero. Più spesso è mezza giornata di pioggia o tramontana forte. Ecco come riorganizzarti senza perdere il viaggio.</div>
        </div>

        <div class="wd-section">
          <h2 class="wd-section-title">📊 Resistenza meteo dei giorni</h2>
          <p class="wd-section-sub">Quanto ogni giornata regge il maltempo</p>
          <div class="wd-days-card">${daysList}</div>
          <div class="wd-legend">
            <div class="wd-legend-item"><span class="wd-day-badge wd-badge-jolly">☂️ Jolly</span> qualsiasi tempo</div>
            <div class="wd-legend-item"><span class="wd-day-badge wd-badge-wind">🌬️ Anti-vento</span> riparato a sud</div>
            <div class="wd-legend-item"><span class="wd-day-badge wd-badge-med">🟡 Medio</span> tiene se non piove</div>
            <div class="wd-legend-item"><span class="wd-day-badge wd-badge-high">⚠️ Sensibile</span> da spostare</div>
            <div class="wd-legend-item"><span class="wd-day-badge wd-badge-flex">🔄 Flessibile</span> si adatta</div>
          </div>
        </div>

        <div class="wd-section">
          <h2 class="wd-section-title">🔀 Mappa scambi</h2>
          <p class="wd-section-sub">Cosa fare se un giorno specifico viene colpito</p>
          <div class="wd-swap-card">
            <div class="wd-swap-row">
              <div class="wd-swap-icon swap">${ICO.swap}</div>
              <div class="wd-swap-text">Se <strong>G6 Cavalleria</strong> becca pioggia o tramontana forte <span class="arrow">→</span> <strong>scambia con G7 Ciutadella</strong>. Scambio classico, sempre vincente.</div>
            </div>
            <div class="wd-swap-row">
              <div class="wd-swap-icon swap">${ICO.swap}</div>
              <div class="wd-swap-text">Se <strong>G4 Galdana</strong> becca pioggia <span class="arrow">→</span> <strong>scambia con G7</strong>. <em>Nota:</em> la tramontana di per sé non la tocca (lato sud).</div>
            </div>
            <div class="wd-swap-row">
              <div class="wd-swap-icon flip">${ICO.flip}</div>
              <div class="wd-swap-text">Se <strong>G5 Son Bou</strong> becca pioggia al mattino <span class="arrow">→</span> <strong>ribalta la giornata</strong>: Cova d'en Xoroi al mattino, mare al pomeriggio se schiarisce.</div>
            </div>
            <div class="wd-swap-row">
              <div class="wd-swap-icon keep">${ICO.check}</div>
              <div class="wd-swap-text">Se <strong>G3 Es Grau</strong> becca tramontana media <span class="arrow">→</span> <strong>tieni il programma</strong>: la pineta di s'Albufera ripara, la laguna resta piatta.</div>
            </div>
            <div class="wd-swap-row">
              <div class="wd-swap-icon absorb">${ICO.merge}</div>
              <div class="wd-swap-text">Se <strong>G2 Arenal</strong> becca maltempo <span class="arrow">→</span> <strong>comprimi su G7</strong>: anticipi mezza giornata di Ciutadella e Arenal va più tardi.</div>
            </div>
            <div class="wd-swap-row">
              <div class="wd-swap-icon absorb">${ICO.merge}</div>
              <div class="wd-swap-text">Se <strong>G1 / G8</strong> beccano maltempo <span class="arrow">→</span> <strong>logistica + Kit C</strong>: il viaggio aeroporto già impegna mezza giornata.</div>
            </div>
          </div>
        </div>

        <div class="wd-section">
          <h2 class="wd-section-title">🎒 Kit pioggia</h2>
          <p class="wd-section-sub">Tre template universali, attivabili da qualsiasi giorno</p>

          <div class="wd-kit kit-a">
            <div class="wd-kit-head">
              <div class="wd-kit-title"><span class="kit-em">⛅</span>Mezza giornata coperta</div>
              <div class="wd-kit-duration">3-4h indoor</div>
            </div>
            <div class="wd-kit-when">Quando il radar mostra pioggia solo al mattino — lo scenario più frequente a giugno</div>
            <div class="wd-kit-timeline">
              <div class="wd-kit-step"><div class="wd-kit-step-dot-wrap"><div class="wd-kit-step-dot"></div></div><div class="wd-kit-step-body"><div class="wd-kit-step-time">09:30</div><div class="wd-kit-step-text"><strong>Mahón porto</strong> — passeggiata sotto i portici della Costa de ses Voltes</div></div></div>
              <div class="wd-kit-step"><div class="wd-kit-step-dot-wrap"><div class="wd-kit-step-dot"></div></div><div class="wd-kit-step-body"><div class="wd-kit-step-time">10:30</div><div class="wd-kit-step-text"><strong>Distilleria Xoriguer</strong> — tour del gin minorchino + degustazione (~45 min, tutto al chiuso)</div></div></div>
              <div class="wd-kit-step"><div class="wd-kit-step-dot-wrap"><div class="wd-kit-step-dot"></div></div><div class="wd-kit-step-body"><div class="wd-kit-step-time">12:30</div><div class="wd-kit-step-text"><strong>Pranzo Mercat des Claustre</strong> — mercato coperto con tapas, ottimo con Bubi</div></div></div>
              <div class="wd-kit-step"><div class="wd-kit-step-dot-wrap"><div class="wd-kit-step-dot"></div></div><div class="wd-kit-step-body"><div class="wd-kit-step-time">14:00+</div><div class="wd-kit-step-text">Se schiarisce <strong>→ mare a Galdana</strong> (lato sud, asciuga prima) <strong>o Son Parc</strong></div></div></div>
            </div>
            <div class="wd-kit-note"><strong>Trigger:</strong> guardi <strong>windy.com</strong> la sera prima — se la pioggia esce dall'isola entro le 13:00, attiva questo kit.</div>
          </div>

          <div class="wd-kit kit-b">
            <div class="wd-kit-head">
              <div class="wd-kit-title"><span class="kit-em">☔</span>Giornata grigia tutto il giorno</div>
              <div class="wd-kit-duration">Full day</div>
            </div>
            <div class="wd-kit-when">Quando piove tutto il giorno o c'è tramontana brutale — raro ma capita</div>
            <div class="wd-kit-timeline">
              <div class="wd-kit-step"><div class="wd-kit-step-dot-wrap"><div class="wd-kit-step-dot"></div></div><div class="wd-kit-step-body"><div class="wd-kit-step-time">10:00</div><div class="wd-kit-step-text"><strong>Ciutadella centro medievale</strong> — cattedrale, palazzi nobiliari, vicoli porticati</div></div></div>
              <div class="wd-kit-step"><div class="wd-kit-step-dot-wrap"><div class="wd-kit-step-dot"></div></div><div class="wd-kit-step-body"><div class="wd-kit-step-time">12:30</div><div class="wd-kit-step-text"><strong>Pranzo al porto incassato</strong> — i ristoranti hanno tettoie/dehors coperti</div></div></div>
              <div class="wd-kit-step"><div class="wd-kit-step-dot-wrap"><div class="wd-kit-step-dot"></div></div><div class="wd-kit-step-body"><div class="wd-kit-step-time">14:30</div><div class="wd-kit-step-text"><strong>Caseificio Subaida</strong> (o Hort Sant Patrici) — visita formaggio Mahón + degustazione</div></div></div>
              <div class="wd-kit-step"><div class="wd-kit-step-dot-wrap"><div class="wd-kit-step-dot"></div></div><div class="wd-kit-step-body"><div class="wd-kit-step-time">17:00</div><div class="wd-kit-step-text"><strong>Naveta des Tudons</strong> — tomba megalitica, 20 min con ombrello (più suggestiva sotto cielo grigio)</div></div></div>
              <div class="wd-kit-step"><div class="wd-kit-step-dot-wrap"><div class="wd-kit-step-dot"></div></div><div class="wd-kit-step-body"><div class="wd-kit-step-time">20:30</div><div class="wd-kit-step-text">Cena a <strong>Ciutadella</strong> o rientro a Son Parc per cena in struttura</div></div></div>
            </div>
            <div class="wd-kit-note"><strong>Trigger:</strong> meteo segna pioggia tutto il giorno <strong>o</strong> tramontana &gt;40 km/h. Equivale a sostituire la giornata di Ciutadella (G7) con questa.</div>
          </div>

          <div class="wd-kit kit-c">
            <div class="wd-kit-head">
              <div class="wd-kit-title"><span class="kit-em">🌧️</span>Pioggia battente + Bubi insofferente</div>
              <div class="wd-kit-duration">Worst case</div>
            </div>
            <div class="wd-kit-when">Visibilità zero, Bubi non vuole stare in auto — modalità "salvare la giornata"</div>
            <div class="wd-kit-timeline">
              <div class="wd-kit-step"><div class="wd-kit-step-dot-wrap"><div class="wd-kit-step-dot"></div></div><div class="wd-kit-step-body"><div class="wd-kit-step-time">MATTINA</div><div class="wd-kit-step-text"><strong>Relax in struttura</strong> — lettura, giochi, zero spostamenti</div></div></div>
              <div class="wd-kit-step"><div class="wd-kit-step-dot-wrap"><div class="wd-kit-step-dot"></div></div><div class="wd-kit-step-body"><div class="wd-kit-step-time">12:30</div><div class="wd-kit-step-text"><strong>Pranzo in casa</strong> — pasta veloce, lascia riposare Bubi</div></div></div>
              <div class="wd-kit-step"><div class="wd-kit-step-dot-wrap"><div class="wd-kit-step-dot"></div></div><div class="wd-kit-step-body"><div class="wd-kit-step-time">15:30</div><div class="wd-kit-step-text"><strong>Lloc de Menorca</strong> — parco-fattoria con animali, capannoni coperti. 20 min da Son Parc</div></div></div>
              <div class="wd-kit-step"><div class="wd-kit-step-dot-wrap"><div class="wd-kit-step-dot"></div></div><div class="wd-kit-step-body"><div class="wd-kit-step-time">19:30</div><div class="wd-kit-step-text"><strong>Cena in struttura</strong> — Bubi a letto presto</div></div></div>
            </div>
            <div class="wd-kit-note"><strong>Trigger:</strong> tutto è andato male contemporaneamente. Questo kit accetta che una giornata è "persa" e protegge le energie per le successive.</div>
          </div>

        </div>
      </div>
    </div>`;
}

function renderChecklist(){
  // v3.1: tab switcher tra checklist pre-partenza e checklist giornaliera.
  // Default: prima del viaggio mostra "pre", durante il viaggio mostra "daily".
  const tripIdx = getTripDayIndex();
  if (S.checkTab === undefined) {
    S.checkTab = (tripIdx === -1) ? 'pre' : 'daily';
  }
  const tab = S.checkTab;

  const tabSwitcher = `
    <div class="check-tabs">
      <button class="check-tab${tab==='pre'?' on':''}" onclick="set({checkTab:'pre'})">
        🧳 Pre-partenza
      </button>
      <button class="check-tab${tab==='daily'?' on':''}" onclick="set({checkTab:'daily'})">
        ☀️ Giornaliera
      </button>
    </div>
  `;

  if (tab === 'pre') {
    const done = S.preChecks.filter(Boolean).length;
    const tot = PRE_TRIP_ITEMS.length;
    const pct = Math.round((done/tot)*100);
    let gi = -1;
    const groups = PRE_TRIP_GROUPS.map(g => {
      const items = g.items.map(item => { gi++; const idx = gi;
        return `<label class="citem" onclick="togglePreCheck(${idx})">
          <input type="checkbox" ${S.preChecks[idx]?'checked':''} onclick="event.stopPropagation();togglePreCheck(${idx})">
          <span class="${S.preChecks[idx]?'done':''}">${item}</span>
        </label>`;
      }).join('');
      return `<div class="cg"><div class="cg-hdr">${g.group}</div><div class="citems">${items}</div></div>`;
    }).join('');
    return `
      ${tabSwitcher}
      <div class="prog-wrap">
        <div class="prog-top"><span class="prog-lbl">Pronti per la partenza</span><span class="prog-num">${done}/${tot} · ${pct}%</span></div>
        <div class="prog-bar"><div class="prog-fill" style="width:${pct}%;${pct===100?'background:var(--ok)':''}"></div></div>
        ${pct===100?'<div class="prog-done">🎉 Tutto pronto! Buon viaggio!</div>':''}
      </div>
      ${groups}
      <button class="reset-btn" onclick="resetPreChecks()">↺ Reset pre-partenza</button>`;
  }

  // Daily
  const done=S.checks.filter(Boolean).length, tot=S.checks.length, pct=Math.round((done/tot)*100);
  let gi=-1;
  const groups=CHECK_GROUPS.map(g=>{
    const items=g.items.map(item=>{gi++;const idx=gi;
      return `<label class="citem" onclick="toggleCheck(${idx})">
        <input type="checkbox" ${S.checks[idx]?'checked':''} onclick="event.stopPropagation();toggleCheck(${idx})">
        <span class="${S.checks[idx]?'done':''}">${item}</span>
      </label>`;
    }).join('');
    return `<div class="cg"><div class="cg-hdr">${g.group}</div><div class="citems">${items}</div></div>`;
  }).join('');
  return `
    ${tabSwitcher}
    <div class="prog-wrap">
      <div class="prog-top"><span class="prog-lbl">Progresso giornaliero</span><span class="prog-num">${done}/${tot} · ${pct}%</span></div>
      <div class="prog-bar"><div class="prog-fill" style="width:${pct}%;${pct===100?'background:var(--ok)':''}"></div></div>
      ${pct===100?'<div class="prog-done">🎉 Siete pronti! Buona giornata!</div>':''}
    </div>
    ${groups}
    <button class="reset-btn" onclick="resetChecks()">↺ Reset checklist giornaliera</button>`;
}

function renderFlights(){
  return `
  <div class="fl-section">
    <div class="fl-sec-title">${ICO.clock} Time Line Viaggio</div>
    <div class="tl-strip">
      <div class="tl-title">${ICO.plane} Partenza · Giovedì 4 Giugno</div>
      ${[
        {t:'12:55',l:'Decollo da Treviso (TSF)',s:'FR2805',cls:'p'},
        {t:'14:40',l:'Atterraggio a Mahon (MAH)',s:'',cls:'a'},
        {t:'~15:15',l:'Bagagli + uscita aeroporto',s:'',cls:''},
        {t:'~16:00',l:'Ritiro auto ACGcars',s:'Rif. 46574',cls:'p'},
        {t:'~16:30',l:'Partenza per Son Parc',s:'~25 min',cls:''},
      ].flatMap((r,i,a)=>{
        const row=`<div class="tl-row"><div class="tl-dot ${r.cls}"></div><div class="tl-txt"><strong>${r.t}</strong> — ${r.l}${r.s?` <em>· ${r.s}</em>`:''}</div></div>`;
        return i<a.length-1?[row,`<div class="tl-row"><div class="tl-connector"></div></div>`]:[row];
      }).join('')}
    </div>
    <div class="tl-strip">
      <div class="tl-title">${ICO.plane} Ritorno · Giovedì 11 Giugno</div>
      ${[
        {t:'Mattina',l:'Check-out hotel',s:'',cls:''},
        {t:'12:00',l:'Riconsegna auto ACGcars',s:'Rif. 46574',cls:'a'},
        {t:'13:20',l:'Check-in chiude (volo 15:20)',s:'',cls:''},
        {t:'15:20',l:'Decollo da Mahon (MAH)',s:'FR2804',cls:'p'},
        {t:'17:00',l:'Atterraggio a Treviso (TSF)',s:'',cls:''},
      ].flatMap((r,i,a)=>{
        const row=`<div class="tl-row"><div class="tl-dot ${r.cls}"></div><div class="tl-txt"><strong>${r.t}</strong> — ${r.l}${r.s?` <em>· ${r.s}</em>`:''}</div></div>`;
        return i<a.length-1?[row,`<div class="tl-row"><div class="tl-connector"></div></div>`]:[row];
      }).join('')}
    </div>
  </div>

  <div class="fl-section">
    <div class="fl-sec-title">${ICO.plane} Voli <span class="fl-badge">Ryanair · FV4P3J</span></div>
    <div class="fl-card">
      <div class="fl-card-hdr">
        <div class="fl-airline">🛫 Volo di andata <span class="fl-num">FR2805</span></div>
        <div class="fl-date">4 Giu 2026</div>
      </div>
      <div class="fl-route">
        <div class="fl-airport">
          <div class="fl-iata">TSF</div>
          <div class="fl-city">Venezia Treviso</div>
          <div class="fl-time">12:55</div>
        </div>
        <div class="fl-arrow">
          <div class="fl-line"></div>
          <div class="fl-dur">1h 45m · diretto</div>
        </div>
        <div class="fl-airport right">
          <div class="fl-iata">MAH</div>
          <div class="fl-city">Mahon Minorca</div>
          <div class="fl-time">14:40</div>
        </div>
      </div>
      <div class="fl-footer">
        <div class="fl-fi">📅 <strong>Giovedì 4 Giugno</strong></div>
        <div class="fl-fi">🏢 Terminal unico MAH</div>
        <div class="fl-fi">🎫 Rif. <strong>FV4P3J</strong></div>
      </div>
    </div>
    <div class="fl-card">
      <div class="fl-card-hdr">
        <div class="fl-airline">🛬 Volo di ritorno <span class="fl-num">FR2804</span></div>
        <div class="fl-date">11 Giu 2026</div>
      </div>
      <div class="fl-route">
        <div class="fl-airport">
          <div class="fl-iata">MAH</div>
          <div class="fl-city">Mahon Minorca</div>
          <div class="fl-time">15:20</div>
        </div>
        <div class="fl-arrow">
          <div class="fl-line"></div>
          <div class="fl-dur">1h 40m · diretto</div>
        </div>
        <div class="fl-airport right">
          <div class="fl-iata">TSF</div>
          <div class="fl-city">Venezia Treviso</div>
          <div class="fl-time">17:00</div>
        </div>
      </div>
      <div class="fl-footer">
        <div class="fl-fi">📅 <strong>Giovedì 11 Giugno</strong></div>
        <div class="fl-fi">⏰ Check-in chiude 2h prima</div>
        <div class="fl-fi">🎫 Rif. <strong>FV4P3J</strong></div>
      </div>
    </div>
    <div class="info-row blue">ℹ️ Check-in online apre 60 giorni prima, <strong>chiude 2 ore prima</strong>. Bagaglio a mano 40×20×25 cm incluso.</div>
  </div>

  <div class="fl-section">
    <div class="fl-sec-title">${ICO.car} Noleggio Auto</div>
    <div class="car-card">
      <div class="car-hdr">
        <div class="car-brand">${ICO.car} ACGcars</div>
        <div class="car-ref">Prenotazione #46574</div>
      </div>
      <div class="car-body">
        <div class="car-row">
          <div class="car-col pickup">
            <div class="car-col-lbl">Ritiro</div>
            <div class="car-col-val">Aeropuerto de Menorca</div>
            <div class="car-col-sub">📅 4 Giu 2026 · ⏰ 16:00</div>
          </div>
          <div class="car-col dropoff">
            <div class="car-col-lbl">Riconsegna</div>
            <div class="car-col-val">Aeropuerto de Menorca</div>
            <div class="car-col-sub">📅 11 Giu 2026 · ⏰ 12:00</div>
          </div>
        </div>
        <div class="car-tip">📍 <strong>Dove trovare ACGcars:</strong> Uscita arrivi → segui "Car Rental". ACGcars potrebbe essere in un parcheggio esterno a 2-3 min a piedi. Cerca il cartello verde o chiama il numero sul voucher.</div>
      </div>
    </div>
    <div class="info-row green">✅ <strong>Documenti per il ritiro:</strong> Patente originale · Carta di credito intestata al guidatore · Voucher #46574 · Documento d'identità.</div>
  </div>

  <div class="fl-section">
    <div class="airport-card">
      <div class="airport-hdr">
        <h3>${ICO.building} Aeroporto di Mahon (MAH)</h3>
        <p>Aeropuerto de Menorca · Un unico terminal</p>
      </div>
      <div class="airport-body">
        <div class="airport-item"><span class="airport-ico">${ICO.car}</span><div class="airport-info"><strong>Noleggio auto</strong><span>Segui "Alquiler de Coches". Operatori locali spesso in parcheggio P1 esterno.</span></div></div>
        <div class="airport-item"><span class="airport-ico">${ICO.shop}</span><div class="airport-info"><strong>Negozi</strong><span>Duty-free al piano partenze. Solo bar e distributori agli arrivi.</span></div></div>
        <div class="airport-item"><span class="airport-ico">${ICO.coffee}</span><div class="airport-info"><strong>Bar & ristorante</strong><span>Bar agli arrivi e partenze. Ristorante dopo i controlli sicurezza.</span></div></div>
        <div class="airport-item"><span class="airport-ico">${ICO.wifi}</span><div class="airport-info"><strong>Wi-Fi gratuito</strong><span>Rete "Aena_wifi_free" — nessuna password.</span></div></div>
        <div class="airport-item"><span class="airport-ico">${ICO.pin}</span><div class="airport-info"><strong>Distanza da Son Parc</strong><span>~25 minuti. ME-1 → Me-7 → Me-15 → Son Parc.</span></div></div>
      </div>
    </div>
    <a class="nav-link" href="https://www.google.com/maps/search/?api=1&query=Aeropuerto+Menorca+MAH" target="_blank">${ICO.pin} Apri aeroporto su Maps ${ICO.arrow}</a>
  </div>`;
}

function toggleCheck(i){const c=[...S.checks];c[i]=!c[i];set({checks:c});}
function resetChecks(){set({checks:ALL_ITEMS.map(()=>false)});}
function togglePreCheck(i){const c=[...S.preChecks];c[i]=!c[i];set({preChecks:c});}
function resetPreChecks(){set({preChecks:PRE_TRIP_ITEMS.map(()=>false)});}

function render(){
  // Reset image fallback registry on each render to prevent leak across re-renders.
  window._imgChains = {};
  window._imgCounter = 0;

  // Fix v3.3: preserva la posizione di scroll del day picker prima del rebuild
  // dell'innerHTML (che la resetterebbe a 0).
  const _oldDpick = document.querySelector('.dpick');
  const _savedScrollLeft = _oldDpick ? _oldDpick.scrollLeft : null;

  let content='';
  if(S.tab==='itinerary') content=renderItinerary();
  else if(S.tab==='beaches') content=renderBeaches();
  else if(S.tab==='flights') content=renderFlights();
  else if(S.tab==='tips') content=renderTips();
  else if(S.tab==='checklist') content=renderChecklist();
  // v20: il dettaglio del giorno è un overlay sopra al resto, sempre disponibile
  // ma renderizzato solo quando S.dayDetailIdx !== null
  const detailOverlay = (S.dayDetailIdx !== null) ? renderDayDetail() : '';
  // v4: overlay Piano Meteo + modal picker + banner undo scambio
  const weatherDetailOverlay = S.weatherDetailOpen ? renderWeatherDetail() : '';
  const weatherPickerModal = renderWeatherPicker();
  const swapBanner = renderSwapBanner();
  document.getElementById('app').innerHTML=`
    ${renderHeader()}
    <div class="content">${swapBanner}${content}
      <div class="footer">Minorca in Famiglia · Son Parc, Giugno 2026 · v4.0 · made with <span class="footer-heart">${ICO.heart}</span></div>
    </div>
    ${renderNav()}
    ${detailOverlay}
    ${weatherDetailOverlay}
    ${weatherPickerModal}`;

  // Fix v3.3: ripristina lo scroll del day picker SENZA animazione. Anima/snap
  // solo se la chip attiva è fuori viewport (caso primo caricamento dell'app
  // con S.day != 0, o ritorno alla tab Itinerario dopo essere stati altrove).
  requestAnimationFrame(() => {
    const dpick = document.querySelector('.dpick');
    if (!dpick) return;

    // 1) Ripristino istantaneo della posizione precedente, se c'era
    if (_savedScrollLeft !== null) {
      dpick.scrollLeft = _savedScrollLeft;
    }

    // 2) Snap della chip attiva SOLO se non è già completamente visibile
    const active = dpick.querySelector('.dchip.on');
    if (!active) return;
    const cw = dpick.clientWidth;
    const sl = dpick.scrollLeft;
    const al = active.offsetLeft;
    const ar = al + active.offsetWidth;
    if (al >= sl && ar <= sl + cw) return; // già visibile: non fare nulla

    if (_savedScrollLeft === null) {
      // primo caricamento del picker: centra
      dpick.scrollLeft = Math.max(0, al - (cw - active.offsetWidth) / 2);
    } else if (al < sl) {
      // parzialmente fuori a sinistra: snap minimo
      dpick.scrollLeft = Math.max(0, al - 8);
    } else {
      // parzialmente fuori a destra: snap minimo
      dpick.scrollLeft = ar - cw + 8;
    }
  });
}
// v20: leggi hash all'avvio e apri il dettaglio se richiesto
(function initFromHash(){
  const m = location.hash.match(/^#giorno-(\d+)$/);
  if (m) {
    const n = parseInt(m[1], 10);
    const idx = DAYS.findIndex(d => d.n === n);
    if (idx >= 0) S.dayDetailIdx = idx;
  }
  // v4: anche per il Piano Meteo
  if (location.hash === '#piano-meteo') {
    S.weatherDetailOpen = true;
  }
})();
render();

// ─── WELCOME / SPLASH SCREEN ──────────────────────────────────────────────
// Mostra una pagina di benvenuto personalizzata al lancio dell'app.
// NB: i browser non possono leggere il nome dall'account Google del telefono
// per motivi di privacy. Il nome viene chiesto una sola volta al primo avvio
// e salvato in localStorage; da quel momento il saluto è automatico.
(function welcomeInit(){
  const NAME_KEY = 'minorca_user_name';

  // Nomi italiani femminili comuni che NON finiscono in 'a' (per heuristic)
  // e nomi di sicura riconoscibilità (per evitare ambiguità).
  const FEMALE_NAMES = new Set([
    'maria','anna','sara','giulia','sofia','chiara','francesca','elena','alessia',
    'martina','laura','silvia','giovanna','vittoria','beatrice','alice','aurora',
    'emma','carlotta','greta','isabella','ginevra','noemi','rebecca','adele',
    'agata','agnese','alma','amelia','arianna','asia','azzurra','benedetta',
    'bianca','camilla','carla','caterina','cecilia','celeste','cristina','daniela',
    'diana','eleonora','elisa','elisabetta','emanuela','erica','eva','fiamma',
    'flavia','gaia','gemma','gioia','iris','irene','letizia','linda','livia',
    'lucia','ludovica','maddalena','margherita','marta','matilde','melissa',
    'mia','michela','miriam','monica','nora','olivia','ornella','paola','penelope',
    'rita','roberta','rosa','sabrina','serena','simona','stella','susanna',
    'teresa','valentina','valeria','veronica','viola','virginia','zoe',
    'angelica','annamaria','antonia','barbara','carolina','claudia','consuelo',
    'cristiana','denise','federica','gabriella','giada','jessica','liliana',
    'lorena','manuela','melania','milena','nadia','natalia','natascia','nicoletta',
    'patrizia','raffaella','renata','sandra','sonia','tiziana'
  ]);

  // Nomi maschili italiani che finiscono in 'a' (eccezioni al pattern -a → femminile)
  const MALE_EXCEPTIONS_ENDING_A = new Set([
    'andrea','nicola','luca','mattia','elia','tobia','enea','battista','barnaba',
    'isaia','geremia','zaccaria'
  ]);

  function detectGender(fullName) {
    if (!fullName) return 'm';
    const tokens = fullName.trim().toLowerCase().split(/\s+/).filter(Boolean);
    // 1) Match esatto su nomi femminili noti
    for (const t of tokens) {
      if (FEMALE_NAMES.has(t)) return 'f';
    }
    // 2) Heuristic: token che finisce in 'a' (e non è un maschile-eccezione)
    for (const t of tokens) {
      if (t.endsWith('a') && !MALE_EXCEPTIONS_ENDING_A.has(t)) return 'f';
    }
    return 'm';
  }

  function getStoredName() {
    try { return (localStorage.getItem(NAME_KEY) || '').trim(); } catch(e) { return ''; }
  }
  function setStoredName(name) {
    try { localStorage.setItem(NAME_KEY, name.trim()); } catch(e) {}
  }
  function clearStoredName() {
    try { localStorage.removeItem(NAME_KEY); } catch(e) {}
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  // Capitalizza correttamente (es. "maria vittoria" → "Maria Vittoria"),
  // limitato ai primi 2 token per leggibilità.
  function prettyName(name) {
    return name.trim().split(/\s+/).slice(0, 2).map(t =>
      t.charAt(0).toLocaleUpperCase('it-IT') + t.slice(1).toLocaleLowerCase('it-IT')
    ).join(' ');
  }

  function showSetupScreen(screen) {
    screen.innerHTML = `
      <div class="welcome-content">
        <div class="welcome-eyebrow">Minorca · Giugno 2026</div>
        <div class="welcome-setup">
          <div class="welcome-setup-title">Ciao!</div>
          <div class="welcome-setup-text">Come ti chiami? Lo userò per personalizzare il tuo benvenuto ogni volta che apri l'app.</div>
          <input class="welcome-setup-input" id="setupName" type="text" placeholder="Il tuo nome" autocomplete="given-name" autocapitalize="words" enterkeyhint="go" />
          <button class="welcome-setup-btn" id="setupSave" disabled>Continua</button>
        </div>
      </div>
    `;
    const input = document.getElementById('setupName');
    const btn = document.getElementById('setupSave');
    input.addEventListener('input', () => {
      btn.disabled = input.value.trim().length < 2;
    });
    // Focus dopo un breve delay (alcuni browser mobile bloccano il focus immediato)
    setTimeout(() => { try { input.focus(); } catch(e){} }, 350);
    const save = () => {
      const name = input.value.trim();
      if (name.length < 2) return;
      const pretty = prettyName(name);
      setStoredName(pretty);
      // Crossfade dal setup al benvenuto vero e proprio
      screen.style.transition = 'opacity 0.3s ease';
      screen.style.opacity = '0';
      setTimeout(() => {
        screen.style.opacity = '';
        screen.style.transition = '';
        showWelcomeScreen(screen, pretty);
      }, 280);
    };
    btn.addEventListener('click', save);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); save(); }
    });
  }

  function showWelcomeScreen(screen, name) {
    const gender = detectGender(name);
    const greeting = gender === 'f' ? 'Benvenuta' : 'Benvenuto';
    const firstToken = name.split(/\s+/)[0];
    screen.innerHTML = `
      <div class="welcome-content">
        <div class="welcome-eyebrow">Minorca · Giugno 2026</div>
        <h1 class="welcome-title">${greeting}<span class="welcome-name">${escapeHtml(name)}</span></h1>
        <p class="welcome-subtitle">Goditi la tua vacanza ✨</p>
        <button class="welcome-swipe-icon" id="welcomeContinue" aria-label="Entra nell'app">
          <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path class="chev chev-top"    d="M5 18 L17 6  L29 18" stroke="white" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
            <path class="chev chev-bottom" d="M5 34 L17 22 L29 34" stroke="white" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="welcome-rename" id="welcomeRename">Non sei ${escapeHtml(firstToken)}? Cambia nome</button>
      </div>
    `;
    document.getElementById('welcomeContinue').addEventListener('click', () => dismissWelcome(screen));
    document.getElementById('welcomeRename').addEventListener('click', () => {
      clearStoredName();
      showSetupScreen(screen);
    });

    // ── Swipe up to dismiss ──
    let startY = null;
    let currentY = null;
    let dragging = false;
    screen.addEventListener('touchstart', (e) => {
      // Blocca lo swipe solo se parte da un input o dal link "Cambia nome".
      // Sull'icona delle chevron (welcomeContinue) lo swipe DEVE poter partire.
      const t = e.target;
      if (t && t.closest && t.closest('input, #welcomeRename')) return;
      startY = e.touches[0].clientY;
      currentY = startY;
      dragging = true;
      screen.style.transition = 'none';
    }, { passive: true });
    screen.addEventListener('touchmove', (e) => {
      if (!dragging || startY === null) return;
      currentY = e.touches[0].clientY;
      const dy = currentY - startY;
      if (dy < 0) {
        screen.style.transform = `translate3d(0, ${dy * 0.65}px, 0)`;
        screen.style.opacity = String(Math.max(0.4, 1 + dy / 600));
      } else {
        screen.style.transform = '';
        screen.style.opacity = '';
      }
    }, { passive: true });
    const endHandler = () => {
      if (!dragging) return;
      const dy = (currentY !== null && startY !== null) ? (currentY - startY) : 0;
      screen.style.transition = '';
      if (dy < -70) {
        dismissWelcome(screen);
      } else {
        screen.style.transform = '';
        screen.style.opacity = '';
      }
      startY = null; currentY = null; dragging = false;
    };
    screen.addEventListener('touchend', endHandler);
    screen.addEventListener('touchcancel', endHandler);
  }

  function dismissWelcome(screen) {
    if (!screen) return;
    if (screen.dataset.dismissing === '1') return; // evita doppia chiamata
    screen.dataset.dismissing = '1';
    // 1) Forza una transizione esplicita (sovrascrive l'eventuale "transition: none"
    //    impostato dal touchmove durante il drag).
    screen.style.transition = 'transform 380ms cubic-bezier(0.32, 0.72, 0, 1), opacity 260ms ease-out';
    // 2) Forza un reflow PRIMA di applicare lo stato finale, così la transizione
    //    parte dalla posizione attuale (dove era il dito) invece di saltare.
    void screen.offsetHeight;
    // 3) Applica lo stato finale come inline style (vince sulla specificità di
    //    qualsiasi classe e sovrascrive translate/opacity lasciati dal drag).
    screen.style.transform = 'translate3d(0, -100%, 0)';
    screen.style.opacity = '0';
    screen.style.pointerEvents = 'none';
    // 4) Aggiungi anche la classe per mettere in pausa le animazioni interne
    //    (isola che galleggia, chevron) e liberare GPU durante l'uscita.
    screen.classList.add('dismissing');
    // 5) Rimuovi dal DOM al termine della transizione e sblocca lo scroll.
    setTimeout(() => {
      try { screen.remove(); } catch(e){}
      document.documentElement.classList.remove('welcome-active');
      document.body.classList.remove('welcome-active');
    }, 420);
  }

  // ── Bootstrap ──
  function start() {
    const screen = document.createElement('div');
    screen.className = 'welcome-screen';
    screen.id = 'welcomeScreen';
    document.body.appendChild(screen);
    // Blocca lo scroll della pagina sottostante mentre la welcome è in scena
    document.documentElement.classList.add('welcome-active');
    document.body.classList.add('welcome-active');
    const name = getStoredName();
    if (name) {
      showWelcomeScreen(screen, name);
    } else {
      showSetupScreen(screen);
    }
  }
  start();
})();
