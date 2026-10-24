from django.http import Http404
from django.shortcuts import render
from . import catalog

def _ctx(**extra):
    cj = {str(p["id"]): {k: p[k] for k in ("id", "slug", "name", "price", "size", "image")}
          for p in catalog.PRODUCTS}
    return {"catalog_json": cj, **extra}

def home(request):
    return render(request, "store/home.html", _ctx(products=catalog.PRODUCTS[::2][:1] + catalog.PRODUCTS[2:3] + catalog.PRODUCTS[4:5], spaces=catalog.SPACES))

def products(request):
    return render(request, "store/products.html", _ctx(products=catalog.PRODUCTS))

def product_detail(request, slug):
    p = catalog.by_slug(slug)
    if not p:
        raise Http404
    related = [x for x in catalog.PRODUCTS if x["id"] != p["id"]][:3]
    return render(request, "store/product_detail.html", _ctx(product=p, related=related))

def cart(request):
    return render(request, "store/cart.html", _ctx())

def checkout(request):
    return render(request, "store/checkout.html", _ctx())

def confirmation(request):
    return render(request, "store/order_confirmation.html", _ctx())
