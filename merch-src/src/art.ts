/** Machetele produselor: tricou și hanorac desenate în SVG, stickere din logo. */
import { COLORS } from "./catalog.js";
import { esc } from "./dom.js";
import type { ColorId, Product, ProductKind } from "./types.js";

export const ASSETS = {
  logo: "assets/logo.webp",
  badge: "assets/badge.webp",
} as const;

function garment(kind: Exclude<ProductKind, "sticker">, color: ColorId): string {
  const fill = COLORS[color].hex;
  const dark = color !== "alb";
  const stroke = dark ? "#000" : "#2a2a2a";
  const shade = dark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.06)";

  if (kind === "hoodie") {
    return `<svg viewBox="0 0 200 200" aria-hidden="true">
      <path d="M58 46 L80 24 Q100 10 120 24 L142 46 L178 70 L166 116 L150 110 L150 190 L50 190 L50 110 L34 116 L22 70 Z"
        fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M78 26 Q100 58 122 26" fill="none" stroke="${stroke}" stroke-width="3"/>
      <path d="M150 110 L150 190 L132 190 Z M50 110 L50 190 L68 190 Z" fill="${shade}"/>
      <path d="M70 146 H130 L136 176 H64 Z" fill="${shade}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M92 44 V70 M108 44 V70" stroke="${dark ? "#e8e4dc" : "#2a2a2a"}" stroke-width="2.5" stroke-linecap="round"/>
      <image href="${ASSETS.logo}" x="72" y="74" width="56" height="53"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 200 200" aria-hidden="true">
    <path d="M62 24 L82 16 Q100 30 118 16 L138 24 L180 50 L164 84 L146 76 L146 188 L54 188 L54 76 L36 84 L20 50 Z"
      fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M82 16 Q100 36 118 16" fill="none" stroke="${stroke}" stroke-width="3"/>
    <path d="M146 76 L146 188 L130 188 Z M54 76 L54 188 L70 188 Z" fill="${shade}"/>
    <image href="${ASSETS.logo}" x="70" y="52" width="60" height="57"/>
  </svg>`;
}

/** Imaginea unui produs: poza reală dacă există, altfel macheta. */
export function productArt(p: Product, color?: ColorId | null): string {
  if (p.img) return `<img src="${esc(p.img)}" alt="" loading="lazy">`;
  if (p.kind === "sticker") {
    const badge = p.art === "badge";
    return `<img class="sticker" src="${badge ? ASSETS.badge : ASSETS.logo}" alt=""
      style="transform:rotate(${badge ? 6 : -6}deg)">`;
  }
  return garment(p.kind, color ?? p.colors?.[0] ?? "negru");
}
