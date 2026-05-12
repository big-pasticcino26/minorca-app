# Minorca App — Setup PWA

## 📁 Struttura finale del repo `minorca-app`

```
minorca-app/
├── index.html               ← il tuo file (con le 2 patch applicate)
├── manifest.json            ← (nuovo)
├── sw.js                    ← (nuovo)
├── icon-192.png             ← copia da minorca-photos/logo.png, ridimensiona a 192x192
├── icon-512.png             ← copia da minorca-photos/logo.png, ridimensiona a 512x512
└── icon-512-maskable.png    ← versione "maskable" con padding (vedi sotto)
```

## 🎨 Le icone (importanti per il cassetto delle app)

Hai già `logo.png` nel repo `minorca-photos`. Servono 3 versioni:

### icon-192.png e icon-512.png
Sono il tuo `logo.png` ridimensionato:
- **icon-192.png** → 192×192 pixel
- **icon-512.png** → 512×512 pixel

Puoi usare qualsiasi editor (anche online: squoosh.app, iloveimg.com).

### icon-512-maskable.png — **questo è la chiave per il cassetto app Android!**

Android **ritaglia le icone** (cerchio, squircle, ecc.) a seconda del launcher.
Se la tua icona arriva fino al bordo, viene tagliata. La versione "maskable"
ha un margine di sicurezza del ~20% intorno al contenuto.

**Come crearla:**
1. Vai su **maskable.app/editor**
2. Carica il tuo `logo.png`
3. Riduci lo zoom finché il contenuto entra nella "safe zone" centrale
4. Scarica → salva come `icon-512-maskable.png`

Senza questa, il logo nel cassetto Android potrebbe apparire schiacciato o tagliato.

---

## 🚀 Pubblicazione su GitHub Pages

1. **Crea il repo** `minorca-app` (separato da `minorca-photos`)
2. **Carica tutti i file** elencati sopra
3. **Settings → Pages**:
   - Source: `Deploy from a branch`
   - Branch: `main` / folder: `/ (root)`
   - Save
4. Aspetta 1-2 minuti, poi vai su:
   ```
   https://big-pasticcino26.github.io/minorca-app/
   ```

---

## 📱 Installazione

### Android (Chrome)
- Apri il link → menù `⋮` → **"Installa app"**
- L'icona appare in Home **e nel cassetto delle app** ✅

### iPhone (Safari)
- Apri il link → tasto Condividi (↑) → **"Aggiungi alla schermata Home"**
- iOS non ha un cassetto app: l'icona va solo in Home

### Verifica che funzioni
Apri `chrome://inspect` o gli strumenti sviluppatore → tab **Application** → 
controlla che `Service Workers` mostri `sw.js` attivo e `Manifest` 
mostri le icone correttamente.

---

## 🔄 Quando aggiorni l'app

Modifica `index.html` e ricarica su GitHub:
- Gli utenti vedranno l'aggiornamento alla **prossima apertura** (il SW scarica la nuova versione in background)
- Per forzare aggiornamenti immediati, aumenta `CACHE_VERSION` in `sw.js` (es. `'v1'` → `'v2'`)

---

## 🐛 Se qualcosa non funziona

| Sintomo | Soluzione |
|---|---|
| Niente prompt "Installa" su Chrome | Verifica HTTPS (GitHub Pages è HTTPS) e che `sw.js` sia raggiungibile |
| L'icona è bianca o sbagliata | Pulisci cache del browser: `chrome://settings/clearBrowserData` |
| L'app non si aggiorna mai | Aumenta `CACHE_VERSION` in `sw.js` |
| Service worker non si registra | Apri DevTools → Console: leggi l'errore esatto |
