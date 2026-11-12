export const EMPTY_FORM = { name: "", phone: "", city: "", address: "", pay: "ramburs", note: "" };
export function validate(f) {
    const errors = {};
    if (f.name.trim().length < 3)
        errors.name = "Scrie numele.";
    if (f.phone.replace(/\D/g, "").length < 9)
        errors.phone = "Scrie un număr de telefon valid.";
    if (f.city.trim().length < 2)
        errors.city = "Scrie orașul.";
    if (f.address.trim().length < 5)
        errors.address = "Scrie adresa de livrare.";
    return errors;
}
export function orderCode(random = Math.random) {
    return "GZ-" + random().toString(36).slice(2, 6).toUpperCase().padEnd(4, "0");
}
export function buildOrder(cart, f, code) {
    return {
        t: "order",
        v: 1,
        code,
        items: cart.items.map((l) => ({ id: l.id, c: l.color, s: l.size, q: l.qty, p: cart.product(l.id)?.price ?? 0 })),
        total: cart.total(),
        name: f.name.trim(),
        phone: f.phone.trim(),
        city: f.city.trim(),
        address: f.address.trim(),
        pay: f.pay,
        note: f.note.trim(),
    };
}
//# sourceMappingURL=order.js.map