// User intents for Enterprise Operations domain
import { UserIntent } from '../../../types';

// Example queries that users might enter - organized by group
export const EXAMPLE_QUERIES = [
  // Group 1: Clear single-node intents
  "Pull general ledger data",
  "Track order delivery status", 
  "Check inventory availability",
  "Monitor sales pipeline",
  
  // Group 2: Shared nodes (demonstrate rationalization)
  "Generate monthly financial statements",
  "View complete customer profile",
  "Process new customer order",
  
  // Group 3: Workflow intents
  "Complete end-to-end order fulfillment",
  "Execute customer onboarding workflow"
];

// Placeholder text for the intent input field
export const INTENT_INPUT_PLACEHOLDER = "e.g., generate financial report, track customer orders, manage projects";

// Predefined user intents that map to specific nodes in the functional hierarchy
export const USER_INTENTS: any[] = [
  // ============================================
  // GROUP 1: CLEAR NON-DUPLICATE INTENTS
  // Starting from lower levels moving up
  // ============================================
  
  // --- Actions (lowest level) ---
  {
    id: 'intent-pull-gl-data',
    text: 'Pull general ledger data',
    entryNode: 'action-run-report-sap',
    entryLevel: 'action',
    ambiguous: false,
    group: 'clear-single'
  },
  
  // --- Steps ---
  {
    id: 'intent-track-shipment',
    text: 'Track order delivery status',
    entryNode: 'step-track-order-salesforce',
    entryLevel: 'step',
    ambiguous: false,
    products: ['salesforce'],
    group: 'clear-single'
  },
  {
    id: 'intent-provision-access',
    text: 'Provision system access for user',
    entryNode: 'step-provision-access-ms365',
    entryLevel: 'step',
    ambiguous: false,
    products: ['ms365'],
    group: 'clear-single'
  },
  {
    id: 'intent-resource-allocation',
    text: 'Allocate resources to project tasks',
    entryNode: 'step-assign-resources-projects',
    entryLevel: 'step',
    ambiguous: false,
    products: ['projects'],
    group: 'clear-single'
  },
  {
    id: 'intent-mobile-checkin',
    text: 'Check in at customer location',
    entryNode: 'step-track-location-fieldops',
    entryLevel: 'step',
    ambiguous: false,
    products: ['fieldops'],
    group: 'clear-single'
  },
  {
    id: 'intent-supplier-management',
    text: 'Evaluate supplier performance',
    entryNode: 'step-manage-vendors',
    entryLevel: 'step',
    ambiguous: false,
    products: ['sap'],
    group: 'clear-single'
  },
  
  // --- Scenarios ---
  {
    id: 'intent-inventory-check',
    text: 'Check inventory availability',
    entryNode: 'scenario-inventory-management',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['sap'],
    group: 'clear-single'
  },
  {
    id: 'intent-sales-pipeline',
    text: 'Monitor sales pipeline and opportunities',
    entryNode: 'scenario-opportunity-tracking',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['salesforce'],
    group: 'clear-single'
  },
  {
    id: 'intent-project-status',
    text: 'Update project status and milestones',
    entryNode: 'scenario-project-planning',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['projects'],
    group: 'clear-single'
  },
  {
    id: 'intent-work-order',
    text: 'Create and assign field work order',
    entryNode: 'scenario-work-order-management',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['fieldops'],
    group: 'clear-single'
  },
  {
    id: 'intent-route-optimization',
    text: 'Optimize field technician routes',
    entryNode: 'scenario-route-optimization',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['fieldops'],
    group: 'clear-single'
  },
  {
    id: 'intent-team-meeting',
    text: 'Schedule and organize team meeting',
    entryNode: 'scenario-team-communication',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['ms365'],
    group: 'clear-single'
  },
  {
    id: 'intent-predictive-analysis',
    text: 'Run predictive analytics on sales data',
    entryNode: 'scenario-predictive-analytics',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['analytics'],
    group: 'clear-single'
  },
  {
    id: 'intent-procurement',
    text: 'Create purchase requisition',
    entryNode: 'scenario-procurement',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['sap'],
    group: 'clear-single'
  },
  
  // --- Outcomes (higher level) ---
  {
    id: 'intent-budget-analysis',
    text: 'Analyze budget variance and trends',
    entryNode: 'scenario-budgeting',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['sap'],
    group: 'clear-single'
  },

  // ============================================
  // GROUP 2: DUPLICATE/SHARED NODE INTENTS
  // These demonstrate rationalization behavior
  // ============================================
  
  {
    id: 'intent-financial-report',
    text: 'Generate monthly financial statements',
    entryNode: 'scenario-financial-reporting-shared',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['sap', 'analytics'],
    group: 'shared-nodes'
  },
  {
    id: 'intent-customer-360',
    text: 'View complete customer profile and history',
    entryNode: 'scenario-customer-360-shared',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['salesforce', 'analytics'],
    group: 'shared-nodes'
  },
  {
    id: 'intent-process-order',
    text: 'Process new customer order',
    entryNode: 'scenario-order-processing-shared',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['sap', 'salesforce', 'fieldops'],
    group: 'shared-nodes'
  },
  {
    id: 'intent-onboard-employee',
    text: 'Onboard new employee to the organization',
    entryNode: 'scenario-employee-management-shared',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['sap', 'ms365'],
    group: 'shared-nodes'
  },
  {
    id: 'intent-document-collaboration',
    text: 'Share and collaborate on project documents',
    entryNode: 'scenario-document-management-shared',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['ms365', 'projects'],
    group: 'shared-nodes'
  },
  {
    id: 'intent-business-dashboard',
    text: 'Create executive business dashboard',
    entryNode: 'scenario-operational-dashboards',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['analytics', 'sap'],
    group: 'shared-nodes'
  },
  
  // --- Ambiguous intents that could map to multiple different nodes ---
  {
    id: 'intent-generate-report',
    text: 'Generate report',
    entryNode: 'step-generate-reports-sap',
    entryLevel: 'step',
    ambiguous: true,
    products: ['sap', 'analytics', 'salesforce'],
    group: 'ambiguous'
  },
  {
    id: 'intent-update-information',
    text: 'Update information',
    entryNode: 'action-export-data-sap',
    entryLevel: 'action',
    ambiguous: true,
    products: ['sap', 'salesforce', 'ms365'],
    group: 'ambiguous'
  },
  {
    id: 'intent-track-performance',
    text: 'Track performance',
    entryNode: 'scenario-operational-dashboards',
    entryLevel: 'scenario',
    ambiguous: true,
    products: ['analytics', 'sap', 'salesforce'],
    group: 'ambiguous'
  },
  {
    id: 'intent-manage-users',
    text: 'Manage users',
    entryNode: 'step-manage-users-ms365',
    entryLevel: 'step',
    ambiguous: true,
    products: ['sap', 'ms365', 'salesforce'],
    group: 'ambiguous'
  },
  {
    id: 'intent-analyze-data',
    text: 'Analyze data',
    entryNode: 'outcome-business-intelligence-analytics',
    entryLevel: 'outcome',
    ambiguous: true,
    products: ['analytics', 'sap', 'salesforce'],
    group: 'ambiguous'
  },

  // ============================================
  // GROUP 3: CROSS-PRODUCT WORKFLOW INTENTS
  // These require workflow mode to resolve properly
  // ============================================
  
  {
    id: 'intent-end-to-end-order',
    text: 'Complete end-to-end order fulfillment',
    entryNode: 'scenario-order-processing-shared',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['sap', 'salesforce', 'fieldops'],
    requiresWorkflow: true,
    group: 'workflow'
  },
  {
    id: 'intent-customer-onboarding-flow',
    text: 'Execute customer onboarding workflow',
    entryNode: 'scenario-customer-360-shared',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['salesforce', 'sap', 'ms365'],
    requiresWorkflow: true,
    group: 'workflow'
  },
  {
    id: 'intent-integrated-reporting',
    text: 'Generate integrated business report across systems',
    entryNode: 'scenario-financial-reporting-shared',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['sap', 'analytics', 'salesforce'],
    requiresWorkflow: true,
    group: 'workflow'
  },
  {
    id: 'intent-field-service-flow',
    text: 'Complete field service request workflow',
    entryNode: 'scenario-work-order-management',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['fieldops', 'sap', 'salesforce'],
    requiresWorkflow: true,
    group: 'workflow'
  },
  {
    id: 'intent-project-delivery',
    text: 'Execute project delivery lifecycle',
    entryNode: 'scenario-project-planning',
    entryLevel: 'scenario',
    ambiguous: false,
    products: ['projects', 'ms365', 'sap'],
    requiresWorkflow: true,
    group: 'workflow'
  }
];

// Helper function to get intents by product
export const getIntentsByProduct = (product: string): any[] => {
  return USER_INTENTS.filter(intent => 
    intent.products && intent.products.includes(product)
  );
};

// Helper function to get ambiguous intents
export const getAmbiguousIntents = (): any[] => {
  return USER_INTENTS.filter(intent => intent.ambiguous);
};

// Helper function to get intents by level
export const getIntentsByLevel = (level: string): any[] => {
  return USER_INTENTS.filter(intent => intent.entryLevel === level);
};

// Helper function to find intent by text (fuzzy matching)
export const findIntentByText = (text: string): any | null => {
  const normalizedText = text.toLowerCase().trim();
  
  // Exact match
  const exactMatch = USER_INTENTS.find(intent => 
    intent.text.toLowerCase() === normalizedText
  );
  if (exactMatch) return exactMatch;
  
  // Partial match
  const partialMatch = USER_INTENTS.find(intent => 
    intent.text.toLowerCase().includes(normalizedText) ||
    normalizedText.includes(intent.text.toLowerCase())
  );
  
  return partialMatch || null;
};

// Helper function to get intents by group
export const getIntentsByGroup = (group: string): any[] => {
  return USER_INTENTS.filter(intent => intent.group === group);
};

// Helper function to get clear single-node intents
export const getClearIntents = (): any[] => {
  return USER_INTENTS.filter(intent => intent.group === 'clear-single');
};

// Helper function to get shared-node intents (for rationalization demo)
export const getSharedNodeIntents = (): any[] => {
  return USER_INTENTS.filter(intent => intent.group === 'shared-nodes');
};

// Helper function to get workflow intents
export const getWorkflowIntents = (): any[] => {
  return USER_INTENTS.filter(intent => intent.group === 'workflow');
};