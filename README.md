# Agri-Acoustic storefront (Django frontend)

## Run
    python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
    pip install -r requirements.txt
    python manage.py runserver
Open http://127.0.0.1:8000/

To drop the `store` app into an existing project: copy `store/`, add `"store"` to INSTALLED_APPS,
add `"store.context_processors.site"` to template context processors, include `store.urls`,
and copy the SITE and SHIPPING dicts from `config/settings.py`.

## Replace images (store/static/images/)
- `hero.jpg`            full-screen hero (1920x1080+, subject on the right; the left gets a dark overlay)
- `sustainability.jpg`  agricultural landscape for the story band
- `products/standard.jpg|premium.jpg|custom.jpg`, and `spaces/*.jpg` (add `hotels.jpg`)
Placeholders were cropped from your mockup and are low resolution. Missing files fall back to
CSS gradients or an SVG placeholder, so nothing breaks.

## Edit content
- Products & placeholder prices: `store/catalog.py`
- Contact + social links (empty = "Add in settings.py"): `SITE` in `config/settings.py`
- Shipping rule (placeholder): `SHIPPING` in settings.py

## What is real vs demo
- Cart and quantities: browser localStorage. Totals recalculate on every change.
- Checkout validates fields but sends nothing. It collects no card/UPI data and shows a
  "DEMO-xxxxxx" reference. Replace the submit handler in `static/js/main.js` with a POST to a
  Django order view and a real gateway (Razorpay, Stripe, etc.) when ready.
- URLs are in `PAGES` at the top of main.js; update if you mount the app under a prefix.
