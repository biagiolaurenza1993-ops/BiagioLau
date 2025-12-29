# Guida al Deploy del Backend di GlowUp Pro

Questa guida spiega come pubblicare il tuo nuovo server backend Node.js su **Render.com** (un provider di hosting gratuito) e collegarlo alla tua app frontend.

## Prerequisiti
1.  **Account GitHub**: Ti serve un account GitHub per ospitare il codice del backend.
2.  **Account Render.com**: Iscriviti su [dashboard.render.com](https://dashboard.render.com/) usando il tuo account GitHub.
3.  **Git Installato**: Assicurati di avere Git installato sul tuo computer.

---

## Passo 1: Preparare il Backend per il Deploy

Dobbiamo mettere il codice del backend in un suo repository Git o caricare quello esistente.

### Opzione A: Il backend è una cartella separata (Consigliato)
1.  Apri il terminale nella cartella `c:\Users\Biagio\20\backend`.
2.  Inizializza un nuovo repository Git:
    ```bash
    git init
    git add .
    git commit -m "Commit iniziale backend"
    ```
    *(Nota: Abbiamo già creato un file `.gitignore` per assicurare che il file `.env` con la tua API Key NON venga caricato online. È fondamentale per la sicurezza.)*

3.  Crea un nuovo repository su GitHub (es. chiamato `glowup-backend`). **Non** inizializzarlo con README o .gitignore.
4.  Collega il tuo repo locale a GitHub e fai il push:
    ```bash
    git remote add origin https://github.com/ITUO_USERNAME/glowup-backend.git
    git branch -M main
    git push -u origin main
    ```

---

## Passo 2: Pubblicare su Render.com

1.  Vai alla tua [Dashboard di Render](https://dashboard.render.com/).
2.  Clicca su **"New +"** e seleziona **"Web Service"**.
3.  Seleziona **"Build and deploy from a Git repository"**.
4.  Connetti il tuo account GitHub se richiesto, e seleziona il repository `glowup-backend` che hai appena creato.
5.  **Configura il Servizio**:
    *   **Name**: `glowup-backend` (o simile)
    *   **Region**: Frankfurt (o il più vicino a te)
    *   **Branch**: `main`
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
    *   **Instance Type**: Free

6.  **Variabili d'Ambiente** (Passo Cruciale):
    *   Scorri giù fino alla sezione "Environment Variables".
    *   Clicca su **"Add Environment Variable"**.
    *   **Key**: `GEMINI_API_KEY`
    *   **Value**: Incolla la tua vera Google Gemini API Key qui (quella che hai attualmente nel file `.env` locale).
    *   *Opzionale*: Aggiungi `PORT` con valore `3000` (Render di solito lo gestisce in automatico, ma è più sicuro metterlo).

7.  Clicca su **"Create Web Service"**.

Render ora costruirà e pubblicherà il tuo server. Potrebbe volerci qualche minuto. Una volta finito, vedrai un badge verde "Live" e l'URL del tuo backend in alto (es. `https://glowup-backend-xyz.onrender.com`).

---

## Passo 3: Collegare il Frontend al Backend Pubblicato

Ora che il backend è online, devi dire alla tua app frontend di usare il nuovo URL invece di `localhost`.

### Per Sviluppo Locale / Test
1.  Crea un file chiamato `.env` nella cartella principale del progetto (`c:\Users\Biagio\20\.env`).
2.  Aggiungi la seguente riga, sostituendo l'URL con il tuo vero URL di Render:
    ```env
    VITE_API_URL=https://glowup-backend-xyz.onrender.com/api/generate
    ```
3.  Riavvia il frontend (ferma `npm run dev` e lancialo di nuovo).

### Per Produzione / Generazione APK
Quando crei il tuo APK Android, assicurati che il file `.env` esista come descritto sopra. Vite includerà automaticamente questo URL nell'applicazione durante il processo di build, così la tua app comunicherà con il server backend sicuro anche quando gira sul telefono.
