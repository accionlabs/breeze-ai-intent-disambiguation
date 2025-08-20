// E-commerce domain functional hierarchy - Simple and clear demonstration
import { FunctionalNode } from '../../../types';

export const FUNCTIONAL_NODES: Record<string, FunctionalNode> = {
  // Product Level - Just 3 products for simplicity
  'product-storefront': {
    id: 'product-storefront',
    label: 'Online Store',
    level: 'product',
    parents: [],
    children: ['outcome-customer-experience-storefront', 'outcome-sales-growth-storefront']
  },
  'product-inventory': {
    id: 'product-inventory',
    label: 'Inventory System',
    level: 'product',
    parents: [],
    children: ['outcome-stock-management-inventory', 'outcome-fulfillment-inventory']
  },
  'product-crm': {
    id: 'product-crm',
    label: 'Customer CRM',
    level: 'product',
    parents: [],
    children: ['outcome-customer-relationships-crm', 'outcome-customer-service-crm']
  },

  // Outcome Level - Product-specific outcomes
  // Storefront outcomes
  'outcome-customer-experience-storefront': {
    id: 'outcome-customer-experience-storefront',
    label: 'Enhance Shopping Experience',
    level: 'outcome',
    products: ['storefront'],
    parents: ['product-storefront'],
    children: ['scenario-product-search-storefront', 'scenario-checkout-storefront', 'scenario-customer-profiles-storefront']
  },
  'outcome-sales-growth-storefront': {
    id: 'outcome-sales-growth-storefront',
    label: 'Increase Sales',
    level: 'outcome',
    products: ['storefront'],
    parents: ['product-storefront'],
    children: ['scenario-promotions', 'scenario-recommendations', 'scenario-order-processing-storefront']
  },

  // Inventory outcomes
  'outcome-stock-management-inventory': {
    id: 'outcome-stock-management-inventory',
    label: 'Optimize Stock Levels',
    level: 'outcome',
    products: ['inventory'],
    parents: ['product-inventory'],
    children: ['scenario-stock-tracking-inventory', 'scenario-reordering', 'scenario-product-search-inventory']
  },
  'outcome-fulfillment-inventory': {
    id: 'outcome-fulfillment-inventory',
    label: 'Efficient Order Fulfillment',
    level: 'outcome',
    products: ['inventory'],
    parents: ['product-inventory'],
    children: ['scenario-order-processing-inventory', 'scenario-shipping']
  },

  // CRM outcomes
  'outcome-customer-relationships-crm': {
    id: 'outcome-customer-relationships-crm',
    label: 'Build Customer Loyalty',
    level: 'outcome',
    products: ['crm'],
    parents: ['product-crm'],
    children: ['scenario-customer-profiles-crm', 'scenario-loyalty-program']
  },
  'outcome-customer-service-crm': {
    id: 'outcome-customer-service-crm',
    label: 'Deliver Great Service',
    level: 'outcome',
    products: ['crm'],
    parents: ['product-crm'],
    children: ['scenario-support-tickets', 'scenario-order-tracking-crm']
  },

  // Scenario Level - Product-specific scenarios
  // Storefront scenarios
  'scenario-product-search-storefront': {
    id: 'scenario-product-search-storefront',
    label: 'Product Search',
    level: 'scenario',
    products: ['storefront'],
    parents: ['outcome-customer-experience-storefront'],
    children: ['step-search-products-storefront', 'step-filter-results', 'step-view-details']
  },
  'scenario-checkout-storefront': {
    id: 'scenario-checkout-storefront',
    label: 'Checkout Process',
    level: 'scenario',
    products: ['storefront'],
    parents: ['outcome-customer-experience-storefront'],
    children: ['step-add-to-cart', 'step-process-payment', 'step-confirm-order-storefront']
  },
  'scenario-promotions': {
    id: 'scenario-promotions',
    label: 'Promotions & Discounts',
    level: 'scenario',
    products: ['storefront'],
    parents: ['outcome-sales-growth-storefront'],
    children: ['step-apply-discounts', 'step-show-deals', 'step-send-offers']
  },
  'scenario-recommendations': {
    id: 'scenario-recommendations',
    label: 'Product Recommendations',
    level: 'scenario',
    products: ['storefront'],
    parents: ['outcome-sales-growth-storefront'],
    children: ['step-analyze-behavior', 'step-suggest-products', 'step-personalize']
  },

  // Inventory scenarios
  'scenario-stock-tracking-inventory': {
    id: 'scenario-stock-tracking-inventory',
    label: 'Stock Tracking',
    level: 'scenario',
    products: ['inventory'],
    parents: ['outcome-stock-management-inventory'],
    children: ['step-monitor-levels', 'step-track-movement', 'step-update-stock-inventory']
  },
  'scenario-reordering': {
    id: 'scenario-reordering',
    label: 'Reordering',
    level: 'scenario',
    products: ['inventory'],
    parents: ['outcome-stock-management-inventory'],
    children: ['step-check-thresholds', 'step-create-purchase-order', 'step-receive-shipment']
  },
  'scenario-order-processing-inventory': {
    id: 'scenario-order-processing-inventory',
    label: 'Order Processing',
    level: 'scenario',
    products: ['inventory'],
    parents: ['outcome-fulfillment-inventory'],
    children: ['step-receive-order-inventory', 'step-pick-items', 'step-pack-order']
  },
  'scenario-shipping': {
    id: 'scenario-shipping',
    label: 'Shipping',
    level: 'scenario',
    products: ['inventory'],
    parents: ['outcome-fulfillment-inventory'],
    children: ['step-generate-label', 'step-schedule-pickup', 'step-track-shipment-inventory']
  },

  // CRM scenarios
  'scenario-customer-profiles-crm': {
    id: 'scenario-customer-profiles-crm',
    label: 'Customer Profiles',
    level: 'scenario',
    products: ['crm'],
    parents: ['outcome-customer-relationships-crm'],
    children: ['step-collect-data-crm', 'step-analyze-preferences', 'step-segment-customers']
  },
  'scenario-loyalty-program': {
    id: 'scenario-loyalty-program',
    label: 'Loyalty Program',
    level: 'scenario',
    products: ['crm'],
    parents: ['outcome-customer-relationships-crm'],
    children: ['step-track-points', 'step-offer-rewards', 'step-send-communications']
  },
  'scenario-support-tickets': {
    id: 'scenario-support-tickets',
    label: 'Support Tickets',
    level: 'scenario',
    products: ['crm'],
    parents: ['outcome-customer-service-crm'],
    children: ['step-create-ticket', 'step-assign-agent', 'step-resolve-issue']
  },
  'scenario-order-tracking-crm': {
    id: 'scenario-order-tracking-crm',
    label: 'Order Tracking',
    level: 'scenario',
    products: ['crm'],
    parents: ['outcome-customer-service-crm'],
    children: ['step-check-status-crm', 'step-update-customer-crm', 'step-handle-inquiries']
  },

  // DUPLICATE SCENARIOS - These show the overlap problem
  // Product Search appears in both Storefront and Inventory
  'scenario-product-search-inventory': {
    id: 'scenario-product-search-inventory',
    label: 'Product Search',
    level: 'scenario',
    products: ['inventory'],
    parents: ['outcome-stock-management-inventory'],
    children: ['step-search-products-inventory', 'step-check-availability-inventory', 'step-locate-warehouse']
  },

  // Order Processing appears in both Storefront and CRM
  'scenario-order-processing-storefront': {
    id: 'scenario-order-processing-storefront',
    label: 'Order Processing',
    level: 'scenario',
    products: ['storefront'],
    parents: ['outcome-sales-growth-storefront'],
    children: ['step-receive-order-storefront', 'step-validate-payment', 'step-confirm-order-storefront']
  },

  // Customer Data appears in both Storefront and CRM
  'scenario-customer-profiles-storefront': {
    id: 'scenario-customer-profiles-storefront',
    label: 'Customer Profiles',
    level: 'scenario',
    products: ['storefront'],
    parents: ['outcome-customer-experience-storefront'],
    children: ['step-collect-data-storefront', 'step-save-preferences-storefront', 'step-track-history-storefront']
  },

  // SHARED SCENARIOS - Created through rationalization (must exist for highlighting)

  // Step Level - Simple steps for each scenario
  // Storefront steps
  'step-search-products-storefront': {
    id: 'step-search-products-storefront',
    label: 'Search Products',
    level: 'step',
    products: ['storefront'],
    parents: ['scenario-product-search-storefront'],
    children: ['action-enter-keywords-storefront', 'action-browse-categories-storefront']
  },
  'step-filter-results': {
    id: 'step-filter-results',
    label: 'Filter Results',
    level: 'step',
    products: ['storefront'],
    parents: ['scenario-product-search-storefront'],
    children: ['action-apply-filters', 'action-sort-results']
  },
  'step-view-details': {
    id: 'step-view-details',
    label: 'View Product Details',
    level: 'step',
    products: ['storefront'],
    parents: ['scenario-product-search-storefront'],
    children: ['action-read-description', 'action-view-images']
  },
  'step-add-to-cart': {
    id: 'step-add-to-cart',
    label: 'Add to Cart',
    level: 'step',
    products: ['storefront'],
    parents: ['scenario-checkout-storefront'],
    children: ['action-select-quantity', 'action-add-item']
  },
  'step-process-payment': {
    id: 'step-process-payment',
    label: 'Process Payment',
    level: 'step',
    products: ['storefront'],
    parents: ['scenario-checkout-storefront'],
    children: ['action-enter-payment', 'action-verify-payment']
  },
  'step-confirm-order-storefront': {
    id: 'step-confirm-order-storefront',
    label: 'Confirm Order',
    level: 'step',
    products: ['storefront'],
    parents: ['scenario-checkout-storefront', 'scenario-order-processing-storefront'],
    children: ['action-review-order-storefront', 'action-place-order-storefront']
  },

  // Duplicate steps for overlapping functionality
  'step-search-products-inventory': {
    id: 'step-search-products-inventory',
    label: 'Search Products',
    level: 'step',
    products: ['inventory'],
    parents: ['scenario-product-search-inventory'],
    children: ['action-enter-sku-inventory', 'action-scan-barcode-inventory']
  },
  'step-check-availability-inventory': {
    id: 'step-check-availability-inventory',
    label: 'Check Availability',
    level: 'step',
    products: ['inventory'],
    parents: ['scenario-product-search-inventory'],
    children: ['action-check-stock-inventory', 'action-check-locations-inventory']
  },
  'step-locate-warehouse': {
    id: 'step-locate-warehouse',
    label: 'Locate in Warehouse',
    level: 'step',
    products: ['inventory'],
    parents: ['scenario-product-search-inventory'],
    children: ['action-find-aisle', 'action-find-shelf']
  },
  'step-receive-order-storefront': {
    id: 'step-receive-order-storefront',
    label: 'Receive Order',
    level: 'step',
    products: ['storefront'],
    parents: ['scenario-order-processing-storefront'],
    children: ['action-capture-order-storefront', 'action-validate-items-storefront']
  },
  'step-validate-payment': {
    id: 'step-validate-payment',
    label: 'Validate Payment',
    level: 'step',
    products: ['storefront'],
    parents: ['scenario-order-processing-storefront'],
    children: ['action-check-payment', 'action-authorize-charge']
  },
  'step-receive-order-inventory': {
    id: 'step-receive-order-inventory',
    label: 'Receive Order',
    level: 'step',
    products: ['inventory'],
    parents: ['scenario-order-processing-inventory'],
    children: ['action-import-order-inventory', 'action-queue-fulfillment-inventory']
  },
  'step-pick-items': {
    id: 'step-pick-items',
    label: 'Pick Items',
    level: 'step',
    products: ['inventory'],
    parents: ['scenario-order-processing-inventory'],
    children: ['action-generate-picklist', 'action-collect-items']
  },
  'step-pack-order': {
    id: 'step-pack-order',
    label: 'Pack Order',
    level: 'step',
    products: ['inventory'],
    parents: ['scenario-order-processing-inventory'],
    children: ['action-package-items', 'action-add-invoice']
  },
  'step-collect-data-storefront': {
    id: 'step-collect-data-storefront',
    label: 'Collect Customer Data',
    level: 'step',
    products: ['storefront'],
    parents: ['scenario-customer-profiles-storefront'],
    children: ['action-capture-registration-storefront', 'action-track-browsing-storefront']
  },
  'step-save-preferences-storefront': {
    id: 'step-save-preferences-storefront',
    label: 'Save Preferences',
    level: 'step',
    products: ['storefront'],
    parents: ['scenario-customer-profiles-storefront'],
    children: ['action-store-preferences-storefront', 'action-update-profile-storefront']
  },
  'step-track-history-storefront': {
    id: 'step-track-history-storefront',
    label: 'Track History',
    level: 'step',
    products: ['storefront'],
    parents: ['scenario-customer-profiles-storefront'],
    children: ['action-log-purchases-storefront', 'action-track-views-storefront']
  },
  'step-collect-data-crm': {
    id: 'step-collect-data-crm',
    label: 'Collect Customer Data',
    level: 'step',
    products: ['crm'],
    parents: ['scenario-customer-profiles-crm'],
    children: ['action-import-data-crm', 'action-enrich-profile-crm']
  },
  'step-analyze-preferences': {
    id: 'step-analyze-preferences',
    label: 'Analyze Preferences',
    level: 'step',
    products: ['crm'],
    parents: ['scenario-customer-profiles-crm'],
    children: ['action-analyze-behavior', 'action-identify-patterns']
  },
  'step-segment-customers': {
    id: 'step-segment-customers',
    label: 'Segment Customers',
    level: 'step',
    products: ['crm'],
    parents: ['scenario-customer-profiles-crm'],
    children: ['action-create-segments', 'action-assign-groups']
  },

  // Unified steps for rationalization
  
  // Shared steps for duplicate labels

  // Other necessary steps (simplified)
  'step-check-thresholds': {
    id: 'step-check-thresholds',
    label: 'Check Thresholds',
    level: 'step',
    products: ['inventory'],
    parents: ['scenario-reordering'],
    children: ['action-check-minimum', 'action-check-maximum']
  },
  'step-create-purchase-order': {
    id: 'step-create-purchase-order',
    label: 'Create Purchase Order',
    level: 'step',
    products: ['inventory'],
    parents: ['scenario-reordering'],
    children: ['action-select-supplier', 'action-submit-order']
  },
  'step-receive-shipment': {
    id: 'step-receive-shipment',
    label: 'Receive Shipment',
    level: 'step',
    products: ['inventory'],
    parents: ['scenario-reordering'],
    children: ['action-verify-shipment', 'action-update-inventory']
  },
  'step-generate-label': {
    id: 'step-generate-label',
    label: 'Generate Shipping Label',
    level: 'step',
    products: ['inventory'],
    parents: ['scenario-shipping'],
    children: ['action-select-carrier', 'action-print-label']
  },
  'step-schedule-pickup': {
    id: 'step-schedule-pickup',
    label: 'Schedule Pickup',
    level: 'step',
    products: ['inventory'],
    parents: ['scenario-shipping'],
    children: ['action-book-pickup', 'action-confirm-time']
  },
  'step-track-shipment-inventory': {
    id: 'step-track-shipment-inventory',
    label: 'Track Shipment',
    level: 'step',
    products: ['inventory'],
    parents: ['scenario-shipping'],
    children: ['action-get-tracking', 'action-update-status']
  },
  'step-track-points': {
    id: 'step-track-points',
    label: 'Track Points',
    level: 'step',
    products: ['crm'],
    parents: ['scenario-loyalty-program'],
    children: ['action-calculate-points', 'action-update-balance']
  },
  'step-offer-rewards': {
    id: 'step-offer-rewards',
    label: 'Offer Rewards',
    level: 'step',
    products: ['crm'],
    parents: ['scenario-loyalty-program'],
    children: ['action-show-rewards', 'action-redeem-points']
  },
  'step-send-communications': {
    id: 'step-send-communications',
    label: 'Send Communications',
    level: 'step',
    products: ['crm'],
    parents: ['scenario-loyalty-program'],
    children: ['action-send-updates', 'action-send-offers-crm']
  },
  'step-create-ticket': {
    id: 'step-create-ticket',
    label: 'Create Ticket',
    level: 'step',
    products: ['crm'],
    parents: ['scenario-support-tickets'],
    children: ['action-capture-issue', 'action-set-priority']
  },
  'step-assign-agent': {
    id: 'step-assign-agent',
    label: 'Assign Agent',
    level: 'step',
    products: ['crm'],
    parents: ['scenario-support-tickets'],
    children: ['action-find-agent', 'action-route-ticket']
  },
  'step-resolve-issue': {
    id: 'step-resolve-issue',
    label: 'Resolve Issue',
    level: 'step',
    products: ['crm'],
    parents: ['scenario-support-tickets'],
    children: ['action-provide-solution', 'action-close-ticket']
  },
  'step-check-status-crm': {
    id: 'step-check-status-crm',
    label: 'Check Order Status',
    level: 'step',
    products: ['crm'],
    parents: ['scenario-order-tracking-crm'],
    children: ['action-lookup-order', 'action-get-status']
  },
  'step-update-customer-crm': {
    id: 'step-update-customer-crm',
    label: 'Update Customer',
    level: 'step',
    products: ['crm'],
    parents: ['scenario-order-tracking-crm'],
    children: ['action-send-notification', 'action-log-update']
  },
  'step-handle-inquiries': {
    id: 'step-handle-inquiries',
    label: 'Handle Inquiries',
    level: 'step',
    products: ['crm'],
    parents: ['scenario-order-tracking-crm'],
    children: ['action-answer-questions', 'action-escalate-issue']
  },
  'step-analyze-behavior': {
    id: 'step-analyze-behavior',
    label: 'Analyze Behavior',
    level: 'step',
    products: ['storefront'],
    parents: ['scenario-recommendations'],
    children: ['action-track-clicks', 'action-track-purchases', 'action-analyze-behavior']
  },
  'step-suggest-products': {
    id: 'step-suggest-products',
    label: 'Suggest Products',
    level: 'step',
    products: ['storefront'],
    parents: ['scenario-recommendations'],
    children: ['action-find-similar', 'action-find-complementary']
  },
  'step-personalize': {
    id: 'step-personalize',
    label: 'Personalize Experience',
    level: 'step',
    products: ['storefront'],
    parents: ['scenario-recommendations'],
    children: ['action-customize-homepage', 'action-tailor-emails']
  },
  'step-monitor-levels': {
    id: 'step-monitor-levels',
    label: 'Monitor Stock Levels',
    level: 'step',
    products: ['inventory'],
    parents: ['scenario-stock-tracking-inventory'],
    children: ['action-check-quantity', 'action-alert-low-stock']
  },
  'step-track-movement': {
    id: 'step-track-movement',
    label: 'Track Movement',
    level: 'step',
    products: ['inventory'],
    parents: ['scenario-stock-tracking-inventory'],
    children: ['action-log-transactions', 'action-update-location']
  },
  'step-update-stock-inventory': {
    id: 'step-update-stock-inventory',
    label: 'Update Stock',
    level: 'step',
    products: ['inventory'],
    parents: ['scenario-stock-tracking-inventory'],
    children: ['action-adjust-quantity-inventory', 'action-sync-systems-inventory']
  },
  'step-apply-discounts': {
    id: 'step-apply-discounts',
    label: 'Apply Discounts',
    level: 'step',
    products: ['storefront'],
    parents: ['scenario-promotions'],
    children: ['action-calculate-discount', 'action-apply-code']
  },
  'step-show-deals': {
    id: 'step-show-deals',
    label: 'Show Deals',
    level: 'step',
    products: ['storefront'],
    parents: ['scenario-promotions'],
    children: ['action-display-banners', 'action-highlight-sales']
  },
  'step-send-offers': {
    id: 'step-send-offers',
    label: 'Send Offers',
    level: 'step',
    products: ['storefront'],
    parents: ['scenario-promotions'],
    children: ['action-email-promotions', 'action-push-notifications']
  },

  // Action Level - Simple actions
  // Search actions
  'action-enter-keywords-storefront': {
    id: 'action-enter-keywords-storefront',
    label: 'Enter Keywords',
    level: 'action',
    products: ['storefront'],
    parents: ['step-search-products-storefront'],
    children: []
  },
  'action-browse-categories-storefront': {
    id: 'action-browse-categories-storefront',
    label: 'Browse Categories',
    level: 'action',
    products: ['storefront'],
    parents: ['step-search-products-storefront'],
    children: []
  },
  'action-enter-sku-inventory': {
    id: 'action-enter-sku-inventory',
    label: 'Enter SKU',
    level: 'action',
    products: ['inventory'],
    parents: ['step-search-products-inventory'],
    children: []
  },
  'action-scan-barcode-inventory': {
    id: 'action-scan-barcode-inventory',
    label: 'Scan Barcode',
    level: 'action',
    products: ['inventory'],
    parents: ['step-search-products-inventory'],
    children: []
  },
  'action-check-stock-inventory': {
    id: 'action-check-stock-inventory',
    label: 'Check Stock',
    level: 'action',
    products: ['inventory'],
    parents: ['step-check-availability-inventory'],
    children: []
  },
  'action-check-locations-inventory': {
    id: 'action-check-locations-inventory',
    label: 'Check Locations',
    level: 'action',
    products: ['inventory'],
    parents: ['step-check-availability-inventory'],
    children: []
  },

  // Order processing actions
  'action-capture-order-storefront': {
    id: 'action-capture-order-storefront',
    label: 'Capture Order',
    level: 'action',
    products: ['storefront'],
    parents: ['step-receive-order-storefront'],
    children: []
  },
  'action-validate-items-storefront': {
    id: 'action-validate-items-storefront',
    label: 'Validate Items',
    level: 'action',
    products: ['storefront'],
    parents: ['step-receive-order-storefront'],
    children: []
  },
  'action-import-order-inventory': {
    id: 'action-import-order-inventory',
    label: 'Import Order',
    level: 'action',
    products: ['inventory'],
    parents: ['step-receive-order-inventory'],
    children: []
  },
  'action-queue-fulfillment-inventory': {
    id: 'action-queue-fulfillment-inventory',
    label: 'Queue for Fulfillment',
    level: 'action',
    products: ['inventory'],
    parents: ['step-receive-order-inventory'],
    children: []
  },
  'action-generate-picklist': {
    id: 'action-generate-picklist',
    label: 'Generate Picklist',
    level: 'action',
    products: ['inventory'],
    parents: ['step-pick-items'],
    children: []
  },
  'action-collect-items': {
    id: 'action-collect-items',
    label: 'Collect Items',
    level: 'action',
    products: ['inventory'],
    parents: ['step-pick-items'],
    children: []
  },

  // Customer profile actions
  'action-capture-registration-storefront': {
    id: 'action-capture-registration-storefront',
    label: 'Capture Registration',
    level: 'action',
    products: ['storefront'],
    parents: ['step-collect-data-storefront'],
    children: []
  },
  'action-track-browsing-storefront': {
    id: 'action-track-browsing-storefront',
    label: 'Track Browsing',
    level: 'action',
    products: ['storefront'],
    parents: ['step-collect-data-storefront'],
    children: []
  },
  'action-import-data-crm': {
    id: 'action-import-data-crm',
    label: 'Import Data',
    level: 'action',
    products: ['crm'],
    parents: ['step-collect-data-crm'],
    children: []
  },
  'action-enrich-profile-crm': {
    id: 'action-enrich-profile-crm',
    label: 'Enrich Profile',
    level: 'action',
    products: ['crm'],
    parents: ['step-collect-data-crm'],
    children: []
  },
  'action-analyze-behavior': {
    id: 'action-analyze-behavior',
    label: 'Analyze Behavior',
    level: 'action',
    products: ['crm', 'storefront'],
    parents: ['step-analyze-preferences', 'step-analyze-behavior'],
    children: []
  },
  'action-identify-patterns': {
    id: 'action-identify-patterns',
    label: 'Identify Patterns',
    level: 'action',
    products: ['crm'],
    parents: ['step-analyze-preferences'],
    children: []
  },

  // Other necessary actions (simplified list)
  'action-apply-filters': {
    id: 'action-apply-filters',
    label: 'Apply Filters',
    level: 'action',
    products: ['storefront'],
    parents: ['step-filter-results'],
    children: []
  },
  'action-sort-results': {
    id: 'action-sort-results',
    label: 'Sort Results',
    level: 'action',
    products: ['storefront'],
    parents: ['step-filter-results'],
    children: []
  },
  'action-read-description': {
    id: 'action-read-description',
    label: 'Read Description',
    level: 'action',
    products: ['storefront'],
    parents: ['step-view-details'],
    children: []
  },
  'action-view-images': {
    id: 'action-view-images',
    label: 'View Images',
    level: 'action',
    products: ['storefront'],
    parents: ['step-view-details'],
    children: []
  },
  'action-select-quantity': {
    id: 'action-select-quantity',
    label: 'Select Quantity',
    level: 'action',
    products: ['storefront'],
    parents: ['step-add-to-cart'],
    children: []
  },
  'action-add-item': {
    id: 'action-add-item',
    label: 'Add Item',
    level: 'action',
    products: ['storefront'],
    parents: ['step-add-to-cart'],
    children: []
  },
  'action-enter-payment': {
    id: 'action-enter-payment',
    label: 'Enter Payment',
    level: 'action',
    products: ['storefront'],
    parents: ['step-process-payment'],
    children: []
  },
  'action-verify-payment': {
    id: 'action-verify-payment',
    label: 'Verify Payment',
    level: 'action',
    products: ['storefront'],
    parents: ['step-process-payment'],
    children: []
  },
  'action-review-order-storefront': {
    id: 'action-review-order-storefront',
    label: 'Review Order',
    level: 'action',
    products: ['storefront'],
    parents: ['step-confirm-order-storefront'],
    children: []
  },
  'action-place-order-storefront': {
    id: 'action-place-order-storefront',
    label: 'Place Order',
    level: 'action',
    products: ['storefront'],
    parents: ['step-confirm-order-storefront'],
    children: []
  },
  
  // Additional actions for completeness
  'action-find-aisle': {
    id: 'action-find-aisle',
    label: 'Find Aisle',
    level: 'action',
    products: ['inventory'],
    parents: ['step-locate-warehouse'],
    children: []
  },
  'action-find-shelf': {
    id: 'action-find-shelf',
    label: 'Find Shelf',
    level: 'action',
    products: ['inventory'],
    parents: ['step-locate-warehouse'],
    children: []
  },
  'action-check-payment': {
    id: 'action-check-payment',
    label: 'Check Payment',
    level: 'action',
    products: ['storefront'],
    parents: ['step-validate-payment'],
    children: []
  },
  'action-authorize-charge': {
    id: 'action-authorize-charge',
    label: 'Authorize Charge',
    level: 'action',
    products: ['storefront'],
    parents: ['step-validate-payment'],
    children: []
  },
  'action-package-items': {
    id: 'action-package-items',
    label: 'Package Items',
    level: 'action',
    products: ['inventory'],
    parents: ['step-pack-order'],
    children: []
  },
  'action-add-invoice': {
    id: 'action-add-invoice',
    label: 'Add Invoice',
    level: 'action',
    products: ['inventory'],
    parents: ['step-pack-order'],
    children: []
  },
  'action-store-preferences-storefront': {
    id: 'action-store-preferences-storefront',
    label: 'Store Preferences',
    level: 'action',
    products: ['storefront'],
    parents: ['step-save-preferences-storefront'],
    children: []
  },
  'action-update-profile-storefront': {
    id: 'action-update-profile-storefront',
    label: 'Update Profile',
    level: 'action',
    products: ['storefront'],
    parents: ['step-save-preferences-storefront'],
    children: []
  },
  'action-log-purchases-storefront': {
    id: 'action-log-purchases-storefront',
    label: 'Log Purchases',
    level: 'action',
    products: ['storefront'],
    parents: ['step-track-history-storefront'],
    children: []
  },
  'action-track-views-storefront': {
    id: 'action-track-views-storefront',
    label: 'Track Views',
    level: 'action',
    products: ['storefront'],
    parents: ['step-track-history-storefront'],
    children: []
  },
  'action-create-segments': {
    id: 'action-create-segments',
    label: 'Create Segments',
    level: 'action',
    products: ['crm'],
    parents: ['step-segment-customers'],
    children: []
  },
  'action-assign-groups': {
    id: 'action-assign-groups',
    label: 'Assign Groups',
    level: 'action',
    products: ['crm'],
    parents: ['step-segment-customers'],
    children: []
  },
  'action-check-quantity': {
    id: 'action-check-quantity',
    label: 'Check Quantity',
    level: 'action',
    products: ['inventory'],
    parents: ['step-monitor-levels'],
    children: []
  },
  'action-alert-low-stock': {
    id: 'action-alert-low-stock',
    label: 'Alert Low Stock',
    level: 'action',
    products: ['inventory'],
    parents: ['step-monitor-levels'],
    children: []
  },
  'action-log-transactions': {
    id: 'action-log-transactions',
    label: 'Log Transactions',
    level: 'action',
    products: ['inventory'],
    parents: ['step-track-movement'],
    children: []
  },
  'action-update-location': {
    id: 'action-update-location',
    label: 'Update Location',
    level: 'action',
    products: ['inventory'],
    parents: ['step-track-movement'],
    children: []
  },
  'action-adjust-quantity-inventory': {
    id: 'action-adjust-quantity-inventory',
    label: 'Adjust Quantity',
    level: 'action',
    products: ['inventory'],
    parents: ['step-update-stock-inventory'],
    children: []
  },
  'action-sync-systems-inventory': {
    id: 'action-sync-systems-inventory',
    label: 'Sync Systems',
    level: 'action',
    products: ['inventory'],
    parents: ['step-update-stock-inventory'],
    children: []
  },
  'action-calculate-discount': {
    id: 'action-calculate-discount',
    label: 'Calculate Discount',
    level: 'action',
    products: ['storefront'],
    parents: ['step-apply-discounts'],
    children: []
  },
  'action-apply-code': {
    id: 'action-apply-code',
    label: 'Apply Code',
    level: 'action',
    products: ['storefront'],
    parents: ['step-apply-discounts'],
    children: []
  },
  'action-display-banners': {
    id: 'action-display-banners',
    label: 'Display Banners',
    level: 'action',
    products: ['storefront'],
    parents: ['step-show-deals'],
    children: []
  },
  'action-highlight-sales': {
    id: 'action-highlight-sales',
    label: 'Highlight Sales',
    level: 'action',
    products: ['storefront'],
    parents: ['step-show-deals'],
    children: []
  },
  'action-email-promotions': {
    id: 'action-email-promotions',
    label: 'Email Promotions',
    level: 'action',
    products: ['storefront'],
    parents: ['step-send-offers'],
    children: []
  },
  'action-push-notifications': {
    id: 'action-push-notifications',
    label: 'Push Notifications',
    level: 'action',
    products: ['storefront'],
    parents: ['step-send-offers'],
    children: []
  },
  
  // Additional actions for new steps
  'action-check-minimum': {
    id: 'action-check-minimum',
    label: 'Check Minimum',
    level: 'action',
    products: ['inventory'],
    parents: ['step-check-thresholds'],
    children: []
  },
  'action-check-maximum': {
    id: 'action-check-maximum',
    label: 'Check Maximum',
    level: 'action',
    products: ['inventory'],
    parents: ['step-check-thresholds'],
    children: []
  },
  'action-select-supplier': {
    id: 'action-select-supplier',
    label: 'Select Supplier',
    level: 'action',
    products: ['inventory'],
    parents: ['step-create-purchase-order'],
    children: []
  },
  'action-submit-order': {
    id: 'action-submit-order',
    label: 'Submit Order',
    level: 'action',
    products: ['inventory'],
    parents: ['step-create-purchase-order'],
    children: []
  },
  'action-verify-shipment': {
    id: 'action-verify-shipment',
    label: 'Verify Shipment',
    level: 'action',
    products: ['inventory'],
    parents: ['step-receive-shipment'],
    children: []
  },
  'action-update-inventory': {
    id: 'action-update-inventory',
    label: 'Update Inventory',
    level: 'action',
    products: ['inventory'],
    parents: ['step-receive-shipment'],
    children: []
  },
  'action-select-carrier': {
    id: 'action-select-carrier',
    label: 'Select Carrier',
    level: 'action',
    products: ['inventory'],
    parents: ['step-generate-label'],
    children: []
  },
  'action-print-label': {
    id: 'action-print-label',
    label: 'Print Label',
    level: 'action',
    products: ['inventory'],
    parents: ['step-generate-label'],
    children: []
  },
  'action-book-pickup': {
    id: 'action-book-pickup',
    label: 'Book Pickup',
    level: 'action',
    products: ['inventory'],
    parents: ['step-schedule-pickup'],
    children: []
  },
  'action-confirm-time': {
    id: 'action-confirm-time',
    label: 'Confirm Time',
    level: 'action',
    products: ['inventory'],
    parents: ['step-schedule-pickup'],
    children: []
  },
  'action-get-tracking': {
    id: 'action-get-tracking',
    label: 'Get Tracking',
    level: 'action',
    products: ['inventory'],
    parents: ['step-track-shipment-inventory'],
    children: []
  },
  'action-update-status': {
    id: 'action-update-status',
    label: 'Update Status',
    level: 'action',
    products: ['inventory'],
    parents: ['step-track-shipment-inventory'],
    children: []
  },
  'action-calculate-points': {
    id: 'action-calculate-points',
    label: 'Calculate Points',
    level: 'action',
    products: ['crm'],
    parents: ['step-track-points'],
    children: []
  },
  'action-update-balance': {
    id: 'action-update-balance',
    label: 'Update Balance',
    level: 'action',
    products: ['crm'],
    parents: ['step-track-points'],
    children: []
  },
  'action-show-rewards': {
    id: 'action-show-rewards',
    label: 'Show Rewards',
    level: 'action',
    products: ['crm'],
    parents: ['step-offer-rewards'],
    children: []
  },
  'action-redeem-points': {
    id: 'action-redeem-points',
    label: 'Redeem Points',
    level: 'action',
    products: ['crm'],
    parents: ['step-offer-rewards'],
    children: []
  },
  'action-send-updates': {
    id: 'action-send-updates',
    label: 'Send Updates',
    level: 'action',
    products: ['crm'],
    parents: ['step-send-communications'],
    children: []
  },
  'action-send-offers-crm': {
    id: 'action-send-offers-crm',
    label: 'Send Offers',
    level: 'action',
    products: ['crm'],
    parents: ['step-send-communications'],
    children: []
  },
  'action-capture-issue': {
    id: 'action-capture-issue',
    label: 'Capture Issue',
    level: 'action',
    products: ['crm'],
    parents: ['step-create-ticket'],
    children: []
  },
  'action-set-priority': {
    id: 'action-set-priority',
    label: 'Set Priority',
    level: 'action',
    products: ['crm'],
    parents: ['step-create-ticket'],
    children: []
  },
  'action-find-agent': {
    id: 'action-find-agent',
    label: 'Find Agent',
    level: 'action',
    products: ['crm'],
    parents: ['step-assign-agent'],
    children: []
  },
  'action-route-ticket': {
    id: 'action-route-ticket',
    label: 'Route Ticket',
    level: 'action',
    products: ['crm'],
    parents: ['step-assign-agent'],
    children: []
  },
  'action-provide-solution': {
    id: 'action-provide-solution',
    label: 'Provide Solution',
    level: 'action',
    products: ['crm'],
    parents: ['step-resolve-issue'],
    children: []
  },
  'action-close-ticket': {
    id: 'action-close-ticket',
    label: 'Close Ticket',
    level: 'action',
    products: ['crm'],
    parents: ['step-resolve-issue'],
    children: []
  },
  'action-lookup-order': {
    id: 'action-lookup-order',
    label: 'Lookup Order',
    level: 'action',
    products: ['crm'],
    parents: ['step-check-status-crm'],
    children: []
  },
  'action-get-status': {
    id: 'action-get-status',
    label: 'Get Status',
    level: 'action',
    products: ['crm'],
    parents: ['step-check-status-crm'],
    children: []
  },
  'action-send-notification': {
    id: 'action-send-notification',
    label: 'Send Notification',
    level: 'action',
    products: ['crm'],
    parents: ['step-update-customer-crm'],
    children: []
  },
  'action-log-update': {
    id: 'action-log-update',
    label: 'Log Update',
    level: 'action',
    products: ['crm'],
    parents: ['step-update-customer-crm'],
    children: []
  },
  'action-answer-questions': {
    id: 'action-answer-questions',
    label: 'Answer Questions',
    level: 'action',
    products: ['crm'],
    parents: ['step-handle-inquiries'],
    children: []
  },
  'action-escalate-issue': {
    id: 'action-escalate-issue',
    label: 'Escalate Issue',
    level: 'action',
    products: ['crm'],
    parents: ['step-handle-inquiries'],
    children: []
  },
  'action-track-clicks': {
    id: 'action-track-clicks',
    label: 'Track Clicks',
    level: 'action',
    products: ['storefront'],
    parents: ['step-analyze-behavior'],
    children: []
  },
  'action-track-purchases': {
    id: 'action-track-purchases',
    label: 'Track Purchases',
    level: 'action',
    products: ['storefront'],
    parents: ['step-analyze-behavior'],
    children: []
  },
  'action-find-similar': {
    id: 'action-find-similar',
    label: 'Find Similar',
    level: 'action',
    products: ['storefront'],
    parents: ['step-suggest-products'],
    children: []
  },
  'action-find-complementary': {
    id: 'action-find-complementary',
    label: 'Find Complementary',
    level: 'action',
    products: ['storefront'],
    parents: ['step-suggest-products'],
    children: []
  },
  'action-customize-homepage': {
    id: 'action-customize-homepage',
    label: 'Customize Homepage',
    level: 'action',
    products: ['storefront'],
    parents: ['step-personalize'],
    children: []
  },
  'action-tailor-emails': {
    id: 'action-tailor-emails',
    label: 'Tailor Emails',
    level: 'action',
    products: ['storefront'],
    parents: ['step-personalize'],
    children: []
  },
  
  // Unified actions for shared functionality
};