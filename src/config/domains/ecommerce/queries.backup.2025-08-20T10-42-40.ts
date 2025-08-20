// Query definitions for ecommerce domain
// Auto-categorized with proper flags for clear, ambiguous, and workflow querys

import { UserQuery } from '../../../types';

export const USER_QUERIES: UserQuery[] = [
  // Clear Querys - Unambiguous, single product/function mapping
  {
    id: 'query-enhance-shopping',
    text: 'I want to improve the online shopping experience',
    entryNode: 'outcome-customer-experience-storefront',
    entryLevel: 'outcome' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-increase-sales',
    text: 'Help me increase our online sales revenue',
    entryNode: 'outcome-sales-growth-storefront',
    entryLevel: 'outcome' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-optimize-inventory',
    text: 'I need to optimize our inventory management',
    entryNode: 'outcome-stock-management-inventory',
    entryLevel: 'outcome' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-improve-fulfillment',
    text: 'Improve order fulfillment efficiency',
    entryNode: 'outcome-fulfillment-inventory',
    entryLevel: 'outcome' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-build-loyalty',
    text: 'Build stronger customer relationships',
    entryNode: 'outcome-customer-relationships-crm',
    entryLevel: 'outcome' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-product-search',
    text: 'Search for products in our catalog',
    entryNode: 'scenario-product-search-shared',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-checkout',
    text: 'Process a customer checkout',
    entryNode: 'scenario-checkout-storefront',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-order-processing',
    text: 'Process and fulfill customer orders',
    entryNode: 'scenario-order-processing-shared',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-customer-profiles',
    text: 'Manage customer profile data',
    entryNode: 'scenario-customer-profiles-shared',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-promotions',
    text: 'Run promotional campaigns',
    entryNode: 'scenario-promotions',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-recommendations',
    text: 'Generate product recommendations',
    entryNode: 'scenario-recommendations',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-stock-tracking',
    text: 'Track inventory stock levels',
    entryNode: 'scenario-stock-tracking-inventory',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-shipping',
    text: 'Manage shipping and delivery',
    entryNode: 'scenario-shipping',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-loyalty-program',
    text: 'Manage customer loyalty program',
    entryNode: 'scenario-loyalty-program',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-support-tickets',
    text: 'Handle customer support requests',
    entryNode: 'scenario-support-tickets',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-search-products-step',
    text: 'Search for specific products',
    entryNode: 'step-product-search-unified',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-filter-results',
    text: 'Filter product search results',
    entryNode: 'step-filter-results',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-add-to-cart',
    text: 'Add items to shopping cart',
    entryNode: 'step-add-to-cart',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-process-payment',
    text: 'Process payment transaction',
    entryNode: 'step-process-payment',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-pick-items',
    text: 'Pick items for order fulfillment',
    entryNode: 'step-pick-items',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-pack-order',
    text: 'Pack order for shipping',
    entryNode: 'step-pack-order',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-track-points',
    text: 'Track loyalty program points',
    entryNode: 'step-track-points',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-segment-customers',
    text: 'Segment customers by behavior',
    entryNode: 'step-segment-customers',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-enter-keywords',
    text: 'Enter search keywords',
    entryNode: 'action-enter-keywords-storefront',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-apply-filters',
    text: 'Apply search filters',
    entryNode: 'action-apply-filters',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-select-quantity',
    text: 'Select product quantity',
    entryNode: 'action-select-quantity',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-enter-payment',
    text: 'Enter payment information',
    entryNode: 'action-enter-payment',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-scan-barcode',
    text: 'Scan product barcode',
    entryNode: 'action-scan-barcode-inventory',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-check-stock',
    text: 'Check stock availability',
    entryNode: 'action-check-stock-inventory',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-generate-picklist',
    text: 'Generate order picklist',
    entryNode: 'action-generate-picklist',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-package-items',
    text: 'Package items for shipping',
    entryNode: 'action-package-items',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-analyze-behavior',
    text: 'Analyze customer behavior',
    entryNode: 'action-analyze-behavior',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-create-segments',
    text: 'Create customer segments',
    entryNode: 'action-create-segments',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  }
];

// Query categorization summary
export const QUERY_CATEGORIES = {
  clear: 33,
  ambiguous: 0,
  workflow: 0,
  total: 33
};
