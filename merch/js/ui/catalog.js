/** Lista de produse, filtrele și bara coșului. */
import { productArt } from "../art.js";
import { CATEGORIES, colorName, money } from "../catalog.js";
import { $, esc } from "../dom.js";
function subtitle(p) {
    if (!p.colors || !p.sizes)
        return "Sticker";
    const first = p.sizes[0] ?? "";
    const last = p.sizes[p.sizes.length - 1] ?? "";
    return `${p.colors.map(colorName).join(" sau ")}, ${first}–${last}`;
}
function card(p) {
    const sold = p.stock === 0;
    return `<button type="button" class="item" data-id="${esc(p.id)}" ${sold ? 'aria-disabled="true"' : ""}>
    <span class="price">${p.price}<small> RON</small></span>
    ${sold ? '<span class="soldout">Epuizat</span>' : ""}
    <div class="art">${productArt(p)}</div>
    <h3>${esc(p.name)}</h3><p class="sub">${esc(subtitle(p))}</p>
  </button>`;
}
export class CatalogView {
    constructor(shop, onOpen) {
        this.shop = shop;
        this.onOpen = onOpen;
        this.filter = "toate";
        $("#filters").addEventListener("click", (e) => {
            const chip = e.target instanceof Element ? e.target.closest(".chip") : null;
            const cat = chip?.dataset.cat;
            if (!cat)
                return;
            this.filter = cat;
            this.render();
        });
        $("#grid").addEventListener("click", (e) => {
            const item = e.target instanceof Element ? e.target.closest(".item") : null;
            if (item?.dataset.id && item.getAttribute("aria-disabled") !== "true")
                this.onOpen(item.dataset.id);
        });
    }
    render() {
        const used = new Set(this.shop.products.map((p) => p.cat));
        $("#filters").innerHTML = CATEGORIES.filter(([k]) => k === "toate" || used.has(k))
            .map(([k, label]) => `<button type="button" class="chip" data-cat="${k}" aria-pressed="${k === this.filter}">${label}</button>`)
            .join("");
        const list = this.shop.products.filter((p) => this.filter === "toate" || p.cat === this.filter);
        $("#grid").innerHTML = list.map(card).join("") ||
            `<p class="note" style="grid-column:1/-1">Nu sunt produse în această categorie.</p>`;
    }
    renderBar() {
        const n = this.shop.cart.count();
        $("#cartbar").hidden = n === 0;
        $("#cartCount").textContent = String(n);
        $("#cartTotal").textContent = money(this.shop.cart.total());
    }
}
//# sourceMappingURL=catalog.js.map