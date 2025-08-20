// Query definitions for enterprise domain
// Generated with comprehensive coverage for clear, ambiguous, and workflow querys
// Generated on: 2025-08-20T10:42:40.989Z

import { UserQuery } from '../../../types';

export const USER_QUERIES: UserQuery[] = [
  // ============================================
  // CLEAR QUERIES (12)
  // Unambiguous, single function mapping
  // ============================================
  {
    id: 'query-sap-action',
    text: 'Help me run financial report',
    entryNode: 'action-run-report-sap',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-salesforce-action',
    text: 'View customer order status',
    entryNode: 'action-view-order-status-salesforce',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-ms365-action',
    text: 'Send team message',
    entryNode: 'action-chat-messaging-send',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-analytics-action',
    text: 'Design dashboard layout',
    entryNode: 'action-design-layout-analytics',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-servicenow-ticket',
    text: 'Create customer support ticket',
    entryNode: 'step-create-ticket',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-servicenow-incident',
    text: 'Report system incident',
    entryNode: 'step-create-incident',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-servicenow-kb',
    text: 'Search knowledge base',
    entryNode: 'step-search-knowledge',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-monitoring-alert',
    text: 'Set up performance alert',
    entryNode: 'step-define-alerts',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-monitoring-metrics',
    text: 'View system metrics',
    entryNode: 'step-collect-metrics',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-monitoring-trace',
    text: 'Trace application requests',
    entryNode: 'step-trace-requests',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-action-action-export-data-s',
    text: 'I want to export data',
    entryNode: 'action-export-data-sap',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-action-action-aggregate-acc',
    text: 'How do I aggregate accounts?',
    entryNode: 'action-aggregate-accounts-sap',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-step-step-generate-report',
    text: 'Show me how to generate financial reports',
    entryNode: 'step-generate-reports-sap',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-step-step-consolidate-dat',
    text: 'Consolidate Financial Data',
    entryNode: 'step-consolidate-data-sap',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },

  // ============================================
  // AMBIGUOUS QUERIES (8)
  // Map to duplicate nodes - require context or rationalization for proper resolution
  // These will FAIL when rationalization and context are OFF
  // ============================================
  {
    id: 'query-ambiguous-customer-360',
    text: 'customer 360 view',
    entryNode: 'scenario-customer-360-salesforce',
    entryLevel: 'scenario' as any,
    isDuplicate: true,
    isWorkflow: false
  },
  {
    id: 'query-ambiguous-document-management',
    text: 'document management',
    entryNode: 'scenario-document-management-ms365',
    entryLevel: 'scenario' as any,
    isDuplicate: true,
    isWorkflow: false
  },
  {
    id: 'query-ambiguous-employee-management',
    text: 'employee management',
    entryNode: 'scenario-employee-management-ms365',
    entryLevel: 'scenario' as any,
    isDuplicate: true,
    isWorkflow: false
  },
  {
    id: 'query-ambiguous-capacity-planning',
    text: 'capacity planning',
    entryNode: 'scenario-capacity-planning',
    entryLevel: 'scenario' as any,
    isDuplicate: true,
    isWorkflow: false
  },
  {
    id: 'query-ambiguous-manage-employees',
    text: 'manage employees',
    entryNode: 'scenario-employee-management-servicenow',
    entryLevel: 'scenario' as any,
    isDuplicate: true,
    isWorkflow: false
  },
  {
    id: 'query-ambiguous-360-customer',
    text: '360 degree customer view',
    entryNode: 'scenario-customer-360-analytics',
    entryLevel: 'scenario' as any,
    isDuplicate: true,
    isWorkflow: false
  },
  {
    id: 'query-ambiguous-document-control',
    text: 'document control system',
    entryNode: 'scenario-document-management-servicenow',
    entryLevel: 'scenario' as any,
    isDuplicate: true,
    isWorkflow: false
  },
  {
    id: 'query-ambiguous-resource-capacity',
    text: 'resource capacity management',
    entryNode: 'scenario-capacity-planning-monitoring',
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
    id: 'query-workflow-employee-onboarding',
    text: 'Execute employee onboarding orchestration workflow',
    entryNode: 'workflow-employee-onboarding',
    entryLevel: 'workflow' as any,
    isDuplicate: false,
    isWorkflow: true
  },
  {
    id: 'query-workflow-incident-response',
    text: 'Coordinate incident response workflow',
    entryNode: 'workflow-incident-response',
    entryLevel: 'workflow' as any,
    isDuplicate: false,
    isWorkflow: true
  },
  {
    id: 'query-workflow-business-intelligence',
    text: 'Orchestrate business intelligence pipeline workflow',
    entryNode: 'workflow-business-intelligence',
    entryLevel: 'workflow' as any,
    isDuplicate: false,
    isWorkflow: true
  }
];

// ============================================
// QUERY STATISTICS
// ============================================
export const QUERY_CATEGORIES = {
  clear: 14,
  ambiguous: 8,
  workflow: 3,
  total: 25
};

// Coverage meets requirements:
// ✅ Clear queries: Yes (14/5-10)
// ✅ Ambiguous queries: Yes (8/3-5) - Maps to duplicate nodes
// ✅ Workflow queries: Yes (3/1-3)
