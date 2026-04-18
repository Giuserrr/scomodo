# Scomodo Podcast — sito

Sito statico in **Astro** + **Tailwind CSS v4** per il podcast editoriale del brand
Lei Studia Lui Stappa, con CMS Decap integrato (`/admin`) e deploy su Netlify.

- Live (futuro): https://scomodo.net
- Repo: https://github.com/Giuserrr/scomodo

---

## Stack

- **Astro 6** · static output (`trailingSlash: 'never'`)
- **Tailwind CSS v4** (config via `@theme` in CSS, senza `tailwind.config.*`)
- **Content Collections** (`src/content/episodes` + `src/content/pages`) con schema Zod
- **Decap CMS 3.x** (`public/admin`) · backend `git-gateway` · `editorial_workflow`
- **Netlify** — hosting + Forms + Identity + Git Gateway
- **Fontsource Variable** — Fraunces (display) + Inter (body)
- **lite-youtube-embed** — custom element leggero (no iframe iniziale)

---

## Setup locale

```bash
git clone git@github.com:Giuserrr/scomodo.git
cd scomodo
npm install
cp .env.example .env
npm run dev
# → http://localhost:4321
```

Comandi utili:

```bash
npm run dev       # dev server con HMR
npm run build     # build produzione in dist/
npm run preview   # serve locale del build
npx astro check   # type check + validazione content collections
node scripts/trim-logo.mjs   # re-trim del logo in public/images/logo.png
```

### Variabili d'ambiente

| Var                       | Scope   | Descrizione                                 |
|---------------------------|---------|---------------------------------------------|
| `PUBLIC_PLAUSIBLE_DOMAIN` | client  | Se valorizzata → iniezione script Plausible |

Su Netlify, impostale in *Site settings → Environment variables*.

---

## Struttura

```
src/
  content.config.ts            schema Zod delle collections
  content/
    episodes/*.md              una puntata = un markdown
    pages/site.json            settings / about / contact / stats
  components/                  EpisodeCard, Footer, LiteYouTube, Nav, SEO, StatsCounter
  layouts/BaseLayout.astro
  lib/youtube.ts
  pages/
    index.astro                home
    chi-siamo.astro
    collaboriamo.astro
    contatti.astro             form Netlify
    podcast/index.astro        archivio con filtri tag + sort
    podcast/[...slug].astro    puntata singola
  styles/global.css
public/
  admin/                       Decap CMS
  images/logo.png              logo trimmato (150x84)
  __forms.html                 stub per detection form Netlify
```

---

## Deploy su Netlify

### 1. Collega il repo

1. https://app.netlify.com → *Add new site* → *Import an existing project*
2. Collega GitHub → seleziona `Giuserrr/scomodo`
3. Build command: `npm run build` · Publish directory: `dist` (già in `netlify.toml`)
4. Deploy

In alternativa da terminale:

```bash
netlify init       # collega il progetto corrente a un site Netlify
netlify deploy     # deploy preview
netlify deploy --prod
```

### 2. Dominio `scomodo.net`

1. Netlify → *Domain management* → *Add custom domain* → `scomodo.net`
2. Su **Namecheap** (Advanced DNS di scomodo.net):
   - **Rimuovi** il `CNAME www → parkingpage.namecheap.com` e `URL Redirect @`
   - **Aggiungi** `A Record` · host `@` · value `75.2.60.5`
   - **Aggiungi** `CNAME` · host `www` · value `<NOME-SITO>.netlify.app`
3. In Netlify, attiva HTTPS (Let's Encrypt, automatico).

### 3. Netlify Identity + Git Gateway (serve al CMS)

Senza questi, `/admin` non può scrivere su GitHub.

1. Netlify → *Site configuration → Identity* → **Enable Identity**
2. *Registration preferences*: **Invite only**
3. *External providers*: opzionale (GitHub / Google)
4. *Services → Git Gateway* → **Enable Git Gateway**
5. *Identity → Invite users* → aggiungi gli editor (email)

### 4. Abilitare Netlify Forms

Il form `/contatti` ha `data-netlify="true"`. Netlify riconosce il form grazie a `public/__forms.html` (già presente). Le submission arrivano in Netlify → *Forms*.

---

## Usare il CMS (`/admin`)

1. `https://scomodo.net/admin`
2. Click **Login with Netlify Identity**
3. Due collection:
   - **Puntate** — ogni markdown in `src/content/episodes`
   - **Pagine (impostazioni)** — `site.json` (settings, bio, contatti, stats)

### Pubblicare una nuova puntata

1. Admin → *Puntate* → **New Puntata**
2. Compila titolo, data, durata, URL YouTube
3. (Opz.) Spotify, tag, ospiti, vini citati
4. Scrivi le show notes in Markdown
5. *In evidenza in home* solo se vuoi forzarla come hero
6. **Save** → Draft
7. **Workflow**: Ready → Published → commit su `main` → Netlify rebuild automatico

### Aggiornare stats / bio

Pagine → Sito → cambia valori → Save → Publish.

---

## Modello dati (frontmatter puntata)

```yaml
---
title: "Titolo"
date: 2026-04-10
duration: "38:56"
description: "Hook per social e OG."
youtube_url: "https://www.youtube.com/watch?v=ABCDEFGHIJK"
spotify_url: ""
thumbnail: ""
tags: [franciacorta, clima]
guests:
  - { name: "Ospite", role: "Produttore", instagram_url: "" }
wines_mentioned:
  - { name: "Vino", winery: "Cantina", link: "" }
featured: false
---

Show notes Markdown.
```

---

## Performance & SEO

- Zero JS di default, isole JS solo dove servono
- `lite-youtube` → nessun iframe caricato fino al click
- `@fontsource-variable` self-hosted + preconnect a `i.ytimg.com`
- Sitemap auto (`@astrojs/sitemap`) → `/sitemap-index.xml`
- JSON-LD `PodcastSeries` (home) + `PodcastEpisode` (puntata)
- OpenGraph dinamico per puntata (thumb YouTube come og:image)
