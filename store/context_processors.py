from django.conf import settings
def site(request):
    return {"site": settings.SITE, "shipping": settings.SHIPPING}
