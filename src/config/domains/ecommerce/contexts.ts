// Sample user contexts representing different e-commerce personas
import { UserContext } from '../../../types';

export const SAMPLE_CONTEXTS: Record<string, UserContext> = {
  'store-manager': {
    profile: {
      role: 'Store Manager',
      department: 'E-commerce Operations',
      seniority: 'Senior'
    },
    history: [],
    patterns: {
      productPreferences: {
        'storefront': 0.7,
        'inventory': 0.5,
        'crm': 0.3
      },
      workflowStage: 'Sales Management',
      domainFocus: ['Sales', 'Inventory', 'Customer Experience']
    }
  },
  'warehouse-supervisor': {
    profile: {
      role: 'Warehouse Supervisor',
      department: 'Fulfillment',
      seniority: 'Mid'
    },
    history: [],
    patterns: {
      productPreferences: {
        'inventory': 0.9,
        'storefront': 0.2,
        'crm': 0.1
      },
      workflowStage: 'Order Fulfillment',
      domainFocus: ['Stock Management', 'Shipping', 'Order Processing']
    }
  },
  'customer-success': {
    profile: {
      role: 'Customer Success Manager',
      department: 'Support',
      seniority: 'Mid'
    },
    history: [],
    patterns: {
      productPreferences: {
        'crm': 0.8,
        'storefront': 0.4,
        'inventory': 0.2
      },
      workflowStage: 'Customer Service',
      domainFocus: ['Support', 'Loyalty', 'Customer Data']
    }
  },
  'marketing-manager': {
    profile: {
      role: 'Marketing Manager',
      department: 'Marketing',
      seniority: 'Senior'
    },
    history: [],
    patterns: {
      productPreferences: {
        'storefront': 0.6,
        'crm': 0.7,
        'inventory': 0.1
      },
      workflowStage: 'Campaign Management',
      domainFocus: ['Promotions', 'Customer Segments', 'Analytics']
    }
  },
  'data-analyst': {
    profile: {
      role: 'Data Analyst',
      department: 'Business Intelligence',
      seniority: 'Junior'
    },
    history: [],
    patterns: {
      productPreferences: {
        'storefront': 0.5,
        'inventory': 0.5,
        'crm': 0.5
      },
      workflowStage: 'Analytics',
      domainFocus: ['Sales Analysis', 'Inventory Metrics', 'Customer Insights']
    }
  }
};

// Export for compatibility
export const USER_CONTEXTS = SAMPLE_CONTEXTS;