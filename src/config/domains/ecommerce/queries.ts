// Query definitions for ecommerce domain
// Generated with comprehensive coverage for clear, ambiguous, and workflow querys
// Generated on: 2025-08-20T10:42:40.987Z

import { UserQuery } from '../../../types';

export const USER_QUERIES: UserQuery[] = [
  // ============================================
  // CLEAR QUERYS (10)
  // Unambiguous, single function mapping
  // ============================================
  {
    id: 'query-storefront-action',
    text: 'I want to enter keywords',
    entryNode: 'action-enter-keywords-storefront',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-inventory-action',
    text: 'Help me enter sku',
    entryNode: 'action-enter-sku-inventory',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-crm-action',
    text: 'Help me import data',
    entryNode: 'action-import-data-crm',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-action-action-browse-catego',
    text: 'How do I browse categories?',
    entryNode: 'action-browse-categories-storefront',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-action-action-scan-barcode-',
    text: 'I want to scan barcode',
    entryNode: 'action-scan-barcode-inventory',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-step-step-filter-results',
    text: 'Show me how to filter results',
    entryNode: 'step-filter-results',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-step-step-view-details',
    text: 'I need to view product details',
    entryNode: 'step-view-details',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-scenario-scenario-checkout-st',
    text: 'Need help with checkout process',
    entryNode: 'scenario-checkout-storefront',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-scenario-scenario-promotions',
    text: 'I\'m working on promotions & discounts',
    entryNode: 'scenario-promotions',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-outcome-outcome-customer-exp',
    text: 'My goal is enhance shopping experience',
    entryNode: 'outcome-customer-experience-storefront',
    entryLevel: 'outcome' as any,
    isDuplicate: false,
    isWorkflow: false
  },

  // ============================================
  // AMBIGUOUS QUERYS (5)
  // Require context for proper resolution
  // ============================================
  {
    id: 'query-ambiguous-product-search-1',
    text: 'product search',
    entryNode: 'scenario-product-search-storefront',
    entryLevel: 'scenario' as any,
    isDuplicate: true,
    isWorkflow: false
  },
  {
    id: 'query-ambiguous-product-search-2',
    text: 'product search now',
    entryNode: 'scenario-product-search-inventory',
    entryLevel: 'scenario' as any,
    isDuplicate: true,
    isWorkflow: false
  },
  {
    id: 'query-ambiguous-order-processing-1',
    text: 'order processing',
    entryNode: 'scenario-order-processing-inventory',
    entryLevel: 'scenario' as any,
    isDuplicate: true,
    isWorkflow: false
  },
  {
    id: 'query-ambiguous-order-processing-2',
    text: 'order processing now',
    entryNode: 'scenario-order-processing-storefront',
    entryLevel: 'scenario' as any,
    isDuplicate: true,
    isWorkflow: false
  },
  {
    id: 'query-ambiguous-customer-profiles-1',
    text: 'customer profiles',
    entryNode: 'scenario-customer-profiles-crm',
    entryLevel: 'scenario' as any,
    isDuplicate: true,
    isWorkflow: false
  }
,

  // ============================================
  // WORKFLOW QUERYS
  // Cross-product orchestration workflows
  // ============================================
  {
    id: 'query-workflow-order-fulfillment',
    text: 'Execute order fulfillment orchestration workflow',
    entryNode: 'workflow-order-fulfillment',
    entryLevel: 'workflow' as any,
    isDuplicate: false,
    isWorkflow: true
  },
  {
    id: 'query-workflow-seasonal-campaign',
    text: 'Coordinate seasonal campaign workflow',
    entryNode: 'workflow-seasonal-campaign',
    entryLevel: 'workflow' as any,
    isDuplicate: false,
    isWorkflow: true
  },
  {
    id: 'query-workflow-customer-retention',
    text: 'Orchestrate customer retention workflow',
    entryNode: 'workflow-customer-retention',
    entryLevel: 'workflow' as any,
    isDuplicate: false,
    isWorkflow: true
  }
];

// ============================================
// QUERY STATISTICS
// ============================================
export const QUERY_CATEGORIES = {
  clear: 10,
  ambiguous: 5,
  workflow: 3,
  total: 18
};

// Coverage meets requirements:
// ✅ Clear querys: Yes (10/5-10)
// ✅ Ambiguous querys: Yes (5/3-5)
// ✅ Workflow querys: Yes (0/1-3)
