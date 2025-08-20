// Sample user queries for testing the e-commerce query disambiguation system
import { UserQuery } from '../../../types';

// Example queries for the query input component
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

// Placeholder text for the query input
export const QUERY_INPUT_PLACEHOLDER = "e.g., find products on sale";

// Sample user queries with their entry points in the functional graph
export const USER_QUERIES: UserQuery[] = [
  // High-level outcome querys
  {
    id: 'query-enhance-shopping',
    text: 'I want to improve the online shopping experience',
    entryNode: 'outcome-customer-experience-storefront',
    entryLevel: 'outcome',
    ambiguous: false
  },
  {
    id: 'query-increase-sales',
    text: 'Help me increase our online sales revenue',
    entryNode: 'outcome-sales-growth-storefront',
    entryLevel: 'outcome',
    ambiguous: false
  },
  {
    id: 'query-optimize-inventory',
    text: 'I need to optimize our inventory management',
    entryNode: 'outcome-stock-management-inventory',
    entryLevel: 'outcome',
    ambiguous: false
  },
  {
    id: 'query-improve-fulfillment',
    text: 'Improve order fulfillment efficiency',
    entryNode: 'outcome-fulfillment-inventory',
    entryLevel: 'outcome',
    ambiguous: false
  },
  {
    id: 'query-build-loyalty',
    text: 'Build stronger customer relationships',
    entryNode: 'outcome-customer-relationships-crm',
    entryLevel: 'outcome',
    ambiguous: false
  },

  // Scenario-level querys (more specific)
  {
    id: 'query-product-search',
    text: 'Search for products in our catalog',
    entryNode: 'scenario-product-search-shared',
    entryLevel: 'scenario',
    ambiguous: true  // Shared between storefront and inventory
  },
  {
    id: 'query-checkout',
    text: 'Process a customer checkout',
    entryNode: 'scenario-checkout-storefront',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'query-order-processing',
    text: 'Process and fulfill customer orders',
    entryNode: 'scenario-order-processing-shared',
    entryLevel: 'scenario',
    ambiguous: true  // Shared between storefront and inventory
  },
  {
    id: 'query-customer-profiles',
    text: 'Manage customer profile data',
    entryNode: 'scenario-customer-profiles-shared',
    entryLevel: 'scenario',
    ambiguous: true  // Shared between storefront and CRM
  },
  {
    id: 'query-promotions',
    text: 'Run promotional campaigns',
    entryNode: 'scenario-promotions',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'query-recommendations',
    text: 'Generate product recommendations',
    entryNode: 'scenario-recommendations',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'query-stock-tracking',
    text: 'Track inventory stock levels',
    entryNode: 'scenario-stock-tracking-inventory',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'query-shipping',
    text: 'Manage shipping and delivery',
    entryNode: 'scenario-shipping',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'query-loyalty-program',
    text: 'Manage customer loyalty program',
    entryNode: 'scenario-loyalty-program',
    entryLevel: 'scenario',
    ambiguous: false
  },
  {
    id: 'query-support-tickets',
    text: 'Handle customer support requests',
    entryNode: 'scenario-support-tickets',
    entryLevel: 'scenario',
    ambiguous: false
  },

  // Step-level querys (specific tasks)
  {
    id: 'query-search-products-step',
    text: 'Search for specific products',
    entryNode: 'step-product-search-unified',
    entryLevel: 'step',
    ambiguous: true  // Unified step
  },
  {
    id: 'query-filter-results',
    text: 'Filter product search results',
    entryNode: 'step-filter-results',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'query-add-to-cart',
    text: 'Add items to shopping cart',
    entryNode: 'step-add-to-cart',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'query-process-payment',
    text: 'Process payment transaction',
    entryNode: 'step-process-payment',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'query-pick-items',
    text: 'Pick items for order fulfillment',
    entryNode: 'step-pick-items',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'query-pack-order',
    text: 'Pack order for shipping',
    entryNode: 'step-pack-order',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'query-track-points',
    text: 'Track loyalty program points',
    entryNode: 'step-track-points',
    entryLevel: 'step',
    ambiguous: false
  },
  {
    id: 'query-segment-customers',
    text: 'Segment customers by behavior',
    entryNode: 'step-segment-customers',
    entryLevel: 'step',
    ambiguous: false
  },

  // Action-level querys (very specific)
  {
    id: 'query-enter-keywords',
    text: 'Enter search keywords',
    entryNode: 'action-enter-keywords-storefront',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'query-apply-filters',
    text: 'Apply search filters',
    entryNode: 'action-apply-filters',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'query-select-quantity',
    text: 'Select product quantity',
    entryNode: 'action-select-quantity',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'query-enter-payment',
    text: 'Enter payment information',
    entryNode: 'action-enter-payment',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'query-scan-barcode',
    text: 'Scan product barcode',
    entryNode: 'action-scan-barcode-inventory',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'query-check-stock',
    text: 'Check stock availability',
    entryNode: 'action-check-stock-inventory',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'query-generate-picklist',
    text: 'Generate order picklist',
    entryNode: 'action-generate-picklist',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'query-package-items',
    text: 'Package items for shipping',
    entryNode: 'action-package-items',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'query-analyze-behavior',
    text: 'Analyze customer behavior',
    entryNode: 'action-analyze-behavior',
    entryLevel: 'action',
    ambiguous: false
  },
  {
    id: 'query-create-segments',
    text: 'Create customer segments',
    entryNode: 'action-create-segments',
    entryLevel: 'action',
    ambiguous: false
  }
];