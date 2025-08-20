// User context definitions for Financial Services domain
import { UserContext } from '../../../types';

// User contexts in the expected format
export const SAMPLE_CONTEXTS: Record<string, UserContext> = {
  'retail-customer': {
    profile: {
      role: 'Retail Banking Customer',
      department: 'Personal Banking',
      seniority: 'Standard'
    },
    history: [
      { 
        action: 'View Balance', 
        product: 'core-banking', 
        node: 'scenario-balance-inquiry-cb',
        timestamp: Date.parse('2024-01-15T10:00:00Z')
      },
      { 
        action: 'Transfer Funds', 
        product: 'core-banking',
        node: 'scenario-transfer-cb', 
        timestamp: Date.parse('2024-01-15T10:05:00Z')
      },
      { 
        action: 'Bill Payment', 
        product: 'payments',
        node: 'scenario-domestic-payments',
        timestamp: Date.parse('2024-01-15T10:10:00Z')
      }
    ],
    patterns: {
      workflowStage: 'active-banking',
      productPreferences: {
        'core-banking': 0.7,
        'payments': 0.3
      },
      domainFocus: ['daily-banking', 'payments']
    }
  },
  'wealth-client': {
    profile: {
      role: 'High Net Worth Client',
      department: 'Private Wealth',
      seniority: 'Premium'
    },
    history: [
      { 
        action: 'Portfolio Management', 
        product: 'wealth',
        node: 'scenario-portfolio-wealth',
        timestamp: Date.parse('2024-01-14T14:00:00Z')
      },
      { 
        action: 'Investment Trading', 
        product: 'wealth',
        node: 'scenario-trading-wealth',
        timestamp: Date.parse('2024-01-14T14:30:00Z')
      },
      { 
        action: 'Retirement Analysis', 
        product: 'wealth',
        node: 'scenario-retirement-wealth',
        timestamp: Date.parse('2024-01-14T15:00:00Z')
      }
    ],
    patterns: {
      workflowStage: 'wealth-growth',
      productPreferences: {
        'wealth': 0.8,
        'core-banking': 0.2
      },
      domainFocus: ['investments', 'retirement-planning']
    }
  },
  'business-owner': {
    profile: {
      role: 'Small Business Owner',
      department: 'Commercial Banking',
      seniority: 'Business'
    },
    history: [
      { 
        action: 'Loan Application', 
        product: 'loans',
        node: 'scenario-application-loans',
        timestamp: Date.parse('2024-01-13T09:00:00Z')
      },
      { 
        action: 'Merchant Payments', 
        product: 'payments',
        node: 'scenario-pos-payments',
        timestamp: Date.parse('2024-01-13T11:00:00Z')
      },
      { 
        action: 'Account Management', 
        product: 'core-banking',
        node: 'scenario-open-account-cb',
        timestamp: Date.parse('2024-01-13T16:00:00Z')
      }
    ],
    patterns: {
      workflowStage: 'business-growth',
      productPreferences: {
        'loans': 0.4,
        'payments': 0.3,
        'core-banking': 0.3
      },
      domainFocus: ['business-banking', 'lending', 'merchant-services']
    }
  },
  'financial-advisor': {
    profile: {
      role: 'Financial Advisor',
      department: 'Wealth Management',
      seniority: 'Professional'
    },
    history: [
      { 
        action: 'Wealth Advisory', 
        product: 'wealth',
        node: 'scenario-advisory-wealth',
        timestamp: Date.parse('2024-01-15T08:00:00Z')
      },
      { 
        action: 'Portfolio Management', 
        product: 'wealth',
        node: 'scenario-portfolio-wealth',
        timestamp: Date.parse('2024-01-15T09:00:00Z')
      },
      { 
        action: 'Regulatory Reporting', 
        product: 'risk',
        node: 'scenario-reporting-risk',
        timestamp: Date.parse('2024-01-15T11:00:00Z')
      }
    ],
    patterns: {
      workflowStage: 'client-management',
      productPreferences: {
        'wealth': 0.7,
        'risk': 0.3
      },
      domainFocus: ['advisory', 'portfolio-management', 'compliance']
    }
  },
  'compliance-officer': {
    profile: {
      role: 'Compliance Officer',
      department: 'Risk & Compliance',
      seniority: 'Senior'
    },
    history: [
      { 
        action: 'KYC Onboarding', 
        product: 'risk',
        node: 'scenario-kyc-risk',
        timestamp: Date.parse('2024-01-15T07:00:00Z')
      },
      { 
        action: 'Transaction Monitoring', 
        product: 'risk',
        node: 'scenario-transaction-monitoring-risk',
        timestamp: Date.parse('2024-01-15T08:00:00Z')
      },
      { 
        action: 'Regulatory Reporting', 
        product: 'risk',
        node: 'scenario-reporting-risk',
        timestamp: Date.parse('2024-01-15T10:00:00Z')
      },
      { 
        action: 'Fraud Detection', 
        product: 'risk',
        node: 'scenario-fraud-detection-risk',
        timestamp: Date.parse('2024-01-15T14:00:00Z')
      }
    ],
    patterns: {
      workflowStage: 'compliance-monitoring',
      productPreferences: {
        'risk': 0.9,
        'core-banking': 0.1
      },
      domainFocus: ['compliance', 'risk-management', 'audit']
    }
  },
  'loan-applicant': {
    profile: {
      role: 'Mortgage Applicant',
      department: 'Retail Lending',
      seniority: 'Standard'
    },
    history: [
      { 
        action: 'Loan Application', 
        product: 'loans',
        node: 'scenario-application-loans',
        timestamp: Date.parse('2024-01-10T10:00:00Z')
      },
      { 
        action: 'Provide Documents', 
        product: 'loans',
        node: 'step-verify-documents-loans',
        timestamp: Date.parse('2024-01-11T14:00:00Z')
      },
      { 
        action: 'Credit Assessment', 
        product: 'loans',
        node: 'scenario-underwriting-loans',
        timestamp: Date.parse('2024-01-12T09:00:00Z')
      }
    ],
    patterns: {
      workflowStage: 'loan-application',
      productPreferences: {
        'loans': 0.8,
        'core-banking': 0.2
      },
      domainFocus: ['mortgage', 'lending']
    }
  }
};

// Export as array for compatibility if needed
export const USER_CONTEXTS = Object.entries(SAMPLE_CONTEXTS).map(([id, context]) => ({
  id,
  ...context
}));

// Context-based rules for intent resolution
export const CONTEXT_RULES = {
  // Product affinity rules
  productAffinity: {
    'retail-customer': ['core-banking', 'payments'],
    'wealth-client': ['wealth', 'core-banking'],
    'business-owner': ['loans', 'payments', 'core-banking'],
    'financial-advisor': ['wealth', 'risk'],
    'compliance-officer': ['risk'],
    'loan-applicant': ['loans', 'core-banking']
  },
  
  // Default product for ambiguous querys
  defaultProduct: {
    'retail-customer': 'core-banking',
    'wealth-client': 'wealth',
    'business-owner': 'loans',
    'financial-advisor': 'wealth',
    'compliance-officer': 'risk',
    'loan-applicant': 'loans'
  },
  
  // Permission levels
  permissions: {
    'retail-customer': ['view-own', 'transact-own'],
    'wealth-client': ['view-own', 'transact-own', 'advisory-access'],
    'business-owner': ['view-business', 'transact-business', 'apply-credit'],
    'financial-advisor': ['view-client', 'manage-portfolio', 'generate-reports'],
    'compliance-officer': ['view-all', 'monitor-transactions', 'generate-compliance-reports'],
    'loan-applicant': ['view-own', 'submit-application']
  }
};