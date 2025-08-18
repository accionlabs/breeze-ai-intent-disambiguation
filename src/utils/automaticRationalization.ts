// Automatic Rationalization Detection
// Uses similarity matching to automatically find duplicate nodes that should be rationalized

import { FunctionalNode, HierarchyLevel } from '../types';

interface RationalizedGroup {
  sharedNodeId: string;
  label: string;
  level: HierarchyLevel;
  duplicates: {
    nodeId: string;
    product: string;
    similarity: number;
  }[];
}

/**
 * Calculate similarity between two node labels
 * Uses normalized Levenshtein distance and token overlap
 */
function calculateLabelSimilarity(label1: string, label2: string): number {
  const norm1 = label1.toLowerCase().trim();
  const norm2 = label2.toLowerCase().trim();
  
  // Exact match
  if (norm1 === norm2) return 1.0;
  
  // Token-based similarity
  const tokens1 = new Set(norm1.split(/\s+/));
  const tokens2 = new Set(norm2.split(/\s+/));
  
  const intersection = new Set(Array.from(tokens1).filter(x => tokens2.has(x)));
  const union = new Set(Array.from(tokens1).concat(Array.from(tokens2)));
  
  const jaccardSimilarity = intersection.size / union.size;
  
  // Levenshtein similarity
  const maxLen = Math.max(norm1.length, norm2.length);
  const distance = levenshteinDistance(norm1, norm2);
  const levenshteinSimilarity = 1 - (distance / maxLen);
  
  // Weighted average
  return (jaccardSimilarity * 0.6 + levenshteinSimilarity * 0.4);
}

/**
 * Simple Levenshtein distance calculation
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  
  if (m === 0) return n;
  if (n === 0) return m;
  
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,    // deletion
          dp[i][j - 1] + 1,    // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }
  
  return dp[m][n];
}

/**
 * Automatically detect groups of duplicate nodes that should be rationalized
 * @param nodes - All functional nodes
 * @param similarityThreshold - Minimum similarity score to consider nodes as duplicates (0-1)
 * @returns Groups of nodes that should be rationalized together
 */
export function detectRationalizedGroups(
  nodes: Record<string, FunctionalNode>,
  similarityThreshold: number = 0.85
): RationalizedGroup[] {
  const groups: RationalizedGroup[] = [];
  const processedNodes = new Set<string>();
  
  // Group nodes by level first
  const nodesByLevel = new Map<HierarchyLevel, Array<[string, FunctionalNode]>>();
  
  for (const [nodeId, node] of Object.entries(nodes)) {
    // Skip shared nodes
    if (nodeId.includes('-shared')) continue;
    
    const level = node.level;
    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, []);
    }
    nodesByLevel.get(level)!.push([nodeId, node]);
  }
  
  // Find similar nodes within each level
  nodesByLevel.forEach((levelNodes, level) => {
    for (let i = 0; i < levelNodes.length; i++) {
      const [nodeId1, node1] = levelNodes[i];
      
      // Skip if already processed
      if (processedNodes.has(nodeId1)) continue;
      
      const duplicates: typeof groups[0]['duplicates'] = [];
      
      // Compare with all other nodes at same level
      for (let j = 0; j < levelNodes.length; j++) {
        if (i === j) continue;
        
        const [nodeId2, node2] = levelNodes[j];
        
        // Skip if already processed
        if (processedNodes.has(nodeId2)) continue;
        
        // Check if nodes are from different products
        const products1 = new Set(node1.products || []);
        const products2 = new Set(node2.products || []);
        
        // Skip if they share any products (not true duplicates)
        const hasOverlap = Array.from(products1).some(p => products2.has(p));
        if (hasOverlap) continue;
        
        // Calculate similarity
        const similarity = calculateLabelSimilarity(node1.label, node2.label);
        
        if (similarity >= similarityThreshold) {
          // Add the first node if not already added
          if (duplicates.length === 0) {
            duplicates.push({
              nodeId: nodeId1,
              product: (node1.products || [])[0] || 'unknown',
              similarity: 1.0
            });
            processedNodes.add(nodeId1);
          }
          
          // Add the similar node
          duplicates.push({
            nodeId: nodeId2,
            product: (node2.products || [])[0] || 'unknown',
            similarity
          });
          processedNodes.add(nodeId2);
        }
      }
      
      // If we found duplicates, create a group
      if (duplicates.length > 1) {
        // Generate shared node ID
        const baseLabel = node1.label.toLowerCase()
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, '-');
        const sharedNodeId = `${level}-${baseLabel}-shared`;
        
        groups.push({
          sharedNodeId,
          label: node1.label,
          level,
          duplicates
        });
      }
    }
  });
  
  return groups;
}

/**
 * Generate RATIONALIZED_NODE_ALTERNATIVES from detected groups
 */
export function generateRationalizedAlternatives(
  groups: RationalizedGroup[]
): Record<string, Record<string, string>> {
  const alternatives: Record<string, Record<string, string>> = {};
  
  for (const group of groups) {
    const productMap: Record<string, string> = {};
    
    for (const duplicate of group.duplicates) {
      productMap[duplicate.product] = duplicate.nodeId;
    }
    
    alternatives[group.sharedNodeId] = productMap;
  }
  
  return alternatives;
}

/**
 * Create shared/rationalized nodes from duplicate groups
 */
export function createSharedNodes(
  groups: RationalizedGroup[],
  existingNodes: Record<string, FunctionalNode>
): Record<string, FunctionalNode> {
  const sharedNodes: Record<string, FunctionalNode> = {};
  
  for (const group of groups) {
    // Collect all products and parents from duplicates
    const allProducts = new Set<string>();
    const allParents = new Set<string>();
    const allChildren = new Set<string>();
    
    for (const duplicate of group.duplicates) {
      const node = existingNodes[duplicate.nodeId];
      if (node) {
        (node.products || []).forEach(p => allProducts.add(p));
        (node.parents || []).forEach(p => allParents.add(p));
        (node.children || []).forEach(c => allChildren.add(c));
      }
    }
    
    // Create the shared node
    const sharedNode: FunctionalNode = {
      id: group.sharedNodeId,
      label: group.label + ' (Unified)',
      level: group.level,
      products: Array.from(allProducts),
      parents: Array.from(allParents),
      children: Array.from(allChildren)
    };
    
    // For scenario-level shared nodes, create a unified step child
    if (group.level === 'scenario') {
      const baseLabel = group.label.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');
      const unifiedStepId = `step-${baseLabel}-unified`;
      
      // Replace individual children with unified step
      sharedNode.children = [unifiedStepId];
      
      // Create the unified step node
      sharedNodes[unifiedStepId] = {
        id: unifiedStepId,
        label: `Unified ${group.label} Process`,
        level: 'step',
        products: Array.from(allProducts),
        parents: [group.sharedNodeId],
        children: [] // Could aggregate actions from duplicate scenarios
      };
    }
    
    sharedNodes[group.sharedNodeId] = sharedNode;
  }
  
  return sharedNodes;
}

/**
 * Automatically detect and configure rationalization
 * This can replace manual RATIONALIZED_NODE_ALTERNATIVES configuration
 */
export function autoConfigureRationalization(
  nodes: Record<string, FunctionalNode>,
  similarityThreshold: number = 0.85
): {
  rationalizedAlternatives: Record<string, Record<string, string>>;
  sharedNodes: FunctionalNode[];
  duplicateNodes: string[];
} {
  // Detect groups of similar nodes
  const groups = detectRationalizedGroups(nodes, similarityThreshold);
  
  // Generate alternatives mapping
  const rationalizedAlternatives = generateRationalizedAlternatives(groups);
  
  // Create shared nodes
  const sharedNodesMap = createSharedNodes(groups, nodes);
  const sharedNodes = Object.values(sharedNodesMap);
  
  // Collect all duplicate node IDs
  const duplicateNodes = groups.flatMap(g => g.duplicates.map(d => d.nodeId));
  
  return {
    rationalizedAlternatives,
    sharedNodes,
    duplicateNodes
  };
}

/**
 * Check if automatic rationalization would match manual configuration
 * Useful for validation and debugging
 */
export function validateAgainstManualConfig(
  nodes: Record<string, FunctionalNode>,
  manualAlternatives: Record<string, Record<string, string>>,
  similarityThreshold: number = 0.85
): {
  matches: string[];
  missingInAuto: string[];
  extraInAuto: string[];
  similarityScores: Record<string, number>;
} {
  const autoConfig = autoConfigureRationalization(nodes, similarityThreshold);
  
  const manualKeys = new Set(Object.keys(manualAlternatives));
  const autoKeys = new Set(Object.keys(autoConfig.rationalizedAlternatives));
  
  const matches: string[] = [];
  const missingInAuto: string[] = [];
  const extraInAuto: string[] = [];
  const similarityScores: Record<string, number> = {};
  
  // Check what's in manual but not in auto
  manualKeys.forEach(key => {
    if (autoKeys.has(key)) {
      matches.push(key);
    } else {
      missingInAuto.push(key);
    }
  });
  
  // Check what's in auto but not in manual
  autoKeys.forEach(key => {
    if (!manualKeys.has(key)) {
      extraInAuto.push(key);
    }
  });
  
  // Calculate similarity scores for all detected groups
  const groups = detectRationalizedGroups(nodes, similarityThreshold);
  for (const group of groups) {
    const avgSimilarity = group.duplicates.reduce((sum, d) => sum + d.similarity, 0) / group.duplicates.length;
    similarityScores[group.sharedNodeId] = avgSimilarity;
  }
  
  return {
    matches,
    missingInAuto,
    extraInAuto,
    similarityScores
  };
}

/**
 * Generate list of duplicate nodes from rationalized groups
 * Includes all descendants of duplicate nodes
 */
export function generateDuplicateNodes(
  groups: RationalizedGroup[],
  nodes?: Record<string, FunctionalNode>
): string[] {
  const duplicateNodes = new Set<string>();
  
  // Add direct duplicates
  for (const group of groups) {
    for (const duplicate of group.duplicates) {
      duplicateNodes.add(duplicate.nodeId);
    }
  }
  
  // If nodes are provided, also add all descendants of duplicate nodes
  if (nodes) {
    const addDescendants = (nodeId: string) => {
      const node = nodes[nodeId];
      if (node && node.children) {
        for (const childId of node.children) {
          if (!duplicateNodes.has(childId)) {
            duplicateNodes.add(childId);
            addDescendants(childId); // Recursively add all descendants
          }
        }
      }
    };
    
    // For each duplicate node, add all its descendants
    const initialDuplicates = Array.from(duplicateNodes);
    for (const nodeId of initialDuplicates) {
      addDescendants(nodeId);
    }
  }
  
  return Array.from(duplicateNodes);
}

/**
 * Generate list of shared nodes from rationalized groups
 */
export function generateSharedNodes(
  groups: RationalizedGroup[]
): string[] {
  const sharedNodes: string[] = [];
  
  for (const group of groups) {
    sharedNodes.push(group.sharedNodeId);
    // Also add unified step nodes
    const baseLabel = group.label.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');
    sharedNodes.push(`step-${baseLabel}-unified`);
  }
  
  return sharedNodes;
}