# Guida deploy su GitHub Pages — Minorca PWA

> Per principianti. Tempo stimato: 20 minuti.

---

## Cosa ti serve

- Account GitHub (gratuito)
- I 12 file della PWA scaricati sul PC, organizzati così:

```
minorca-pwa/
├── index.html
├── app.css
├── app.js
├── pwa.js
├── manifest.webmanifest
├── sw.js
├── offline.html
├── README.md
└── icons/
    ├── icon-192.png
    ├── icon-512.png
    ├── icon-maskable-512.png
    └── apple-touch-180.png
```

---

## STEP 1 — Crea il repository

1. Vai su [github.com](https://github.com) e fai login
2. In alto a destra: **+** → **New repository**
3. Repository name: `minorca-app` (niente spazi, tutto minuscolo)
4. Lascia **Public** (Pages gratis funziona solo su repo public)
5. Spunta ✅ **Add a README file**
6. Clicca **Create repository**

---

## STEP 2 — Carica i file

1. Nel nuovo repo, clicca **Add file** → **Upload files**
2. Sul PC, apri la cartella `minorca-pwa`
3. Seleziona **tutto il contenuto** (i 7 file + la cartella `icons` intera)
4. Trascinala nel browser
5. GitHub manterrà la struttura — la cartella `icons/` resterà sottocartella
6. In fondo alla pagina, commit message: `Prima versione PWA`
7. Clicca **Commit changes**

Quando torni alla home del repo dovresti vedere tutti i file elencati,
inclusa la cartella `icons` che si apre cliccandoci sopra.

---

## STEP 3 — Attiva GitHub Pages

1. Nel repo, clicca **Settings** (in alto, ingranaggio)
2. Menu sinistra → **Pages**
3. Sotto "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **main** / folder: **/ (root)**
4. Clicca **Save**
5. Aspetta 1-2 minuti
6. Ricarica la pagina Settings → Pages
7. In alto compare un box verde: **"Your site is live at..."**

Il tuo URL sarà:

```
https://big-pasticcino26.github.io/minorca-app/
```

---

## STEP 4 — Installa l'app sul telefono

Apri il link dal telefono.

### Android (Chrome)
- Dovrebbe spuntare il banner "Installa Minorca" → tocca **Installa**
- Se non spunta: menu ⋮ → **Installa app** o **Aggiungi a schermata Home**

### iPhone (Safari obbligatorio, NON Chrome iOS)
- Tocca il pulsante **Condividi** ⎙ in basso al centro
- Scorri → **Aggiungi a Home**

Dopo l'install, l'icona compare sulla home come una vera app.

---

## STEP 5 — Pre-scarica le foto (PRIMA della partenza)

1. Connettiti al Wi-Fi
2. Apri l'app installata
3. In basso a destra: pulsantino **"📥 Foto offline"**
4. Toccalo, conferma, aspetta 1-2 minuti
5. Quando finisce, il pulsantino diventa verde "Foto in cache"

Da questo momento tutte le foto sono salvate sul dispositivo.

---

## STEP 6 — Verifica che funzioni offline

Sul telefono:

1. Attiva modalità aereo
2. Apri l'app dalla home
3. Deve aprirsi normalmente, foto incluse
4. Solo i link esterni (Maps, Windfinder, prenotazioni) saranno irraggiungibili — è il comportamento corretto

---

## Aggiornamenti futuri

Per modificare qualcosa (testo, una cala, ecc.):

1. Sul repo, clicca il file da modificare (es. `app.js`)
2. Clicca matita 🖊️ in alto a destra
3. Modifica → in fondo clicca **Commit changes**

### ⚠️ IMPORTANTE: bump CACHE_VERSION

Dopo ogni modifica significativa, apri **`sw.js`**, cerca questa riga:

```js
const CACHE_VERSION = 'v1';
```

E cambiala in `'v2'`, poi `'v3'`, ecc.

**Senza questo, chi ha installato l'app continua a vedere la versione vecchia per sempre** (il service worker serve dalla cache). Bumpando la versione, al prossimo refresh i dispositivi scaricano i file nuovi automaticamente.

Pages rideploya in 30 secondi dopo ogni commit.

---

## Sostituire le icone placeholder col tuo logo

Le icone attuali sono geometriche (palma + sole + onde). Funzionano, ma se vuoi il tuo logo reale (es. quello già su `minorca-photos`):

1. Vai su [realfavicongenerator.net](https://realfavicongenerator.net) dal PC
2. Carica il tuo `logo.png` (consigliato 1024×1024, sfondo opaco)
3. Configura come vuoi → clicca **Generate**
4. Scarica lo ZIP, estrailo
5. Rinomina i file:
   - `android-chrome-192x192.png` → `icon-192.png`
   - `android-chrome-512x512.png` → `icon-512.png`
   - `apple-touch-icon.png` → `apple-touch-180.png`
6. Per la **maskable** (Android adaptive icon):
   - Vai su [maskable.app/editor](https://maskable.app/editor)
   - Carica il logo, regola lo zoom (il contenuto deve stare nel cerchio centrale)
   - Esporta a 512×512 → salva come `icon-maskable-512.png`
7. Sul repo, naviga dentro `icons/`, clicca **Add file** → **Upload files**, sostituisci i 4 PNG
8. Bumpa `CACHE_VERSION` in `sw.js`

---

## Problemi comuni

| Sintomo | Soluzione |
|---|---|
| **404 dopo Pages attivato** | Aspetta 2-3 minuti per il primo deploy. Controlla che `index.html` sia alla root, non in sottocartella |
| **Modifiche non visibili** | Hai bumpato `CACHE_VERSION`? Hard-quit dell'app sul telefono e riapri |
| **SW non si registra** | L'URL deve essere `https://`. GitHub Pages serve sempre HTTPS sull'URL ufficiale |
| **iPhone non mostra banner install** | Normale. iOS richiede aggiunta manuale via Safari → Condividi → Aggiungi a Home |
| **Foto offline non funziona** | Aspetta qualche secondo dopo l'apertura dell'app prima di toccare il pulsante. Serve che la lista foto venga popolata |
| **DevTools dice "Manifest not detected"** | Controlla che `manifest.webmanifest` sia accessibile aprendo `https://tuonome.github.io/minorca-app/manifest.webmanifest` |

---

## Test diagnostico (PC, Chrome)

Per essere sicuro che tutto funzioni come PWA:

1. Apri l'URL su Chrome desktop
2. F12 → tab **Application**
3. **Manifest** (a sinistra): tutti i campi verdi, icone visibili
4. **Service Workers**: "activated and is running"
5. **Cache Storage**: vedi `minorca-shell-v1` con dentro tutti i file della shell
6. Tab **Network** → spunta "**Offline**" → F5 → l'app deve aprirsi lo stesso

Se questi 5 punti sono OK, la PWA è perfetta.
