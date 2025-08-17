// Domain metadata for display in the UI
export interface DomainMetadata {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  primaryColor: string;
  accentColor: string;
  logo?: string;
  company?: string;
  industry?: string;
  capabilities?: string[];
}

export const DOMAIN_METADATA: Record<string, DomainMetadata> = {
  'cision': {
    id: 'cision',
    name: 'Cision Nexus',
    tagline: 'Unified PR & Communications Intelligence',
    description: 'Multi-product rationalization across media monitoring, social listening, and PR distribution',
    category: 'PR & Communications',
    primaryColor: '#667eea',
    accentColor: '#764ba2',
    company: 'Cision',
    industry: 'Public Relations',
    capabilities: ['Media Monitoring', 'Press Release Distribution', 'Social Listening', 'Influencer Management', 'Analytics']
  },
  'healthcare': {
    id: 'healthcare',
    name: 'Unified Healthcare',
    tagline: 'Integrated Patient Care Platform',
    description: 'Multi-system integration across EHR, scheduling, billing, pharmacy, and laboratory',
    category: 'Healthcare',
    primaryColor: '#10b981',
    accentColor: '#059669',
    company: 'HealthTech Solutions',
    industry: 'Healthcare',
    capabilities: ['Patient Records', 'Appointments', 'Medical Billing', 'Prescriptions', 'Lab Results']
  },
  'ecommerce': {
    id: 'ecommerce',
    name: 'E-Commerce Platform',
    tagline: 'Multi-Channel Retail Operations',
    description: 'Integrated commerce across inventory, orders, fulfillment, and customer service',
    category: 'Retail & E-Commerce',
    primaryColor: '#f59e0b',
    accentColor: '#d97706',
    industry: 'Retail',
    capabilities: ['Inventory Management', 'Order Processing', 'Shipping', 'Customer Service', 'Analytics']
  },
  'financial': {
    id: 'financial',
    name: 'Financial Services',
    tagline: 'Comprehensive Banking Solutions',
    description: 'Unified financial management across accounts, investments, and transactions',
    category: 'Financial Services',
    primaryColor: '#3b82f6',
    accentColor: '#2563eb',
    industry: 'Finance',
    capabilities: ['Banking', 'Investments', 'Loans', 'Transactions', 'Reporting']
  }
};