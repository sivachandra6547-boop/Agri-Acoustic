/* Agri-Acoustic frontend. Cart lives in localStorage; swap for Django endpoints later. */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const CATALOG = JSON.parse($("#catalog-data").textContent);
  const SHIP = window.AA_SHIPPING || { flat: 100, freeAbove: 2000 };
  const KEY = "aa_cart_v1", ORDER_KEY = "aa_last_order";
  const inr = n => "₹" + Number(n).toLocaleString("en-IN");
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const STATIC = (() => { const l = $('link[href*="css/style.css"]'); return l.getAttribute("href").replace("css/style.css", "images/"); })();
  const PAGES = { products: "/products/", cart: "/cart/", checkout: "/checkout/", confirm: "/order/confirmation/" };

  /* ---------- Cart store ---------- */
  const Cart = {
    read() { try { return (JSON.parse(localStorage.getItem(KEY)) || []).filter(i => CATALOG[i.id]); } catch { return []; } },
    write(items) { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {} badge(); },
    add(id, variant, qty) {
      const items = this.read(), hit = items.find(i => i.id == id && i.variant === variant);
      hit ? hit.qty = Math.min(99, hit.qty + qty) : items.push({ id, variant, qty });
      this.write(items);
    },
    setQty(idx, qty) { const it = this.read(); if (it[idx]) { it[idx].qty = Math.max(1, Math.min(99, qty)); this.write(it); } },
    remove(idx) { const it = this.read(); it.splice(idx, 1); this.write(it); },
    clear() { this.write([]); },
    totals(items = this.read()) {
      const sub = items.reduce((s, i) => s + CATALOG[i.id].price * i.qty, 0);
      const ship = !items.length ? 0 : sub >= SHIP.freeAbove ? 0 : SHIP.flat;
      return { sub, ship, total: sub + ship };
    }
  };

  function badge() {
    const n = Cart.read().reduce((s, i) => s + i.qty, 0), el = $("#cart-count");
    el.textContent = n; el.hidden = !n;
    $("#cart-link").setAttribute("aria-label", `Shopping cart, ${n} item${n === 1 ? "" : "s"}`);
  }
  let toastT;
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("is-on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("is-on"), 2200); }
  const go = path => { location.href = path; };

  function summaryHTML(t) {
    return `<div class="totals">
      <div><span>Subtotal</span><span>${inr(t.sub)}</span></div>
      <div><span>Shipping (estimate)</span><span>${t.ship ? inr(t.ship) : "Free"}</span></div>
      ${t.ship ? `<div class="hint">Free shipping on sample orders above ${inr(SHIP.freeAbove)}.</div>` : ""}
      <div class="grand"><span>Total</span><span>${inr(t.total)}</span></div></div>`;
  }
  const thumb = p => `<img src="${STATIC}${p.image}" alt="" width="72" height="72">`;

  /* ---------- Shell: navbar, menu, fallbacks ---------- */
  const nav = $("#navbar"), toggle = $("#menu-toggle"), menu = $("#nav");
  const onScroll = () => nav.classList.toggle("is-solid", scrollY > 40 || !document.body.classList.contains("has-hero"));
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const closeMenu = () => { menu.classList.remove("is-open"); nav.classList.remove("menu-open"); toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Open menu"); };
  toggle.addEventListener("click", () => {
    const open = !menu.classList.contains("is-open");
    menu.classList.toggle("is-open", open); nav.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", open); toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  menu.addEventListener("click", e => e.target.closest("a") && closeMenu());
  addEventListener("keydown", e => e.key === "Escape" && closeMenu());

  const FALLBACK = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#e6dcc6"/><path d="M0 220c60-30 90 20 150-10s90-50 250-10v100H0z" fill="#b9a982"/><circle cx="300" cy="90" r="34" fill="#cfdcc4"/></svg>');
  const fix = img => { if (!img.dataset.fb) { img.dataset.fb = "1"; img.src = FALLBACK; } };
  document.addEventListener("error", e => e.target.tagName === "IMG" && fix(e.target), true);
  $$("img").forEach(i => i.complete && i.naturalWidth === 0 && fix(i));
  badge();

  /* ---------- Buy Now buttons (cards) ---------- */
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-buy]"); if (!b) return;
    Cart.add(b.dataset.buy, "Default", 1); go(PAGES.checkout);
  });

  const page = document.body.dataset.page;

  /* ---------- Products: filter ---------- */
  if (page === "products") {
    const chips = $$(".chip"), cards = $$("#product-grid .product");
    const apply = f => {
      let n = 0;
      cards.forEach(c => { const show = f === "all" || c.dataset.category === f; c.hidden = !show; n += show; });
      chips.forEach(c => { const on = c.dataset.filter === f; c.classList.toggle("is-active", on); c.setAttribute("aria-pressed", on); });
      $("#no-results").hidden = n > 0;
    };
    chips.forEach(c => c.addEventListener("click", () => { apply(c.dataset.filter); history.replaceState(null, "", c.dataset.filter === "all" ? location.pathname : "#" + c.dataset.filter); }));
    const h = location.hash.slice(1); apply(["standard", "premium", "custom"].includes(h) ? h : "all");
  }

  /* ---------- Product detail ---------- */
  if (page === "detail") {
    const d = $(".detail"), id = d.dataset.id, price = +d.dataset.price, q = $("#qty");
    const qty = () => Math.max(1, Math.min(99, parseInt(q.value) || 1));
    const sync = () => { q.value = qty(); $("#subtotal").textContent = inr(price * qty()); };
    $$("[data-qty]").forEach(b => b.addEventListener("click", () => { q.value = qty() + +b.dataset.qty; sync(); }));
    q.addEventListener("input", sync); q.addEventListener("blur", sync);
    const variant = () => $('input[name="variant"]:checked').value;
    $("#add-to-cart").addEventListener("click", () => { Cart.add(id, variant(), qty()); toast("Added to cart"); });
    $("#buy-now").addEventListener("click", () => { Cart.add(id, variant(), qty()); go(PAGES.checkout); });
    $$(".thumb").forEach(t => t.addEventListener("click", () => {
      $("#gallery-main").src = t.dataset.src; $$(".thumb").forEach(x => x.classList.toggle("is-active", x === t));
    }));
  }

  /* ---------- Cart page ---------- */
  function renderCart() {
    const items = Cart.read();
    $("#cart-empty").hidden = items.length > 0; $("#cart-filled").hidden = !items.length;
    $("#cart-list").innerHTML = items.map((it, i) => { const p = CATALOG[it.id]; return `
      <li data-i="${i}">${thumb(p)}
        <div><a class="item__name" href="${PAGES.products}${p.slug}/">${esc(p.name)}</a>
          <span class="item__meta">${esc(it.variant)} · ${esc(p.size)} · ${inr(p.price)} each</span></div>
        <div class="item__end"><span class="item__total">${inr(p.price * it.qty)}</span>
          <div class="qty" role="group" aria-label="Quantity for ${esc(p.name)}">
            <button type="button" data-act="dec" aria-label="Decrease quantity">−</button>
            <input type="number" min="1" max="99" value="${it.qty}" aria-label="Quantity">
            <button type="button" data-act="inc" aria-label="Increase quantity">+</button></div>
          <button class="remove" type="button" data-act="rm" aria-label="Remove ${esc(p.name)}">Remove</button></div></li>`; }).join("");
    $("#summary").innerHTML = summaryHTML(Cart.totals(items));
  }
  if (page === "cart") {
    renderCart();
    const list = $("#cart-list");
    list.addEventListener("click", e => {
      const b = e.target.closest("[data-act]"); if (!b) return;
      const li = b.closest("li"), i = +li.dataset.i, cur = Cart.read()[i].qty;
      if (b.dataset.act === "rm") { Cart.remove(i); toast("Item removed"); }
      else Cart.setQty(i, cur + (b.dataset.act === "inc" ? 1 : -1));
      renderCart();
    });
    list.addEventListener("change", e => { if (e.target.type === "number") { Cart.setQty(+e.target.closest("li").dataset.i, parseInt(e.target.value) || 1); renderCart(); } });
  }

  /* ---------- Checkout ---------- */
  const miniList = items => items.map(it => { const p = CATALOG[it.id]; return `<li>${thumb(p)}<div><span class="item__name">${esc(p.name)}</span><span class="item__meta">${esc(it.variant)} × ${it.qty}</span></div><span class="item__total">${inr(p.price * it.qty)}</span></li>`; }).join("");
  if (page === "checkout") {
    const items = Cart.read(), form = $("#checkout-form");
    if (!items.length) $("#co-empty").hidden = false;
    else {
      form.hidden = false; $("#mini-list").innerHTML = miniList(items); $("#summary").innerHTML = summaryHTML(Cart.totals(items));
      const rules = {
        name: v => v.trim().length >= 2 || "Enter your full name.",
        email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || "Enter a valid email, like name@example.com.",
        phone: v => /^(\+91[\s-]?)?[6-9]\d{9}$/.test(v.replace(/\s/g, "")) || "Enter a 10-digit Indian mobile number.",
        address: v => v.trim().length >= 6 || "Enter your house number, street and area.",
        city: v => v.trim().length >= 2 || "Enter your city.",
        state: v => v.trim().length >= 2 || "Enter your state.",
        pin: v => /^[1-9]\d{5}$/.test(v) || "Enter a 6-digit PIN code."
      };
      const check = k => {
        const inp = form.elements[k], r = rules[k](inp.value), ok = r === true;
        $("#" + k + "-err").textContent = ok ? "" : r; inp.closest(".field").classList.toggle("has-error", !ok);
        inp.setAttribute("aria-invalid", !ok); inp.setAttribute("aria-describedby", k + "-err"); return ok;
      };
      Object.keys(rules).forEach(k => form.elements[k].addEventListener("blur", () => check(k)));
      form.addEventListener("submit", e => {
        e.preventDefault();
        const bad = Object.keys(rules).filter(k => !check(k));
        if (bad.length) { form.elements[bad[0]].focus(); toast("Please fix the highlighted fields"); return; }
        const ref = "DEMO-" + Math.random().toString(36).slice(2, 8).toUpperCase();
        try {
          sessionStorage.setItem(ORDER_KEY, JSON.stringify({ ref, items, totals: Cart.totals(items), name: form.elements.name.value.trim(), city: form.elements.city.value.trim(), pay: form.elements.pay.value }));
        } catch {}
        Cart.clear(); go(PAGES.confirm);
      });
    }
  }

  /* ---------- Confirmation ---------- */
  if (page === "confirmation") {
    let o = null; try { o = JSON.parse(sessionStorage.getItem(ORDER_KEY)); } catch {}
    if (!o) $("#conf-empty").hidden = false;
    else {
      $("#conf-filled").hidden = false; $("#conf-ref").textContent = o.ref;
      $("#conf-to").textContent = `For ${o.name}, ${o.city}. Selected method: ${o.pay} (not charged).`;
      $("#mini-list").innerHTML = miniList(o.items.filter(i => CATALOG[i.id])); $("#summary").innerHTML = summaryHTML(o.totals);
      const b = $("#view-details"), box = $("#conf-details");
      b.addEventListener("click", () => { box.hidden = !box.hidden; b.setAttribute("aria-expanded", !box.hidden); });
    }
  }
})();
