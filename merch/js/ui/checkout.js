/** Formularul de livrare și confirmarea comenzii. */
import { money } from "../catalog.js";
import { $, clickedButton, esc } from "../dom.js";
import { EMPTY_FORM, buildOrder, orderCode, validate } from "../order.js";
import { haptic, inTelegram, sendOrder, telegramName } from "../telegram.js";
const FORM_KEY = "gz_form";
const FIELDS = ["name", "phone", "city", "address"];
const SEND_DELAY_MS = 1400;
function loadForm() {
    const form = { ...EMPTY_FORM };
    try {
        const saved = JSON.parse(localStorage.getItem(FORM_KEY) ?? "{}");
        if (typeof saved === "object" && saved !== null) {
            for (const k of Object.keys(EMPTY_FORM)) {
                const v = saved[k];
                if (typeof v === "string")
                    form[k] = v;
            }
        }
    }
    catch {
        /* fără memorie locală */
    }
    if (form.pay !== "transfer")
        form.pay = "ramburs";
    if (!form.name)
        form.name = telegramName();
    return form;
}
function saveForm(f) {
    try {
        localStorage.setItem(FORM_KEY, JSON.stringify(f));
    }
    catch {
        /* fără memorie locală */
    }
}
function field(name, label, value, extra, error) {
    const input = name === "address"
        ? `<textarea class="in" name="address" rows="2" ${extra}>${esc(value)}</textarea>`
        : `<input class="in" name="${name}" value="${esc(value)}" ${extra}>`;
    return `<label class="f"><span>${label}</span>${input}</label>` +
        (error ? `<div class="err" data-for="${name}" hidden>${error}</div>` : "");
}
function view(f, total) {
    return `<h2 id="sheetTitle">Unde livrăm?</h2>
    <p class="lead">Te sunăm pe acest număr ca să confirmăm comanda.</p>
    <form id="of" novalidate>
      ${field("name", "Nume și prenume", f.name, 'autocomplete="name"', "Scrie numele.")}
      ${field("phone", "Telefon", f.phone, 'type="tel" inputmode="tel" autocomplete="tel" placeholder="07xx xxx xxx"', "Scrie un număr de telefon valid.")}
      ${field("city", "Oraș", f.city, 'autocomplete="address-level2"', "Scrie orașul.")}
      ${field("address", "Adresa", f.address, 'autocomplete="street-address" placeholder="Stradă, număr, bloc, apartament"', "Scrie adresa de livrare.")}
      <fieldset><legend>Plata</legend><div class="pay">
        <label><input type="radio" name="pay" value="ramburs" ${f.pay === "ramburs" ? "checked" : ""}><span>La livrare<small>Plătești curierului când primești coletul.</small></span></label>
        <label><input type="radio" name="pay" value="transfer" ${f.pay === "transfer" ? "checked" : ""}><span>Transfer bancar<small>Îți trimitem datele contului la confirmare.</small></span></label>
      </div></fieldset>
      ${field("note", "Mențiuni (opțional)", f.note, "", "")}
      <div class="totals"><span>De plată pentru produse</span><span class="pricebig">${money(total)}</span></div>
      <button type="submit" class="cta">Trimite comanda</button>
      ${inTelegram ? "" : `<p class="hint">Deschide magazinul din bot ca să trimiți comanda.</p>`}
    </form>`;
}
function readForm(form) {
    const fd = new FormData(form);
    const get = (k) => String(fd.get(k) ?? "").trim();
    const pay = get("pay") === "transfer" ? "transfer" : "ramburs";
    return { name: get("name"), phone: get("phone"), city: get("city"), address: get("address"), pay, note: get("note") };
}
export function openCheckout(shop, onSent) {
    shop.sheet.open(view(loadForm(), shop.cart.total()), "Unde livrăm?");
    const form = $("#of", shop.sheet.root);
    // eroarea dispare când câmpul e completat
    form.addEventListener("input", (e) => {
        const el = e.target;
        if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement))
            return;
        const err = form.querySelector(`.err[data-for="${el.name}"]`);
        if (err && !err.hidden) {
            err.hidden = true;
            el.setAttribute("aria-invalid", "false");
        }
    });
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = readForm(form);
        saveForm(data);
        const errors = validate(data);
        let first = null;
        for (const k of FIELDS) {
            const el = form.elements.namedItem(k);
            const err = form.querySelector(`.err[data-for="${k}"]`);
            const bad = !!errors[k];
            if (el instanceof HTMLElement)
                el.setAttribute("aria-invalid", String(bad));
            if (err)
                err.hidden = !bad;
            if (bad && !first && el instanceof HTMLElement)
                first = el;
        }
        if (first) {
            first.focus();
            haptic("light");
            return;
        }
        const order = buildOrder(shop.cart, data, orderCode());
        const lines = shop.cart.items.map((l) => `${l.qty} × ${esc(shop.cart.product(l.id)?.name ?? l.id)}${l.size ? " " + l.size : ""}`);
        shop.cart.clear();
        shop.sheet.open(`<div class="done"><span class="stamp">Comandă trimisă</span>
      <h2 id="sheetTitle">${esc(order.code)}</h2>
      <p class="lead">${lines.join("<br>")}</p>
      <p class="lead">Te sunăm la ${esc(order.phone)} ca să confirmăm livrarea.</p>
      <button type="button" class="cta dark" id="back">Înapoi la magazin</button></div>`, "Comandă trimisă", (ev) => {
            if (clickedButton(ev)?.id === "back")
                shop.sheet.close();
        });
        haptic("heavy");
        onSent?.(order);
        // după ce omul vede confirmarea, comanda pleacă la bot (Telegram închide magazinul)
        window.setTimeout(() => sendOrder(order), SEND_DELAY_MS);
    });
}
//# sourceMappingURL=checkout.js.map