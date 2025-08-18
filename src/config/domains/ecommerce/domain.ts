// Domain-specific configuration for E-commerce Platform
// This file contains all domain-specific constants for the e-commerce domain

// Domain information
export const DOMAIN_NAME = "E-commerce Platform";
export const DOMAIN_DESCRIPTION = "Simplified e-commerce demo with clear product overlaps";
export const COMPANY_NAME = "ShopTech Solutions";

// Product-specific colors for better visual distinction
// Standard product codes used throughout the application
export const PRODUCT_CODES = ['storefront', 'inventory', 'crm'] as const;
export type ProductCode = typeof PRODUCT_CODES[number];

export const PRODUCT_COLORS = {
  'storefront': '#4F46E5',  // Indigo - Online Store
  'inventory': '#10B981',   // Emerald - Inventory System
  'crm': '#F59E0B',        // Amber - Customer CRM
  'n/a': '#999'            // Gray - Not applicable
};

// Product names and descriptions
export const PRODUCTS = {
  'storefront': {
    name: 'Online Store',
    description: 'Customer-facing e-commerce website and shopping experience',
    abbreviation: 'STORE'
  },
  'inventory': {
    name: 'Inventory System',
    description: 'Warehouse management and stock control',
    abbreviation: 'INV'
  },
  'crm': {
    name: 'Customer CRM',
    description: 'Customer relationship and loyalty management',
    abbreviation: 'CRM'
  }
};

// Helper function to get product color with fallback
export const getProductColor = (product: string): string => {
  const normalizedProduct = product.toLowerCase();
  if (normalizedProduct === 'n/a') {
    return PRODUCT_COLORS['n/a'];
  }
  return PRODUCT_COLORS[normalizedProduct as keyof typeof PRODUCT_COLORS] || PRODUCT_COLORS['n/a'];
};

// Domain-specific capabilities/features
export const DOMAIN_CAPABILITIES = [
  'Product Catalog',
  'Shopping Cart',
  'Order Processing',
  'Inventory Management',
  'Customer Profiles',
  'Loyalty Programs',
  'Shipping & Fulfillment',
  'Customer Support'
];

// Industry focus areas
export const INDUSTRY_VERTICALS = [
  'Retail',
  'Online Marketplaces',
  'Direct-to-Consumer',
  'B2B Commerce',
  'Omnichannel Retail'
];

// Domain-specific synonyms
export const DOMAIN_SYNONYMS = {
  'product': ['item', 'merchandise', 'goods', 'article'],
  'order': ['purchase', 'transaction', 'sale'],
  'customer': ['buyer', 'shopper', 'client', 'consumer'],
  'inventory': ['stock', 'warehouse', 'storage'],
  'cart': ['basket', 'bag'],
  'search': ['find', 'browse', 'lookup', 'discover']
};

// Word forms for stemming/matching
export const WORD_FORMS = {
  'buy': 'purchase',
  'bought': 'purchase',
  'buying': 'purchase',
  'sell': 'sale',
  'selling': 'sale',
  'sold': 'sale',
  'ship': 'shipping',
  'shipped': 'shipping',
  'deliver': 'delivery',
  'delivered': 'delivery',
  'return': 'returns',
  'returned': 'returns',
  'returning': 'returns'
};

// Legacy export for compatibility
export const DOMAIN_CONFIG = {
  id: 'ecommerce',
  name: 'E-commerce Platform',
  description: 'Simplified e-commerce domain with clear overlaps for demonstration',
  version: '1.0.0',
  products: [
    {
      id: 'storefront',
      name: 'Online Store',
      description: 'Customer-facing e-commerce website',
      color: '#4F46E5',
      icon: '🛍️'
    },
    {
      id: 'inventory',
      name: 'Inventory System',
      description: 'Warehouse and stock management',
      color: '#10B981',
      icon: '📦'
    },
    {
      id: 'crm',
      name: 'Customer CRM',
      description: 'Customer relationship management',
      color: '#F59E0B',
      icon: '👥'
    }
  ],
  overlaps: [
    {
      name: 'Product Search',
      products: ['storefront', 'inventory'],
      description: 'Both systems need to search and find products'
    },
    {
      name: 'Order Processing',
      products: ['storefront', 'inventory'],
      description: 'Order handling appears in both sales and fulfillment'
    },
    {
      name: 'Customer Profiles',
      products: ['storefront', 'crm'],
      description: 'Customer data management across systems'
    }
  ],
  metrics: {
    totalNodes: 250,
    duplicateNodes: 18,
    sharedNodes: 6,
    rationalizationRate: 0.33
  }
};