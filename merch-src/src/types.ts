/** Tipurile de date ale magazinului. */

export type ProductCategory = "tricouri" | "hanorace" | "stickere";
export type CategoryFilter = "toate" | ProductCategory;
export type ColorId = "negru" | "alb";
export type Size = "S" | "M" | "L" | "XL" | "XXL";
export type ProductKind = "tee" | "hoodie" | "sticker";
export type StickerArt = "logo" | "badge";
export type PayMethod = "ramburs" | "transfer";

export interface Product {
  id: string;
  cat: ProductCategory;
  kind: ProductKind;
  name: string;
  /** Preț în RON. */
  price: number;
  desc?: string;
  colors?: ColorId[];
  sizes?: Size[];
  /** Pentru stickere: ce imagine se afișează. */
  art?: StickerArt;
  /** Poză reală a produsului (înlocuiește macheta desenată). */
  img?: string;
  /** 0 = epuizat. Lipsă = nelimitat. */
  stock?: number;
}

export interface CartLine {
  id: string;
  color: ColorId | null;
  size: Size | null;
  qty: number;
}

export interface CheckoutForm {
  name: string;
  phone: string;
  city: string;
  address: string;
  pay: PayMethod;
  note: string;
}

export type FormField = "name" | "phone" | "city" | "address";
export type FormErrors = Partial<Record<FormField, string>>;

/** Rândul unei comenzi, în forma scurtă trimisă botului. */
export interface OrderItem {
  id: string;
  c: ColorId | null;
  s: Size | null;
  q: number;
  p: number;
}

/** Comanda trimisă botului prin Telegram (maxim 4096 de caractere). */
export interface Order {
  t: "order";
  v: 1;
  code: string;
  items: OrderItem[];
  total: number;
  name: string;
  phone: string;
  city: string;
  address: string;
  pay: PayMethod;
  note: string;
}
