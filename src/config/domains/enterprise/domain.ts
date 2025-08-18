// Domain-specific configuration for Enterprise Operations
// This domain showcases integration between packaged (COTS) and custom applications

// Domain information
export const DOMAIN_NAME = "Enterprise Operations";
export const DOMAIN_DESCRIPTION = "Integrated enterprise systems with packaged and custom applications";
export const COMPANY_NAME = "Global Enterprise Inc.";

// Product-specific colors for better visual distinction
// Standard product codes used throughout the application
export const PRODUCT_CODES = ['sap', 'salesforce', 'ms365', 'analytics', 'projects', 'fieldops'] as const;
export type ProductCode = typeof PRODUCT_CODES[number];

export const PRODUCT_COLORS = {
  'sap': '#1873B6',        // SAP Blue - ERP System
  'salesforce': '#00A1E0',  // Salesforce Blue - CRM
  'ms365': '#0078D4',       // Microsoft Blue - Collaboration
  'analytics': '#8B5CF6',   // Purple - Custom Analytics
  'projects': '#10B981',    // Green - Custom Projects
  'fieldops': '#F59E0B',    // Orange - Custom Field Ops
  'n/a': '#999'            // Gray - Not applicable
};

// Product names and descriptions
export const PRODUCTS = {
  'sap': {
    name: 'SAP ERP',
    description: 'Enterprise Resource Planning - Finance, Supply Chain, HR',
    abbreviation: 'SAP',
    type: 'packaged'
  },
  'salesforce': {
    name: 'Salesforce CRM',
    description: 'Customer Relationship Management - Sales & Service Cloud',
    abbreviation: 'SFDC',
    type: 'packaged'
  },
  'ms365': {
    name: 'Microsoft 365',
    description: 'Collaboration Suite - Teams, SharePoint, Power Platform',
    abbreviation: 'M365',
    type: 'packaged'
  },
  'analytics': {
    name: 'Analytics Platform',
    description: 'Custom Business Intelligence and Reporting System',
    abbreviation: 'ANLYT',
    type: 'custom'
  },
  'projects': {
    name: 'Project Hub',
    description: 'Custom Project Management and Resource Planning',
    abbreviation: 'PROJ',
    type: 'custom'
  },
  'fieldops': {
    name: 'Field Operations',
    description: 'Custom Mobile App for Field Service Management',
    abbreviation: 'FIELD',
    type: 'custom'
  }
};

// Helper function to get product color with fallback
export const getProductColor = (product: string): string => {
  const normalizedProduct = product.toLowerCase();
  if (normalizedProduct === 'n/a') {
    return PRODUCT_COLORS['n/a'];
  }
  return PRODUCT_COLORS[normalizedProduct as keyof typeof PRODUCT_COLORS] || PRODUCT_COLORS['n/a'];
};

// Domain-specific capabilities/features
export const DOMAIN_CAPABILITIES = [
  'Financial Management',
  'Customer Relationship Management',
  'Supply Chain Management',
  'Human Resources',
  'Business Intelligence',
  'Project Management',
  'Field Service',
  'Document Collaboration',
  'Workflow Automation',
  'Mobile Operations'
];

// Industry focus areas
export const INDUSTRY_VERTICALS = [
  'Manufacturing',
  'Financial Services',
  'Healthcare',
  'Retail',
  'Technology',
  'Professional Services'
];

// Domain-specific synonyms
export const DOMAIN_SYNONYMS = {
  'customer': ['client', 'account', 'prospect', 'lead', 'contact'],
  'order': ['purchase order', 'sales order', 'transaction', 'deal'],
  'employee': ['staff', 'resource', 'worker', 'user', 'team member'],
  'report': ['dashboard', 'analytics', 'metrics', 'KPI', 'insight'],
  'project': ['initiative', 'program', 'engagement', 'assignment'],
  'finance': ['accounting', 'financial', 'fiscal', 'monetary', 'budget']
};

// Word forms for stemming/matching
export const WORD_FORMS = {
  'analyze': 'analysis',
  'analyzing': 'analysis',
  'analyzed': 'analysis',
  'manage': 'management',
  'managing': 'management',
  'managed': 'management',
  'process': 'processing',
  'processed': 'processing',
  'processes': 'processing',
  'report': 'reporting',
  'reported': 'reporting',
  'reports': 'reporting',
  'integrate': 'integration',
  'integrating': 'integration',
  'integrated': 'integration'
};