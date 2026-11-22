export const CATEGORIES = [
  { name: "Classic Pizzas", blurb: "Margherita, pepperoni and the timeless favourites", emoji: "🍕" },
  { name: "Vegetarian Pizzas", blurb: "Garden-fresh toppings, zero meat", emoji: "🥬" },
  { name: "Meat Lovers", blurb: "Loaded with sausage, bacon and ham", emoji: "🥓" },
  { name: "Specialty / Gourmet Pizzas", blurb: "Chef's creations with bold flavours", emoji: "👨‍🍳" },
  { name: "Sides & Appetizers", blurb: "Garlic knots, wings and dips", emoji: "🧄" },
  { name: "Beverages & Desserts", blurb: "Cold drinks and something sweet", emoji: "🥤" },
];
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export const ROLE_HOME = { admin: "/dashboard/admin", vendor: "/dashboard/vendor", customer: "/dashboard/customer" };
