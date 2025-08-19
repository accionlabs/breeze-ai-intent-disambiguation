// Resolution engine for intent disambiguation
// This file contains all the business logic for resolution calculation
// Separated from React components for better testability

import { FunctionalNode, Resolution, UserContext } from '../types';
import { GraphOperations } from './graphModel';
import { checkNodeDuplicateStatus } from './rationalizationProcessor';

export interface RecentAction {
  id: string;
  persona: string;
  intent: string;
  product: string;
  outcome: string;
  matchedNode: string;
  timestamp: Date;
  success: boolean;
  resolution: Resolution;
  toggleStates: {
    showRationalized: boolean;
    showWorkflows: boolean;
  };
}

/**
 * Calculate resolution for a given intent node
 * This is the core resolution logic extracted from the React component
 */
export function calculateResolution(
  entryNodeId: string, 
  context: UserContext | null,
  showRationalized: boolean,
  showWorkflows: boolean,
  recentActions: RecentAction[] = [],
  FUNCTIONAL_NODES: Record<string, FunctionalNode>,
  RATIONALIZED_NODE_ALTERNATIVES: Record<string, Record<string, string>>,
  graphOps: GraphOperations
): Resolution {
  
  // First check if this is a shared/rationalized node that requires rationalization to be on
  if (entryNodeId.includes('-shared') && !showRationalized) {
    // When rationalization is OFF but we have context, try to resolve using recent actions
    if (context && recentActions.length > 0) {
      // Look for alternatives based on recent actions
      const alternatives = RATIONALIZED_NODE_ALTERNATIVES[entryNodeId];
      
      if (alternatives) {
        // Count product usage in recent SUCCESSFUL actions (already filtered)
        const productWeights: Record<string, number> = {};
        
        recentActions.forEach((action: any) => {
          const product = action.product.toLowerCase();
          
          // Use product directly since we've standardized product codes
          if (product !== 'n/a') {
            productWeights[product] = (productWeights[product] || 0) + 1;
          }
        });
        
        // Find the most used product
        let bestProduct: string | null = null;
        let maxWeight = 0;
        
        for (const [product, weight] of Object.entries(productWeights)) {
          if (weight > maxWeight && alternatives[product]) {
            bestProduct = product;
            maxWeight = weight;
          }
        }
        
        // If we found a preferred product, redirect to that specific node
        if (bestProduct) {
          const specificNodeId = alternatives[bestProduct];
          const specificNode = FUNCTIONAL_NODES[specificNodeId];
          
          if (specificNode) {
            // Recursively call with the specific node
            const resolution = calculateResolution(specificNodeId, context, showRationalized, showWorkflows, recentActions, FUNCTIONAL_NODES, RATIONALIZED_NODE_ALTERNATIVES, graphOps);
            resolution.reasoning.unshift(`Context-based resolution: Selected ${bestProduct.toUpperCase()} based on recent usage (${maxWeight} recent actions)`);
            return resolution;
          }
        }
      }
    }
    
    // When rationalization is OFF and no context helps, shared nodes should ALWAYS fail
    // This demonstrates the problem of overlapping functions across products
    
    // Return unresolved - overlapping functions cannot be resolved
    return {
      entryNode: entryNodeId,
      traversalPath: { upward: [], downward: [] },
      selectedActions: [],
      productActivation: [],
      confidenceScore: 0,
      reasoning: ['Resolution failed: Overlapping functions in multiple products - no clear resolution possible. Enable rationalization to unify duplicate functionality.']
    };
  }
  
  const entryNode = FUNCTIONAL_NODES[entryNodeId];
  
  // Check if the node exists
  if (!entryNode) {
    return {
      entryNode: entryNodeId,
      traversalPath: { upward: [], downward: [] },
      selectedActions: [],
      productActivation: [],
      confidenceScore: 0,
      reasoning: ['Resolution failed: Entry node not found']
    };
  }
  
  // Track if we resolved ambiguity using context
  let contextResolvedAmbiguity = false;
  let contextMessage = '';
  
  // When rationalization is OFF, check for duplicates in two ways:
  // 1. Direct duplicates (same label as entry node)
  // 2. Ancestor duplicates (parent nodes that have duplicates)
  if (!showRationalized && !entryNodeId.includes('-shared') && !entryNodeId.includes('-workflow')) {
    // Find all nodes with the same label (potential duplicates)
    const sameLabel = entryNode.label.toLowerCase();
    const duplicateNodes = Object.keys(FUNCTIONAL_NODES).filter((nodeId: string) => {
      const node = FUNCTIONAL_NODES[nodeId];
      return node && 
             node.label.toLowerCase() === sameLabel &&
             !nodeId.includes('-shared') &&
             nodeId !== entryNodeId;  // Don't count the current node
    });
    
    console.log('[DuplicateDetection] Entry node:', entryNodeId, 'label:', sameLabel);
    console.log('[DuplicateDetection] Found duplicate nodes:', duplicateNodes);
    
    // Use helper function to check for duplicates in this node or ancestors
    const duplicateCheck = checkNodeDuplicateStatus(
      entryNodeId, 
      FUNCTIONAL_NODES, 
      RATIONALIZED_NODE_ALTERNATIVES
    );
    
    console.log('[DuplicateDetection] Duplicate check result:', duplicateCheck);
    
    if (duplicateCheck.isDuplicate && duplicateCheck.duplicateAncestor) {
      // Find all duplicate nodes for the ancestor
      const ancestorLabel = FUNCTIONAL_NODES[duplicateCheck.duplicateAncestor].label.toLowerCase();
      const ancestorDuplicates = Object.keys(FUNCTIONAL_NODES).filter((nodeId: string) => {
        const node = FUNCTIONAL_NODES[nodeId];
        return node && 
               node.label.toLowerCase() === ancestorLabel &&
               !nodeId.includes('-shared');
      });
      
      console.log('[DuplicateDetection] Ancestor duplicates:', ancestorDuplicates);
      
      // Get product mappings for all duplicates
      const productDuplicates = ancestorDuplicates.map(nodeId => {
        const ancestors = graphOps.getAncestors(nodeId);
        const pathToRoot = [nodeId, ...ancestors];
        const products: string[] = [];
        pathToRoot.forEach((id: string) => {
          const node = FUNCTIONAL_NODES[id];
          if (node?.products) {
            node.products.forEach((p: string) => {
              if (p && p !== 'n/a' && !products.includes(p)) {
                products.push(p);
              }
            });
          }
        });
        
        return {
          nodeId,
          product: products.length > 0 ? products[0] : 'unknown'
        };
      });
      
      console.log('[DuplicateDetection] Product duplicates:', productDuplicates);
      
      // Check if we can resolve with context
      if (context && recentActions.length > 0) {
        // Count product usage in recent SUCCESSFUL actions
        const productWeights: Record<string, number> = {};
        
        recentActions.forEach((action: any) => {
          const product = action.product.toLowerCase();
          if (product !== 'n/a') {
            productWeights[product] = (productWeights[product] || 0) + 1;
          }
        });
        
        console.log('[ContextResolution] Product weights from recent actions:', productWeights);
        
        // Find which product path matches our current entry node
        const entryAncestors = graphOps.getAncestors(entryNodeId);
        const entryPathToRoot = [entryNodeId, ...entryAncestors];
        const entryProducts: string[] = [];
        entryPathToRoot.forEach((id: string) => {
          const node = FUNCTIONAL_NODES[id];
          if (node?.products) {
            node.products.forEach((p: string) => {
              if (p && p !== 'n/a' && !entryProducts.includes(p)) {
                entryProducts.push(p);
              }
            });
          }
        });
        
        const entryProduct = entryProducts.length > 0 ? entryProducts[0].toLowerCase() : null;
        
        console.log('[ContextResolution] Entry node product:', entryProduct);
        console.log('[ContextResolution] Entry path products:', entryProducts);
        
        // Check if our current path's product has weight from recent actions
        if (entryProduct && productWeights[entryProduct] > 0) {
          const totalWeight = Object.values(productWeights).reduce((sum, w) => sum + w, 0);
          const percentage = Math.round((productWeights[entryProduct] / totalWeight) * 100);
          
          console.log('[ContextResolution] Can resolve - product', entryProduct, 'has weight', productWeights[entryProduct], `(${percentage}% of recent actions)`);
          
          contextResolvedAmbiguity = true;
          contextMessage = `Context-based resolution: Selected ${entryProduct.toUpperCase()} path based on ${percentage}% usage in recent actions`;
        } else {
          console.log('[ContextResolution] Cannot resolve - no matching product weight for', entryProduct);
          
          // Return unresolved due to ambiguity
          const duplicateProducts = productDuplicates.map(d => d.product.toUpperCase()).join(', ');
          return {
            entryNode: entryNodeId,
            traversalPath: { upward: [], downward: [] },
            selectedActions: [],
            productActivation: [],
            confidenceScore: 0,
            reasoning: [`Resolution failed: Ambiguity detected - "${FUNCTIONAL_NODES[duplicateCheck.duplicateAncestor].label}" found in multiple products (${duplicateProducts}). Enable context or rationalization to resolve.`]
          };
        }
      } else {
        // No context available - return unresolved
        const duplicateProducts = productDuplicates.map(d => d.product.toUpperCase()).join(', ');
        return {
          entryNode: entryNodeId,
          traversalPath: { upward: [], downward: [] },
          selectedActions: [],
          productActivation: [],
          confidenceScore: 0,
          reasoning: [`Resolution failed: Ambiguity detected - "${FUNCTIONAL_NODES[duplicateCheck.duplicateAncestor].label}" found in multiple products (${duplicateProducts}). Enable context or rationalization to resolve.`]
        };
      }
    }
  }
  
  // Special handling for workflow nodes
  if (entryNodeId.includes('-workflow')) {
    if (!showWorkflows) {
      return {
        entryNode: entryNodeId,
        traversalPath: { upward: [], downward: [] },
        selectedActions: [],
        productActivation: [],
        confidenceScore: 0,
        reasoning: ['Resolution failed: Workflow orchestration is disabled. Enable workflows to access cross-product coordination.']
      };
    }
    
    // Workflow nodes are always at the outcome level and traverse downward
    const downwardPath = graphOps.getDescendants(entryNodeId);
    const allActions = downwardPath.filter((nodeId: string) => {
      const node = FUNCTIONAL_NODES[nodeId];
      return node && node.level === 'action';
    });
    
    // Get unique products involved
    const productsInvolved = new Set<string>();
    allActions.forEach((actionId: string) => {
      const ancestors = graphOps.getAncestors(actionId);
      const pathToRoot = [actionId, ...ancestors];
      pathToRoot.forEach((nodeId: string) => {
        const node = FUNCTIONAL_NODES[nodeId];
        if (node?.products) {
          node.products.forEach((p: string) => {
            if (p && p !== 'n/a') {
              productsInvolved.add(p);
            }
          });
        }
      });
    });
    
    return {
      entryNode: entryNodeId,
      traversalPath: { 
        upward: [],
        downward: downwardPath 
      },
      selectedActions: allActions,
      productActivation: Array.from(productsInvolved).map(product => ({
        product,
        priority: 'primary' as const,
        actions: allActions.filter((actionId: string) => {
          const node = FUNCTIONAL_NODES[actionId];
          return node?.products?.includes(product);
        })
      })),
      confidenceScore: 1,
      reasoning: [
        'Cross-product workflow orchestration enabled',
        `Coordinating across ${productsInvolved.size} products: ${Array.from(productsInvolved).join(', ')}`,
        `${allActions.length} actions orchestrated in workflow`
      ]
    };
  }
  
  // Standard resolution logic for both rationalized and non-rationalized nodes
  // When rationalized is on, shared nodes are already handled in the FUNCTIONAL_NODES
  const nodeType = entryNode.level;
  let upwardPath: string[] = [];
  let downwardPath: string[] = [];
  let selectedActions: any[] = [];
  let reasoning: string[] = [];
  
  // Determine traversal based on node type
  switch (nodeType) {
    case 'workflow':
      // Workflow nodes are like outcomes - traverse downward to find all actions
      downwardPath = graphOps.getDescendants(entryNodeId);
      selectedActions = downwardPath.filter((nodeId: string) => {
        const node = FUNCTIONAL_NODES[nodeId];
        return node && node.level === 'action';
      });
      reasoning.push(`Starting from workflow: "${entryNode.label}"`);
      reasoning.push(`Traversed downward through ${downwardPath.length} nodes`);
      break;
      
    case 'outcome':
      // From outcome, traverse downward to find all actions
      downwardPath = graphOps.getDescendants(entryNodeId);
      selectedActions = downwardPath.filter((nodeId: string) => {
        const node = FUNCTIONAL_NODES[nodeId];
        return node && node.level === 'action';
      });
      reasoning.push(`Starting from outcome: "${entryNode.label}"`);
      reasoning.push(`Traversed downward through ${downwardPath.length} nodes`);
      break;
      
    case 'scenario':
      // From scenario, traverse up to outcome and down to actions
      upwardPath = graphOps.getAncestors(entryNodeId); // Already excludes self
      downwardPath = graphOps.getDescendants(entryNodeId);
      selectedActions = downwardPath.filter((nodeId: string) => {
        const node = FUNCTIONAL_NODES[nodeId];
        return node && node.level === 'action';
      });
      reasoning.push(`Starting from scenario: "${entryNode.label}"`);
      reasoning.push(`Traversed upward through ${upwardPath.length} nodes to outcome`);
      reasoning.push(`Traversed downward through ${downwardPath.length} nodes to actions`);
      break;
      
    case 'step':
      // From step, traverse up to outcome and down to actions
      upwardPath = graphOps.getAncestors(entryNodeId); // Already excludes self
      downwardPath = graphOps.getDescendants(entryNodeId);
      selectedActions = downwardPath.filter((nodeId: string) => {
        const node = FUNCTIONAL_NODES[nodeId];
        return node && node.level === 'action';
      });
      reasoning.push(`Starting from step: "${entryNode.label}"`);
      reasoning.push(`Traversed upward through ${upwardPath.length} nodes to outcome`);
      reasoning.push(`Traversed downward through ${downwardPath.length} nodes to actions`);
      break;
      
    case 'action':
      // From action, traverse up to outcome
      upwardPath = graphOps.getAncestors(entryNodeId); // Already excludes self
      selectedActions = [entryNodeId];
      reasoning.push(`Starting from action: "${entryNode.label}"`);
      reasoning.push(`Traversed upward through ${upwardPath.length} nodes to outcome`);
      break;
      
    default:
      reasoning.push(`Unknown node type: ${nodeType}`);
  }
  
  // Determine product activation
  const productMap: Record<string, string[]> = {};
  
  // Collect products and their associated actions
  selectedActions.forEach((actionId: string) => {
    const node = FUNCTIONAL_NODES[actionId];
    if (node?.products) {
      node.products.forEach((p: string) => {
        if (p && p !== 'n/a') {
          if (!productMap[p]) {
            productMap[p] = [];
          }
          productMap[p].push(actionId);
        }
      });
    }
  });
  
  // Convert to productActivation format
  const productActivation = Object.entries(productMap).map(([product, actions]) => ({
    product,
    priority: 'primary' as const,
    actions
  }));
  
  // Add context resolution message if applicable
  if (contextResolvedAmbiguity) {
    reasoning.unshift(contextMessage);
  }
  
  // Add final summary
  reasoning.push(`Selected ${selectedActions.length} actions for execution`);
  if (productActivation.length > 0) {
    reasoning.push(`Activating products: ${productActivation.map(p => p.product).join(', ')}`);
  }
  
  // Add context information
  if (!context) {
    reasoning.push('No user context available');
  } else if (recentActions.length > 0) {
    const recentProducts = recentActions.map(a => a.product).filter(p => p !== 'n/a');
    const uniqueProducts = Array.from(new Set(recentProducts));
    reasoning.push(`Context: Recent activity in ${uniqueProducts.join(', ')}`);
  }
  
  return {
    entryNode: entryNodeId,
    traversalPath: {
      upward: upwardPath,
      downward: downwardPath
    },
    selectedActions: selectedActions,
    productActivation,
    confidenceScore: selectedActions.length > 0 ? 1 : 0,
    reasoning
  };
}