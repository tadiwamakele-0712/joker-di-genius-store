# Joker Di Genius Store

Official music store — stream, download & discover tracks from **Joker Di Genius**.

**Folder:** `joker-di-genius-store`

## Live site

https://tadiwamakele-0712.github.io/joker-di-genius-store/

## Open locally

1. Open **`joker-digenius-store/index.html`** in your browser (double-click or drag into Chrome/Edge).
2. If a track does not play, click **▶ on the bottom player bar** — browsers sometimes block auto-play until you interact.
3. For best results, run a local server from this folder:
   `python -m http.server 8080` then visit `http://localhost:8080`

Music files live in `music/` (copied from the `joker-music` folder). To refresh tracks after adding files to `joker-music`, copy them into `joker-digenius-store/music/`.

## Features

- **21 tracks** from `joker-music` folder (stream + download)
- Search by title or artist
- Category filters (Dancehall, Riddim, Hip Hop, Collaborations, Gospel, Tribute)
- Play count tracking
- Comments on each track
- Fixed bottom audio player
- Social links (Facebook, Instagram, YouTube, TikTok, WhatsApp)
- **Admin dashboard** — upload new music (`admin.html`)

## Admin login

- URL: `admin.html`
- Default password: `joker2026`
- Change password after first login in the dashboard

## Social

- [Facebook](https://www.facebook.com/jokerdigenius)
- [Instagram](https://www.instagram.com/joker_di_genius)
- [YouTube](https://youtube.com/@jokerdigenius)
- [TikTok](https://www.tiktok.com/@jokerdigenius)
- WhatsApp: +44 7917 431957

## Tech

HTML5, CSS3, JavaScript, IndexedDB (uploads, comments, play counts)
