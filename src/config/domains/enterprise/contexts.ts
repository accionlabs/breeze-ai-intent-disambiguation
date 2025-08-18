// User contexts and personas for Enterprise Operations domain
import { UserContext } from '../../../types';

// Define enterprise personas representing different roles in the organization
export const SAMPLE_CONTEXTS: Record<string, UserContext> = {
  'cfo': {
    profile: {
      role: 'Chief Financial Officer',
      department: 'Finance',
      seniority: 'Executive'
    },
    history: [],
    patterns: {
      productPreferences: {
        'sap': 0.45,        // Heavy ERP user for financials
        'analytics': 0.35,   // Business intelligence focus
        'ms365': 0.15,      // Executive presentations
        'salesforce': 0.05,  // Revenue visibility
        'projects': 0.0,
        'fieldops': 0.0
      },
      workflowStage: 'Strategic Planning',
      domainFocus: [
        'Financial Reporting',
        'Budget Management',
        'Risk Assessment',
        'Compliance',
        'Executive Dashboards'
      ]
    }
  },

  'sales-manager': {
    profile: {
      role: 'Regional Sales Manager',
      department: 'Sales',
      seniority: 'Senior'
    },
    history: [],
    patterns: {
      productPreferences: {
        'salesforce': 0.50,  // Primary CRM user
        'analytics': 0.20,   // Sales analytics
        'ms365': 0.15,      // Collaboration
        'sap': 0.10,        // Order processing
        'fieldops': 0.05,   // Field team coordination
        'projects': 0.0
      },
      workflowStage: 'Customer Acquisition',
      domainFocus: [
        'Pipeline Management',
        'Customer Relationships',
        'Sales Forecasting',
        'Team Performance',
        'Order Processing'
      ]
    }
  },

  'operations-director': {
    profile: {
      role: 'Director of Operations',
      department: 'Operations',
      seniority: 'Senior'
    },
    history: [],
    patterns: {
      productPreferences: {
        'sap': 0.40,        // Supply chain & operations
        'fieldops': 0.25,   // Field operations
        'projects': 0.15,   // Process improvement projects
        'analytics': 0.15,  // Operational analytics
        'ms365': 0.05,      // Documentation
        'salesforce': 0.0
      },
      workflowStage: 'Process Management',
      domainFocus: [
        'Supply Chain Management',
        'Inventory Control',
        'Process Optimization',
        'Quality Control',
        'Field Operations'
      ]
    }
  },

  'project-manager': {
    profile: {
      role: 'Senior Project Manager',
      department: 'PMO',
      seniority: 'Senior'
    },
    history: [],
    patterns: {
      productPreferences: {
        'projects': 0.45,   // Primary project management
        'ms365': 0.30,      // Collaboration & docs
        'analytics': 0.15,  // Project analytics
        'sap': 0.05,        // Resource planning
        'salesforce': 0.05, // Customer projects
        'fieldops': 0.0
      },
      workflowStage: 'Project Execution',
      domainFocus: [
        'Project Planning',
        'Resource Allocation',
        'Timeline Management',
        'Document Collaboration',
        'Risk Management'
      ]
    }
  },

  'hr-manager': {
    profile: {
      role: 'Human Resources Manager',
      department: 'Human Resources',
      seniority: 'Senior'
    },
    history: [],
    patterns: {
      productPreferences: {
        'sap': 0.40,        // HR module in ERP
        'ms365': 0.35,      // Employee communication
        'analytics': 0.15,  // HR analytics
        'projects': 0.10,   // HR initiatives
        'salesforce': 0.0,
        'fieldops': 0.0
      },
      workflowStage: 'Talent Management',
      domainFocus: [
        'Employee Management',
        'Recruitment',
        'Performance Management',
        'Benefits Administration',
        'Training & Development'
      ]
    }
  },

  'field-technician': {
    profile: {
      role: 'Senior Field Technician',
      department: 'Field Services',
      seniority: 'Mid-level'
    },
    history: [],
    patterns: {
      productPreferences: {
        'fieldops': 0.60,   // Primary field app user
        'sap': 0.15,        // Work orders & parts
        'salesforce': 0.15, // Customer info
        'ms365': 0.10,      // Documentation
        'analytics': 0.0,
        'projects': 0.0
      },
      workflowStage: 'Service Delivery',
      domainFocus: [
        'Work Order Management',
        'Customer Service',
        'Parts & Inventory',
        'Route Optimization',
        'Service Documentation'
      ]
    }
  },

  'data-analyst': {
    profile: {
      role: 'Senior Data Analyst',
      department: 'Business Intelligence',
      seniority: 'Senior'
    },
    history: [],
    patterns: {
      productPreferences: {
        'analytics': 0.60,  // Primary BI platform
        'sap': 0.15,        // Source data
        'salesforce': 0.15, // CRM data
        'ms365': 0.10,      // Report distribution
        'projects': 0.0,
        'fieldops': 0.0
      },
      workflowStage: 'Data Analysis',
      domainFocus: [
        'Business Intelligence',
        'Data Integration',
        'Report Generation',
        'Predictive Analytics',
        'Dashboard Creation'
      ]
    }
  },

  'it-manager': {
    profile: {
      role: 'IT Manager',
      department: 'Information Technology',
      seniority: 'Senior'
    },
    history: [],
    patterns: {
      productPreferences: {
        'ms365': 0.30,      // IT collaboration & admin
        'sap': 0.20,        // ERP administration
        'salesforce': 0.15, // CRM administration
        'analytics': 0.15,  // System monitoring
        'projects': 0.15,   // IT projects
        'fieldops': 0.05    // Mobile app support
      },
      workflowStage: 'System Management',
      domainFocus: [
        'System Integration',
        'User Management',
        'Security & Access',
        'Infrastructure',
        'Application Support'
      ]
    }
  },

  'marketing-director': {
    profile: {
      role: 'Marketing Director',
      department: 'Marketing',
      seniority: 'Senior'
    },
    history: [],
    patterns: {
      productPreferences: {
        'salesforce': 0.35, // Marketing automation
        'analytics': 0.30,  // Marketing analytics
        'ms365': 0.20,      // Content collaboration
        'projects': 0.15,   // Campaign projects
        'sap': 0.0,
        'fieldops': 0.0
      },
      workflowStage: 'Campaign Execution',
      domainFocus: [
        'Campaign Management',
        'Lead Generation',
        'Brand Management',
        'Content Creation',
        'Marketing Analytics'
      ]
    }
  },

  'supply-chain-manager': {
    profile: {
      role: 'Supply Chain Manager',
      department: 'Supply Chain',
      seniority: 'Senior'
    },
    history: [],
    patterns: {
      productPreferences: {
        'sap': 0.50,        // Supply chain modules
        'analytics': 0.25,  // Supply chain analytics
        'fieldops': 0.15,   // Logistics coordination
        'projects': 0.05,   // Supply chain projects
        'ms365': 0.05,      // Documentation
        'salesforce': 0.0
      },
      workflowStage: 'Supply Chain Planning',
      domainFocus: [
        'Inventory Management',
        'Procurement',
        'Logistics',
        'Demand Planning',
        'Supplier Management'
      ]
    }
  }
};

// Export for compatibility with existing code
export const USER_CONTEXTS = SAMPLE_CONTEXTS;

// Helper function to get persona display name
export const getPersonaDisplayName = (personaKey: string): string => {
  const persona = SAMPLE_CONTEXTS[personaKey];
  if (!persona) return personaKey;
  return persona.profile.role;
};

// Helper function to get persona's primary product
export const getPrimaryProduct = (personaKey: string): string => {
  const persona = SAMPLE_CONTEXTS[personaKey];
  if (!persona) return 'unknown';
  
  const preferences = persona.patterns.productPreferences;
  let maxPreference = 0;
  let primaryProduct = '';
  
  for (const [product, preference] of Object.entries(preferences)) {
    if (preference > maxPreference) {
      maxPreference = preference;
      primaryProduct = product;
    }
  }
  
  return primaryProduct;
};

// Helper function to get personas by department
export const getPersonasByDepartment = (department: string): string[] => {
  return Object.keys(SAMPLE_CONTEXTS).filter(key => 
    SAMPLE_CONTEXTS[key].profile.department === department
  );
};

// Helper function to get personas by seniority
export const getPersonasBySeniority = (seniority: string): string[] => {
  return Object.keys(SAMPLE_CONTEXTS).filter(key => 
    SAMPLE_CONTEXTS[key].profile.seniority === seniority
  );
};