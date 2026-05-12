/* ============================================================================
 * Service Worker — Minorca in Famiglia
 * ============================================================================
 * Strategie di cache:
 *  - App shell (index.html, manifest, icone)  → Stale-While-Revalidate
 *  - Foto da jsDelivr (GitHub)                → Cache-First (immutabili)
 *  - Foto da Wikimedia Commons                → Cache-First (immutabili)
 *  - Fonts Google                             → Cache-First
 *  - Tutto il resto                           → Network-First con fallback
 *
 * Quando aggiorni l'app: cambia CACHE_VERSION e il SW farà pulizia automatica.
 * ============================================================================ */

const CACHE_VERSION = 'v1';
const SHELL_CACHE   = `minorca-shell-${CACHE_VERSION}`;
const PHOTOS_CACHE  = `minorca-photos-${CACHE_VERSION}`;
const FONTS_CACHE   = `minorca-fonts-${CACHE_VERSION}`;

// File che vogliamo SEMPRE disponibili offline (app shell)
const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// ── INSTALL: precarica l'app shell ──────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
      // addAll fallisce in blocco se UN file manca; usiamo add singolo + catch
      // così se per esempio icon-512.png non esiste ancora, l'install va avanti.
      return Promise.all(
        SHELL_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[SW] Skipped precache for', url, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: pulisci cache vecchie ─────────────────────────────────────────
self.addEventListener('activate', (event) => {
  const validCaches = new Set([SHELL_CACHE, PHOTOS_CACHE, FONTS_CACHE]);
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (!validCaches.has(key)) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: smista in base al tipo di risorsa ────────────────────────────────
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Solo GET — POST/PUT non vanno cachate
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 1) Foto personali da jsDelivr (GitHub repo minorca-photos)
  if (url.hostname === 'cdn.jsdelivr.net') {
    event.respondWith(cacheFirst(req, PHOTOS_CACHE));
    return;
  }

  // 2) Foto fallback da Wikimedia Commons
  if (url.hostname === 'commons.wikimedia.org' || url.hostname === 'upload.wikimedia.org') {
    event.respondWith(cacheFirst(req, PHOTOS_CACHE));
    return;
  }

  // 3) Google Fonts
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(req, FONTS_CACHE));
    return;
  }

  // 4) App shell (same-origin) → Stale-While-Revalidate
  //    Mostra subito la cache, aggiorna in background.
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(req, SHELL_CACHE));
    return;
  }

  // 5) Default: prova la rete, se fallisce usa la cache (se esiste)
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});

// ── STRATEGIE ───────────────────────────────────────────────────────────────

// Cache-First: se è in cache restituiscila subito, altrimenti scarica e salva.
// Perfetta per risorse immutabili (foto identificate dall'URL).
async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  if (cached) return cached;

  try {
    const fresh = await fetch(req);
    // Salva solo se la risposta è valida (status 200 oppure opaque per CDN cross-origin)
    if (fresh && (fresh.status === 200 || fresh.type === 'opaque')) {
      cache.put(req, fresh.clone());
    }
    return fresh;
  } catch (err) {
    // Offline e niente in cache → la <img onerror> dell'app passerà al fallback
    return new Response('', { status: 504, statusText: 'Offline' });
  }
}

// Stale-While-Revalidate: restituisci subito la cache (veloce), poi aggiorna
// in background per la prossima volta. Ideale per l'app shell.
async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);

  const networkPromise = fetch(req).then((fresh) => {
    if (fresh && fresh.status === 200) {
      cache.put(req, fresh.clone());
    }
    return fresh;
  }).catch(() => null);

  // Se ho già la cache, ritorno quella e l'aggiornamento avviene in background.
  // Se non ho cache, aspetto la rete.
  return cached || networkPromise || new Response('Offline', { status: 504 });
}

// ── MESSAGGI dall'app (es. per forzare l'update) ────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
