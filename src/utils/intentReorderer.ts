// Intent Reorderer Utility
// Dynamically reorders intents based on node duplication status and hierarchy level

import { getDuplicateNodesFromAlternatives } from './rationalizationProcessor';

interface Intent {
  id: string;
  text: string;
  entryNode: string;
  entryLevel: string;
  ambiguous?: boolean;
  products?: string[];
  requiresWorkflow?: boolean;
  group?: string;
}

interface ReorderedIntents {
  clearIntents: Intent[];
  duplicateIntents: Intent[];
  workflowIntents: Intent[];
  allIntents: Intent[];
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
 * Reorder intents based on duplication status and hierarchy level
 */
export function reorderIntents(
  intents: Intent[],
  nodes: Record<string, any>,
  rationalizedNodeAlternatives?: Record<string, Record<string, string>>,
  sharedNodesList?: string[],
  duplicateNodesList?: string[]
): ReorderedIntents {
  // Use provided duplicate nodes list, or fall back to extracting from alternatives
  const duplicateNodes = new Set<string>(
    duplicateNodesList || 
    (rationalizedNodeAlternatives 
      ? getDuplicateNodesFromAlternatives(rationalizedNodeAlternatives)
      : [])
  );
  
  // Get shared nodes
  const sharedNodes = new Set<string>(sharedNodesList || []);
  
  // Classify intents into groups
  const clearIntents: Intent[] = [];
  const duplicateIntents: Intent[] = [];
  const workflowIntents: Intent[] = [];
  
  // Enhance intents with products from nodes if not specified
  const enhancedIntents = intents.map(intent => {
    // If intent doesn't have products, try to get them from the node
    if (!intent.products || intent.products.length === 0) {
      const node = nodes[intent.entryNode];
      if (node) {
        // First, check if the node itself has products
        if (node.products && node.products.length > 0) {
          return { ...intent, products: node.products };
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
            return { ...intent, products: Array.from(childProducts) };
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
            return { ...intent, products: Array.from(parentProducts) };
          }
        }
      }
    }
    return intent;
  });
  
  enhancedIntents.forEach(intent => {
    // Skip if it's a workflow intent
    if (intent.entryLevel === 'workflow' || intent.requiresWorkflow) {
      workflowIntents.push(intent);
      return;
    }
    
    // Check if the entry node is in a duplicate or shared hierarchy
    const isInDuplicate = isNodeInDuplicateHierarchy(intent.entryNode, nodes, duplicateNodes);
    const isInShared = isNodeInSharedHierarchy(intent.entryNode, nodes, sharedNodes);
    
    if (isInDuplicate || isInShared || intent.ambiguous) {
      duplicateIntents.push(intent);
    } else {
      clearIntents.push(intent);
    }
  });
  
  // Sort each group by level (action -> step -> scenario -> outcome)
  const sortByLevel = (a: Intent, b: Intent) => {
    const levelA = LEVEL_ORDER[a.entryLevel as keyof typeof LEVEL_ORDER] || 999;
    const levelB = LEVEL_ORDER[b.entryLevel as keyof typeof LEVEL_ORDER] || 999;
    return levelA - levelB;
  };
  
  clearIntents.sort(sortByLevel);
  duplicateIntents.sort(sortByLevel);
  workflowIntents.sort((a, b) => a.text.localeCompare(b.text)); // Sort workflows alphabetically
  
  // Combine all intents in order
  const allIntents = [...clearIntents, ...duplicateIntents, ...workflowIntents];
  
  return {
    clearIntents,
    duplicateIntents,
    workflowIntents,
    allIntents
  };
}

/**
 * Get intent group label for display
 */
export function getIntentGroupLabel(intent: Intent, reorderedIntents: ReorderedIntents): string {
  if (reorderedIntents.clearIntents.includes(intent)) {
    return 'Clear (Non-duplicate)';
  } else if (reorderedIntents.duplicateIntents.includes(intent)) {
    return 'Duplicate/Ambiguous';
  } else if (reorderedIntents.workflowIntents.includes(intent)) {
    return 'Cross-Product Workflow';
  }
  return 'Unknown';
}

/**
 * Get intent level label for display
 */
export function getIntentLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    'action': 'Action',
    'step': 'Step',
    'scenario': 'Scenario',
    'outcome': 'Outcome',
    'workflow': 'Workflow'
  };
  return labels[level] || level;
}