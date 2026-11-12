/** Catalogul: produse, culori, categorii. Botul poate trimite un catalog nou în adresă (?p=...). */
import type { CategoryFilter, ColorId, Product, ProductCategory, ProductKind, Size, StickerArt } from "./types.js";

export const CATEGORIES: ReadonlyArray<readonly [CategoryFilter, string]> = [
  ["toate", "Toate"],
  ["tricouri", "Tricouri"],
  ["hanorace", "Hanorace"],
  ["stickere", "Stickere"],
];

export const COLORS: Readonly<Record<ColorId, { name: string; hex: string }>> = {
  negru: { name: "Negru", hex: "#1d1c20" },
  alb: { name: "Alb", hex: "#f4f2ee" },
};

const ALL_SIZES: Size[] = ["S", "M", "L", "XL", "XXL"];

export const DEFAULT_PRODUCTS: Product[] = [
  { id: "tricou", cat: "tricouri", kind: "tee", name: "Tricou Gorillaz Crew", price: 150,
    colors: ["negru", "alb"], sizes: ALL_SIZES, desc: "Logo-ul crew-ului pe piept." },
  { id: "hanorac", cat: "hanorace", kind: "hoodie", name: "Hanorac Gorillaz Crew", price: 300,
    colors: ["negru", "alb"], sizes: ALL_SIZES, desc: "Cu glugă și buzunar în față, logo-ul pe piept." },
  { id: "sticker-logo", cat: "stickere", kind: "sticker", art: "logo", name: "Sticker Gorillaz Crew", price: 20,
    desc: "Logo-ul complet, decupat pe contur." },
  { id: "sticker-gorila", cat: "stickere", kind: "sticker", art: "badge", name: "Sticker gorila", price: 20,
    desc: "Insigna rotundă cu gorila cu bandană." },
];

export const money = (n: number): string => `${n} RON`;
export const colorName = (c: ColorId | null): string => (c ? COLORS[c].name : "");

// ---------------------------------------------------------------- validarea catalogului primit de la bot
const CATS: readonly ProductCategory[] = ["tricouri", "hanorace", "stickere"];
const KINDS: readonly ProductKind[] = ["tee", "hoodie", "sticker"];
const COLOR_IDS = Object.keys(COLORS) as ColorId[];
const ARTS: readonly StickerArt[] = ["logo", "badge"];

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;
const oneOf = <T extends string>(list: readonly T[], v: unknown): v is T => typeof v === "string" && (list as readonly string[]).includes(v);

function toProduct(v: unknown): Product | null {
  if (!isObj(v)) return null;
  const { id, cat, kind, name, price } = v;
  if (typeof id !== "string" || !id || typeof name !== "string" || !name) return null;
  if (!oneOf(CATS, cat) || !oneOf(KINDS, kind)) return null;
  if (typeof price !== "number" || !Number.isFinite(price) || price < 0) return null;
  const p: Product = { id, cat, kind, name, price };
  if (typeof v.desc === "string") p.desc = v.desc;
  if (Array.isArray(v.colors)) p.colors = v.colors.filter((c): c is ColorId => oneOf(COLOR_IDS, c));
  if (Array.isArray(v.sizes)) p.sizes = v.sizes.filter((s): s is Size => oneOf(ALL_SIZES, s));
  if (oneOf(ARTS, v.art)) p.art = v.art;
  if (typeof v.img === "string" && /^https:\/\//.test(v.img)) p.img = v.img;
  if (typeof v.stock === "number") p.stock = v.stock;
  if (p.colors && !p.colors.length) delete p.colors;
  if (p.sizes && !p.sizes.length) delete p.sizes;
  return p;
}

function decodeBase64Url(raw: string): string {
  const b64 = raw.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "===".slice((b64.length + 3) % 4);
  const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Catalogul din adresă, dacă e valid; altfel cel de bază. */
export function loadProducts(search: string = location.search): Product[] {
  const raw = new URLSearchParams(search).get("p");
  if (!raw) return DEFAULT_PRODUCTS;
  try {
    const parsed: unknown = JSON.parse(decodeBase64Url(raw));
    if (!Array.isArray(parsed)) return DEFAULT_PRODUCTS;
    const list = parsed.map(toProduct).filter((p): p is Product => p !== null);
    return list.length ? list : DEFAULT_PRODUCTS;
  } catch {
    return DEFAULT_PRODUCTS;
  }
}
