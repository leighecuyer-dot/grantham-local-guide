// Stripe subscription tiers configuration
export const SUBSCRIPTION_TIERS = {
  free: {
    name: "Free",
    price: 0,
    priceId: null,
    productId: null,
    features: [
      "Basic listing in directory",
      "1 business image",
      "Standard search placement",
      "Business contact info",
    ],
  },
  featured: {
    name: "Featured",
    price: 5,
    priceId: "price_1SdH1mPmajPuonYtmz7mTMNx",
    productId: "prod_TaRvdpYtRpyuTO",
    features: [
      "Everything in Free",
      "Top category placement",
      "Up to 3 business images",
      "Highlighted listing background",
      "Priority in search results",
    ],
  },
  premium: {
    name: "Premium",
    price: 20,
    priceId: "price_1SdQUfPmajPuonYtomrJMwWX",
    productId: "prod_TabihOQjWEmFj0",
    features: [
      "Everything in Featured",
      "Featured on homepage",
      "Priority search placement",
      "AI-powered profile rewrite",
      "Social media shoutout",
      "Monthly analytics report",
    ],
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

export const getTierByProductId = (productId: string | null): SubscriptionTier => {
  if (!productId) return "free";
  if (productId === SUBSCRIPTION_TIERS.featured.productId) return "featured";
  if (productId === SUBSCRIPTION_TIERS.premium.productId) return "premium";
  return "free";
};
