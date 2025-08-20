// Domain-specific configuration for Financial Services platform
// This file contains all domain-specific constants for the financial domain

// Domain information
export const DOMAIN_NAME = "Unified Financial Services Platform";
export const DOMAIN_DESCRIPTION = "Integrated Banking, Investment & Payment Solutions";
export const COMPANY_NAME = "FinTech Global";

// Product-specific colors for better visual distinction
// Standard product codes used throughout the application
export const PRODUCT_CODES = ['core-banking', 'wealth', 'loans', 'payments', 'risk'] as const;
export type ProductCode = typeof PRODUCT_CODES[number];

export const PRODUCT_COLORS = {
  'core-banking': '#3b82f6',  // Blue - Core Banking (trust, stability)
  'wealth': '#10b981',         // Green - Wealth Management (growth, prosperity)
  'loans': '#f59e0b',          // Amber - Loan Origination (opportunity)
  'payments': '#8b5cf6',       // Purple - Payment Hub (speed, innovation)
  'risk': '#ef4444',           // Red - Risk Analytics (alertness, security)
  'n/a': '#999'                // Gray - Not applicable
};

// Product names and descriptions
export const PRODUCTS = {
  'core-banking': {
    name: 'CoreBanking',
    description: 'Core banking operations - accounts, transactions, deposits',
    abbreviation: 'CB'
  },
  'wealth': {
    name: 'WealthManager',
    description: 'Investment portfolio and wealth management platform',
    abbreviation: 'WM'
  },
  'loans': {
    name: 'LoanOrigination',
    description: 'Loan processing, underwriting, and servicing system',
    abbreviation: 'LO'
  },
  'payments': {
    name: 'PaymentHub',
    description: 'Payment processing, transfers, and clearing platform',
    abbreviation: 'PH'
  },
  'risk': {
    name: 'RiskAnalytics',
    description: 'Risk assessment, compliance, and fraud detection',
    abbreviation: 'RA'
  }
};

// Domain-specific configuration
export const DOMAIN_CONFIG = {
  // Feature flags
  features: {
    showWorkflows: false,
    showContextPanel: true,
    enableQueryResolution: true
  },
  // Layout configuration
  layout: {
    nodeWidth: 140,
    nodeHeight: 60,
    levelHeight: 120,
    horizontalSpacing: 160
  },
  // Visualization settings
  visualization: {
    defaultExpansionMode: 'single',
    enableOverlapRemoval: true,
    showNodeIds: false
  }
};

// Helper function to get product color
export const getProductColor = (product: string): string => {
  return PRODUCT_COLORS[product as keyof typeof PRODUCT_COLORS] || PRODUCT_COLORS['n/a'];
};

// Domain capabilities
export const DOMAIN_CAPABILITIES = [
  'Account Management',
  'Investment & Wealth Management',
  'Loan Origination & Servicing',
  'Payment Processing',
  'Risk Assessment & Compliance',
  'Fraud Detection & Prevention',
  'Regulatory Reporting',
  'Customer Onboarding (KYC/AML)',
  'Portfolio Analytics',
  'Financial Advisory Services'
];

// Industry verticals served
export const INDUSTRY_VERTICALS = [
  'Retail Banking',
  'Commercial Banking',
  'Investment Banking',
  'Wealth Management',
  'Insurance',
  'FinTech',
  'Payment Services',
  'Digital Banking'
];

// Domain-specific synonyms for better query matching
export const DOMAIN_SYNONYMS: Record<string, string[]> = {
  'transfer': ['send', 'move', 'wire', 'remit', 'pay'],
  'balance': ['amount', 'funds', 'money', 'available', 'total'],
  'account': ['profile', 'wallet', 'portfolio'],
  'payment': ['transaction', 'transfer', 'remittance'],
  'loan': ['credit', 'mortgage', 'advance', 'financing'],
  'invest': ['trade', 'buy', 'purchase', 'allocate'],
  'report': ['statement', 'summary', 'document', 'record'],
  'verify': ['confirm', 'validate', 'authenticate', 'check'],
  'fraud': ['suspicious', 'unauthorized', 'illegal', 'scam']
};

// Word forms for lemmatization
export const WORD_FORMS: Record<string, string> = {
  'transferred': 'transfer',
  'transferring': 'transfer',
  'transfers': 'transfer',
  'paid': 'pay',
  'paying': 'pay',
  'payments': 'payment',
  'invested': 'invest',
  'investing': 'invest',
  'investments': 'investment',
  'applied': 'apply',
  'applying': 'apply',
  'applications': 'application',
  'verified': 'verify',
  'verifying': 'verify',
  'verification': 'verify'
};

// Example queries for testing
export const EXAMPLE_QUERIES = [
  "transfer money to savings",
  "check my balance",
  "apply for a loan",
  "view investment portfolio",
  "report suspicious activity",
  "make a payment",
  "open new account",
  "generate tax report"
];

// Placeholder text for query input
export const QUERY_INPUT_PLACEHOLDER = "e.g., transfer funds to checking account";