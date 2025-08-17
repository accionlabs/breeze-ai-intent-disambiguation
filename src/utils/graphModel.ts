// Improved Graph Data Model with separated metadata and connections

export type HierarchyLevel = 'product' | 'workflow' | 'outcome' | 'scenario' | 'step' | 'action';

// Node metadata - pure data about the node
export interface NodeMetadata {
  id: string;
  level: HierarchyLevel;
  label: string;
  description?: string;
  products?: string[]; // Which products can handle this
  // Any additional metadata can be added here without affecting graph structure
  tags?: string[];
  capabilities?: string[];
  priority?: number;
}

// Graph structure - defines connections between nodes
export interface GraphStructure {
  // Adjacency lists for efficient traversal
  children: Record<string, string[]>;  // nodeId -> [childIds]
  parents: Record<string, string[]>;   // nodeId -> [parentIds]
  
  // Quick lookup sets for graph analysis
  roots: Set<string>;      // Nodes with no parents (top-level)
  leaves: Set<string>;     // Nodes with no children (bottom-level)
  
  // Level-based grouping for efficient rendering
  nodesByLevel: Record<HierarchyLevel, string[]>;
}

// Complete graph model
export interface FunctionalGraph {
  nodes: Record<string, NodeMetadata>;  // All node metadata
  graph: GraphStructure;                 // All connections
}

// Graph operations utilities
export class GraphOperations {
  private graph: FunctionalGraph;
  
  constructor(graph: FunctionalGraph) {
    this.graph = graph;
  }
  
  // Get node metadata
  getNode(nodeId: string): NodeMetadata | undefined {
    return this.graph.nodes[nodeId];
  }
  
  // Get children of a node
  getChildren(nodeId: string): string[] {
    return this.graph.graph.children[nodeId] || [];
  }
  
  // Get parents of a node
  getParents(nodeId: string): string[] {
    return this.graph.graph.parents[nodeId] || [];
  }
  
  // Get all ancestors (recursive upward traversal)
  getAncestors(nodeId: string, visited: Set<string> = new Set()): string[] {
    if (visited.has(nodeId)) return [];
    visited.add(nodeId);
    
    const parents = this.getParents(nodeId);
    const ancestors = [...parents];
    
    parents.forEach(parentId => {
      ancestors.push(...this.getAncestors(parentId, visited));
    });
    
    return ancestors;
  }
  
  // Get all descendants (recursive downward traversal)
  getDescendants(nodeId: string, visited: Set<string> = new Set()): string[] {
    if (visited.has(nodeId)) return [];
    visited.add(nodeId);
    
    const children = this.getChildren(nodeId);
    const descendants = [...children];
    
    children.forEach(childId => {
      descendants.push(...this.getDescendants(childId, visited));
    });
    
    return descendants;
  }
  
  // Find path between two nodes
  findPath(fromId: string, toId: string): string[] | null {
    const queue: { nodeId: string; path: string[] }[] = [
      { nodeId: fromId, path: [fromId] }
    ];
    const visited = new Set<string>();
    
    while (queue.length > 0) {
      const { nodeId, path } = queue.shift()!;
      
      if (nodeId === toId) {
        return path;
      }
      
      if (visited.has(nodeId)) continue;
      visited.add(nodeId);
      
      // Check both children and parents for bidirectional search
      const neighbors = [
        ...this.getChildren(nodeId),
        ...this.getParents(nodeId)
      ];
      
      neighbors.forEach(neighborId => {
        if (!visited.has(neighborId)) {
          queue.push({
            nodeId: neighborId,
            path: [...path, neighborId]
          });
        }
      });
    }
    
    return null;
  }
  
  // Get nodes at a specific level
  getNodesAtLevel(level: HierarchyLevel): NodeMetadata[] {
    const nodeIds = this.graph.graph.nodesByLevel[level] || [];
    return nodeIds.map(id => this.graph.nodes[id]).filter(Boolean);
  }
  
  // Find overlapping nodes (nodes with same label at same level)
  findOverlappingNodes(): Map<string, string[]> {
    const overlaps = new Map<string, string[]>();
    
    Object.values(this.graph.nodes).forEach(node => {
      const key = `${node.level}:${node.label}`;
      if (!overlaps.has(key)) {
        overlaps.set(key, []);
      }
      overlaps.get(key)!.push(node.id);
    });
    
    // Filter out non-overlapping nodes
    const actualOverlaps = new Map<string, string[]>();
    overlaps.forEach((nodeIds, key) => {
      if (nodeIds.length > 1) {
        actualOverlaps.set(key, nodeIds);
      }
    });
    
    return actualOverlaps;
  }
  
  // Check if two nodes are connected
  areConnected(nodeId1: string, nodeId2: string): boolean {
    return this.getChildren(nodeId1).includes(nodeId2) ||
           this.getParents(nodeId1).includes(nodeId2);
  }
  
  // Get subgraph starting from a node
  getSubgraph(rootId: string, maxDepth: number = Infinity): FunctionalGraph {
    const includedNodes = new Set<string>();
    const queue: { nodeId: string; depth: number }[] = [
      { nodeId: rootId, depth: 0 }
    ];
    
    while (queue.length > 0) {
      const { nodeId, depth } = queue.shift()!;
      
      if (depth > maxDepth || includedNodes.has(nodeId)) continue;
      includedNodes.add(nodeId);
      
      if (depth < maxDepth) {
        this.getChildren(nodeId).forEach(childId => {
          queue.push({ nodeId: childId, depth: depth + 1 });
        });
      }
    }
    
    // Build subgraph
    const nodes: Record<string, NodeMetadata> = {};
    const children: Record<string, string[]> = {};
    const parents: Record<string, string[]> = {};
    const nodesByLevel: Record<HierarchyLevel, string[]> = {
      product: [],
      workflow: [],
      outcome: [],
      scenario: [],
      step: [],
      action: []
    };
    
    includedNodes.forEach(nodeId => {
      const node = this.graph.nodes[nodeId];
      if (node) {
        nodes[nodeId] = node;
        
        // Only include connections within the subgraph
        children[nodeId] = this.getChildren(nodeId).filter(id => includedNodes.has(id));
        parents[nodeId] = this.getParents(nodeId).filter(id => includedNodes.has(id));
        
        if (!nodesByLevel[node.level].includes(nodeId)) {
          nodesByLevel[node.level].push(nodeId);
        }
      }
    });
    
    const roots = new Set<string>();
    const leaves = new Set<string>();
    
    Object.keys(nodes).forEach(nodeId => {
      if (parents[nodeId].length === 0) roots.add(nodeId);
      if (children[nodeId].length === 0) leaves.add(nodeId);
    });
    
    return {
      nodes,
      graph: {
        children,
        parents,
        roots,
        leaves,
        nodesByLevel
      }
    };
  }
}

// Helper function to build graph structure from nodes
export function buildGraphStructure(nodes: Record<string, NodeMetadata>, connections: { parent: string; child: string }[]): GraphStructure {
  const children: Record<string, string[]> = {};
  const parents: Record<string, string[]> = {};
  const roots = new Set<string>();
  const leaves = new Set<string>();
  const nodesByLevel: Record<HierarchyLevel, string[]> = {
    product: [],
    workflow: [],
    outcome: [],
    scenario: [],
    step: [],
    action: []
  };
  
  // Initialize structures
  Object.keys(nodes).forEach(nodeId => {
    children[nodeId] = [];
    parents[nodeId] = [];
    
    const node = nodes[nodeId];
    if (!nodesByLevel[node.level].includes(nodeId)) {
      nodesByLevel[node.level].push(nodeId);
    }
  });
  
  // Build connections
  connections.forEach(({ parent, child }) => {
    if (nodes[parent] && nodes[child]) {
      if (!children[parent].includes(child)) {
        children[parent].push(child);
      }
      if (!parents[child].includes(parent)) {
        parents[child].push(parent);
      }
    }
  });
  
  // Identify roots and leaves
  Object.keys(nodes).forEach(nodeId => {
    if (parents[nodeId].length === 0) {
      roots.add(nodeId);
    }
    if (children[nodeId].length === 0) {
      leaves.add(nodeId);
    }
  });
  
  return {
    children,
    parents,
    roots,
    leaves,
    nodesByLevel
  };
}

// Convert old format to new format
export function convertLegacyNodes(legacyNodes: Record<string, any>): FunctionalGraph {
  const nodes: Record<string, NodeMetadata> = {};
  const connections: { parent: string; child: string }[] = [];
  
  // Extract metadata and connections
  Object.values(legacyNodes).forEach((legacyNode: any) => {
    nodes[legacyNode.id] = {
      id: legacyNode.id,
      level: legacyNode.level,
      label: legacyNode.label,
      description: legacyNode.description,
      products: legacyNode.products
    };
    
    // Extract connections
    if (legacyNode.children) {
      legacyNode.children.forEach((childId: string) => {
        connections.push({ parent: legacyNode.id, child: childId });
      });
    }
  });
  
  const graph = buildGraphStructure(nodes, connections);
  
  return { nodes, graph };
}