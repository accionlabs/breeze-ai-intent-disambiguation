// Main configuration export file for the Intent Disambiguation system
// Dynamically loads domain configuration based on URL

import { convertLegacyNodes, GraphOperations } from '../utils/graphModel';

// Re-export all types from the types folder
export * from '../types';

// Re-export theme (domain-agnostic)
export { LEVEL_COLORS, LEVEL_DESCRIPTIONS, LAYOUT, UI_LAYOUT, DISPLAY_LIMITS, BUTTON_COLORS } from './theme';

// Function to get current domain from URL
const getCurrentDomainId = (): string => {
  const path = window.location.pathname;
  if (path.includes('/intent-disambiguation/')) {
    const domainId = path.split('/intent-disambiguation/')[1]?.split('/')[0];
    return domainId || 'cision';
  }
  return 'cision'; // Default domain
};

// Dynamically import domain configuration
const domainId = getCurrentDomainId();
let domainConfig: any = {};

// Load domain synchronously (this is a workaround for now)
if (domainId === 'healthcare') {
  domainConfig = require('./domains/healthcare');
} else {
  domainConfig = require('./domains/cision');
}

// Re-export domain configuration
export const DOMAIN_NAME = domainConfig.DOMAIN_NAME;
export const DOMAIN_DESCRIPTION = domainConfig.DOMAIN_DESCRIPTION;
export const COMPANY_NAME = domainConfig.COMPANY_NAME;
export const PRODUCTS = domainConfig.PRODUCTS;
export const PRODUCT_CODES = domainConfig.PRODUCT_CODES;
export const PRODUCT_COLORS = domainConfig.PRODUCT_COLORS;
export const getProductColor = domainConfig.getProductColor;
export const DOMAIN_CAPABILITIES = domainConfig.DOMAIN_CAPABILITIES;
export const INDUSTRY_VERTICALS = domainConfig.INDUSTRY_VERTICALS;
export const DOMAIN_SYNONYMS = domainConfig.DOMAIN_SYNONYMS;
export const WORD_FORMS = domainConfig.WORD_FORMS;
export const FUNCTIONAL_NODES = domainConfig.FUNCTIONAL_NODES;
export const USER_INTENTS = domainConfig.USER_INTENTS;
export const EXAMPLE_QUERIES = domainConfig.EXAMPLE_QUERIES;
export const INTENT_INPUT_PLACEHOLDER = domainConfig.INTENT_INPUT_PLACEHOLDER;
export const SAMPLE_CONTEXTS = domainConfig.SAMPLE_CONTEXTS;
export const RATIONALIZED_NODE_ALTERNATIVES = domainConfig.RATIONALIZED_NODE_ALTERNATIVES;
export const DUPLICATE_NODES = domainConfig.DUPLICATE_NODES;
export const SHARED_NODES = domainConfig.SHARED_NODES;

// Create and export the functional graph
export const FUNCTIONAL_GRAPH = convertLegacyNodes(domainConfig.FUNCTIONAL_NODES);
export const graphOps = new GraphOperations(FUNCTIONAL_GRAPH);