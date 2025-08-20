// Find orphaned nodes in enterprise domain
import { FUNCTIONAL_NODES } from '../config/domains/enterprise/nodes';

console.log('=== Finding Orphaned Nodes in Enterprise Domain ===\n');

// Build a set of all node IDs
const allNodeIds = new Set(Object.keys(FUNCTIONAL_NODES));

// Find nodes that are referenced but don't exist
const missingNodes = new Set<string>();

// Check all parent and child references
Object.entries(FUNCTIONAL_NODES).forEach(([nodeId, node]) => {
  // Check parent references
  if (node.parents) {
    node.parents.forEach(parentId => {
      if (!allNodeIds.has(parentId)) {
        missingNodes.add(parentId);
        console.log(`❌ Node "${nodeId}" references missing parent: "${parentId}"`);
      }
    });
  }
  
  // Check child references
  if (node.children) {
    node.children.forEach(childId => {
      if (!allNodeIds.has(childId)) {
        missingNodes.add(childId);
        console.log(`❌ Node "${nodeId}" references missing child: "${childId}"`);
      }
    });
  }
});

// Find orphaned nodes (nodes with no parents when they should have them)
console.log('\n=== Orphaned Nodes (no parents) ===\n');

const orphanedNodes: string[] = [];
Object.entries(FUNCTIONAL_NODES).forEach(([nodeId, node]) => {
  // Skip product nodes - they're meant to be roots
  if (node.level === 'product') return;
  
  if (!node.parents || node.parents.length === 0) {
    orphanedNodes.push(nodeId);
    console.log(`🔸 Orphan: ${nodeId}`);
    console.log(`   Label: ${node.label}`);
    console.log(`   Level: ${node.level}`);
    console.log(`   Products: ${node.products?.join(', ')}`);
  }
});

// Find nodes that are not connected to the graph
console.log('\n=== Connectivity Check ===\n');

// Start from product nodes and traverse down
const visited = new Set<string>();
const queue: string[] = [];

// Find all product nodes (roots)
Object.entries(FUNCTIONAL_NODES).forEach(([nodeId, node]) => {
  if (node.level === 'product') {
    queue.push(nodeId);
  }
});

// BFS traversal
while (queue.length > 0) {
  const currentId = queue.shift()!;
  if (visited.has(currentId)) continue;
  
  visited.add(currentId);
  
  const node = FUNCTIONAL_NODES[currentId];
  if (node && node.children) {
    node.children.forEach(childId => {
      if (!visited.has(childId) && allNodeIds.has(childId)) {
        queue.push(childId);
      }
    });
  }
}

// Find unvisited nodes
const unconnectedNodes = Array.from(allNodeIds).filter(id => !visited.has(id));

if (unconnectedNodes.length > 0) {
  console.log(`Found ${unconnectedNodes.length} nodes not connected to any product:\n`);
  unconnectedNodes.forEach(nodeId => {
    const node = FUNCTIONAL_NODES[nodeId];
    console.log(`🔴 Unconnected: ${nodeId}`);
    console.log(`   Label: ${node.label}`);
    console.log(`   Level: ${node.level}`);
    console.log(`   Products: ${node.products?.join(', ')}`);
    console.log(`   Parents: ${node.parents?.join(', ') || 'none'}`);
    console.log(`   Children: ${node.children?.join(', ') || 'none'}`);
    console.log('');
  });
} else {
  console.log('✅ All nodes are connected to the product tree!');
}

// Summary
console.log('\n=== Summary ===');
console.log(`Total nodes: ${allNodeIds.size}`);
console.log(`Missing referenced nodes: ${missingNodes.size}`);
console.log(`Orphaned nodes (no parents): ${orphanedNodes.length}`);
console.log(`Unconnected nodes: ${unconnectedNodes.length}`);