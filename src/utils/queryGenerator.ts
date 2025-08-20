// Automated Query Generation System
// Ensures proper coverage of Clear, Ambiguous, and Workflow queries

import { FunctionalNode, HierarchyLevel } from '../config';
import { UserQuery } from '../types';

// Extended query type for generation
interface GeneratedQuery extends UserQuery {
  products?: string[];
  isDuplicate?: boolean;
  isWorkflow?: boolean;
  confidence?: number;
  alternativeNodes?: string[];
}

interface QueryGenerationResult {
  clearQueries: GeneratedQuery[];
  ambiguousQueries: GeneratedQuery[];
  workflowQueries: GeneratedQuery[];
  stats: {
    totalNodes: number;
    duplicateNodes: number;
    workflowNodes: number;
    productsCount: number;
    clearQueriesCoverage: Record<string, number>; // product -> count
    levelCoverage: Record<HierarchyLevel, number>;
  };
}

interface DuplicateGroup {
  label: string;
  level: HierarchyLevel;
  nodes: Array<{
    id: string;
    products: string[];
  }>;
}

/**
 * Analyzes domain nodes to find duplicates (same label and level, different products)
 */
function findDuplicateNodes(nodes: Record<string, FunctionalNode>): DuplicateGroup[] {
  const nodeGroups = new Map<string, DuplicateGroup>();
  
  Object.entries(nodes).forEach(([nodeId, node]) => {
    // Skip shared/unified nodes and workflow nodes for duplicate detection
    if (nodeId.includes('-shared') || nodeId.includes('-unified') || node.level === 'workflow') {
      return;
    }
    
    const groupKey = `${node.level}-${node.label.toLowerCase()}`;
    
    if (!nodeGroups.has(groupKey)) {
      nodeGroups.set(groupKey, {
        label: node.label,
        level: node.level,
        nodes: []
      });
    }
    
    nodeGroups.get(groupKey)!.nodes.push({
      id: nodeId,
      products: node.products || []
    });
  });
  
  // Filter to only keep groups with duplicates
  return Array.from(nodeGroups.values()).filter(group => group.nodes.length > 1);
}

/**
 * Generates clear queries - one per product covering different levels
 */
function generateClearQueries(
  nodes: Record<string, FunctionalNode>,
  duplicateNodeIds: Set<string>,
  maxQueries: number = 10
): GeneratedQuery[] {
  const queries: GeneratedQuery[] = [];
  const products = new Set<string>();
  const usedNodes = new Set<string>();
  
  // First, collect all unique products
  Object.values(nodes).forEach(node => {
    if (node.products) {
      node.products.forEach(p => products.add(p));
    }
  });
  
  // Priority order for levels
  const levelPriority: HierarchyLevel[] = ['action', 'step', 'scenario', 'outcome'];
  
  // Try to get at least one query per product
  products.forEach(product => {
    if (queries.length >= maxQueries) return;
    
    // Find a clear (non-duplicate) node for this product
    for (const level of levelPriority) {
      const node = Object.entries(nodes).find(([id, n]) => 
        !duplicateNodeIds.has(id) &&
        !usedNodes.has(id) &&
        !id.includes('-shared') &&
        !id.includes('-unified') &&
        n.level === level &&
        n.products?.includes(product)
      );
      
      if (node) {
        const [nodeId, nodeData] = node;
        usedNodes.add(nodeId);
        
        queries.push({
          id: `query-clear-${nodeId}`,
          text: generateQueryText(nodeData),
          entryNode: nodeId,
          entryLevel: nodeData.level,
          products: nodeData.products || [],
          isDuplicate: false,
          isWorkflow: false,
          confidence: 1.0
        });
        break;
      }
    }
  });
  
  // Fill remaining slots with diverse level coverage
  if (queries.length < maxQueries) {
    levelPriority.forEach(level => {
      if (queries.length >= maxQueries) return;
      
      const candidates = Object.entries(nodes).filter(([id, n]) =>
        !duplicateNodeIds.has(id) &&
        !usedNodes.has(id) &&
        !id.includes('-shared') &&
        !id.includes('-unified') &&
        n.level === level
      );
      
      // Take up to 2 from each level
      candidates.slice(0, 2).forEach(([nodeId, nodeData]) => {
        if (queries.length < maxQueries) {
          usedNodes.add(nodeId);
          queries.push({
            id: `query-clear-${nodeId}`,
            text: generateQueryText(nodeData),
            entryNode: nodeId,
            entryLevel: nodeData.level,
            products: nodeData.products || [],
            isDuplicate: false,
            isWorkflow: false,
            confidence: 1.0
          });
        }
      });
    });
  }
  
  return queries;
}

/**
 * Generates ambiguous queries from duplicate nodes
 */
function generateAmbiguousQueries(
  nodes: Record<string, FunctionalNode>,
  duplicateGroups: DuplicateGroup[]
): GeneratedQuery[] {
  const queries: GeneratedQuery[] = [];
  
  // Take the most interesting duplicate groups (max 5)
  const selectedGroups = duplicateGroups
    .sort((a, b) => {
      // Prioritize by number of products involved and level
      const levelOrder = { action: 0, step: 1, scenario: 2, outcome: 3, product: 4, workflow: 5 };
      const aScore = a.nodes.reduce((sum, n) => sum + n.products.length, 0) + (4 - (levelOrder[a.level] || 5));
      const bScore = b.nodes.reduce((sum, n) => sum + n.products.length, 0) + (4 - (levelOrder[b.level] || 5));
      return bScore - aScore;
    })
    .slice(0, 5);
  
  selectedGroups.forEach(group => {
    // Use the first node from the group as the entry point
    const firstNode = group.nodes[0];
    const nodeData = nodes[firstNode.id];
    
    if (nodeData) {
      queries.push({
        id: `query-ambiguous-${group.label.toLowerCase().replace(/\s+/g, '-')}`,
        text: generateAmbiguousQueryText(nodeData),
        entryNode: firstNode.id,
        entryLevel: nodeData.level,
        products: group.nodes.flatMap(n => n.products),
        isDuplicate: true,
        isWorkflow: false,
        confidence: 0.7,
        alternativeNodes: group.nodes.map(n => n.id)
      });
    }
  });
  
  return queries;
}

/**
 * Generates workflow queries from workflow nodes
 */
function generateWorkflowQueries(nodes: Record<string, FunctionalNode>): GeneratedQuery[] {
  const queries: GeneratedQuery[] = [];
  
  const workflowNodes = Object.entries(nodes).filter(([_, n]) => n.level === 'workflow');
  
  workflowNodes.slice(0, 3).forEach(([nodeId, node]) => {
    queries.push({
      id: `query-workflow-${nodeId}`,
      text: generateWorkflowQueryText(node),
      entryNode: nodeId,
      entryLevel: 'workflow',
      products: node.products || [],
      isDuplicate: false,
      isWorkflow: true,
      confidence: 0.9
    });
  });
  
  return queries;
}

/**
 * Generate natural language query text for clear nodes
 */
function generateQueryText(node: FunctionalNode): string {
  const templates: Record<HierarchyLevel, string[]> = {
    action: [
      `I want to ${node.label.toLowerCase()}`,
      `Help me ${node.label.toLowerCase()}`,
      `${node.label}`
    ],
    step: [
      `I need to ${node.label.toLowerCase()}`,
      `How do I ${node.label.toLowerCase()}`,
      `${node.label}`
    ],
    scenario: [
      `I'm working on ${node.label.toLowerCase()}`,
      `Support for ${node.label.toLowerCase()}`,
      `${node.label}`
    ],
    outcome: [
      `I want to achieve ${node.label.toLowerCase()}`,
      `Help me with ${node.label.toLowerCase()}`,
      `${node.label}`
    ],
    product: [`${node.label}`],
    workflow: [`${node.label}`]
  };
  
  const levelTemplates = templates[node.level] || [`${node.label}`];
  return levelTemplates[Math.floor(Math.random() * levelTemplates.length)];
}

/**
 * Generate natural language query text for ambiguous nodes
 */
function generateAmbiguousQueryText(node: FunctionalNode): string {
  // Ambiguous queries should be more generic
  const templates: Record<HierarchyLevel, string[]> = {
    action: [`${node.label.toLowerCase()}`],
    step: [`${node.label.toLowerCase()}`],
    scenario: [`${node.label.toLowerCase()} management`],
    outcome: [`${node.label.toLowerCase()}`],
    product: [`${node.label}`],
    workflow: [`${node.label}`]
  };
  
  const levelTemplates = templates[node.level] || [`${node.label}`];
  return levelTemplates[0];
}

/**
 * Generate natural language query text for workflow nodes
 */
function generateWorkflowQueryText(node: FunctionalNode): string {
  return `Execute ${node.label.toLowerCase()} workflow`;
}

/**
 * Main function to generate queries for a domain
 */
export function generateQueriesForDomain(
  nodes: Record<string, FunctionalNode>,
  domainName?: string
): QueryGenerationResult {
  // Find duplicate groups
  const duplicateGroups = findDuplicateNodes(nodes);
  const duplicateNodeIds = new Set(
    duplicateGroups.flatMap(g => g.nodes.map(n => n.id))
  );
  
  // Generate each type of query
  const clearQueries = generateClearQueries(nodes, duplicateNodeIds);
  const ambiguousQueries = generateAmbiguousQueries(nodes, duplicateGroups);
  const workflowQueries = generateWorkflowQueries(nodes);
  
  // Calculate statistics
  const products = new Set<string>();
  const levelCoverage: Record<string, number> = {};
  const clearQueriesCoverage: Record<string, number> = {};
  
  Object.values(nodes).forEach(node => {
    if (node.products) {
      node.products.forEach(p => products.add(p));
    }
    levelCoverage[node.level] = (levelCoverage[node.level] || 0) + 1;
  });
  
  clearQueries.forEach(query => {
    query.products?.forEach(p => {
      clearQueriesCoverage[p] = (clearQueriesCoverage[p] || 0) + 1;
    });
  });
  
  return {
    clearQueries,
    ambiguousQueries,
    workflowQueries,
    stats: {
      totalNodes: Object.keys(nodes).length,
      duplicateNodes: duplicateNodeIds.size,
      workflowNodes: workflowQueries.length,
      productsCount: products.size,
      clearQueriesCoverage,
      levelCoverage: levelCoverage as Record<HierarchyLevel, number>
    }
  };
}

/**
 * Validates query coverage and suggests improvements
 */
export function validateQueryCoverage(result: QueryGenerationResult): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Check clear queries coverage
  if (result.clearQueries.length < 5) {
    issues.push(`Only ${result.clearQueries.length} clear queries (minimum 5 recommended)`);
    suggestions.push('Add more clear queries covering different products and levels');
  }
  
  // Check if all products have at least one clear query
  const productsWithQueries = new Set(
    result.clearQueries.flatMap(i => i.products)
  );
  if (productsWithQueries.size < result.stats.productsCount) {
    issues.push(`Only ${productsWithQueries.size} of ${result.stats.productsCount} products have clear queries`);
    suggestions.push('Ensure each product has at least one clear query');
  }
  
  // Check ambiguous queries
  if (result.stats.duplicateNodes > 0 && result.ambiguousQueries.length === 0) {
    issues.push('No ambiguous queries despite having duplicate nodes');
    suggestions.push('Add ambiguous queries for duplicate nodes to test context resolution');
  }
  
  // Check level coverage
  const levelsWithQueries = new Set(
    [...result.clearQueries, ...result.ambiguousQueries].map(i => i.entryLevel)
  );
  if (levelsWithQueries.size < 3) {
    issues.push(`Queries only cover ${levelsWithQueries.size} hierarchy levels`);
    suggestions.push('Add queries covering action, step, scenario, and outcome levels');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    suggestions
  };
}