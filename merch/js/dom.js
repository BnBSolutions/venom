/** Mici ajutoare pentru DOM. */
/** Găsește un element obligatoriu; oprește aplicația cu un mesaj clar dacă lipsește din HTML. */
export function $(selector, root = document) {
    const el = root.querySelector(selector);
    if (!el)
        throw new Error(`Lipsește elementul ${selector} din pagină`);
    return el;
}
export function esc(value) {
    return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
}
/** Butonul pe care s-a apăsat, dacă există. */
export function clickedButton(e) {
    return e.target instanceof Element ? e.target.closest("button") : null;
}
//# sourceMappingURL=dom.js.map