/** Fereastra unui produs: culoare, mărime, cantitate, adăugare în coș. */
import { productArt } from "../art.js";
import { COLORS, colorName, money } from "../catalog.js";
import { $, clickedButton, esc } from "../dom.js";
import { haptic } from "../telegram.js";
import type { ColorId, Product, Size } from "../types.js";
import type { Shop } from "./shop.js";

interface Choice {
  color: ColorId | null;
  size: Size | null;
  qty: number;
}

function view(p: Product, c: Choice): string {
  const colors = p.colors?.map((id) =>
    `<button type="button" class="opt" data-color="${id}" aria-pressed="${id === c.color}">` +
    `<span class="swatch" style="background:${COLORS[id].hex}"></span>${COLORS[id].name}</button>`).join("");
  const sizes = p.sizes?.map((s) => `<button type="button" class="opt" data-size="${s}" aria-pressed="${s === c.size}">${s}</button>`).join("");
  return `
    <h2 id="sheetTitle">${esc(p.name)}</h2>
    <p class="lead">${esc(p.desc ?? "")}</p>
    <div class="big-art" id="bigArt">${productArt(p, c.color)}</div>
    <div class="pricebig">${money(p.price)}</div>
    ${colors ? `<fieldset><legend>Culoare</legend><div class="opts">${colors}</div></fieldset>` : ""}
    ${sizes ? `<fieldset><legend>Mărime</legend><div class="opts">${sizes}</div>
      <p class="err" id="sizeErr" hidden>Alege mărimea.</p></fieldset>` : ""}
    <fieldset><legend>Cantitate</legend>
      <div class="qty"><button type="button" data-q="-1" aria-label="Mai puțin">−</button><output id="qv">${c.qty}</output><button type="button" data-q="1" aria-label="Mai mult">+</button></div>
    </fieldset>
    <button type="button" class="cta" id="addBtn">Adaugă în coș</button>`;
}

export function openProduct(shop: Shop, id: string, openCart: () => void): void {
  const p = shop.products.find((x) => x.id === id);
  if (!p || p.stock === 0) return;
  const c: Choice = { color: p.colors?.[0] ?? null, size: null, qty: 1 };
  const root = shop.sheet.root;
  const press = (attr: "color" | "size", value: string): void => {
    root.querySelectorAll<HTMLButtonElement>(`[data-${attr}]`)
      .forEach((b) => b.setAttribute("aria-pressed", String(b.dataset[attr] === value)));
  };

  shop.sheet.open(view(p, c), p.name, (e) => {
    const b = clickedButton(e);
    if (!b) return;
    const { color, size, q } = b.dataset;
    if (color && p.colors?.includes(color as ColorId)) {
      c.color = color as ColorId;
      $("#bigArt", root).innerHTML = productArt(p, c.color);
      press("color", color);
    } else if (size && p.sizes?.includes(size as Size)) {
      c.size = size as Size;
      press("size", size);
      root.querySelector<HTMLElement>("#sizeErr")?.setAttribute("hidden", "");
    } else if (q) {
      c.qty = Math.max(1, Math.min(99, c.qty + Number(q)));
      $("#qv", root).textContent = String(c.qty);
    } else if (b.id === "addBtn") {
      if (p.sizes && !c.size) {
        root.querySelector<HTMLElement>("#sizeErr")?.removeAttribute("hidden");
        haptic("light");
        return;
      }
      shop.cart.add({ id: p.id, color: c.color, size: c.size, qty: c.qty });
      haptic("medium");
      showAdded(shop, p, c, openCart);
    }
  });
}

function showAdded(shop: Shop, p: Product, c: Choice, openCart: () => void): void {
  const details = [colorName(c.color), c.size].filter(Boolean).join(", ");
  shop.sheet.open(`<div class="done"><h2 id="sheetTitle">Adăugat în coș</h2>
    <p class="lead">${esc(p.name)}${details ? `, ${esc(details)}` : ""}, ${c.qty} buc.</p>
    <button type="button" class="cta dark" id="goCart">Vezi coșul (${money(shop.cart.total())})</button>
    <button type="button" class="cta ghost" id="keep">Mai alege</button></div>`, "Adăugat în coș", (e) => {
    const b = clickedButton(e);
    if (b?.id === "goCart") openCart();
    if (b?.id === "keep") shop.sheet.close();
  });
}
