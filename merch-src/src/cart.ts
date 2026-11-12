/** Coșul de cumpărături, ținut minte pe telefon. */
import type { CartLine, Product } from "./types.js";

const STORAGE_KEY = "gz_cart";
const MAX_QTY = 99;

type Listener = () => void;

export class Cart {
  private lines: CartLine[] = [];
  private listeners: Listener[] = [];

  constructor(private readonly products: readonly Product[]) {
    this.lines = this.load();
  }

  get items(): readonly CartLine[] {
    return this.lines;
  }

  product(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  count(): number {
    return this.lines.reduce((n, l) => n + l.qty, 0);
  }

  total(): number {
    return this.lines.reduce((n, l) => n + l.qty * (this.product(l.id)?.price ?? 0), 0);
  }

  add(line: CartLine): void {
    const same = this.lines.find((l) => l.id === line.id && l.color === line.color && l.size === line.size);
    if (same) same.qty = Math.min(MAX_QTY, same.qty + line.qty);
    else this.lines.push({ ...line, qty: Math.min(MAX_QTY, line.qty) });
    this.changed();
  }

  /** Schimbă cantitatea unui rând; la 0 rândul dispare. */
  change(index: number, delta: number): void {
    const line = this.lines[index];
    if (!line) return;
    line.qty = Math.min(MAX_QTY, line.qty + delta);
    if (line.qty <= 0) this.lines.splice(index, 1);
    this.changed();
  }

  clear(): void {
    this.lines = [];
    this.changed();
  }

  onChange(fn: Listener): void {
    this.listeners.push(fn);
  }

  private changed(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.lines));
    } catch {
      /* fără memorie locală (navigare privată) */
    }
    this.listeners.forEach((fn) => fn());
  }

  private load(): CartLine[] {
    try {
      const raw: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (!Array.isArray(raw)) return [];
      return raw.filter((l): l is CartLine =>
        typeof l === "object" && l !== null && typeof l.id === "string" && typeof l.qty === "number" &&
        l.qty > 0 && !!this.product(l.id));
    } catch {
      return [];
    }
  }
}
