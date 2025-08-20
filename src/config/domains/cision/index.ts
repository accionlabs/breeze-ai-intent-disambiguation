// Cision Domain Configuration
// This file exports all configuration for the Cision PR/Communications domain

export * from './domain';
export * from './nodes';
export * from './queries';
export * from './contexts';

// Domain metadata
export const DOMAIN_METADATA = {
  id: 'cision',
  name: 'Cision Nexus',
  description: 'Unified PR and Communications Intelligence Platform',
  version: '1.0.0',
  author: 'Breeze.AI',
  category: 'PR & Communications',
  keywords: ['PR', 'media monitoring', 'social listening', 'press release', 'brand management']
};