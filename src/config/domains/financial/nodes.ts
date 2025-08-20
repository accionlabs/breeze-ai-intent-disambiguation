// Functional nodes for Financial Services domain
import { FunctionalNode } from '../../../types';

export const FUNCTIONAL_NODES: Record<string, FunctionalNode> = {
  // PRODUCT LEVEL NODES
  'product-core-banking': {
    id: 'product-core-banking',
    label: 'CoreBanking',
    level: 'product',
    children: ['outcome-accounts-cb', 'outcome-transactions-cb', 'workflow-kyc-onboarding', 'workflow-fraud-response', 'workflow-lending-lifecycle'],
    parents: []
  },
  'product-wealth': {
    id: 'product-wealth',
    label: 'WealthManager',
    level: 'product',
    children: ['outcome-investments-wealth', 'outcome-planning-wealth', 'workflow-kyc-onboarding'],
    parents: []
  },
  'product-loans': {
    id: 'product-loans',
    label: 'LoanOrigination',
    level: 'product',
    children: ['outcome-origination-loans', 'outcome-servicing-loans', 'workflow-lending-lifecycle'],
    parents: []
  },
  'product-payments': {
    id: 'product-payments',
    label: 'PaymentHub',
    level: 'product',
    children: ['outcome-processing-payments', 'outcome-merchant-payments', 'workflow-fraud-response'],
    parents: []
  },
  'product-risk': {
    id: 'product-risk',
    label: 'RiskAnalytics',
    level: 'product',
    children: ['outcome-compliance-risk', 'outcome-monitoring-risk', 'workflow-kyc-onboarding', 'workflow-fraud-response', 'workflow-lending-lifecycle'],
    parents: []
  },

  // CORE BANKING OUTCOMES
  'outcome-accounts-cb': {
    id: 'outcome-accounts-cb',
    label: 'Account Management',
    level: 'outcome',
    products: ['core-banking'],
    children: ['scenario-open-account-cb', 'scenario-close-account-cb'],
    parents: ['product-core-banking', 'workflow-kyc-onboarding', 'workflow-fraud-response', 'workflow-lending-lifecycle']
  },
  'outcome-transactions-cb': {
    id: 'outcome-transactions-cb',
    label: 'Transaction Processing',
    level: 'outcome',
    products: ['core-banking'],
    children: ['scenario-transfer-cb', 'scenario-balance-inquiry-cb'],
    parents: ['product-core-banking']
  },

  // WEALTH OUTCOMES
  'outcome-investments-wealth': {
    id: 'outcome-investments-wealth',
    label: 'Investment Management',
    level: 'outcome',
    products: ['wealth'],
    children: ['scenario-portfolio-wealth', 'scenario-trading-wealth'],
    parents: ['product-wealth', 'workflow-kyc-onboarding']
  },
  'outcome-planning-wealth': {
    id: 'outcome-planning-wealth',
    label: 'Financial Planning',
    level: 'outcome',
    products: ['wealth'],
    children: ['scenario-retirement-wealth', 'scenario-advisory-wealth'],
    parents: ['product-wealth']
  },

  // LOANS OUTCOMES
  'outcome-origination-loans': {
    id: 'outcome-origination-loans',
    label: 'Loan Origination',
    level: 'outcome',
    products: ['loans'],
    children: ['scenario-application-loans', 'scenario-underwriting-loans'],
    parents: ['product-loans', 'workflow-lending-lifecycle']
  },
  'outcome-servicing-loans': {
    id: 'outcome-servicing-loans',
    label: 'Loan Servicing',
    level: 'outcome',
    products: ['loans'],
    children: ['scenario-payments-loans', 'scenario-modification-loans'],
    parents: ['product-loans', 'workflow-lending-lifecycle']
  },

  // PAYMENTS OUTCOMES
  'outcome-processing-payments': {
    id: 'outcome-processing-payments',
    label: 'Payment Processing',
    level: 'outcome',
    products: ['payments'],
    children: ['scenario-domestic-payments', 'scenario-international-payments'],
    parents: ['product-payments', 'workflow-fraud-response']
  },
  'outcome-merchant-payments': {
    id: 'outcome-merchant-payments',
    label: 'Merchant Services',
    level: 'outcome',
    products: ['payments'],
    children: ['scenario-pos-payments', 'scenario-settlement-payments'],
    parents: ['product-payments']
  },

  // RISK OUTCOMES
  'outcome-compliance-risk': {
    id: 'outcome-compliance-risk',
    label: 'Compliance Management',
    level: 'outcome',
    products: ['risk'],
    children: ['scenario-kyc-risk', 'scenario-reporting-risk'],
    parents: ['product-risk', 'workflow-kyc-onboarding', 'workflow-lending-lifecycle']
  },
  'outcome-monitoring-risk': {
    id: 'outcome-monitoring-risk',
    label: 'Risk Monitoring',
    level: 'outcome',
    products: ['risk'],
    children: ['scenario-transaction-monitoring-risk', 'scenario-fraud-detection-risk'],
    parents: ['product-risk', 'workflow-fraud-response']
  },

  // CORE BANKING SCENARIOS
  'scenario-open-account-cb': {
    id: 'scenario-open-account-cb',
    label: 'Account Opening',
    level: 'scenario',
    products: ['core-banking'],
    children: ['step-collect-info-cb', 'step-verify-identity-cb'],
    parents: ['outcome-accounts-cb']
  },
  'scenario-close-account-cb': {
    id: 'scenario-close-account-cb',
    label: 'Account Closure',
    level: 'scenario',
    products: ['core-banking'],
    children: ['step-verify-closure-cb', 'step-transfer-funds-cb'],
    parents: ['outcome-accounts-cb']
  },
  'scenario-transfer-cb': {
    id: 'scenario-transfer-cb',
    label: 'Fund Transfer',
    level: 'scenario',
    products: ['core-banking'],
    children: ['step-select-accounts-cb', 'step-execute-transfer-cb'],
    parents: ['outcome-transactions-cb']
  },
  'scenario-balance-inquiry-cb': {
    id: 'scenario-balance-inquiry-cb',
    label: 'Balance Inquiry',
    level: 'scenario',
    products: ['core-banking'],
    children: ['step-authenticate-cb', 'step-retrieve-balance-cb'],
    parents: ['outcome-transactions-cb']
  },

  // WEALTH SCENARIOS
  'scenario-portfolio-wealth': {
    id: 'scenario-portfolio-wealth',
    label: 'Portfolio Management',
    level: 'scenario',
    products: ['wealth'],
    children: ['step-analyze-portfolio-wealth', 'step-rebalance-wealth'],
    parents: ['outcome-investments-wealth']
  },
  'scenario-trading-wealth': {
    id: 'scenario-trading-wealth',
    label: 'Investment Trading',
    level: 'scenario',
    products: ['wealth'],
    children: ['step-place-order-wealth', 'step-execute-trade-wealth'],
    parents: ['outcome-investments-wealth']
  },
  'scenario-retirement-wealth': {
    id: 'scenario-retirement-wealth',
    label: 'Retirement Planning',
    level: 'scenario',
    products: ['wealth'],
    children: ['step-assess-needs-wealth', 'step-create-plan-wealth'],
    parents: ['outcome-planning-wealth']
  },
  'scenario-advisory-wealth': {
    id: 'scenario-advisory-wealth',
    label: 'Investment Advisory',
    level: 'scenario',
    products: ['wealth'],
    children: ['step-analyze-risk-wealth', 'step-recommend-wealth'],
    parents: ['outcome-planning-wealth']
  },

  // LOANS SCENARIOS
  'scenario-application-loans': {
    id: 'scenario-application-loans',
    label: 'Loan Application',
    level: 'scenario',
    products: ['loans'],
    children: ['step-submit-application-loans', 'step-verify-documents-loans'],
    parents: ['outcome-origination-loans']
  },
  'scenario-underwriting-loans': {
    id: 'scenario-underwriting-loans',
    label: 'Loan Underwriting',
    level: 'scenario',
    products: ['loans'],
    children: ['step-credit-check-loans', 'step-approve-loan-loans'],
    parents: ['outcome-origination-loans']
  },
  'scenario-payments-loans': {
    id: 'scenario-payments-loans',
    label: 'Loan Payments',
    level: 'scenario',
    products: ['loans'],
    children: ['step-schedule-payment-loans', 'step-process-payment-loans'],
    parents: ['outcome-servicing-loans']
  },
  'scenario-modification-loans': {
    id: 'scenario-modification-loans',
    label: 'Loan Modification',
    level: 'scenario',
    products: ['loans'],
    children: ['step-assess-hardship-loans', 'step-modify-terms-loans'],
    parents: ['outcome-servicing-loans']
  },

  // PAYMENTS SCENARIOS
  'scenario-domestic-payments': {
    id: 'scenario-domestic-payments',
    label: 'Domestic Transfers',
    level: 'scenario',
    products: ['payments'],
    children: ['step-validate-domestic-payments', 'step-route-domestic-payments'],
    parents: ['outcome-processing-payments']
  },
  'scenario-international-payments': {
    id: 'scenario-international-payments',
    label: 'International Transfers',
    level: 'scenario',
    products: ['payments'],
    children: ['step-validate-intl-payments', 'step-convert-currency-payments'],
    parents: ['outcome-processing-payments']
  },
  'scenario-pos-payments': {
    id: 'scenario-pos-payments',
    label: 'Point of Sale',
    level: 'scenario',
    products: ['payments'],
    children: ['step-authorize-pos-payments', 'step-capture-payment-payments'],
    parents: ['outcome-merchant-payments']
  },
  'scenario-settlement-payments': {
    id: 'scenario-settlement-payments',
    label: 'Payment Settlement',
    level: 'scenario',
    products: ['payments'],
    children: ['step-batch-transactions-payments', 'step-settle-funds-payments'],
    parents: ['outcome-merchant-payments']
  },

  // RISK SCENARIOS
  'scenario-kyc-risk': {
    id: 'scenario-kyc-risk',
    label: 'KYC Verification',
    level: 'scenario',
    products: ['risk'],
    children: ['step-identity-verification-risk', 'step-background-check-risk'],
    parents: ['outcome-compliance-risk']
  },
  'scenario-reporting-risk': {
    id: 'scenario-reporting-risk',
    label: 'Regulatory Reporting',
    level: 'scenario',
    products: ['risk'],
    children: ['step-collect-data-risk', 'step-generate-report-risk'],
    parents: ['outcome-compliance-risk']
  },
  'scenario-transaction-monitoring-risk': {
    id: 'scenario-transaction-monitoring-risk',
    label: 'Transaction Monitoring',
    level: 'scenario',
    products: ['risk'],
    children: ['step-scan-transactions-risk', 'step-flag-suspicious-risk'],
    parents: ['outcome-monitoring-risk']
  },
  'scenario-fraud-detection-risk': {
    id: 'scenario-fraud-detection-risk',
    label: 'Fraud Detection',
    level: 'scenario',
    products: ['risk'],
    children: ['step-analyze-patterns-risk', 'step-block-suspicious-risk'],
    parents: ['outcome-monitoring-risk']
  },

  // CORE BANKING STEPS
  'step-collect-info-cb': {
    id: 'step-collect-info-cb',
    label: 'Collect Customer Information',
    level: 'step',
    products: ['core-banking'],
    children: ['action-capture-personal-cb', 'action-capture-financial-cb'],
    parents: ['scenario-open-account-cb']
  },
  'step-verify-identity-cb': {
    id: 'step-verify-identity-cb',
    label: 'Verify Customer Identity',
    level: 'step',
    products: ['core-banking'],
    children: ['action-check-documents-cb', 'action-validate-id-cb'],
    parents: ['scenario-open-account-cb']
  },
  'step-verify-closure-cb': {
    id: 'step-verify-closure-cb',
    label: 'Verify Closure Request',
    level: 'step',
    products: ['core-banking'],
    children: ['action-confirm-balance-cb', 'action-check-obligations-cb'],
    parents: ['scenario-close-account-cb']
  },
  'step-transfer-funds-cb': {
    id: 'step-transfer-funds-cb',
    label: 'Transfer Remaining Funds',
    level: 'step',
    products: ['core-banking'],
    children: ['action-calculate-balance-cb', 'action-initiate-transfer-cb'],
    parents: ['scenario-close-account-cb']
  },
  'step-select-accounts-cb': {
    id: 'step-select-accounts-cb',
    label: 'Select Source/Destination Accounts',
    level: 'step',
    products: ['core-banking'],
    children: ['action-validate-accounts-cb', 'action-check-limits-cb'],
    parents: ['scenario-transfer-cb']
  },
  'step-execute-transfer-cb': {
    id: 'step-execute-transfer-cb',
    label: 'Execute Fund Transfer',
    level: 'step',
    products: ['core-banking'],
    children: ['action-debit-source-cb', 'action-credit-destination-cb'],
    parents: ['scenario-transfer-cb']
  },
  'step-authenticate-cb': {
    id: 'step-authenticate-cb',
    label: 'Authenticate Customer',
    level: 'step',
    products: ['core-banking'],
    children: ['action-verify-credentials-cb', 'action-check-access-cb'],
    parents: ['scenario-balance-inquiry-cb']
  },
  'step-retrieve-balance-cb': {
    id: 'step-retrieve-balance-cb',
    label: 'Retrieve Account Balance',
    level: 'step',
    products: ['core-banking'],
    children: ['action-query-ledger-cb', 'action-format-response-cb'],
    parents: ['scenario-balance-inquiry-cb']
  },

  // WEALTH STEPS
  'step-analyze-portfolio-wealth': {
    id: 'step-analyze-portfolio-wealth',
    label: 'Analyze Portfolio Performance',
    level: 'step',
    products: ['wealth'],
    children: ['action-calculate-returns-wealth', 'action-assess-risk-wealth'],
    parents: ['scenario-portfolio-wealth']
  },
  'step-rebalance-wealth': {
    id: 'step-rebalance-wealth',
    label: 'Rebalance Portfolio',
    level: 'step',
    products: ['wealth'],
    children: ['action-determine-allocation-wealth', 'action-execute-rebalance-wealth'],
    parents: ['scenario-portfolio-wealth']
  },
  'step-place-order-wealth': {
    id: 'step-place-order-wealth',
    label: 'Place Trade Order',
    level: 'step',
    products: ['wealth'],
    children: ['action-validate-order-wealth', 'action-submit-order-wealth'],
    parents: ['scenario-trading-wealth']
  },
  'step-execute-trade-wealth': {
    id: 'step-execute-trade-wealth',
    label: 'Execute Trade',
    level: 'step',
    products: ['wealth'],
    children: ['action-match-order-wealth', 'action-settle-trade-wealth'],
    parents: ['scenario-trading-wealth']
  },
  'step-assess-needs-wealth': {
    id: 'step-assess-needs-wealth',
    label: 'Assess Retirement Needs',
    level: 'step',
    products: ['wealth'],
    children: ['action-calculate-needs-wealth', 'action-evaluate-timeline-wealth'],
    parents: ['scenario-retirement-wealth']
  },
  'step-create-plan-wealth': {
    id: 'step-create-plan-wealth',
    label: 'Create Retirement Plan',
    level: 'step',
    products: ['wealth'],
    children: ['action-design-strategy-wealth', 'action-recommend-products-wealth'],
    parents: ['scenario-retirement-wealth']
  },
  'step-analyze-risk-wealth': {
    id: 'step-analyze-risk-wealth',
    label: 'Analyze Risk Profile',
    level: 'step',
    products: ['wealth'],
    children: ['action-assess-tolerance-wealth', 'action-measure-capacity-wealth'],
    parents: ['scenario-advisory-wealth']
  },
  'step-recommend-wealth': {
    id: 'step-recommend-wealth',
    label: 'Provide Investment Recommendations',
    level: 'step',
    products: ['wealth'],
    children: ['action-generate-recommendations-wealth', 'action-present-options-wealth'],
    parents: ['scenario-advisory-wealth']
  },

  // LOANS STEPS
  'step-submit-application-loans': {
    id: 'step-submit-application-loans',
    label: 'Submit Loan Application',
    level: 'step',
    products: ['loans'],
    children: ['action-capture-details-loans', 'action-upload-documents-loans'],
    parents: ['scenario-application-loans']
  },
  'step-verify-documents-loans': {
    id: 'step-verify-documents-loans',
    label: 'Verify Supporting Documents',
    level: 'step',
    products: ['loans'],
    children: ['action-validate-documents-loans', 'action-verify-income-loans'],
    parents: ['scenario-application-loans']
  },
  'step-credit-check-loans': {
    id: 'step-credit-check-loans',
    label: 'Perform Credit Check',
    level: 'step',
    products: ['loans'],
    children: ['action-pull-credit-report-loans', 'action-calculate-score-loans'],
    parents: ['scenario-underwriting-loans']
  },
  'step-approve-loan-loans': {
    id: 'step-approve-loan-loans',
    label: 'Approve/Deny Loan',
    level: 'step',
    products: ['loans'],
    children: ['action-make-decision-loans', 'action-set-terms-loans'],
    parents: ['scenario-underwriting-loans']
  },
  'step-schedule-payment-loans': {
    id: 'step-schedule-payment-loans',
    label: 'Schedule Loan Payment',
    level: 'step',
    products: ['loans'],
    children: ['action-calculate-amount-loans', 'action-set-schedule-loans'],
    parents: ['scenario-payments-loans']
  },
  'step-process-payment-loans': {
    id: 'step-process-payment-loans',
    label: 'Process Loan Payment',
    level: 'step',
    products: ['loans'],
    children: ['action-collect-payment-loans', 'action-apply-payment-loans'],
    parents: ['scenario-payments-loans']
  },
  'step-assess-hardship-loans': {
    id: 'step-assess-hardship-loans',
    label: 'Assess Financial Hardship',
    level: 'step',
    products: ['loans'],
    children: ['action-review-circumstances-loans', 'action-evaluate-options-loans'],
    parents: ['scenario-modification-loans']
  },
  'step-modify-terms-loans': {
    id: 'step-modify-terms-loans',
    label: 'Modify Loan Terms',
    level: 'step',
    products: ['loans'],
    children: ['action-adjust-terms-loans', 'action-document-changes-loans'],
    parents: ['scenario-modification-loans']
  },

  // PAYMENTS STEPS
  'step-validate-domestic-payments': {
    id: 'step-validate-domestic-payments',
    label: 'Validate Domestic Transfer',
    level: 'step',
    products: ['payments'],
    children: ['action-check-account-payments', 'action-verify-funds-payments'],
    parents: ['scenario-domestic-payments']
  },
  'step-route-domestic-payments': {
    id: 'step-route-domestic-payments',
    label: 'Route Domestic Payment',
    level: 'step',
    products: ['payments'],
    children: ['action-determine-network-payments', 'action-send-payment-payments'],
    parents: ['scenario-domestic-payments']
  },
  'step-validate-intl-payments': {
    id: 'step-validate-intl-payments',
    label: 'Validate International Transfer',
    level: 'step',
    products: ['payments'],
    children: ['action-check-compliance-payments', 'action-verify-beneficiary-payments'],
    parents: ['scenario-international-payments']
  },
  'step-convert-currency-payments': {
    id: 'step-convert-currency-payments',
    label: 'Convert Currency',
    level: 'step',
    products: ['payments'],
    children: ['action-get-exchange-rate-payments', 'action-convert-amount-payments'],
    parents: ['scenario-international-payments']
  },
  'step-authorize-pos-payments': {
    id: 'step-authorize-pos-payments',
    label: 'Authorize POS Transaction',
    level: 'step',
    products: ['payments'],
    children: ['action-validate-card-payments', 'action-check-limits-pos-payments'],
    parents: ['scenario-pos-payments']
  },
  'step-capture-payment-payments': {
    id: 'step-capture-payment-payments',
    label: 'Capture Payment',
    level: 'step',
    products: ['payments'],
    children: ['action-process-authorization-payments', 'action-update-balance-payments'],
    parents: ['scenario-pos-payments']
  },
  'step-batch-transactions-payments': {
    id: 'step-batch-transactions-payments',
    label: 'Batch Transactions',
    level: 'step',
    products: ['payments'],
    children: ['action-collect-transactions-payments', 'action-create-batch-payments'],
    parents: ['scenario-settlement-payments']
  },
  'step-settle-funds-payments': {
    id: 'step-settle-funds-payments',
    label: 'Settle Funds',
    level: 'step',
    products: ['payments'],
    children: ['action-calculate-settlement-payments', 'action-transfer-funds-payments'],
    parents: ['scenario-settlement-payments']
  },

  // RISK STEPS
  'step-identity-verification-risk': {
    id: 'step-identity-verification-risk',
    label: 'Verify Customer Identity',
    level: 'step',
    products: ['risk'],
    children: ['action-check-id-documents-risk', 'action-verify-biometrics-risk'],
    parents: ['scenario-kyc-risk']
  },
  'step-background-check-risk': {
    id: 'step-background-check-risk',
    label: 'Perform Background Check',
    level: 'step',
    products: ['risk'],
    children: ['action-check-sanctions-risk', 'action-verify-pep-risk'],
    parents: ['scenario-kyc-risk']
  },
  'step-collect-data-risk': {
    id: 'step-collect-data-risk',
    label: 'Collect Regulatory Data',
    level: 'step',
    products: ['risk'],
    children: ['action-query-systems-risk', 'action-aggregate-data-risk'],
    parents: ['scenario-reporting-risk']
  },
  'step-generate-report-risk': {
    id: 'step-generate-report-risk',
    label: 'Generate Compliance Report',
    level: 'step',
    products: ['risk'],
    children: ['action-format-report-risk', 'action-validate-report-risk'],
    parents: ['scenario-reporting-risk']
  },
  'step-scan-transactions-risk': {
    id: 'step-scan-transactions-risk',
    label: 'Scan Transaction Patterns',
    level: 'step',
    products: ['risk'],
    children: ['action-analyze-patterns-risk', 'action-score-risk-risk'],
    parents: ['scenario-transaction-monitoring-risk']
  },
  'step-flag-suspicious-risk': {
    id: 'step-flag-suspicious-risk',
    label: 'Flag Suspicious Activity',
    level: 'step',
    products: ['risk'],
    children: ['action-create-alert-risk', 'action-escalate-case-risk'],
    parents: ['scenario-transaction-monitoring-risk']
  },
  'step-analyze-patterns-risk': {
    id: 'step-analyze-patterns-risk',
    label: 'Analyze Fraud Patterns',
    level: 'step',
    products: ['risk'],
    children: ['action-apply-rules-risk', 'action-ml-analysis-risk'],
    parents: ['scenario-fraud-detection-risk']
  },
  'step-block-suspicious-risk': {
    id: 'step-block-suspicious-risk',
    label: 'Block Suspicious Transactions',
    level: 'step',
    products: ['risk'],
    children: ['action-block-transaction-risk', 'action-notify-customer-risk'],
    parents: ['scenario-fraud-detection-risk']
  },

  // CORE BANKING ACTIONS
  'action-capture-personal-cb': {
    id: 'action-capture-personal-cb',
    label: 'Capture Personal Details',
    level: 'action',
    products: ['core-banking'],
    children: [],
    parents: ['step-collect-info-cb']
  },
  'action-capture-financial-cb': {
    id: 'action-capture-financial-cb',
    label: 'Capture Financial Information',
    level: 'action',
    products: ['core-banking'],
    children: [],
    parents: ['step-collect-info-cb']
  },
  'action-check-documents-cb': {
    id: 'action-check-documents-cb',
    label: 'Check Identity Documents',
    level: 'action',
    products: ['core-banking', 'risk'],
    children: [],
    parents: ['step-verify-identity-cb']
  },
  'action-validate-id-cb': {
    id: 'action-validate-id-cb',
    label: 'Validate Identity',
    level: 'action',
    products: ['core-banking', 'risk'],
    children: [],
    parents: ['step-verify-identity-cb']
  },
  'action-confirm-balance-cb': {
    id: 'action-confirm-balance-cb',
    label: 'Confirm Zero Balance',
    level: 'action',
    products: ['core-banking'],
    children: [],
    parents: ['step-verify-closure-cb']
  },
  'action-check-obligations-cb': {
    id: 'action-check-obligations-cb',
    label: 'Check Outstanding Obligations',
    level: 'action',
    products: ['core-banking'],
    children: [],
    parents: ['step-verify-closure-cb']
  },
  'action-calculate-balance-cb': {
    id: 'action-calculate-balance-cb',
    label: 'Calculate Final Balance',
    level: 'action',
    products: ['core-banking'],
    children: [],
    parents: ['step-transfer-funds-cb']
  },
  'action-initiate-transfer-cb': {
    id: 'action-initiate-transfer-cb',
    label: 'Initiate Fund Transfer',
    level: 'action',
    products: ['core-banking'],
    children: [],
    parents: ['step-transfer-funds-cb']
  },
  'action-validate-accounts-cb': {
    id: 'action-validate-accounts-cb',
    label: 'Validate Account Numbers',
    level: 'action',
    products: ['core-banking'],
    children: [],
    parents: ['step-select-accounts-cb']
  },
  'action-check-limits-cb': {
    id: 'action-check-limits-cb',
    label: 'Check Transaction Limits',
    level: 'action',
    products: ['core-banking'],
    children: [],
    parents: ['step-select-accounts-cb']
  },
  'action-debit-source-cb': {
    id: 'action-debit-source-cb',
    label: 'Debit Source Account',
    level: 'action',
    products: ['core-banking'],
    children: [],
    parents: ['step-execute-transfer-cb']
  },
  'action-credit-destination-cb': {
    id: 'action-credit-destination-cb',
    label: 'Credit Destination Account',
    level: 'action',
    products: ['core-banking'],
    children: [],
    parents: ['step-execute-transfer-cb']
  },
  'action-verify-credentials-cb': {
    id: 'action-verify-credentials-cb',
    label: 'Verify Login Credentials',
    level: 'action',
    products: ['core-banking'],
    children: [],
    parents: ['step-authenticate-cb']
  },
  'action-check-access-cb': {
    id: 'action-check-access-cb',
    label: 'Check Account Access',
    level: 'action',
    products: ['core-banking'],
    children: [],
    parents: ['step-authenticate-cb']
  },
  'action-query-ledger-cb': {
    id: 'action-query-ledger-cb',
    label: 'Query Account Ledger',
    level: 'action',
    products: ['core-banking'],
    children: [],
    parents: ['step-retrieve-balance-cb']
  },
  'action-format-response-cb': {
    id: 'action-format-response-cb',
    label: 'Format Balance Response',
    level: 'action',
    products: ['core-banking'],
    children: [],
    parents: ['step-retrieve-balance-cb']
  },

  // WEALTH ACTIONS
  'action-calculate-returns-wealth': {
    id: 'action-calculate-returns-wealth',
    label: 'Calculate Portfolio Returns',
    level: 'action',
    products: ['wealth'],
    children: [],
    parents: ['step-analyze-portfolio-wealth']
  },
  'action-assess-risk-wealth': {
    id: 'action-assess-risk-wealth',
    label: 'Assess Portfolio Risk',
    level: 'action',
    products: ['wealth'],
    children: [],
    parents: ['step-analyze-portfolio-wealth']
  },
  'action-determine-allocation-wealth': {
    id: 'action-determine-allocation-wealth',
    label: 'Determine Target Allocation',
    level: 'action',
    products: ['wealth'],
    children: [],
    parents: ['step-rebalance-wealth']
  },
  'action-execute-rebalance-wealth': {
    id: 'action-execute-rebalance-wealth',
    label: 'Execute Portfolio Rebalance',
    level: 'action',
    products: ['wealth'],
    children: [],
    parents: ['step-rebalance-wealth']
  },
  'action-validate-order-wealth': {
    id: 'action-validate-order-wealth',
    label: 'Validate Trade Order',
    level: 'action',
    products: ['wealth'],
    children: [],
    parents: ['step-place-order-wealth']
  },
  'action-submit-order-wealth': {
    id: 'action-submit-order-wealth',
    label: 'Submit Trade Order',
    level: 'action',
    products: ['wealth'],
    children: [],
    parents: ['step-place-order-wealth']
  },
  'action-match-order-wealth': {
    id: 'action-match-order-wealth',
    label: 'Match Trade Orders',
    level: 'action',
    products: ['wealth'],
    children: [],
    parents: ['step-execute-trade-wealth']
  },
  'action-settle-trade-wealth': {
    id: 'action-settle-trade-wealth',
    label: 'Settle Trade Transaction',
    level: 'action',
    products: ['wealth'],
    children: [],
    parents: ['step-execute-trade-wealth']
  },
  'action-calculate-needs-wealth': {
    id: 'action-calculate-needs-wealth',
    label: 'Calculate Retirement Needs',
    level: 'action',
    products: ['wealth'],
    children: [],
    parents: ['step-assess-needs-wealth']
  },
  'action-evaluate-timeline-wealth': {
    id: 'action-evaluate-timeline-wealth',
    label: 'Evaluate Investment Timeline',
    level: 'action',
    products: ['wealth'],
    children: [],
    parents: ['step-assess-needs-wealth']
  },
  'action-design-strategy-wealth': {
    id: 'action-design-strategy-wealth',
    label: 'Design Investment Strategy',
    level: 'action',
    products: ['wealth'],
    children: [],
    parents: ['step-create-plan-wealth']
  },
  'action-recommend-products-wealth': {
    id: 'action-recommend-products-wealth',
    label: 'Recommend Investment Products',
    level: 'action',
    products: ['wealth'],
    children: [],
    parents: ['step-create-plan-wealth']
  },
  'action-assess-tolerance-wealth': {
    id: 'action-assess-tolerance-wealth',
    label: 'Assess Risk Tolerance',
    level: 'action',
    products: ['wealth'],
    children: [],
    parents: ['step-analyze-risk-wealth']
  },
  'action-measure-capacity-wealth': {
    id: 'action-measure-capacity-wealth',
    label: 'Measure Risk Capacity',
    level: 'action',
    products: ['wealth'],
    children: [],
    parents: ['step-analyze-risk-wealth']
  },
  'action-generate-recommendations-wealth': {
    id: 'action-generate-recommendations-wealth',
    label: 'Generate Investment Recommendations',
    level: 'action',
    products: ['wealth'],
    children: [],
    parents: ['step-recommend-wealth']
  },
  'action-present-options-wealth': {
    id: 'action-present-options-wealth',
    label: 'Present Investment Options',
    level: 'action',
    products: ['wealth'],
    children: [],
    parents: ['step-recommend-wealth']
  },

  // LOANS ACTIONS
  'action-capture-details-loans': {
    id: 'action-capture-details-loans',
    label: 'Capture Loan Details',
    level: 'action',
    products: ['loans'],
    children: [],
    parents: ['step-submit-application-loans']
  },
  'action-upload-documents-loans': {
    id: 'action-upload-documents-loans',
    label: 'Upload Supporting Documents',
    level: 'action',
    products: ['loans'],
    children: [],
    parents: ['step-submit-application-loans']
  },
  'action-validate-documents-loans': {
    id: 'action-validate-documents-loans',
    label: 'Validate Document Authenticity',
    level: 'action',
    products: ['loans'],
    children: [],
    parents: ['step-verify-documents-loans']
  },
  'action-verify-income-loans': {
    id: 'action-verify-income-loans',
    label: 'Verify Income Information',
    level: 'action',
    products: ['loans'],
    children: [],
    parents: ['step-verify-documents-loans']
  },
  'action-pull-credit-report-loans': {
    id: 'action-pull-credit-report-loans',
    label: 'Pull Credit Report',
    level: 'action',
    products: ['loans'],
    children: [],
    parents: ['step-credit-check-loans']
  },
  'action-calculate-score-loans': {
    id: 'action-calculate-score-loans',
    label: 'Calculate Credit Score',
    level: 'action',
    products: ['loans'],
    children: [],
    parents: ['step-credit-check-loans']
  },
  'action-make-decision-loans': {
    id: 'action-make-decision-loans',
    label: 'Make Approval Decision',
    level: 'action',
    products: ['loans'],
    children: [],
    parents: ['step-approve-loan-loans']
  },
  'action-set-terms-loans': {
    id: 'action-set-terms-loans',
    label: 'Set Loan Terms',
    level: 'action',
    products: ['loans'],
    children: [],
    parents: ['step-approve-loan-loans']
  },
  'action-calculate-amount-loans': {
    id: 'action-calculate-amount-loans',
    label: 'Calculate Payment Amount',
    level: 'action',
    products: ['loans'],
    children: [],
    parents: ['step-schedule-payment-loans']
  },
  'action-set-schedule-loans': {
    id: 'action-set-schedule-loans',
    label: 'Set Payment Schedule',
    level: 'action',
    products: ['loans'],
    children: [],
    parents: ['step-schedule-payment-loans']
  },
  'action-collect-payment-loans': {
    id: 'action-collect-payment-loans',
    label: 'Collect Payment',
    level: 'action',
    products: ['loans'],
    children: [],
    parents: ['step-process-payment-loans']
  },
  'action-apply-payment-loans': {
    id: 'action-apply-payment-loans',
    label: 'Apply Payment to Loan',
    level: 'action',
    products: ['loans'],
    children: [],
    parents: ['step-process-payment-loans']
  },
  'action-review-circumstances-loans': {
    id: 'action-review-circumstances-loans',
    label: 'Review Financial Circumstances',
    level: 'action',
    products: ['loans'],
    children: [],
    parents: ['step-assess-hardship-loans']
  },
  'action-evaluate-options-loans': {
    id: 'action-evaluate-options-loans',
    label: 'Evaluate Modification Options',
    level: 'action',
    products: ['loans'],
    children: [],
    parents: ['step-assess-hardship-loans']
  },
  'action-adjust-terms-loans': {
    id: 'action-adjust-terms-loans',
    label: 'Adjust Loan Terms',
    level: 'action',
    products: ['loans'],
    children: [],
    parents: ['step-modify-terms-loans']
  },
  'action-document-changes-loans': {
    id: 'action-document-changes-loans',
    label: 'Document Term Changes',
    level: 'action',
    products: ['loans'],
    children: [],
    parents: ['step-modify-terms-loans']
  },

  // PAYMENTS ACTIONS
  'action-check-account-payments': {
    id: 'action-check-account-payments',
    label: 'Check Account Status',
    level: 'action',
    products: ['payments'],
    children: [],
    parents: ['step-validate-domestic-payments']
  },
  'action-verify-funds-payments': {
    id: 'action-verify-funds-payments',
    label: 'Verify Available Funds',
    level: 'action',
    products: ['payments'],
    children: [],
    parents: ['step-validate-domestic-payments']
  },
  'action-determine-network-payments': {
    id: 'action-determine-network-payments',
    label: 'Determine Payment Network',
    level: 'action',
    products: ['payments'],
    children: [],
    parents: ['step-route-domestic-payments']
  },
  'action-send-payment-payments': {
    id: 'action-send-payment-payments',
    label: 'Send Payment Message',
    level: 'action',
    products: ['payments'],
    children: [],
    parents: ['step-route-domestic-payments']
  },
  'action-check-compliance-payments': {
    id: 'action-check-compliance-payments',
    label: 'Check Compliance Rules',
    level: 'action',
    products: ['payments'],
    children: [],
    parents: ['step-validate-intl-payments']
  },
  'action-verify-beneficiary-payments': {
    id: 'action-verify-beneficiary-payments',
    label: 'Verify Beneficiary Details',
    level: 'action',
    products: ['payments'],
    children: [],
    parents: ['step-validate-intl-payments']
  },
  'action-get-exchange-rate-payments': {
    id: 'action-get-exchange-rate-payments',
    label: 'Get Exchange Rate',
    level: 'action',
    products: ['payments'],
    children: [],
    parents: ['step-convert-currency-payments']
  },
  'action-convert-amount-payments': {
    id: 'action-convert-amount-payments',
    label: 'Convert Currency Amount',
    level: 'action',
    products: ['payments'],
    children: [],
    parents: ['step-convert-currency-payments']
  },
  'action-validate-card-payments': {
    id: 'action-validate-card-payments',
    label: 'Validate Card Details',
    level: 'action',
    products: ['payments'],
    children: [],
    parents: ['step-authorize-pos-payments']
  },
  'action-check-limits-pos-payments': {
    id: 'action-check-limits-pos-payments',
    label: 'Check POS Limits',
    level: 'action',
    products: ['payments'],
    children: [],
    parents: ['step-authorize-pos-payments']
  },
  'action-process-authorization-payments': {
    id: 'action-process-authorization-payments',
    label: 'Process Authorization',
    level: 'action',
    products: ['payments'],
    children: [],
    parents: ['step-capture-payment-payments']
  },
  'action-update-balance-payments': {
    id: 'action-update-balance-payments',
    label: 'Update Account Balance',
    level: 'action',
    products: ['payments'],
    children: [],
    parents: ['step-capture-payment-payments']
  },
  'action-collect-transactions-payments': {
    id: 'action-collect-transactions-payments',
    label: 'Collect Transactions',
    level: 'action',
    products: ['payments'],
    children: [],
    parents: ['step-batch-transactions-payments']
  },
  'action-create-batch-payments': {
    id: 'action-create-batch-payments',
    label: 'Create Settlement Batch',
    level: 'action',
    products: ['payments'],
    children: [],
    parents: ['step-batch-transactions-payments']
  },
  'action-calculate-settlement-payments': {
    id: 'action-calculate-settlement-payments',
    label: 'Calculate Settlement Amount',
    level: 'action',
    products: ['payments'],
    children: [],
    parents: ['step-settle-funds-payments']
  },
  'action-transfer-funds-payments': {
    id: 'action-transfer-funds-payments',
    label: 'Transfer Settlement Funds',
    level: 'action',
    products: ['payments'],
    children: [],
    parents: ['step-settle-funds-payments']
  },

  // RISK ACTIONS
  'action-check-id-documents-risk': {
    id: 'action-check-id-documents-risk',
    label: 'Check ID Documents',
    level: 'action',
    products: ['risk', 'core-banking'],
    children: [],
    parents: ['step-identity-verification-risk']
  },
  'action-verify-biometrics-risk': {
    id: 'action-verify-biometrics-risk',
    label: 'Verify Biometric Data',
    level: 'action',
    products: ['risk', 'core-banking'],
    children: [],
    parents: ['step-identity-verification-risk']
  },
  'action-check-sanctions-risk': {
    id: 'action-check-sanctions-risk',
    label: 'Check Sanctions Lists',
    level: 'action',
    products: ['risk'],
    children: [],
    parents: ['step-background-check-risk']
  },
  'action-verify-pep-risk': {
    id: 'action-verify-pep-risk',
    label: 'Verify PEP Status',
    level: 'action',
    products: ['risk'],
    children: [],
    parents: ['step-background-check-risk']
  },
  'action-query-systems-risk': {
    id: 'action-query-systems-risk',
    label: 'Query Source Systems',
    level: 'action',
    products: ['risk'],
    children: [],
    parents: ['step-collect-data-risk']
  },
  'action-aggregate-data-risk': {
    id: 'action-aggregate-data-risk',
    label: 'Aggregate Report Data',
    level: 'action',
    products: ['risk'],
    children: [],
    parents: ['step-collect-data-risk']
  },
  'action-format-report-risk': {
    id: 'action-format-report-risk',
    label: 'Format Compliance Report',
    level: 'action',
    products: ['risk'],
    children: [],
    parents: ['step-generate-report-risk']
  },
  'action-validate-report-risk': {
    id: 'action-validate-report-risk',
    label: 'Validate Report Accuracy',
    level: 'action',
    products: ['risk'],
    children: [],
    parents: ['step-generate-report-risk']
  },
  'action-analyze-patterns-risk': {
    id: 'action-analyze-patterns-risk',
    label: 'Analyze Transaction Patterns',
    level: 'action',
    products: ['risk'],
    children: [],
    parents: ['step-scan-transactions-risk']
  },
  'action-score-risk-risk': {
    id: 'action-score-risk-risk',
    label: 'Score Risk Level',
    level: 'action',
    products: ['risk'],
    children: [],
    parents: ['step-scan-transactions-risk']
  },
  'action-create-alert-risk': {
    id: 'action-create-alert-risk',
    label: 'Create Suspicious Activity Alert',
    level: 'action',
    products: ['risk'],
    children: [],
    parents: ['step-flag-suspicious-risk']
  },
  'action-escalate-case-risk': {
    id: 'action-escalate-case-risk',
    label: 'Escalate to Investigation',
    level: 'action',
    products: ['risk'],
    children: [],
    parents: ['step-flag-suspicious-risk']
  },
  'action-apply-rules-risk': {
    id: 'action-apply-rules-risk',
    label: 'Apply Fraud Rules',
    level: 'action',
    products: ['risk'],
    children: [],
    parents: ['step-analyze-patterns-risk']
  },
  'action-ml-analysis-risk': {
    id: 'action-ml-analysis-risk',
    label: 'Machine Learning Analysis',
    level: 'action',
    products: ['risk'],
    children: [],
    parents: ['step-analyze-patterns-risk']
  },
  'action-block-transaction-risk': {
    id: 'action-block-transaction-risk',
    label: 'Block Suspicious Transaction',
    level: 'action',
    products: ['risk'],
    children: [],
    parents: ['step-block-suspicious-risk']
  },
  'action-notify-customer-risk': {
    id: 'action-notify-customer-risk',
    label: 'Notify Customer of Block',
    level: 'action',
    products: ['risk'],
    children: [],
    parents: ['step-block-suspicious-risk']
  },

  // SHARED NODES (for cross-product scenarios)
  // These nodes represent rationalized/unified functionality across products
  // When rationalization is ON, these replace their duplicate counterparts
  
  // Shared identity verification step - rationalizes duplicate verification steps
  // This node replaces the duplicate verification steps when rationalization is ON

  // WORKFLOW LEVEL - Cross-product orchestration
  'workflow-kyc-onboarding': {
    id: 'workflow-kyc-onboarding',
    label: 'KYC & Onboarding Orchestration',
    level: 'workflow',
    children: ['outcome-accounts-cb', 'outcome-compliance-risk', 'outcome-investments-wealth'],
    parents: [],
    description: 'Complete customer onboarding across banking, wealth, and risk products'
  },
  'workflow-fraud-response': {
    id: 'workflow-fraud-response',
    label: 'Fraud Response Coordination',
    level: 'workflow',
    children: ['outcome-monitoring-risk', 'outcome-processing-payments', 'outcome-accounts-cb'],
    parents: [],
    description: 'Coordinate fraud detection and response across payments, accounts, and risk'
  },
  'workflow-lending-lifecycle': {
    id: 'workflow-lending-lifecycle',
    label: 'End-to-End Lending Workflow',
    level: 'workflow',
    children: ['outcome-origination-loans', 'outcome-compliance-risk', 'outcome-servicing-loans', 'outcome-accounts-cb'],
    parents: [],
    description: 'Orchestrate complete lending lifecycle from application to servicing'
  },
};