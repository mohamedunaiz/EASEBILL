// Product and region data store

export interface Product {
  id: string
  name: string
  category: string
  basePrice: number // Base price in USD for conversion
  prices: Record<string, number> // Region-specific prices
  gstRate: number
  image: string
  active: boolean
}

export interface Region {
  id: string
  name: string
  currency: string
  currencySymbol: string
  taxName: string
  taxRates: number[]
  exchangeRate: number // Relative to USD
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Transaction {
  id: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: string
  region: string
  timestamp: Date
}

export const regions: Region[] = [
  {
    id: "india",
    name: "India",
    currency: "INR",
    currencySymbol: "₹",
    taxName: "GST",
    taxRates: [0, 5, 12, 18, 28],
    exchangeRate: 83.5,
  },
  {
    id: "usa",
    name: "United States",
    currency: "USD",
    currencySymbol: "$",
    taxName: "Sales Tax",
    taxRates: [0, 5, 7, 8.5, 10],
    exchangeRate: 1,
  },
  {
    id: "uk",
    name: "United Kingdom",
    currency: "GBP",
    currencySymbol: "£",
    taxName: "VAT",
    taxRates: [0, 5, 12.5, 20],
    exchangeRate: 0.79,
  },
  {
    id: "eu",
    name: "European Union",
    currency: "EUR",
    currencySymbol: "€",
    taxName: "VAT",
    taxRates: [0, 5, 10, 20, 25],
    exchangeRate: 0.92,
  },
  {
    id: "uae",
    name: "United Arab Emirates",
    currency: "AED",
    currencySymbol: "د.إ",
    taxName: "VAT",
    taxRates: [0, 5],
    exchangeRate: 3.67,
  },
  {
    id: "japan",
    name: "Japan",
    currency: "JPY",
    currencySymbol: "¥",
    taxName: "Consumption Tax",
    taxRates: [0, 8, 10],
    exchangeRate: 149.5,
  },
]

export const defaultProducts: Product[] = [
  {
    id: "1",
    name: "Organic Milk",
    category: "Dairy",
    basePrice: 3.5,
    prices: {
      india: 292,
      usa: 3.5,
      uk: 2.8,
      eu: 3.2,
      uae: 12.8,
      japan: 523,
    },
    gstRate: 5,
    image: "/organic-milk-bottle.jpg",
    active: true,
  },
  {
    id: "2",
    name: "Whole Wheat Bread",
    category: "Bakery",
    basePrice: 2.5,
    prices: {
      india: 209,
      usa: 2.5,
      uk: 2.0,
      eu: 2.3,
      uae: 9.2,
      japan: 374,
    },
    gstRate: 0,
    image: "/whole-wheat-bread-loaf.jpg",
    active: true,
  },
  {
    id: "3",
    name: "Fresh Apples (1kg)",
    category: "Fruits",
    basePrice: 4.0,
    prices: {
      india: 334,
      usa: 4.0,
      uk: 3.2,
      eu: 3.7,
      uae: 14.7,
      japan: 598,
    },
    gstRate: 0,
    image: "/fresh-red-apples.png",
    active: true,
  },
  {
    id: "4",
    name: "Basmati Rice (5kg)",
    category: "Grains",
    basePrice: 12.0,
    prices: {
      india: 1002,
      usa: 12.0,
      uk: 9.5,
      eu: 11.0,
      uae: 44.0,
      japan: 1794,
    },
    gstRate: 5,
    image: "/basmati-rice-bag.jpg",
    active: true,
  },
  {
    id: "5",
    name: "Coca-Cola (2L)",
    category: "Beverages",
    basePrice: 2.0,
    prices: {
      india: 167,
      usa: 2.0,
      uk: 1.6,
      eu: 1.8,
      uae: 7.3,
      japan: 299,
    },
    gstRate: 28,
    image: "/coca-cola-2-liter-bottle.jpg",
    active: true,
  },
  {
    id: "6",
    name: "Paneer (500g)",
    category: "Dairy",
    basePrice: 5.0,
    prices: {
      india: 418,
      usa: 5.0,
      uk: 4.0,
      eu: 4.6,
      uae: 18.4,
      japan: 748,
    },
    gstRate: 12,
    image: "/fresh-paneer-cheese-block.jpg",
    active: true,
  },
  {
    id: "7",
    name: "Olive Oil (1L)",
    category: "Cooking",
    basePrice: 8.0,
    prices: {
      india: 668,
      usa: 8.0,
      uk: 6.3,
      eu: 7.4,
      uae: 29.4,
      japan: 1196,
    },
    gstRate: 18,
    image: "/olive-oil-bottle-premium.jpg",
    active: true,
  },
  {
    id: "8",
    name: "Dark Chocolate Bar",
    category: "Snacks",
    basePrice: 3.0,
    prices: {
      india: 251,
      usa: 3.0,
      uk: 2.4,
      eu: 2.8,
      uae: 11.0,
      japan: 449,
    },
    gstRate: 18,
    image: "/premium-dark-chocolate-bar.png",
    active: true,
  },
]

export function getProductPrice(product: Product, regionId: string): number {
  return product.prices[regionId] || product.basePrice
}

export function formatCurrency(amount: number, region: Region): string {
  const formatted = amount.toFixed(region.currency === "JPY" ? 0 : 2)
  return `${region.currencySymbol}${formatted}`
}
