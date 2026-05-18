# Minorca PWA — guida rapida

App planner di viaggio in versione **Progressive Web App completa**: installabile,
funziona offline, manifest e service worker proper.

## Struttura

```
minorca/
├── index.html              ← shell HTML pulita (~40 righe)
├── app.css                 ← stile (estratto, 2500 righe)
├── app.js                  ← logica app (estratto, 3000 righe)
├── pwa.js                  ← helper PWA (install/offline/download foto)
├── manifest.webmanifest    ← manifest statico
├── sw.js                   ← service worker (3 cache: shell + foto + font)
├── offline.html            ← fallback se la shell non è in cache
└── icons/
    ├── icon-192.png
    ├── icon-512.png
    ├── icon-maskable-512.png    (con safe zone per Android adaptive)
    └── apple-touch-180.png
```

## Deploy

**Requisito assoluto: HTTPS.** I service worker non funzionano su HTTP
(eccetto `localhost`). Opzioni gratuite immediate:

- **GitHub Pages** — pusha la cartella, abilita Pages → HTTPS automatico
- **Netlify** — `netlify deploy` da CLI o drag-and-drop della cartella
- **Cloudflare Pages** o **Vercel** — equivalenti

Tutto va alla **root** del sito (es. `tuodominio.com/`). Se metti l'app in
una sottocartella, aggiorna `start_url` e `scope` nel `manifest.webmanifest`
e il `register('./sw.js')` deve avere lo scope giusto.

## Test in locale

```bash
# Python 3 (semplice e sempre disponibile)
cd minorca/
python3 -m http.server 8080

# Apri http://localhost:8080 — su localhost il SW funziona anche senza HTTPS
```

DevTools → **Application** → controlla:
- **Manifest** → tutti i campi verdi, nessun warning sulle icone
- **Service Workers** → "activated and running"
- **Storage** → Cache Storage dovrebbe avere `minorca-shell-v1` con tutti i file

Poi **DevTools → Network → Offline** e ricarica: l'app deve aprirsi comunque.

## Le icone sono placeholder

Le PNG in `icons/` sono geometriche (palma + sole + onde sul blu della
palette). Funzionano, ma se hai un logo definitivo:

1. Genera 4 versioni dello stesso logo:
   - `icon-192.png` (192×192)
   - `icon-512.png` (512×512)
   - `icon-maskable-512.png` (512×512 ma con il logo **dentro al 60% centrale**:
     Android taglia i bordi per adattare alla forma dell'OS)
   - `apple-touch-180.png` (180×180)
2. Sostituisci i file mantenendo gli stessi nomi
3. Bumpa `CACHE_VERSION` in `sw.js` (es. da `v1` a `v2`) per forzare l'update

Tool consigliati per generarle dal tuo logo: [maskable.app](https://maskable.app/editor)
oppure [realfavicongenerator.net](https://realfavicongenerator.net/).

## Cambiare nome dell'app

Edita questi tre punti:

1. `index.html` → tag `<title>` e meta `apple-mobile-web-app-title`
2. `manifest.webmanifest` → campi `name` e `short_name`
3. `sw.js` → bumpa `CACHE_VERSION` per forzare il refresh sui dispositivi installati

## Strategia di caching (in breve)

| Risorsa | Cache | Strategia | Quando si aggiorna |
|---|---|---|---|
| HTML/CSS/JS/icone/manifest | `minorca-shell-v1` | cache-first, precache all'install | quando bumpi `CACHE_VERSION` |
| Foto (jsDelivr + Wikimedia) | `minorca-photos-v1` | stale-while-revalidate | in background a ogni visita online |
| Google Fonts (woff2) | `minorca-fonts-v1` | stale-while-revalidate | al primo load online, poi offline |
| Google Maps, Windfinder, prenotazioni | — | passa diretto alla rete | sono link esterni veri, no cache |

Cap massimo cache foto: 200 voci (LRU automatico in `sw.js`).

## Foto offline

Le foto vengono cachate automaticamente quando vengono mostrate. Per
**precaricare tutto prima del viaggio**:

1. Connettiti a internet
2. Apri l'app
3. Tocca il pulsante **"Foto offline"** in basso a destra
4. Aspetta il completamento (può richiedere 1-2 minuti su Wi-Fi)

Dopo questo, anche con copertura zero a Minorca l'app è pienamente fluida.

## Modifiche all'app

- **CSS** → edita `app.css` direttamente
- **Logica/contenuti** → edita `app.js`
- **Shell HTML** → edita `index.html`
- **Comportamento PWA** → edita `pwa.js` (banner install, indicatori, ecc.)
- **Cache** → edita `sw.js` e bumpa `CACHE_VERSION`

Dopo qualsiasi modifica significativa, **incrementa `CACHE_VERSION`** in
`sw.js` (es. `'v1'` → `'v2'`). Altrimenti i dispositivi che hanno già
installato vecchie versioni continueranno a servire i file vecchi dalla
cache.

## Cosa è cambiato rispetto al single-file originale

| Prima | Adesso |
|---|---|
| 1 file HTML da 290 KB | 4 file principali (HTML/CSS/JS/PWA) + assets |
| `user-scalable=no` (anti-accessibility) | Zoom utente permesso |
| Manifest generato come `data:` URI a runtime | Manifest statico (compatibile iOS) |
| Icone runtime SVG da emoji | Icone PNG vere 192/512/maskable |
| Niente service worker → schermata bianca offline | SW con 3 strategie di cache |
| Foto da rete sempre | Foto cachate con stale-while-revalidate + bottone download bulk |
| Font da rete a ogni load | Font cachati nel SW dopo il primo load |
| Nessun indicatore di stato rete | Chip "offline" nel corner |
| Nessun prompt di installazione | Banner install (Android nativo, iOS con istruzioni) |
