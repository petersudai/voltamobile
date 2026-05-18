export const WHATSAPP_NUMBER = "+254708004281";
export const STORE_NAME = "Volta Mobile";
export const STORE_TAGLINE = "Powered by Trust.";
export const STORE_ADDRESS = "Nairobi CBD, Moi Avenue, Ground Floor";
export const STORE_HOURS = "Mon–Sat 8:30 AM – 7:00 PM";
export const USD_TO_KES_RATE = 130;

export const CONDITION_LABELS: Record<string, string> = {
  BRAND_NEW: "Brand New",
  EX_UK: "Ex-UK",
  REFURBISHED: "Refurbished",
  USED: "Used",
};

export const CONDITION_COLORS: Record<string, string> = {
  BRAND_NEW: "bg-emerald-100 text-emerald-800",
  EX_UK: "bg-blue-100 text-blue-800",
  REFURBISHED: "bg-violet-100 text-violet-800",
  USED: "bg-gray-100 text-gray-700",
};

export const STORAGE_OPTIONS = ["64GB", "128GB", "256GB", "512GB", "1TB"];

export const PRICE_RANGES = [
  { label: "Under KSh 30,000", min: 0, max: 30000 },
  { label: "KSh 30,000 – 60,000", min: 30000, max: 60000 },
  { label: "KSh 60,000 – 100,000", min: 60000, max: 100000 },
  { label: "KSh 100,000 – 150,000", min: 100000, max: 150000 },
  { label: "Over KSh 150,000", min: 150000, max: 9999999 },
];

export const WHATSAPP_MESSAGE = (productName: string, condition: string, price: string) =>
  `Hi, I'm interested in the *${productName}* (${condition}) listed at *${price}*. Is it still available at the CBD shop?`;
