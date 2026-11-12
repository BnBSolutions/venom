/** Legătura cu Telegram (mini-aplicație deschisă din bot). */
import type { Order } from "./types.js";

interface TelegramUser {
  first_name?: string;
  last_name?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe?: { user?: TelegramUser };
  platform?: string;
  ready(): void;
  expand(): void;
  setHeaderColor?(color: string): void;
  setBackgroundColor?(color: string): void;
  sendData(data: string): void;
  HapticFeedback?: { impactOccurred(style: "light" | "medium" | "heavy"): void };
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

const tg: TelegramWebApp | undefined = window.Telegram?.WebApp;

/** Deschis din bot: Telegram nu trimite initData pentru butoanele de jos, dar platforma e cunoscută. */
export const inTelegram: boolean = !!tg && ((!!tg.platform && tg.platform !== "unknown") || !!tg.initData);

export function initTelegram(background: string): void {
  if (!tg) return;
  try {
    tg.ready();
    tg.expand();
    tg.setHeaderColor?.(background);
    tg.setBackgroundColor?.(background);
  } catch {
    /* versiuni vechi de Telegram */
  }
}

export function haptic(style: "light" | "medium" | "heavy"): void {
  try {
    tg?.HapticFeedback?.impactOccurred(style);
  } catch {
    /* fără vibrații */
  }
}

/** Numele din Telegram, ca să precompletăm formularul. */
export function telegramName(): string {
  const u = tg?.initDataUnsafe?.user;
  return u ? [u.first_name, u.last_name].filter(Boolean).join(" ") : "";
}

/** Trimite comanda botului. Telegram închide magazinul după trimitere. */
export function sendOrder(order: Order): boolean {
  if (!inTelegram || !tg) return false;
  try {
    tg.sendData(JSON.stringify(order));
    return true;
  } catch {
    return false;
  }
}
