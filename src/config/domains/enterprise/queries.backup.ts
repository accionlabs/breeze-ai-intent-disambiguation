// User querys for Enterprise Operations domain
import { UserQuery } from '../../../types';

// Example queries that users might enter - organized by group
export const EXAMPLE_QUERIES = [
  // Group 1: Clear single-node querys
  "Pull general ledger data",
  "Track order delivery status", 
  "Check inventory availability",
  "Monitor sales pipeline",
  
  // Group 2: Shared nodes (demonstrate rationalization)
  "Generate monthly financial statements",
  "View complete customer profile",
  "Process new customer order",
  
  // Group 3: Workflow querys
  "Complete end-to-end order fulfillment",
  "Execute customer onboarding workflow"
];

// Placeholder text for the query input field
export const QUERY_INPUT_PLACEHOLDER = "e.g., generate financial report, track customer orders, manage projects";

// Predefined user queries that map to specific nodes in the functional hierarchy
export const USER_QUERIES: any[] = [
  // ============================================
  // GROUP 1: CLEAR NON-DUPLICATE QUERYS
  // Starting from lower levels moving up
  // ============================================
  
  // --- Actions (lowest level) ---
  {
    id: 'query-pull-gl-data',
    text: 'Pull general ledger data',
    entryNode: 'action-run-report-sap',
    entryLevel: 'action',
    ambiguous: false,
    group: 'clear-single'
  },
  
  // --- Steps ---
  {
    id: 'query-track-shipment',
    text: 'Track order delivery status',
    entryNode: 'step-track-order-salesforce',
    entryLevel: 'step',
    ambiguous: false,
    products: ['salesforce'],
    group: 'clear-single'
  },
  {
    id: 'query-provision-access',
    text: 'Provision system access for user',
    entryNode: 'step-provision-access-ms365',
    entryLevel: 'step',
    ambiguous: false,
    products: ['ms365'],
    group: 'clear-single'
  },
  {
    id: 'query-resource-allocation',
    text: 'Allocate resources to project tasks',
    entryNode: 'step-assign-resources-projects',
    entryLevel: 'step',
    ambiguous: false,
    products: ['projects'],
    group: 'clear-single'
  },
  {
    id: 'query-mobile-checkin',
    text: 'Check in at customer location',
    entryNode: 'step-track-location-fieldops',
    entryLevel: 'step',
    ambiguous: false,
    products: ['fieldops'],
    group: 'clear-single'
  },
  {
    id: 'query-supplier-management',
    text: 'Evaluate supplier performance',
    entryNode: 'step-manage-vendors',
    entryLevel: 'step',
    ambiguous: false,
    products: ['sap'],
    group: 'clear-single'
  },
  
  // --- Scenarios ---
  {
    id: 'query-inventory-check',
    text: 'Check inventory availability',
    entryNode: 'scenario-inventory-management',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['sap'],
    group: 'clear-single'
  },
  {
    id: 'query-sales-pipeline',
    text: 'Monitor sales pipeline and opportunities',
    entryNode: 'scenario-opportunity-tracking',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['salesforce'],
    group: 'clear-single'
  },
  {
    id: 'query-project-status',
    text: 'Update project status and milestones',
    entryNode: 'scenario-project-planning',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['projects'],
    group: 'clear-single'
  },
  {
    id: 'query-work-order',
    text: 'Create and assign field work order',
    entryNode: 'scenario-work-order-management',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['fieldops'],
    group: 'clear-single'
  },
  {
    id: 'query-route-optimization',
    text: 'Optimize field technician routes',
    entryNode: 'scenario-route-optimization',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['fieldops'],
    group: 'clear-single'
  },
  {
    id: 'query-team-meeting',
    text: 'Schedule and organize team meeting',
    entryNode: 'scenario-team-communication',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['ms365'],
    group: 'clear-single'
  },
  {
    id: 'query-predictive-analysis',
    text: 'Run predictive analytics on sales data',
    entryNode: 'scenario-predictive-analytics',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['analytics'],
    group: 'clear-single'
  },
  {
    id: 'query-procurement',
    text: 'Create purchase requisition',
    entryNode: 'scenario-procurement',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['sap'],
    group: 'clear-single'
  },
  
  // --- Outcomes (higher level) ---
  {
    id: 'query-budget-analysis',
    text: 'Analyze budget variance and trends',
    entryNode: 'scenario-budgeting',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['sap'],
    group: 'clear-single'
  },

  // ============================================
  // GROUP 2: DUPLICATE/SHARED NODE QUERYS
  // These demonstrate rationalization behavior
  // ============================================
  
  {
    id: 'query-financial-report',
    text: 'Generate monthly financial statements',
    entryNode: 'scenario-financial-reporting-shared',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['sap', 'analytics'],
    group: 'shared-nodes'
  },
  {
    id: 'query-customer-360',
    text: 'View complete customer profile and history',
    entryNode: 'scenario-customer-360-shared',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['salesforce', 'analytics'],
    group: 'shared-nodes'
  },
  {
    id: 'query-process-order',
    text: 'Process new customer order',
    entryNode: 'scenario-order-processing-shared',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['sap', 'salesforce', 'fieldops'],
    group: 'shared-nodes'
  },
  {
    id: 'query-onboard-employee',
    text: 'Onboard new employee to the organization',
    entryNode: 'scenario-employee-management-shared',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['sap', 'ms365'],
    group: 'shared-nodes'
  },
  {
    id: 'query-document-collaboration',
    text: 'Share and collaborate on project documents',
    entryNode: 'scenario-document-management-shared',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['ms365', 'projects'],
    group: 'shared-nodes'
  },
  {
    id: 'query-business-dashboard',
    text: 'Create executive business dashboard',
    entryNode: 'scenario-operational-dashboards',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['analytics', 'sap'],
    group: 'shared-nodes'
  },
  
  // --- Ambiguous querys that could map to multiple different nodes ---
  {
    id: 'query-generate-report',
    text: 'Generate report',
    entryNode: 'step-generate-reports-sap',
    entryLevel: 'step',
    ambiguous: true,
    products: ['sap', 'analytics', 'salesforce'],
    group: 'ambiguous'
  },
  {
    id: 'query-update-information',
    text: 'Update information',
    entryNode: 'action-export-data-sap',
    entryLevel: 'action',
    ambiguous: true,
    products: ['sap', 'salesforce', 'ms365'],
    group: 'ambiguous'
  },
  {
    id: 'query-track-performance',
    text: 'Track performance',
    entryNode: 'scenario-operational-dashboards',
    entryLevel: 'scenario',
    ambiguous: true,
    products: ['analytics', 'sap', 'salesforce'],
    group: 'ambiguous'
  },
  {
    id: 'query-manage-users',
    text: 'Manage users',
    entryNode: 'step-manage-users-ms365',
    entryLevel: 'step',
    ambiguous: true,
    products: ['sap', 'ms365', 'salesforce'],
    group: 'ambiguous'
  },
  {
    id: 'query-analyze-data',
    text: 'Analyze data',
    entryNode: 'outcome-business-intelligence-analytics',
    entryLevel: 'outcome',
    ambiguous: true,
    products: ['analytics', 'sap', 'salesforce'],
    group: 'ambiguous'
  },

  // ============================================
  // GROUP 3: CROSS-PRODUCT WORKFLOW QUERYS
  // These require workflow mode to resolve properly
  // ============================================
  
  {
    id: 'query-end-to-end-order',
    text: 'Complete end-to-end order fulfillment',
    entryNode: 'scenario-order-processing-shared',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['sap', 'salesforce', 'fieldops'],
    requiresWorkflow: true,
    group: 'workflow'
  },
  {
    id: 'query-customer-onboarding-flow',
    text: 'Execute customer onboarding workflow',
    entryNode: 'scenario-customer-360-shared',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['salesforce', 'sap', 'ms365'],
    requiresWorkflow: true,
    group: 'workflow'
  },
  {
    id: 'query-integrated-reporting',
    text: 'Generate integrated business report across systems',
    entryNode: 'scenario-financial-reporting-shared',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['sap', 'analytics', 'salesforce'],
    requiresWorkflow: true,
    group: 'workflow'
  },
  {
    id: 'query-field-service-flow',
    text: 'Complete field service request workflow',
    entryNode: 'scenario-work-order-management',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['fieldops', 'sap', 'salesforce'],
    requiresWorkflow: true,
    group: 'workflow'
  },
  {
    id: 'query-project-delivery',
    text: 'Execute project delivery lifecycle',
    entryNode: 'scenario-project-planning',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['projects', 'ms365', 'sap'],
    requiresWorkflow: true,
    group: 'workflow'
  }
];

// Helper function to get querys by product
export const getQuerysByProduct = (product: string): any[] => {
  return USER_QUERIES.filter(query => 
    query.products && query.products.includes(product)
  );
};

// Helper function to get ambiguous querys
export const getAmbiguousQuerys = (): any[] => {
  return USER_QUERIES.filter(query => query.ambiguous);
};

// Helper function to get querys by level
export const getQuerysByLevel = (level: string): any[] => {
  return USER_QUERIES.filter(query => query.entryLevel === level);
};

// Helper function to find query by text (fuzzy matching)
export const findQueryByText = (text: string): any | null => {
  const normalizedText = text.toLowerCase().trim();
  
  // Exact match
  const exactMatch = USER_QUERIES.find(query => 
    query.text.toLowerCase() === normalizedText
  );
  if (exactMatch) return exactMatch;
  
  // Partial match
  const partialMatch = USER_QUERIES.find(query => 
    query.text.toLowerCase().includes(normalizedText) ||
    normalizedText.includes(query.text.toLowerCase())
  );
  
  return partialMatch || null;
};

// Helper function to get querys by group
export const getQuerysByGroup = (group: string): any[] => {
  return USER_QUERIES.filter(query => query.group === group);
};

// Helper function to get clear single-node querys
export const getClearQuerys = (): any[] => {
  return USER_QUERIES.filter(query => query.group === 'clear-single');
};

// Helper function to get shared-node querys (for rationalization demo)
export const getSharedNodeQuerys = (): any[] => {
  return USER_QUERIES.filter(query => query.group === 'shared-nodes');
};

// Helper function to get workflow querys
export const getWorkflowQuerys = (): any[] => {
  return USER_QUERIES.filter(query => query.group === 'workflow');
};