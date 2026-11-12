const STORAGE_KEY = "gz_cart";
const MAX_QTY = 99;
export class Cart {
    constructor(products) {
        this.products = products;
        this.lines = [];
        this.listeners = [];
        this.lines = this.load();
    }
    get items() {
        return this.lines;
    }
    product(id) {
        return this.products.find((p) => p.id === id);
    }
    count() {
        return this.lines.reduce((n, l) => n + l.qty, 0);
    }
    total() {
        return this.lines.reduce((n, l) => n + l.qty * (this.product(l.id)?.price ?? 0), 0);
    }
    add(line) {
        const same = this.lines.find((l) => l.id === line.id && l.color === line.color && l.size === line.size);
        if (same)
            same.qty = Math.min(MAX_QTY, same.qty + line.qty);
        else
            this.lines.push({ ...line, qty: Math.min(MAX_QTY, line.qty) });
        this.changed();
    }
    /** Schimbă cantitatea unui rând; la 0 rândul dispare. */
    change(index, delta) {
        const line = this.lines[index];
        if (!line)
            return;
        line.qty = Math.min(MAX_QTY, line.qty + delta);
        if (line.qty <= 0)
            this.lines.splice(index, 1);
        this.changed();
    }
    clear() {
        this.lines = [];
        this.changed();
    }
    onChange(fn) {
        this.listeners.push(fn);
    }
    changed() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.lines));
        }
        catch {
            /* fără memorie locală (navigare privată) */
        }
        this.listeners.forEach((fn) => fn());
    }
    load() {
        try {
            const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
            if (!Array.isArray(raw))
                return [];
            return raw.filter((l) => typeof l === "object" && l !== null && typeof l.id === "string" && typeof l.qty === "number" &&
                l.qty > 0 && !!this.product(l.id));
        }
        catch {
            return [];
        }
    }
}
//# sourceMappingURL=cart.js.map