// Query definitions for financial domain
// Auto-categorized with proper flags for clear, ambiguous, and workflow querys

import { UserQuery } from '../../../types';

export const USER_QUERIES: UserQuery[] = [
  // Clear Querys - Unambiguous, single product/function mapping
  {
    id: 'open-account',
    text: 'Open an account',
    entryNode: 'scenario-open-account-cb',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'close-account',
    text: 'Close account',
    entryNode: 'scenario-close-account-cb',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'check-balance',
    text: 'Check my balance',
    entryNode: 'scenario-balance-inquiry-cb',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'transfer-money',
    text: 'Transfer money',
    entryNode: 'scenario-transfer-cb',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'review-portfolio',
    text: 'Review portfolio',
    entryNode: 'scenario-portfolio-wealth',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'buy-securities',
    text: 'Buy securities',
    entryNode: 'scenario-trading-wealth',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'plan-retirement',
    text: 'Plan retirement',
    entryNode: 'scenario-retirement-wealth',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'get-advice',
    text: 'Get financial advice',
    entryNode: 'scenario-advisory-wealth',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'apply-credit',
    text: 'Apply for credit',
    entryNode: 'scenario-application-loans',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'check-credit-score',
    text: 'Check credit score',
    entryNode: 'step-credit-check-loans',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'make-payment',
    text: 'Make loan payment',
    entryNode: 'scenario-payments-loans',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'modify-loan',
    text: 'Modify loan terms',
    entryNode: 'scenario-modification-loans',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'send-domestic-payment',
    text: 'Send domestic payment',
    entryNode: 'scenario-domestic-payments',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'send-international-payment',
    text: 'Send international payment',
    entryNode: 'scenario-international-payments',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'process-pos-payment',
    text: 'Process point of sale payment',
    entryNode: 'scenario-pos-payments',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'settle-payments',
    text: 'Settle payments',
    entryNode: 'scenario-settlement-payments',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'verify-identity',
    text: 'Verify identity',
    entryNode: 'scenario-kyc-risk',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'check-compliance',
    text: 'Check compliance',
    entryNode: 'scenario-kyc-risk',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'generate-report',
    text: 'Generate compliance report',
    entryNode: 'scenario-reporting-risk',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'monitor-transactions',
    text: 'Monitor transactions',
    entryNode: 'scenario-transaction-monitoring-risk',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'detect-fraud',
    text: 'Detect fraud',
    entryNode: 'scenario-fraud-detection-risk',
    entryLevel: 'scenario' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'update-information',
    text: 'Update my information',
    entryNode: 'step-collect-info-cb',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'submit-documents',
    text: 'Submit documents',
    entryNode: 'step-verify-documents-loans',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'authorize-transaction',
    text: 'Authorize transaction',
    entryNode: 'step-authorize-pos-payments',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  },
  {
    id: 'view-transactions',
    text: 'View transactions',
    entryNode: 'step-retrieve-balance-cb',
    entryLevel: 'step' as any,
    isDuplicate: false,
    isWorkflow: false
  }
];

// Query categorization summary
export const QUERY_CATEGORIES = {
  clear: 25,
  ambiguous: 0,
  workflow: 0,
  total: 25
};
