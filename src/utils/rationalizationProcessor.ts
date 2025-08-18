// Rationalization Processor
// Automatically handles parent-child relationships when rationalization is toggled

import { FunctionalNode } from '../types';

interface RationalizationResult {
  processedNodes: Record<string, FunctionalNode>;
  duplicateChildren: string[];
  warnings: string[];
}

/**
 * Helper function to get rationalized node for a duplicate
 */
function getRationalizedNode(
  duplicateNodeId: string,
  RATIONALIZED_NODE_ALTERNATIVES: Record<string, Record<string, string>>
): string | null {
  for (const [rationalizedId, alternatives] of Object.entries(RATIONALIZED_NODE_ALTERNATIVES)) {
    for (const product in alternatives) {
      if (alternatives[product] === duplicateNodeId) {
        return rationalizedId;
      }
    }
  }
  return null;
}

/**
 * Get all duplicate nodes from RATIONALIZED_NODE_ALTERNATIVES
 * This eliminates the need for a separate DUPLICATE_NODES config
 */
export function getDuplicateNodesFromAlternatives(
  RATIONALIZED_NODE_ALTERNATIVES: Record<string, Record<string, string>>
): string[] {
  const duplicates = new Set<string>();
  
  // Extract all duplicate nodes from the alternatives mapping
  for (const alternatives of Object.values(RATIONALIZED_NODE_ALTERNATIVES)) {
    Object.values(alternatives).forEach(nodeId => duplicates.add(nodeId));
  }
  
  return Array.from(duplicates);
}

/**
 * Process nodes for rationalization, automatically handling parent-child relationships
 * @param originalNodes - The original functional nodes
 * @param showRationalized - Whether rationalization is enabled
 * @param RATIONALIZED_NODE_ALTERNATIVES - Map of shared nodes to their alternatives
 * @returns Processed nodes with adjusted relationships
 */
export function processRationalization(
  originalNodes: Record<string, FunctionalNode>,
  showRationalized: boolean,
  RATIONALIZED_NODE_ALTERNATIVES?: Record<string, Record<string, string>>
): RationalizationResult {
  const result: RationalizationResult = {
    processedNodes: { ...originalNodes },
    duplicateChildren: [],
    warnings: []
  };

  if (!showRationalized || !RATIONALIZED_NODE_ALTERNATIVES) {
    // When rationalization is OFF or no alternatives provided, return original nodes
    return result;
  }

  // When rationalization is ON, process the nodes
  const duplicateChildrenMap = new Map<string, Set<string>>();

  // Step 1: Build a map of shared nodes to their duplicate alternatives
  const sharedToDuplicates = new Map<string, string[]>();
  for (const [sharedId, alternatives] of Object.entries(RATIONALIZED_NODE_ALTERNATIVES)) {
    const duplicateIds = Object.values(alternatives);
    sharedToDuplicates.set(sharedId, duplicateIds);
  }

  // Step 2: For each shared node, collect ALL children from duplicate nodes
  sharedToDuplicates.forEach((duplicateIds, sharedId) => {
    const sharedNode = result.processedNodes[sharedId];
    if (!sharedNode) {
      result.warnings.push(`Shared node ${sharedId} not found in nodes`);
      return;
    }

    // Collect all unique children from duplicate nodes
    const allChildren = new Set<string>();
    const childrenByLabel = new Map<string, string[]>();

    for (const duplicateId of duplicateIds) {
      const duplicateNode = result.processedNodes[duplicateId];
      if (!duplicateNode) {
        result.warnings.push(`Duplicate node ${duplicateId} not found`);
        continue;
      }

      // Add each child to the set
      for (const childId of duplicateNode.children || []) {
        allChildren.add(childId);
        
        // Track children with same labels (potential duplicates)
        const childNode = result.processedNodes[childId];
        if (childNode) {
          const label = childNode.label.toLowerCase();
          if (!childrenByLabel.has(label)) {
            childrenByLabel.set(label, []);
          }
          childrenByLabel.get(label)!.push(childId);
        }
      }
    }

    // Step 3: Update the shared node's children to be the union
    sharedNode.children = Array.from(allChildren);

    // Step 4: Find duplicate children (same label, different products)
    childrenByLabel.forEach((childIds, label) => {
      if (childIds.length > 1) {
        // These are duplicate children that should be in DUPLICATE_NODES
        result.duplicateChildren.push(...childIds);
        
        // Store for deduplication
        if (!duplicateChildrenMap.has(label)) {
          duplicateChildrenMap.set(label, new Set());
        }
        childIds.forEach(id => duplicateChildrenMap.get(label)!.add(id));
      }
    });

    // Step 5: Update parent references for all children to point to shared node
    Array.from(allChildren).forEach(childId => {
      const childNode = result.processedNodes[childId];
      if (childNode) {
        // Replace duplicate parent references with shared parent
        const newParents = new Set<string>();
        
        for (const parentId of childNode.parents || []) {
          // Check if this parent is a duplicate that has a shared alternative
          const sharedParent = getRationalizedNode(parentId, RATIONALIZED_NODE_ALTERNATIVES);
          if (sharedParent) {
            newParents.add(sharedParent);
          } else {
            newParents.add(parentId);
          }
        }
        
        childNode.parents = Array.from(newParents);
      }
    });

    // Step 6: Hide duplicate nodes when rationalized
    // (This should be handled by the UI, but we can mark them)
    for (const duplicateId of duplicateIds) {
      const duplicateNode = result.processedNodes[duplicateId];
      if (duplicateNode) {
        // Add a flag or modify visibility
        // For now, we'll keep them in the data but the UI should filter them
      }
    }
  });

  // Remove duplicate entries from duplicateChildren
  result.duplicateChildren = Array.from(new Set(result.duplicateChildren));

  return result;
}

/**
 * Check if a node or any of its ancestors is a duplicate
 * This uses RATIONALIZED_NODE_ALTERNATIVES to determine duplicates automatically
 */
export function isNodeOrAncestorDuplicate(
  nodeId: string,
  nodes: Record<string, FunctionalNode>,
  RATIONALIZED_NODE_ALTERNATIVES?: Record<string, Record<string, string>>
): boolean {
  if (!RATIONALIZED_NODE_ALTERNATIVES) return false;
  
  // Get all duplicate nodes from alternatives
  const duplicateNodes = getDuplicateNodesFromAlternatives(RATIONALIZED_NODE_ALTERNATIVES);
  
  // Check if current node is a duplicate
  if (duplicateNodes.includes(nodeId)) {
    return true;
  }
  
  // Check ancestors
  let currentNode = nodes[nodeId];
  while (currentNode && currentNode.parents && currentNode.parents.length > 0) {
    // Check each parent
    for (const parentId of currentNode.parents) {
      if (duplicateNodes.includes(parentId)) {
        return true;
      }
    }
    
    // Move up to the next level (use first parent for traversal)
    const nextParentId = currentNode.parents[0];
    currentNode = nodes[nextParentId];
    if (!currentNode) break;
  }
  
  return false;
}

/**
 * Get all nodes that should be marked as duplicates
 * This includes top-level duplicates and any duplicate children
 */
export function getAllDuplicateNodes(
  nodes: Record<string, FunctionalNode>,
  RATIONALIZED_NODE_ALTERNATIVES?: Record<string, Record<string, string>>
): string[] {
  // Start with duplicates from alternatives
  const allDuplicates = new Set<string>(
    RATIONALIZED_NODE_ALTERNATIVES ? getDuplicateNodesFromAlternatives(RATIONALIZED_NODE_ALTERNATIVES) : []
  );
  
  // Find duplicate children by comparing nodes with same labels
  const nodesByLabel = new Map<string, string[]>();
  
  for (const [nodeId, node] of Object.entries(nodes)) {
    // Skip shared nodes
    if (nodeId.includes('-shared')) continue;
    
    const label = node.label.toLowerCase();
    if (!nodesByLabel.has(label)) {
      nodesByLabel.set(label, []);
    }
    nodesByLabel.get(label)!.push(nodeId);
  }
  
  // Add nodes with duplicate labels to the set
  nodesByLabel.forEach((nodeIds, label) => {
    if (nodeIds.length > 1) {
      // Check if they belong to different products
      const products = new Set<string>();
      for (const nodeId of nodeIds) {
        const node = nodes[nodeId];
        if (node && node.products) {
          node.products.forEach(p => products.add(p));
        }
      }
      
      // If they span multiple products, they're duplicates
      if (products.size > 1 || nodeIds.some(id => allDuplicates.has(id))) {
        nodeIds.forEach(id => allDuplicates.add(id));
      }
    }
  });
  
  return Array.from(allDuplicates);
}

/**
 * Validate rationalization configuration
 * Checks for consistency between shared nodes, duplicates, and alternatives
 */
export function validateRationalizationConfig(
  nodes: Record<string, FunctionalNode>,
  SHARED_NODES?: string[],
  RATIONALIZED_NODE_ALTERNATIVES?: Record<string, Record<string, string>>
): string[] {
  const errors: string[] = [];
  
  // Check that all shared nodes exist
  if (SHARED_NODES) {
    for (const sharedId of SHARED_NODES) {
      if (!nodes[sharedId]) {
        errors.push(`Shared node ${sharedId} is defined but doesn't exist in nodes`);
      }
    }
  }
  
  // Check that alternatives map correctly
  if (RATIONALIZED_NODE_ALTERNATIVES) {
    for (const [sharedId, alternatives] of Object.entries(RATIONALIZED_NODE_ALTERNATIVES)) {
      if (!nodes[sharedId]) {
        errors.push(`Rationalized node ${sharedId} doesn't exist`);
      }
      
      for (const [product, duplicateId] of Object.entries(alternatives)) {
        if (!nodes[duplicateId]) {
          errors.push(`Alternative node ${duplicateId} for product ${product} doesn't exist`);
        }
      }
    }
  }
  
  // Check for orphaned shared nodes (shared nodes not in alternatives)
  if (SHARED_NODES && RATIONALIZED_NODE_ALTERNATIVES) {
    for (const sharedId of SHARED_NODES) {
      if (!RATIONALIZED_NODE_ALTERNATIVES[sharedId]) {
        errors.push(`Shared node ${sharedId} has no alternatives defined`);
      }
    }
  }
  
  return errors;
}

/**
 * Automatically detect duplicate nodes based on labels and products
 */
export function detectDuplicateNodes(
  nodes: Record<string, FunctionalNode>
): Map<string, string[]> {
  const duplicateGroups = new Map<string, string[]>();
  const nodesByLabelAndLevel = new Map<string, string[]>();
  
  // Group nodes by label and level
  for (const [nodeId, node] of Object.entries(nodes)) {
    // Skip shared nodes
    if (nodeId.includes('-shared')) continue;
    
    const key = `${node.label.toLowerCase()}_${node.level}`;
    if (!nodesByLabelAndLevel.has(key)) {
      nodesByLabelAndLevel.set(key, []);
    }
    nodesByLabelAndLevel.get(key)!.push(nodeId);
  }
  
  // Find groups with duplicates
  nodesByLabelAndLevel.forEach((nodeIds, key) => {
    if (nodeIds.length > 1) {
      // Check if they're from different products
      const productSets = nodeIds.map(id => new Set(nodes[id].products || []));
      
      // If any nodes have different products, they're duplicates
      const allProductsIdentical = productSets.every(set => 
        productSets[0].size === set.size && 
        Array.from(productSets[0]).every(p => set.has(p))
      );
      
      if (!allProductsIdentical) {
        duplicateGroups.set(key, nodeIds);
      }
    }
  });
  
  return duplicateGroups;
}