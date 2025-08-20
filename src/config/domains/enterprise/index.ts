// Enterprise Operations domain exports
export * from './domain';
export * from './nodes';
export * from './queries';
export * from './contexts';

// Domain metadata for registration
export const DOMAIN_METADATA = {
  id: 'enterprise',
  name: 'Enterprise Operations',
  description: 'Integrated enterprise systems with packaged and custom applications',
  version: '1.0.0',
  author: 'Breeze.AI',
  category: 'Enterprise Systems',
  keywords: [
    'ERP',
    'CRM',
    'SAP',
    'Salesforce',
    'Microsoft 365',
    'Business Intelligence',
    'Project Management',
    'Field Operations',
    'COTS',
    'Custom Applications',
    'System Integration',
    'Enterprise Software'
  ],
  capabilities: [
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
  ],
  industries: [
    'Manufacturing',
    'Financial Services',
    'Healthcare',
    'Retail',
    'Technology',
    'Professional Services'
  ]
};