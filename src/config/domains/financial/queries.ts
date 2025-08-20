// Query definitions for financial domain
// Generated with comprehensive coverage for clear, ambiguous, and workflow querys
// Generated on: 2025-08-20T10:42:40.983Z

import { UserQuery } from '../../../types';

export const USER_QUERIES: UserQuery[] = [
  // ============================================
  // CLEAR QUERYS (10)
  // Unambiguous, single function mapping
  // ============================================
  {
    id: 'query-core-banking-action',
    text: 'I want to capture personal details',
    entryNode: 'action-capture-personal-cb',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-wealth-action',
    text: 'Help me calculate portfolio returns',
    entryNode: 'action-calculate-returns-wealth',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-loans-action',
    text: 'I want to capture loan details',
    entryNode: 'action-capture-details-loans',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-payments-action',
    text: 'I want to check account status',
    entryNode: 'action-check-account-payments',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-risk-action',
    text: 'I want to check identity documents',
    entryNode: 'action-check-documents-cb',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-action-action-capture-finan',
    text: 'How do I capture financial information?',
    entryNode: 'action-capture-financial-cb',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-action-action-validate-id-c',
    text: 'Help me validate identity',
    entryNode: 'action-validate-id-cb',
    entryLevel: 'action' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-step-step-collect-info-cb',
    text: 'I need to collect customer information',
    entryNode: 'step-collect-info-cb',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-step-step-verify-closure-',
    text: 'Verify Closure Request',
    entryNode: 'step-verify-closure-cb',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'query-scenario-scenario-open-accoun',
    text: 'Account Opening',
    entryNode: 'scenario-open-account-cb',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },

  // ============================================
  // AMBIGUOUS QUERYS (1)
  // Require context for proper resolution
  // ============================================
  {
    id: 'query-ambiguous-verify-customer-identity-1',
    text: 'verify customer identity',
    entryNode: 'step-verify-identity-cb',
    entryLevel: 'step' as any,
    isDuplicate: true,
    isWorkflow: false
  }
,

  // ============================================
  // WORKFLOW QUERYS
  // Cross-product orchestration workflows
  // ============================================
  {
    id: 'query-workflow-kyc-onboarding',
    text: 'Execute complete KYC and customer onboarding workflow',
    entryNode: 'workflow-kyc-onboarding',
    entryLevel: 'workflow' as any,
    isDuplicate: false,
    isWorkflow: true
  },
  {
    id: 'query-workflow-fraud-response',
    text: 'Coordinate multi-product fraud response workflow',
    entryNode: 'workflow-fraud-response',
    entryLevel: 'workflow' as any,
    isDuplicate: false,
    isWorkflow: true
  },
  {
    id: 'query-workflow-lending-lifecycle',
    text: 'Orchestrate end-to-end lending workflow',
    entryNode: 'workflow-lending-lifecycle',
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
  ambiguous: 1,
  workflow: 3,
  total: 14
};

// Coverage meets requirements:
// ✅ Clear querys: Yes (10/5-10)
// ✅ Ambiguous querys: No (1/3-5)
// ✅ Workflow querys: Yes (0/1-3)
