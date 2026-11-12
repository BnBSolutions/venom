/** Fereastra coșului. */
import { productArt } from "../art.js";
import { colorName, money } from "../catalog.js";
import { clickedButton, esc } from "../dom.js";
import type { Shop } from "./shop.js";

export function openCart(shop: Shop, openCheckout: () => void): void {
  const { cart, sheet } = shop;
  if (!cart.items.length) {
    sheet.close();
    return;
  }
  const rows = cart.items.map((l, i) => {
    const p = cart.product(l.id);
    if (!p) return "";
    const meta = [colorName(l.color), l.size].filter(Boolean).join(", ") || "Sticker";
    return `<div class="line"><div class="thumb">${productArt(p, l.color)}</div>
      <div><b>${esc(p.name)}</b><div class="meta">${esc(meta)}</div>
        <div class="qty"><button type="button" data-i="${i}" data-q="-1" aria-label="Mai puțin">−</button><output>${l.qty}</output><button type="button" data-i="${i}" data-q="1" aria-label="Mai mult">+</button></div></div>
      <div class="lp">${money(p.price * l.qty)}</div></div>`;
  }).join("");

  sheet.open(`<h2 id="sheetTitle">Coșul tău</h2>${rows}
    <div class="totals"><span>Total produse</span><span class="pricebig">${money(cart.total())}</span></div>
    <p class="hint">Plus livrarea, pe care ți-o spunem la confirmare.</p>
    <button type="button" class="cta" id="checkout">Continuă comanda</button>`, "Coșul tău", (e) => {
    const b = clickedButton(e);
    if (!b) return;
    if (b.dataset.q && b.dataset.i) {
      cart.change(Number(b.dataset.i), Number(b.dataset.q));
      openCart(shop, openCheckout);
    } else if (b.id === "checkout") {
      openCheckout();
    }
  });
}
