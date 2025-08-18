// Sample user intents for testing the e-commerce intent disambiguation system
import { UserIntent } from '../../../types';

// Example queries for the intent input component
export const EXAMPLE_QUERIES = [
  "find product in stock",
  "process customer order",
  "check inventory levels",
  "apply discount codes",
  "track shipment status",
  "manage customer account",
  "handle product returns",
  "analyze sales data",
  "send promotional email",
  "update product catalog"
];

// Placeholder text for the intent input
export const INTENT_INPUT_PLACEHOLDER = "e.g., find products on sale";

// Sample user intents with their entry points in the functional graph
export const USER_INTENTS: UserIntent[] = [
  // High-level outcome intents
  {
    id: 'intent-enhance-shopping',
    text: 'I want to improve the online shopping experience',
    entryNode: 'outcome-customer-experience-storefront',
    entryLevel: 'outcome',
    ambiguous: false
  },
  {
    id: 'intent-increase-sales',
    text: 'Help me increase our online sales revenue',
    entryNode: 'outcome-sales-growth-storefront',
    entryLevel: 'outcome',
    ambiguous: false
  },
  {
    id: 'intent-optimize-inventory',
    text: 'I need to optimize our inventory management',
    entryNode: 'outcome-stock-management-inventory',
    entryLevel: 'outcome',
    ambiguous: false
  },
  {
    id: 'intent-improve-fulfillment',
    text: 'Improve order fulfillment efficiency',
    entryNode: 'outcome-fulfillment-inventory',
    entryLevel: 'outcome',
    ambiguous: false
  },
  {
    id: 'intent-build-loyalty',
    text: 'Build stronger customer relationships',
    entryNode: 'outcome-customer-relationships-crm',
    entryLevel: 'outcome',
    ambiguous: false
  },

  // Scenario-level intents (more specific)
  {
    id: 'intent-product-search',
    text: 'Search for products in our catalog',
    entryNode: 'scenario-product-search-shared',
    entryLevel: 'scenario',
    ambiguous: true  // Shared between storefront and inventory
  },
  {
    id: 'intent-checkout',
    text: 'Process a customer checkout',
    entryNode: 'scenario-checkout-storefront',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'intent-order-processing',
    text: 'Process and fulfill customer orders',
    entryNode: 'scenario-order-processing-shared',
    entryLevel: 'scenario',
    ambiguous: true  // Shared between storefront and inventory
  },
  {
    id: 'intent-customer-profiles',
    text: 'Manage customer profile data',
    entryNode: 'scenario-customer-profiles-shared',
    entryLevel: 'scenario',
    ambiguous: true  // Shared between storefront and CRM
  },
  {
    id: 'intent-promotions',
    text: 'Run promotional campaigns',
    entryNode: 'scenario-promotions',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'intent-recommendations',
    text: 'Generate product recommendations',
    entryNode: 'scenario-recommendations',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'intent-stock-tracking',
    text: 'Track inventory stock levels',
    entryNode: 'scenario-stock-tracking-inventory',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'intent-shipping',
    text: 'Manage shipping and delivery',
    entryNode: 'scenario-shipping',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'intent-loyalty-program',
    text: 'Manage customer loyalty program',
    entryNode: 'scenario-loyalty-program',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'intent-support-tickets',
    text: 'Handle customer support requests',
    entryNode: 'scenario-support-tickets',
    entryLevel: 'scenario',
    ambiguous: false
  },

  // Step-level intents (specific tasks)
  {
    id: 'intent-search-products-step',
    text: 'Search for specific products',
    entryNode: 'step-product-search-unified',
    entryLevel: 'step',
    ambiguous: true  // Unified step
  },
  {
    id: 'intent-filter-results',
    text: 'Filter product search results',
    entryNode: 'step-filter-results',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'intent-add-to-cart',
    text: 'Add items to shopping cart',
    entryNode: 'step-add-to-cart',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'intent-process-payment',
    text: 'Process payment transaction',
    entryNode: 'step-process-payment',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'intent-pick-items',
    text: 'Pick items for order fulfillment',
    entryNode: 'step-pick-items',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'intent-pack-order',
    text: 'Pack order for shipping',
    entryNode: 'step-pack-order',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'intent-track-points',
    text: 'Track loyalty program points',
    entryNode: 'step-track-points',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'intent-segment-customers',
    text: 'Segment customers by behavior',
    entryNode: 'step-segment-customers',
    entryLevel: 'step',
    ambiguous: false
  },

  // Action-level intents (very specific)
  {
    id: 'intent-enter-keywords',
    text: 'Enter search keywords',
    entryNode: 'action-enter-keywords-storefront',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'intent-apply-filters',
    text: 'Apply search filters',
    entryNode: 'action-apply-filters',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'intent-select-quantity',
    text: 'Select product quantity',
    entryNode: 'action-select-quantity',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'intent-enter-payment',
    text: 'Enter payment information',
    entryNode: 'action-enter-payment',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'intent-scan-barcode',
    text: 'Scan product barcode',
    entryNode: 'action-scan-barcode-inventory',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'intent-check-stock',
    text: 'Check stock availability',
    entryNode: 'action-check-stock-inventory',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'intent-generate-picklist',
    text: 'Generate order picklist',
    entryNode: 'action-generate-picklist',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'intent-package-items',
    text: 'Package items for shipping',
    entryNode: 'action-package-items',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'intent-analyze-behavior',
    text: 'Analyze customer behavior',
    entryNode: 'action-analyze-behavior',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'intent-create-segments',
    text: 'Create customer segments',
    entryNode: 'action-create-segments',
    entryLevel: 'action',
    ambiguous: false
  }
];