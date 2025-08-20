// User query examples for Financial Services domain
import { UserQuery } from '../../../types';

export const USER_QUERIES: UserQuery[] = [
  // Account-related querys
  {
    id: 'open-account',
    text: "Open an account",
    entryNode: "scenario-open-account-cb",
    entryLevel: "scenario",
    ambiguous: true
  },
  {
    id: 'close-account',
    text: "Close account",
    entryNode: "scenario-close-account-cb",
    entryLevel: "scenario",
    ambiguous: true
  },
  {
    id: 'check-balance',
    text: "Check my balance",
    entryNode: "scenario-balance-inquiry-cb",
    entryLevel: "scenario",
    ambiguous: true
  },
  {
    id: 'transfer-money',
    text: "Transfer money",
    entryNode: "scenario-transfer-cb",
    entryLevel: "scenario",
    ambiguous: true
  },

  // Investment and wealth management querys
  {
    id: 'review-portfolio',
    text: "Review portfolio",
    entryNode: "scenario-portfolio-wealth",
    entryLevel: "scenario",
    ambiguous: false
  },
  {
    id: 'buy-securities',
    text: "Buy securities",
    entryNode: "scenario-trading-wealth",
    entryLevel: "scenario",
    ambiguous: false
  },
  {
    id: 'plan-retirement',
    text: "Plan retirement",
    entryNode: "scenario-retirement-wealth",
    entryLevel: "scenario",
    ambiguous: false
  },
  {
    id: 'get-advice',
    text: "Get financial advice",
    entryNode: "scenario-advisory-wealth",
    entryLevel: "scenario",
    ambiguous: false
  },

  // Loan and credit querys
  {
    id: 'apply-credit',
    text: "Apply for credit",
    entryNode: "scenario-application-loans",
    entryLevel: "scenario",
    ambiguous: false
  },
  {
    id: 'check-credit-score',
    text: "Check credit score",
    entryNode: "step-credit-check-loans",
    entryLevel: "step",
    ambiguous: false
  },
  {
    id: 'make-payment',
    text: "Make loan payment",
    entryNode: "scenario-payments-loans",
    entryLevel: "scenario",
    ambiguous: false
  },
  {
    id: 'modify-loan',
    text: "Modify loan terms",
    entryNode: "scenario-modification-loans",
    entryLevel: "scenario",
    ambiguous: false
  },

  // Payment processing querys
  {
    id: 'send-domestic-payment',
    text: "Send domestic payment",
    entryNode: "scenario-domestic-payments",
    entryLevel: "scenario",
    ambiguous: false
  },
  {
    id: 'send-international-payment',
    text: "Send international payment",
    entryNode: "scenario-international-payments",
    entryLevel: "scenario",
    ambiguous: false
  },
  {
    id: 'process-pos-payment',
    text: "Process point of sale payment",
    entryNode: "scenario-pos-payments",
    entryLevel: "scenario",
    ambiguous: false
  },
  {
    id: 'settle-payments',
    text: "Settle payments",
    entryNode: "scenario-settlement-payments",
    entryLevel: "scenario",
    ambiguous: false
  },

  // Compliance and security querys
  {
    id: 'verify-identity',
    text: "Verify identity",
    entryNode: "scenario-kyc-risk",
    entryLevel: "scenario",
    ambiguous: true
  },
  {
    id: 'check-compliance',
    text: "Check compliance",
    entryNode: "scenario-kyc-risk",
    entryLevel: "scenario",
    ambiguous: false
  },
  {
    id: 'generate-report',
    text: "Generate compliance report",
    entryNode: "scenario-reporting-risk",
    entryLevel: "scenario",
    ambiguous: false
  },
  {
    id: 'monitor-transactions',
    text: "Monitor transactions",
    entryNode: "scenario-transaction-monitoring-risk",
    entryLevel: "scenario",
    ambiguous: false
  },
  {
    id: 'detect-fraud',
    text: "Detect fraud",
    entryNode: "scenario-fraud-detection-risk",
    entryLevel: "scenario",
    ambiguous: false
  },

  // Cross-product ambiguous querys
  {
    id: 'update-information',
    text: "Update my information",
    entryNode: "step-collect-info-cb",
    entryLevel: "step",
    ambiguous: true
  },
  {
    id: 'submit-documents',
    text: "Submit documents",
    entryNode: "step-verify-documents-loans",
    entryLevel: "step",
    ambiguous: true
  },
  {
    id: 'authorize-transaction',
    text: "Authorize transaction",
    entryNode: "step-authorize-pos-payments",
    entryLevel: "step",
    ambiguous: true
  },
  {
    id: 'view-transactions',
    text: "View transactions",
    entryNode: "step-retrieve-balance-cb",
    entryLevel: "step",
    ambiguous: true
  }
];