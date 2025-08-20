// Query definitions for enterprise domain
// Auto-categorized with proper flags for clear, ambiguous, and workflow querys

import { UserQuery } from '../../../types';

export const USER_QUERIES: UserQuery[] = [
  // Clear Querys - Unambiguous, single product/function mapping
  {
    id: 'query-pull-gl-data',
    text: 'Pull general ledger data',
    entryNode: 'action-run-report-sap',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-track-shipment',
    text: 'Track order delivery status',
    entryNode: 'step-track-order-salesforce',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-provision-access',
    text: 'Provision system access for user',
    entryNode: 'step-provision-access-ms365',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-resource-allocation',
    text: 'Allocate resources to project tasks',
    entryNode: 'step-assign-resources-projects',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-mobile-checkin',
    text: 'Check in at customer location',
    entryNode: 'step-track-location-fieldops',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-supplier-management',
    text: 'Evaluate supplier performance',
    entryNode: 'step-manage-vendors',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-inventory-check',
    text: 'Check inventory availability',
    entryNode: 'scenario-inventory-management',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-sales-pipeline',
    text: 'Monitor sales pipeline and opportunities',
    entryNode: 'scenario-opportunity-tracking',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-project-status',
    text: 'Update project status and milestones',
    entryNode: 'scenario-project-planning',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-work-order',
    text: 'Create and assign field work order',
    entryNode: 'scenario-work-order-management',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-route-optimization',
    text: 'Optimize field technician routes',
    entryNode: 'scenario-route-optimization',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-team-meeting',
    text: 'Schedule and organize team meeting',
    entryNode: 'scenario-team-communication',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-predictive-analysis',
    text: 'Run predictive analytics on sales data',
    entryNode: 'scenario-predictive-analytics',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-procurement',
    text: 'Create purchase requisition',
    entryNode: 'scenario-procurement',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-budget-analysis',
    text: 'Analyze budget variance and trends',
    entryNode: 'scenario-budgeting',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-financial-report',
    text: 'Generate monthly financial statements',
    entryNode: 'scenario-financial-reporting-shared',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-customer-360',
    text: 'View complete customer profile and history',
    entryNode: 'scenario-customer-360-shared',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-process-order',
    text: 'Process new customer order',
    entryNode: 'scenario-order-processing-shared',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-onboard-employee',
    text: 'Onboard new employee to the organization',
    entryNode: 'scenario-employee-management-shared',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-document-collaboration',
    text: 'Share and collaborate on project documents',
    entryNode: 'scenario-document-management-shared',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-business-dashboard',
    text: 'Create executive business dashboard',
    entryNode: 'scenario-operational-dashboards',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-generate-report',
    text: 'Generate report',
    entryNode: 'step-generate-reports-sap',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-update-information',
    text: 'Update information',
    entryNode: 'action-export-data-sap',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-track-performance',
    text: 'Track performance',
    entryNode: 'scenario-operational-dashboards',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-manage-users',
    text: 'Manage users',
    entryNode: 'step-manage-users-ms365',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-analyze-data',
    text: 'Analyze data',
    entryNode: 'outcome-business-intelligence-analytics',
    entryLevel: 'outcome' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-end-to-end-order',
    text: 'Complete end-to-end order fulfillment',
    entryNode: 'scenario-order-processing-shared',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-customer-onboarding-flow',
    text: 'Execute customer onboarding workflow',
    entryNode: 'scenario-customer-360-shared',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-integrated-reporting',
    text: 'Generate integrated business report across systems',
    entryNode: 'scenario-financial-reporting-shared',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-field-service-flow',
    text: 'Complete field service request workflow',
    entryNode: 'scenario-work-order-management',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-project-delivery',
    text: 'Execute project delivery lifecycle',
    entryNode: 'scenario-project-planning',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  }
];

// Query categorization summary
export const QUERY_CATEGORIES = {
  clear: 31,
  ambiguous: 0,
  workflow: 0,
  total: 31
};
