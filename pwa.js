/* ============================================================================
 * Minorca PWA — Helper di runtime
 * ============================================================================
 * Gestisce features PWA-specifiche, isolate dall'app principale:
 *   • Banner di installazione (Android/desktop via beforeinstallprompt, iOS via istruzioni)
 *   • Indicatore stato online/offline nel corner
 *   • Bottone "Scarica foto per uso offline" (post-message al service worker)
 *   • Aggiornamento automatico quando una nuova versione del SW è disponibile
 * ========================================================================== */
(function () {
  'use strict';

  // ── Stili iniettati (self-contained, evitano dipendenze da app.css) ──────
  const css = `
    .mnc-pwa-banner {
      position: fixed; left: 12px; right: 12px;
      top: calc(env(safe-area-inset-top, 0px) + 12px);
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 12px 32px rgba(15,23,42,.18), 0 2px 6px rgba(15,23,42,.06);
      padding: 14px 16px;
      display: flex; align-items: center; gap: 12px;
      z-index: 9999;
      font-family: "Plus Jakarta Sans", system-ui, sans-serif;
      transform: translateY(-120%);
      opacity: 0;
      transition: transform 320ms cubic-bezier(.32,.72,0,1), opacity 220ms ease;
    }
    .mnc-pwa-banner.show { transform: translateY(0); opacity: 1; }
    .mnc-pwa-banner .ico {
      width: 38px; height: 38px; flex: 0 0 38px;
      border-radius: 11px; background: #1373E6;
      display: grid; place-items: center; color: #fff; font-size: 20px;
    }
    .mnc-pwa-banner .txt { flex: 1; min-width: 0; }
    .mnc-pwa-banner .t1 { font-weight: 700; color: #0E1B2C; font-size: 14px; line-height: 1.25; }
    .mnc-pwa-banner .t2 { color: #4A5567; font-size: 12.5px; line-height: 1.3; margin-top: 2px; }
    .mnc-pwa-banner button {
      font: inherit; cursor: pointer; border: 0;
      background: #1373E6; color: #fff; font-weight: 700;
      padding: 8px 14px; border-radius: 10px; font-size: 13px;
    }
    .mnc-pwa-banner .dismiss {
      background: transparent; color: #94A3B8;
      padding: 6px 8px; font-size: 18px; line-height: 1;
    }

    .mnc-offline-chip {
      position: fixed;
      top: calc(env(safe-area-inset-top, 0px) + 10px);
      right: 12px;
      background: #475569; color: #fff;
      font-family: "Plus Jakarta Sans", system-ui, sans-serif;
      font-size: 11px; font-weight: 700;
      padding: 6px 10px; border-radius: 999px;
      box-shadow: 0 4px 12px rgba(15,23,42,.18);
      z-index: 9998;
      display: none;
      align-items: center; gap: 6px;
      letter-spacing: .02em; text-transform: uppercase;
    }
    .mnc-offline-chip.show { display: inline-flex; }
    .mnc-offline-chip::before {
      content: ''; width: 7px; height: 7px; border-radius: 50%;
      background: #FBBF24;
    }

    .mnc-photos-fab {
      position: fixed;
      right: 14px;
      bottom: calc(var(--nav-h, 60px) + env(safe-area-inset-bottom, 0px) + 14px);
      background: #fff;
      color: #0E1B2C;
      border: 1px solid #E2E8F0;
      border-radius: 999px;
      padding: 10px 14px 10px 12px;
      font-family: "Plus Jakarta Sans", system-ui, sans-serif;
      font-weight: 700; font-size: 13px;
      box-shadow: 0 10px 28px rgba(15,23,42,.14), 0 2px 6px rgba(15,23,42,.06);
      z-index: 9997;
      display: none;
      align-items: center; gap: 8px;
      cursor: pointer;
      transition: opacity 400ms ease, transform 400ms ease;
      opacity: 1;
    }
    .mnc-photos-fab.show { display: inline-flex; }
    .mnc-photos-fab.hiding { opacity: 0; transform: translateY(20px); pointer-events: none; }
    .mnc-photos-fab .dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #1373E6;
    }
    .mnc-photos-fab.done .dot { background: #059669; }
    .mnc-photos-fab.loading .dot { background: #F59E0B; animation: mncPulse 1s ease-in-out infinite; }
    @keyframes mncPulse { 0%,100% { opacity: 1; } 50% { opacity: .4; } }

    .mnc-photos-fab small {
      font-weight: 600; color: #94A3B8; font-size: 11px;
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── Helper: localStorage sicuro ──────────────────────────────────────────
  const store = {
    get(k)    { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); }    catch (e) {} },
    del(k)    { try { localStorage.removeItem(k); }    catch (e) {} }
  };

  // ════════════════════════════════════════════════════════════════════════
  // 1) INSTALL BANNER
  // ════════════════════════════════════════════════════════════════════════
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  let deferredInstall = null;

  function makeBanner({ title, subtitle, action, onAction }) {
    const b = document.createElement('div');
    b.className = 'mnc-pwa-banner';
    b.innerHTML = `
      <div class="ico">📲</div>
      <div class="txt">
        <div class="t1"></div>
        <div class="t2"></div>
      </div>
      ${action ? '<button class="cta"></button>' : ''}
      <button class="dismiss" aria-label="Chiudi">×</button>
    `;
    b.querySelector('.t1').textContent = title;
    b.querySelector('.t2').textContent = subtitle;
    if (action) b.querySelector('.cta').textContent = action;
    b.querySelector('.dismiss').addEventListener('click', () => hideBanner(b));
    if (action && onAction) b.querySelector('.cta').addEventListener('click', () => onAction(b));
    document.body.appendChild(b);
    // Defer per consentire la transizione
    requestAnimationFrame(() => requestAnimationFrame(() => b.classList.add('show')));
    return b;
  }

  function hideBanner(b) {
    b.classList.remove('show');
    setTimeout(() => b.remove(), 340);
  }

  // Android/desktop: cattura l'evento e mostra banner
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstall = e;
    if (store.get('mnc_install_dismissed') === '1') return;
    if (isStandalone) return;
    makeBanner({
      title: 'Installa Minorca',
      subtitle: 'Aggiungila alla home per usarla come app vera',
      action: 'Installa',
      onAction: async (b) => {
        if (!deferredInstall) return;
        deferredInstall.prompt();
        const choice = await deferredInstall.userChoice;
        if (choice.outcome === 'dismissed') store.set('mnc_install_dismissed', '1');
        deferredInstall = null;
        hideBanner(b);
      }
    });
  });

  // iOS: nessun evento. Mostra istruzioni se non standalone, primo accesso.
  if (isIOS && !isStandalone && store.get('mnc_ios_install_dismissed') !== '1') {
    window.addEventListener('load', () => {
      // Aspetta che la welcome screen sia gestita
      setTimeout(() => {
        const b = makeBanner({
          title: 'Installa sulla home',
          subtitle: 'Tocca ⎙ in Safari, poi "Aggiungi a Home"',
          action: null
        });
        b.querySelector('.dismiss').addEventListener('click', () => {
          store.set('mnc_ios_install_dismissed', '1');
        });
      }, 1500);
    });
  }

  // ════════════════════════════════════════════════════════════════════════
  // 2) INDICATORE OFFLINE
  // ════════════════════════════════════════════════════════════════════════
  const offlineChip = document.createElement('div');
  offlineChip.className = 'mnc-offline-chip';
  offlineChip.textContent = 'Offline';
  offlineChip.title = 'Sei senza rete. L\'app funziona, ma Maps e prenotazioni non si aprono.';
  document.body.appendChild(offlineChip);

  function updateOnlineStatus() {
    if (navigator.onLine) {
      offlineChip.classList.remove('show');
    } else {
      offlineChip.classList.add('show');
    }
  }
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();

  // ════════════════════════════════════════════════════════════════════════
  // 3) BOTTONE "SCARICA FOTO PER OFFLINE"
  // ════════════════════════════════════════════════════════════════════════
  // Si attiva quando window.__MNC_ALL_PHOTOS è disponibile (esposto da app.js).
  const fab = document.createElement('button');
  fab.className = 'mnc-photos-fab';
  fab.type = 'button';
  fab.innerHTML = `<span class="dot"></span><span class="label">Foto offline</span><small></small>`;
  document.body.appendChild(fab);

  const fabLabel = fab.querySelector('.label');
  const fabSmall = fab.querySelector('small');

  function setFabState(state, text, sub) {
    fab.classList.remove('loading', 'done');
    if (state) fab.classList.add(state);
    if (text != null) fabLabel.textContent = text;
    if (sub != null)  fabSmall.textContent = sub;
  }

  function showFabVisible() {
    fab.classList.add('show');
    fab.classList.remove('hiding');
  }

  function hideFab(animated) {
    if (animated) {
      fab.classList.add('hiding');
      setTimeout(() => fab.classList.remove('show'), 450);
    } else {
      fab.classList.remove('show');
      fab.classList.remove('hiding');
    }
  }

  function getAllPhotos() {
    const list = window.__MNC_ALL_PHOTOS;
    if (Array.isArray(list) && list.length) return list;
    // Fallback: scansiona il DOM (cattura solo le immagini già renderizzate)
    const found = new Set();
    document.querySelectorAll('img[src]').forEach((img) => {
      const u = img.src;
      if (u && (u.includes('cdn.jsdelivr.net') || u.includes('wikimedia.org'))) found.add(u);
    });
    return [...found];
  }

  // L'utente può forzare il refresh aggiungendo ?refreshPhotos all'URL
  const forceRefresh = /[?&]refreshPhotos\b/.test(location.search);

  function checkCacheStatus() {
    const photos = getAllPhotos();
    if (!photos.length) return;
    // Chiedi al SW lo stato della cache foto. La risposta arriva via messaggio.
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'PHOTOS_STATUS' });
    }
  }

  // Tenta di controllare lo stato cache dopo che app.js ha completato il render
  let fabAttempts = 0;
  function tryCheckCache() {
    if (window.__MNC_ALL_PHOTOS || fabAttempts > 20) {
      checkCacheStatus();
      return;
    }
    fabAttempts++;
    setTimeout(tryCheckCache, 250);
  }
  window.addEventListener('load', () => setTimeout(tryCheckCache, 800));

  fab.addEventListener('click', () => {
    if (fab.classList.contains('loading')) return;
    const photos = getAllPhotos();
    if (!photos.length) {
      setFabState(null, 'Nessuna foto', '');
      return;
    }
    if (!navigator.serviceWorker || !navigator.serviceWorker.controller) {
      setFabState(null, 'SW non pronto', 'ricarica la pagina');
      return;
    }
    if (!confirm(`Scaricare ${photos.length} foto per l'uso offline?\n\nPotrebbero essere 20-50 MB.`)) return;
    setFabState('loading', 'Scarico…', '0%');
    navigator.serviceWorker.controller.postMessage({ type: 'CACHE_PHOTOS', urls: photos });
  });

  // Messaggi dal Service Worker
  if (navigator.serviceWorker) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      const msg = event.data || {};
      if (msg.type === 'CACHE_PROGRESS') {
        const pct = Math.round((msg.done / msg.total) * 100);
        setFabState('loading', 'Scarico…', pct + '%');
        showFabVisible();
      } else if (msg.type === 'CACHE_DONE') {
        setFabState('done', 'Foto in cache', msg.ok + '/' + msg.total);
        store.set('mnc_photos_cached', String(msg.ok));
        showFabVisible();
        // Dopo 4 secondi, nascondi con fade
        setTimeout(() => hideFab(true), 4000);
      } else if (msg.type === 'PHOTOS_STATUS_REPLY') {
        // Logica chiave: mostra il bottone solo se la cache è vuota,
        // o se l'utente ha forzato il refresh con ?refreshPhotos
        if (msg.count > 0 && !forceRefresh) {
          // Foto già scaricate: bottone NASCOSTO, non rompe la UI
          hideFab(false);
        } else {
          // Foto mancanti (primo setup) o refresh forzato: mostra il bottone
          setFabState(null, 'Foto offline', msg.count > 0 ? 'aggiorna' : '');
          showFabVisible();
        }
      } else if (msg.type === 'CLEAR_PHOTOS_DONE') {
        setFabState(null, 'Foto offline', '');
        showFabVisible();
      }
    });
  }

  // ════════════════════════════════════════════════════════════════════════
  // 4) AUTO-UPDATE quando esce una nuova versione del SW
  // ════════════════════════════════════════════════════════════════════════
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // Quando il nuovo SW prende il controllo, ricarica per usare i nuovi asset
      if (window.__mncReloading) return;
      window.__mncReloading = true;
      window.location.reload();
    });
  }
})();
