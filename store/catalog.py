"""Editable SAMPLE catalogue. Prices are PLACEHOLDERS (INR) until confirmed.
Later, replace with a Django model and query it in views.py."""

PRODUCTS = [
    {"id": 1, "slug": "standard-slat-panel", "name": "Standard Slat Panel", "category": "standard",
     "tagline": "Great for homes and small rooms.",
     "description": "A linear, wood-toned panel with a rice-straw core. A calm everyday choice for bedrooms, study corners and living rooms.",
     "price": 499, "size": "600 × 600 mm", "thickness": "12 mm", "material": "Rice straw + natural binder",
     "image": "products/standard.jpg", "variants": ["Natural", "Oak"]},
    {"id": 2, "slug": "standard-flat-panel", "name": "Standard Flat Panel", "category": "standard",
     "tagline": "Clean, quiet and easy to fit.",
     "description": "A smooth coconut-fibre face in a neutral tone. Designed to sit quietly behind furniture or fill a whole wall.",
     "price": 549, "size": "600 × 600 mm", "thickness": "12 mm", "material": "Coconut fibre + rice straw",
     "image": "products/standard.jpg", "variants": ["Natural", "Sand"]},
    {"id": 3, "slug": "premium-hex-panel", "name": "Premium Hex Panel", "category": "premium",
     "tagline": "Stylish, with a richer finish.",
     "description": "Hexagonal tiles in banana-fibre and coconut-fibre blends. Mix finishes to build a feature wall that feels hand-made.",
     "price": 799, "size": "300 mm hexagon", "thickness": "20 mm", "material": "Banana fibre + coconut fibre",
     "image": "products/premium.jpg", "variants": ["Natural", "Forest green", "Terracotta"]},
    {"id": 4, "slug": "premium-relief-panel", "name": "Premium Relief Panel", "category": "premium",
     "tagline": "Sculpted texture for statement walls.",
     "description": "A deeper relief pattern that catches light through the day. Suited to studios, lounges and hospitality spaces.",
     "price": 899, "size": "600 × 600 mm", "thickness": "25 mm", "material": "Banana fibre + rice straw",
     "image": "products/premium.jpg", "variants": ["Forest green", "Natural"]},
    {"id": 5, "slug": "custom-geometric-panel", "name": "Custom Geometric Panel", "category": "custom",
     "tagline": "Custom sizes and designs.",
     "description": "Tell us your wall size and pattern and we shape panels to your layout. Lead time and final price are confirmed after we review your brief.",
     "price": 999, "size": "Made to order", "thickness": "20–25 mm", "material": "Agri-waste fibre blend",
     "image": "products/custom.jpg", "variants": ["Natural", "Forest green", "Terracotta"]},
    {"id": 6, "slug": "custom-room-set", "name": "Custom Room Set", "category": "custom",
     "tagline": "A full layout for one room.",
     "description": "A planned set of panels sized to a single room, from classrooms to boardrooms. Quoted individually.",
     "price": 1499, "size": "Made to order", "thickness": "20–25 mm", "material": "Agri-waste fibre blend",
     "image": "products/custom.jpg", "variants": ["Natural", "Forest green"]},
]

SPACES = [
    ("Homes", "spaces/homes.jpg"), ("Offices", "spaces/offices.jpg"),
    ("Schools", "spaces/schools.jpg"), ("Studios", "spaces/studios.jpg"),
    ("Hotels", "spaces/hotels.jpg"), ("Restaurants", "spaces/restaurants.jpg"),
]

def by_slug(slug):
    return next((p for p in PRODUCTS if p["slug"] == slug), None)
