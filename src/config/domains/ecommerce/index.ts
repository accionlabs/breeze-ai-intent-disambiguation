// E-commerce Domain Configuration
// This file exports all configuration for the E-commerce domain

export * from './domain';
export * from './nodes';
export * from './intents';
export * from './contexts';

// Domain metadata
export const DOMAIN_METADATA = {
  id: 'ecommerce',
  name: 'E-commerce Platform',
  description: 'Simplified e-commerce demo with clear product overlaps',
  version: '1.0.0',
  author: 'Breeze.AI',
  category: 'Retail & E-Commerce',
  keywords: ['Product Search', 'Order Processing', 'Customer Profiles', 'Inventory', 'Shopping Cart']
};