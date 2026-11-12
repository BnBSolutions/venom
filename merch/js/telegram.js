const tg = window.Telegram?.WebApp;
/** Deschis din bot: Telegram nu trimite initData pentru butoanele de jos, dar platforma e cunoscută. */
export const inTelegram = !!tg && ((!!tg.platform && tg.platform !== "unknown") || !!tg.initData);
export function initTelegram(background) {
    if (!tg)
        return;
    try {
        tg.ready();
        tg.expand();
        tg.setHeaderColor?.(background);
        tg.setBackgroundColor?.(background);
    }
    catch {
        /* versiuni vechi de Telegram */
    }
}
export function haptic(style) {
    try {
        tg?.HapticFeedback?.impactOccurred(style);
    }
    catch {
        /* fără vibrații */
    }
}
/** Numele din Telegram, ca să precompletăm formularul. */
export function telegramName() {
    const u = tg?.initDataUnsafe?.user;
    return u ? [u.first_name, u.last_name].filter(Boolean).join(" ") : "";
}
/** Trimite comanda botului. Telegram închide magazinul după trimitere. */
export function sendOrder(order) {
    if (!inTelegram || !tg)
        return false;
    try {
        tg.sendData(JSON.stringify(order));
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=telegram.js.map