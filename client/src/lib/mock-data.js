export const users = [
  { id: "u1", name: "Ava Patel", email: "ava.patel@example.com" },
  { id: "u2", name: "Noah James", email: "noah.james@example.com" },
  { id: "u3", name: "Mia Chen", email: "atharv@example.com" },
  { id: "u4", name: "Liam Moore", email: "liam.moore@example.com" },
]

export const stores = [
  {
    id: "s1",
    name: "FreshMart",
    rating: 4.6,
    description: "Organic produce and daily essentials.",
    logo: "/freshmart-logo.png",
  },
  {
    id: "s2",
    name: "TechHub",
    rating: 4.3,
    description: "Gadgets, accessories, and repairs.",
    logo: "/techhub-logo.png",
  },
  {
    id: "s3",
    name: "StyleCorner",
    rating: 4.0,
    description: "Trendy apparel and local designers.",
    logo: "/stylecorner-logo.png",
  },
]

export const owners = [
  { id: "o1", name: "Chris Rivera", email: "chris.rivera@example.com", storesOwned: 2 },
  { id: "o2", name: "Fatima Ali", email: "fatima.ali@example.com", storesOwned: 1 },
]

export const mockData = { users, stores, owners }
