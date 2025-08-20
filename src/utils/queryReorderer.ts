// Query Reorderer Utility
// Dynamically reorders queries based on node duplication status and hierarchy level

import { getDuplicateNodesFromAlternatives } from './rationalizationProcessor';

interface Query {
  id: string;
  text: string;
  entryNode: string;
  entryLevel: string;
  ambiguous?: boolean;
  products?: string[];
  requiresWorkflow?: boolean;
  group?: string;
}

interface ReorderedQueries {
  clearQueries: Query[];
  duplicateQueries: Query[];
  workflowQueries: Query[];
  allQueries: Query[];
}

// Level order for sorting
const LEVEL_ORDER = {
  'action': 1,
  'step': 2,
  'scenario': 3,
  'outcome': 4,
  'workflow': 5
};

/**
 * Check if a node or any of its ancestors are duplicate nodes
 */
function isNodeInDuplicateHierarchy(
  nodeId: string,
  nodes: Record<string, any>,
  duplicateNodes: Set<string>
): boolean {
  // Check if the node itself is a duplicate
  if (duplicateNodes.has(nodeId)) {
    return true;
  }
  
  // Check ancestors
  const node = nodes[nodeId];
  if (!node) return false;
  
  // Check all parents recursively
  if (node.parents && node.parents.length > 0) {
    for (const parentId of node.parents) {
      if (isNodeInDuplicateHierarchy(parentId, nodes, duplicateNodes)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Check if a node or any of its ancestors are shared/rationalized nodes
 */
function isNodeInSharedHierarchy(
  nodeId: string,
  nodes: Record<string, any>,
  sharedNodes: Set<string>
): boolean {
  // Check if the node itself is shared
  if (sharedNodes.has(nodeId)) {
    return true;
  }
  
  // Check ancestors
  const node = nodes[nodeId];
  if (!node) return false;
  
  // Check all parents recursively
  if (node.parents && node.parents.length > 0) {
    for (const parentId of node.parents) {
      if (isNodeInSharedHierarchy(parentId, nodes, sharedNodes)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Reorder queries based on duplication status and hierarchy level
 */
export function reorderQueries(
  queries: Query[],
  nodes: Record<string, any>,
  rationalizedNodeAlternatives?: Record<string, Record<string, string>>,
  sharedNodesList?: string[],
  duplicateNodesList?: string[]
): ReorderedQueries {
  // Use provided duplicate nodes list, or fall back to extracting from alternatives
  const duplicateNodes = new Set<string>(
    duplicateNodesList || 
    (rationalizedNodeAlternatives 
      ? getDuplicateNodesFromAlternatives(rationalizedNodeAlternatives)
      : [])
  );
  
  // Get shared nodes
  const sharedNodes = new Set<string>(sharedNodesList || []);
  
  // Classify queries into groups
  const clearQueries: Query[] = [];
  const duplicateQueries: Query[] = [];
  const workflowQueries: Query[] = [];
  
  // Enhance queries with products from nodes if not specified
  const enhancedQueries = queries.map(query => {
    // If query doesn't have products, try to get them from the node
    if (!query.products || query.products.length === 0) {
      const node = nodes[query.entryNode];
      if (node) {
        // First, check if the node itself has products
        if (node.products && node.products.length > 0) {
          return { ...query, products: node.products };
        }
        
        // If not, try to infer from children's products
        if (node.children && node.children.length > 0) {
          const childProducts = new Set<string>();
          node.children.forEach((childId: string) => {
            const childNode = nodes[childId];
            if (childNode && childNode.products) {
              childNode.products.forEach((p: string) => childProducts.add(p));
            }
          });
          if (childProducts.size > 0) {
            return { ...query, products: Array.from(childProducts) };
          }
        }
        
        // If still no products, try to infer from parents
        if (node.parents && node.parents.length > 0) {
          const parentProducts = new Set<string>();
          node.parents.forEach((parentId: string) => {
            const parentNode = nodes[parentId];
            if (parentNode && parentNode.products) {
              parentNode.products.forEach((p: string) => parentProducts.add(p));
            }
          });
          if (parentProducts.size > 0) {
            return { ...query, products: Array.from(parentProducts) };
          }
        }
      }
    }
    return query;
  });
  
  enhancedQueries.forEach(query => {
    // Skip if it's a workflow query
    if (query.entryLevel === 'workflow' || query.requiresWorkflow) {
      workflowQueries.push(query);
      return;
    }
    
    // Check if the entry node is in a duplicate or shared hierarchy
    const isInDuplicate = isNodeInDuplicateHierarchy(query.entryNode, nodes, duplicateNodes);
    const isInShared = isNodeInSharedHierarchy(query.entryNode, nodes, sharedNodes);
    
    // Note: We ignore the manual ambiguous flag and rely only on automatic detection
    if (isInDuplicate || isInShared) {
      duplicateQueries.push(query);
    } else {
      clearQueries.push(query);
    }
  });
  
  // Sort each group by level (action -> step -> scenario -> outcome)
  const sortByLevel = (a: Query, b: Query) => {
    const levelA = LEVEL_ORDER[a.entryLevel as keyof typeof LEVEL_ORDER] || 999;
    const levelB = LEVEL_ORDER[b.entryLevel as keyof typeof LEVEL_ORDER] || 999;
    return levelA - levelB;
  };
  
  clearQueries.sort(sortByLevel);
  duplicateQueries.sort(sortByLevel);
  workflowQueries.sort((a, b) => a.text.localeCompare(b.text)); // Sort workflows alphabetically
  
  // Combine all queries in order
  const allQueries = [...clearQueries, ...duplicateQueries, ...workflowQueries];
  
  return {
    clearQueries,
    duplicateQueries,
    workflowQueries,
    allQueries
  };
}

/**
 * Get query group label for display
 */
export function getQueryGroupLabel(query: Query, reorderedQueries: ReorderedQueries): string {
  if (reorderedQueries.clearQueries.includes(query)) {
    return 'Clear (Non-duplicate)';
  } else if (reorderedQueries.duplicateQueries.includes(query)) {
    return 'Duplicate/Ambiguous';
  } else if (reorderedQueries.workflowQueries.includes(query)) {
    return 'Cross-Product Workflow';
  }
  return 'Unknown';
}

/**
 * Get query level label for display
 */
export function getQueryLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    'action': 'Action',
    'step': 'Step',
    'scenario': 'Scenario',
    'outcome': 'Outcome',
    'workflow': 'Workflow'
  };
  return labels[level] || level;
}