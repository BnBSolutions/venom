# Gorillaz Crew Merch (TypeScript)

Magazinul de merch care se deschide din botul de Telegram.

## Structura
- `src/` – codul TypeScript
  - `main.ts` – pornirea magazinului
  - `types.ts` – tipurile (produs, coș, comandă)
  - `catalog.ts` – produsele, prețurile, culorile; catalog nou din adresă (`?p=`)
  - `cart.ts` – coșul (ținut minte pe telefon)
  - `order.ts` – validarea formularului și comanda trimisă botului
  - `telegram.ts` – legătura cu Telegram
  - `art.ts` – desenele tricoului, hanoracului, stickerelor
  - `ui/` – ecranele: lista, produsul, coșul, comanda
- `public/` – site-ul gata de pus online (`index.html`, `styles.css`, `assets/`, `js/` compilat)

## Cum îl construiești
```
npm install
npm run build
```
Codul compilat apare în `public/js/`. Conținutul folderului `public/` se pune pe GitHub Pages (în `merch/`).

Pentru test local: `npx serve public` (modulele JS nu merg deschizând fișierul direct).
