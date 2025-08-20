// Financial Services domain exports
import { FUNCTIONAL_NODES } from './nodes';
import { USER_QUERIES } from './queries';
import { USER_CONTEXTS } from './contexts';

export * from './domain';
export { FUNCTIONAL_NODES } from './nodes';
export { USER_QUERIES } from './queries';
export { USER_CONTEXTS, CONTEXT_RULES, SAMPLE_CONTEXTS } from './contexts';

// Rationalized node alternatives will be generated automatically
// The system will detect duplicate nodes and create shared versions dynamically

// Domain configuration summary
export const DOMAIN_INFO = {
  id: 'financial',
  name: 'Financial Services',
  description: 'Unified financial services platform with integrated banking, investment, and payment solutions',
  products: ['core-banking', 'wealth', 'loans', 'payments', 'risk'],
  capabilities: [
    'Account Management',
    'Investment & Wealth Management',
    'Loan Origination & Servicing',
    'Payment Processing',
    'Risk & Compliance Management'
  ],
  statistics: {
    totalNodes: Object.keys(FUNCTIONAL_NODES).length,
    sharedNodes: Object.keys(FUNCTIONAL_NODES).filter(id => id.includes('-shared')).length,
    querys: USER_QUERIES.length,
    contexts: USER_CONTEXTS.length
  }
};