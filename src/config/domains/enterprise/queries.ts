// Query definitions for enterprise domain
// Generated with comprehensive coverage for clear, ambiguous, and workflow querys
// Generated on: 2025-08-20T10:42:40.989Z

import { UserQuery } from '../../../types';

export const USER_QUERIES: UserQuery[] = [
  // ============================================
  // CLEAR QUERYS (10)
  // Unambiguous, single function mapping
  // ============================================
  {
    id: 'query-sap-action',
    text: 'Help me run report',
    entryNode: 'action-run-report-sap',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-salesforce-action',
    text: 'Help me view order status',
    entryNode: 'action-view-order-status-salesforce',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-ms365-action',
    text: 'Help me send message',
    entryNode: 'action-chat-messaging-send',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-analytics-action',
    text: 'Help me design layout',
    entryNode: 'action-design-layout-analytics',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-projects-action',
    text: 'Help me document scope',
    entryNode: 'action-define-scope-document',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-fieldops-action',
    text: 'Help me new work order',
    entryNode: 'action-create-work-order-new',
    entryLevel: 'action' as any,
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
  // AMBIGUOUS QUERYS (3)
  // Require context for proper resolution
  // ============================================
  {
    id: 'query-ambiguous-employee-management-1',
    text: 'employee management',
    entryNode: 'scenario-employee-management-ms365',
    entryLevel: 'scenario' as any,
    isDuplicate: true,
    isWorkflow: false
  },
  {
    id: 'query-ambiguous-employee-management-2',
    text: 'employee management now',
    entryNode: 'scenario-employee-management-projects',
    entryLevel: 'scenario' as any,
    isDuplicate: true,
    isWorkflow: false
  },
  {
    id: 'query-ambiguous-customer-360-view-1',
    text: 'customer 360 view',
    entryNode: 'scenario-customer-360-salesforce',
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
    id: 'query-workflow-project-delivery',
    text: 'Coordinate project delivery workflow',
    entryNode: 'workflow-project-delivery',
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
  clear: 10,
  ambiguous: 3,
  workflow: 3,
  total: 16
};

// Coverage meets requirements:
// ✅ Clear querys: Yes (10/5-10)
// ✅ Ambiguous querys: Yes (3/3-5)
// ✅ Workflow querys: Yes (0/1-3)
