// Automatic Shared Node Generator
// Detects duplicate nodes and creates shared nodes dynamically when domains load

import { FunctionalNode, HierarchyLevel } from '../types';

interface DuplicateGroup {
  label: string;
  level: HierarchyLevel;
  nodeIds: string[];
  products: Set<string>;
}

interface SharedNodeGenerationResult {
  nodes: Record<string, FunctionalNode>;
  duplicateNodes: string[];
  sharedNodes: string[];
  mappings: Record<string, string[]>; // shared node id -> duplicate node ids
}

/**
 * Generate a deterministic ID for a shared node based on label and level
 */
function generateSharedNodeId(label: string, level: HierarchyLevel): string {
  // Convert label to a consistent format for ID
  const normalizedLabel = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return `${level}-${normalizedLabel}-shared`;
}

/**
 * Detect duplicate nodes based on label and level
 * Ignores nodes that already have -shared or -unified suffix
 */
export function detectDuplicateGroups(
  nodes: Record<string, FunctionalNode>
): DuplicateGroup[] {
  const groups = new Map<string, DuplicateGroup>();
  
  // Group nodes by label and level
  Object.entries(nodes).forEach(([nodeId, node]) => {
    // Skip nodes that are already shared/unified
    if (nodeId.includes('-shared') || nodeId.includes('-unified')) {
      return;
    }
    
    // Skip workflow nodes as they're designed to be cross-product
    if (node.level === 'workflow') {
      return;
    }
    
    const key = `${node.label.toLowerCase()}_${node.level}`;
    
    if (!groups.has(key)) {
      groups.set(key, {
        label: node.label,
        level: node.level,
        nodeIds: [],
        products: new Set()
      });
    }
    
    const group = groups.get(key)!;
    group.nodeIds.push(nodeId);
    
    // Add products from this node
    if (node.products) {
      node.products.forEach(p => group.products.add(p));
    }
  });
  
  // Filter to only keep groups with multiple nodes from different products
  const duplicateGroups: DuplicateGroup[] = [];
  
  groups.forEach(group => {
    if (group.nodeIds.length > 1) {
      // Check if nodes are from different products
      const nodeProducts = group.nodeIds.map(id => 
        new Set(nodes[id].products || [])
      );
      
      // If products differ, it's a duplicate group
      const allSameProducts = nodeProducts.every(set => 
        nodeProducts[0].size === set.size && 
        Array.from(nodeProducts[0]).every(p => set.has(p))
      );
      
      if (!allSameProducts) {
        duplicateGroups.push(group);
      }
    }
  });
  
  return duplicateGroups;
}

/**
 * Create a shared node from a duplicate group
 */
function createSharedNode(
  group: DuplicateGroup,
  nodes: Record<string, FunctionalNode>
): FunctionalNode {
  const sharedNodeId = generateSharedNodeId(group.label, group.level);
  
  // Collect all unique children and parents from duplicate nodes
  const allChildren = new Set<string>();
  const allParents = new Set<string>();
  const allProducts = new Set<string>();
  
  let description = '';
  
  group.nodeIds.forEach(nodeId => {
    const node = nodes[nodeId];
    
    // Collect children
    if (node.children) {
      node.children.forEach(child => allChildren.add(child));
    }
    
    // Collect parents
    if (node.parents) {
      node.parents.forEach(parent => allParents.add(parent));
    }
    
    // Collect products
    if (node.products) {
      node.products.forEach(product => allProducts.add(product));
    }
    
    // Use first node's description
    if (!description && node.description) {
      description = node.description;
    }
  });
  
  // Create the shared node
  const sharedNode: FunctionalNode = {
    id: sharedNodeId,
    label: group.label,
    level: group.level,
    description: description || `Shared ${group.level} across multiple products`,
    parents: Array.from(allParents),
    children: Array.from(allChildren),
    products: Array.from(allProducts)
  };
  
  return sharedNode;
}

// Note: We deliberately DO NOT modify duplicate nodes' parent/child references
// The duplicate nodes should remain fully connected in the graph
// Only the visibility logic will hide them when rationalization is ON

/**
 * Generate shared nodes from duplicate groups and update relationships
 */
export function generateSharedNodes(
  originalNodes: Record<string, FunctionalNode>
): SharedNodeGenerationResult {
  // Clone the nodes to avoid mutating the original
  const nodes = JSON.parse(JSON.stringify(originalNodes)) as Record<string, FunctionalNode>;
  
  // Track manually created shared nodes but DON'T remove them
  // We'll just add them to the SHARED_NODES list so they get hidden properly
  const manualSharedNodes: string[] = [];
  Object.keys(nodes).forEach(nodeId => {
    if (nodeId.includes('-shared') || nodeId.includes('-unified')) {
      manualSharedNodes.push(nodeId);
    }
  });
  
  if (manualSharedNodes.length > 0) {
    console.log(`Found ${manualSharedNodes.length} manually created shared nodes (will be kept but marked as shared):`, manualSharedNodes);
  }
  
  // Detect duplicate groups
  const duplicateGroups = detectDuplicateGroups(nodes);
  
  const duplicateNodes: string[] = [];
  const sharedNodes: string[] = [];
  const mappings: Record<string, string[]> = {};
  
  // Process each duplicate group
  duplicateGroups.forEach(group => {
    // Skip if a manual shared node already exists for this group
    const potentialSharedId = generateSharedNodeId(group.label, group.level);
    if (nodes[potentialSharedId] || manualSharedNodes.some(id => {
      const node = nodes[id];
      return node && node.label === group.label && node.level === group.level;
    })) {
      console.log(`Shared node for "${group.label}" already exists, skipping generation`);
      // Still add the duplicates to the list
      duplicateNodes.push(...group.nodeIds);
      return;
    }
    
    console.log(`Creating shared node for "${group.label}" from duplicates:`, group.nodeIds);
    
    // Create shared node
    const sharedNode = createSharedNode(group, nodes);
    nodes[sharedNode.id] = sharedNode;
    
    // Track the shared node and duplicates
    sharedNodes.push(sharedNode.id);
    duplicateNodes.push(...group.nodeIds);
    mappings[sharedNode.id] = group.nodeIds;
    
    // DO NOT modify the duplicate nodes or their relationships!
    // The duplicate nodes should remain connected to their original parents/children
    // Only the shared node needs to be properly connected
    
    // Add shared node to parents' children lists (without removing duplicates)
    sharedNode.parents.forEach(parentId => {
      const parent = nodes[parentId];
      if (parent && parent.children && !parent.children.includes(sharedNode.id)) {
        parent.children.push(sharedNode.id);
      }
    });
    
    // Add shared node to children's parents lists (without removing duplicates)
    sharedNode.children.forEach(childId => {
      const child = nodes[childId];
      if (child && child.parents && !child.parents.includes(sharedNode.id)) {
        child.parents.push(sharedNode.id);
      }
    });
    
    console.log(`Created shared node: ${sharedNode.id} with parents:`, sharedNode.parents, 'and children:', sharedNode.children);
  });
  
  // Add all manual shared nodes to the sharedNodes list
  sharedNodes.push(...manualSharedNodes);
  
  return {
    nodes,
    duplicateNodes,
    sharedNodes,
    mappings
  };
}

/**
 * Process domain nodes to add shared nodes automatically
 * This is the main entry point for domain preprocessing
 */
export function preprocessDomainNodes(
  originalNodes: Record<string, FunctionalNode>
): {
  FUNCTIONAL_NODES: Record<string, FunctionalNode>;
  DUPLICATE_NODES: string[];
  SHARED_NODES: string[];
  RATIONALIZED_NODE_ALTERNATIVES: Record<string, Record<string, string>>;
} {
  const result = generateSharedNodes(originalNodes);
  
  // Build RATIONALIZED_NODE_ALTERNATIVES from mappings
  const alternatives: Record<string, Record<string, string>> = {};
  
  Object.entries(result.mappings).forEach(([sharedId, duplicateIds]) => {
    alternatives[sharedId] = {};
    
    // Map each duplicate to its products
    duplicateIds.forEach(dupId => {
      const dupNode = result.nodes[dupId];
      if (dupNode && dupNode.products) {
        // Use first product as key (or could use all products)
        dupNode.products.forEach(product => {
          alternatives[sharedId][product] = dupId;
        });
      }
    });
  });
  
  return {
    FUNCTIONAL_NODES: result.nodes,
    DUPLICATE_NODES: result.duplicateNodes,
    SHARED_NODES: result.sharedNodes,  // Only auto-generated shared nodes
    RATIONALIZED_NODE_ALTERNATIVES: alternatives
  };
}