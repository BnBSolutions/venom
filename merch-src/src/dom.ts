/** Mici ajutoare pentru DOM. */

/** Găsește un element obligatoriu; oprește aplicația cu un mesaj clar dacă lipsește din HTML. */
export function $<T extends HTMLElement = HTMLElement>(selector: string, root: ParentNode = document): T {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`Lipsește elementul ${selector} din pagină`);
  return el;
}

export function esc(value: unknown): string {
  return String(value).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
}

/** Butonul pe care s-a apăsat, dacă există. */
export function clickedButton(e: Event): HTMLButtonElement | null {
  return e.target instanceof Element ? e.target.closest("button") : null;
}
