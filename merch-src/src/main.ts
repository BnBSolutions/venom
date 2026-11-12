/** Punctul de pornire al magazinului Gorillaz Crew Merch. */
import { Cart } from "./cart.js";
import { loadProducts } from "./catalog.js";
import { $ } from "./dom.js";
import { initTelegram } from "./telegram.js";
import type { Order } from "./types.js";
import { openCart } from "./ui/cart-view.js";
import { CatalogView } from "./ui/catalog.js";
import { openCheckout } from "./ui/checkout.js";
import { openProduct } from "./ui/product.js";
import { Sheet } from "./ui/sheet.js";
import type { Shop } from "./ui/shop.js";

declare global {
  interface Window {
    /** Pentru teste automate: ultima comandă și coșul. */
    __shop?: { readonly lastOrder: Order | null; readonly cart: Cart };
  }
}

initTelegram("#cfcac2");

const products = loadProducts();
const shop: Shop = { products, cart: new Cart(products), sheet: new Sheet() };
let lastOrder: Order | null = null;

const showCheckout = (): void => openCheckout(shop, (o) => { lastOrder = o; });
const showCart = (): void => openCart(shop, showCheckout);
const catalog = new CatalogView(shop, (id) => openProduct(shop, id, showCart));

$("#openCart").addEventListener("click", showCart);
shop.cart.onChange(() => catalog.renderBar());

catalog.render();
catalog.renderBar();

window.__shop = { get lastOrder() { return lastOrder; }, cart: shop.cart };
