/** Fereastra care urcă de jos (produs, coș, comandă). */
import { $ } from "../dom.js";

const ANIM_MS = 260;

export class Sheet {
  private readonly scrim = $("#scrim");
  private readonly sheet = $("#sheet");
  private readonly body = $("#sheetBody");
  private lastFocus: Element | null = null;
  private clickHandler: ((e: MouseEvent) => void) | null = null;

  constructor() {
    $("#closeSheet").addEventListener("click", () => this.close());
    this.scrim.addEventListener("click", () => this.close());
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) this.close();
    });
    this.body.addEventListener("click", (e) => this.clickHandler?.(e));
  }

  get isOpen(): boolean {
    return !this.sheet.hidden;
  }

  get root(): HTMLElement {
    return this.body;
  }

  /** Arată conținutul nou; `onClick` primește click-urile din fereastră. */
  open(html: string, title: string, onClick: ((e: MouseEvent) => void) | null = null): void {
    if (!this.isOpen) this.lastFocus = document.activeElement;
    this.body.innerHTML = html;
    this.clickHandler = onClick;
    this.sheet.setAttribute("aria-label", title);
    this.scrim.hidden = false;
    this.sheet.hidden = false;
    requestAnimationFrame(() => {
      this.scrim.classList.add("on");
      this.sheet.classList.add("on");
    });
    window.setTimeout(() => {
      const heading = this.body.querySelector<HTMLElement>("h2");
      if (heading) {
        heading.tabIndex = -1;
        heading.focus();
      }
    }, 30);
  }

  close(): void {
    this.scrim.classList.remove("on");
    this.sheet.classList.remove("on");
    this.clickHandler = null;
    window.setTimeout(() => {
      this.scrim.hidden = true;
      this.sheet.hidden = true;
    }, ANIM_MS);
    if (this.lastFocus instanceof HTMLElement) this.lastFocus.focus();
  }
}
