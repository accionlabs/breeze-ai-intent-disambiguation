// Healthcare Domain Configuration
// This file exports all configuration for the Healthcare domain

export * from './domain';
export * from './nodes';
export * from './queries';
export * from './contexts';

// Domain metadata
export const DOMAIN_METADATA = {
  id: 'healthcare',
  name: 'Unified Healthcare Platform',
  description: 'Integrated Patient Care & Medical Records System',
  version: '1.0.0',
  author: 'Breeze.AI',
  category: 'Healthcare',
  keywords: ['Patient Records', 'Appointments', 'Medical Billing', 'Prescriptions', 'Lab Results', 'Clinical Care']
};