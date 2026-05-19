/* ============================================================================
 * Minorca PWA — Service Worker
 * ============================================================================
 * Strategia di caching a 3 livelli:
 *
 *  1) SHELL  (cache-first)            → HTML/CSS/JS/icone/manifest
 *     Precaricata all'install. L'app si apre sempre, anche senza rete.
 *
 *  2) PHOTOS (stale-while-revalidate) → foto da jsDelivr e Wikimedia
 *     Cachate al primo uso, mostrate subito dalla cache, aggiornate in BG.
 *
 *  3) FONTS  (stale-while-revalidate) → Google Fonts (CSS + woff2)
 *     Stessa strategia delle foto. Dopo il primo load online, funzionano offline.
 *
 * Tutto ciò che NON rientra (Google Maps, Windfinder, siti prenotazione)
 * passa direttamente alla rete — sono link esterni veri.
 *
 * Versioning: bump CACHE_VERSION quando cambi shell/CSS/JS per forzare update.
 * ========================================================================== */

const CACHE_VERSION = 'v2';
const SHELL_CACHE   = `minorca-shell-${CACHE_VERSION}`;
const PHOTOS_CACHE  = `minorca-photos-${CACHE_VERSION}`;
const FONTS_CACHE   = `minorca-fonts-${CACHE_VERSION}`;

// File che costituiscono la "app shell" — precaricati all'install
const SHELL_ASSETS = [
  './',
  './index.html',
  './app.css',
  './app.js',
  './pwa.js',
  './manifest.webmanifest',
  './offline.html',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-180.png'
];

// Cap massimo per la cache foto (eviction LRU manuale)
const PHOTOS_MAX_ENTRIES = 200;

// ── Helpers ────────────────────────────────────────────────────────────────
function isPhotoHost(url) {
  return url.hostname === 'cdn.jsdelivr.net'
      || url.hostname === 'commons.wikimedia.org'
      || url.hostname === 'upload.wikimedia.org';
}

function isFontHost(url) {
  return url.hostname === 'fonts.googleapis.com'
      || url.hostname === 'fonts.gstatic.com';
}

// LRU semplificato: se la cache supera il cap, elimina le voci più vecchie
async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;
  // Le keys sono in ordine di inserimento — elimina le prime (più vecchie)
  const toDelete = keys.length - maxEntries;
  for (let i = 0; i < toDelete; i++) {
    await cache.delete(keys[i]);
  }
}

// ── Install: precarica la shell ────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: cleanup delle cache vecchie ──────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((k) => !k.endsWith(CACHE_VERSION))
          .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: routing per tipo di risorsa ─────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Solo GET
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const photoReq = isPhotoHost(url);
  const fontReq  = isFontHost(url);

  // Tutto il resto (Google Maps, Windfinder, ecc.) → passa diretto alla rete
  if (!sameOrigin && !photoReq && !fontReq) return;

  // ── Navigation: network-first con fallback alla shell ─────────────────
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() =>
        caches.match('./index.html').then((r) => r || caches.match('./offline.html'))
      )
    );
    return;
  }

  // ── Shell (same-origin asset): cache-first ────────────────────────────
  if (sameOrigin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((resp) => {
          // Solo le risposte ok finiscono nella cache shell
          if (resp && resp.status === 200 && resp.type === 'basic') {
            const copy = resp.clone();
            caches.open(SHELL_CACHE).then((c) => c.put(req, copy));
          }
          return resp;
        }).catch(() => cached);
      })
    );
    return;
  }

  // ── Foto / Font: stale-while-revalidate ───────────────────────────────
  const cacheName = photoReq ? PHOTOS_CACHE : FONTS_CACHE;
  event.respondWith(
    caches.open(cacheName).then((cache) =>
      cache.match(req).then((cached) => {
        const fetchPromise = fetch(req).then((resp) => {
          if (resp && resp.status === 200) {
            cache.put(req, resp.clone());
            if (photoReq) trimCache(PHOTOS_CACHE, PHOTOS_MAX_ENTRIES);
          }
          return resp;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    )
  );
});

// ── Messaggi dall'app: precaricamento batch foto, status, clear ───────────
self.addEventListener('message', (event) => {
  const data = event.data || {};

  // App chiede di pre-cachare un set di URL foto (bottone "scarica per offline")
  if (data.type === 'CACHE_PHOTOS' && Array.isArray(data.urls)) {
    event.waitUntil((async () => {
      const cache = await caches.open(PHOTOS_CACHE);
      const total = data.urls.length;
      let done = 0;
      let ok = 0;
      // Scarica a piccoli batch per non saturare la rete
      const BATCH = 6;
      for (let i = 0; i < total; i += BATCH) {
        const slice = data.urls.slice(i, i + BATCH);
        await Promise.allSettled(slice.map(async (url) => {
          try {
            // mode no-cors: permette di cachare anche risposte opache (Wikimedia)
            const resp = await fetch(url, { mode: 'no-cors', cache: 'reload' });
            if (resp) {
              await cache.put(url, resp);
              ok++;
            }
          } catch (e) { /* ignora singolo errore */ }
          done++;
          // Notifica il client sul progresso
          if (event.source) {
            event.source.postMessage({ type: 'CACHE_PROGRESS', done, total, ok });
          }
        }));
      }
      await trimCache(PHOTOS_CACHE, PHOTOS_MAX_ENTRIES);
      if (event.source) {
        event.source.postMessage({ type: 'CACHE_DONE', done, total, ok });
      }
    })());
    return;
  }

  // App chiede stato della cache foto
  if (data.type === 'PHOTOS_STATUS') {
    event.waitUntil((async () => {
      const cache = await caches.open(PHOTOS_CACHE);
      const keys = await cache.keys();
      if (event.source) {
        event.source.postMessage({ type: 'PHOTOS_STATUS_REPLY', count: keys.length });
      }
    })());
    return;
  }

  // App chiede di svuotare la cache foto (settings)
  if (data.type === 'CLEAR_PHOTOS') {
    event.waitUntil((async () => {
      await caches.delete(PHOTOS_CACHE);
      if (event.source) event.source.postMessage({ type: 'CLEAR_PHOTOS_DONE' });
    })());
    return;
  }

  // App chiede al SW di attivarsi subito (skip waiting)
  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
