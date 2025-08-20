// Test shared node generation for enterprise domain
import { preprocessDomainNodes } from '../utils/automaticSharedNodeGenerator';

const enterpriseNodes = require('../config/domains/enterprise/nodes').FUNCTIONAL_NODES;

console.log('=== Testing Shared Node Generation for Enterprise ===\n');

const result = preprocessDomainNodes(enterpriseNodes);

console.log('Summary:');
console.log(`- Original nodes: ${Object.keys(enterpriseNodes).length}`);
console.log(`- Processed nodes: ${Object.keys(result.FUNCTIONAL_NODES).length}`);
console.log(`- Shared nodes created: ${result.SHARED_NODES.length}`);
console.log(`- Duplicate nodes marked: ${result.DUPLICATE_NODES.length}`);

// Check shared nodes
console.log('\n\nShared Nodes Created:');
result.SHARED_NODES.forEach(nodeId => {
  const node = result.FUNCTIONAL_NODES[nodeId];
  if (node) {
    console.log(`\n${nodeId}:`);
    console.log(`  Label: ${node.label}`);
    console.log(`  Level: ${node.level}`);
    console.log(`  Products: ${node.products?.join(', ')}`);
    console.log(`  Parents: ${node.parents?.join(', ')}`);
    console.log(`  Children: ${node.children?.join(', ')}`);
  }
});

// Verify parent-child connections
console.log('\n\nVerifying Connections:');

// For each shared node, verify its parents know about it
let connectionsOk = true;
result.SHARED_NODES.forEach(sharedId => {
  const sharedNode = result.FUNCTIONAL_NODES[sharedId];
  if (!sharedNode) return;
  
  // Check parents have this shared node as child
  sharedNode.parents?.forEach(parentId => {
    const parent = result.FUNCTIONAL_NODES[parentId];
    if (parent && !parent.children?.includes(sharedId)) {
      console.error(`❌ Parent ${parentId} doesn't have shared node ${sharedId} as child`);
      connectionsOk = false;
    }
  });
  
  // Check children have this shared node as parent
  sharedNode.children?.forEach(childId => {
    const child = result.FUNCTIONAL_NODES[childId];
    if (child && !child.parents?.includes(sharedId)) {
      console.error(`❌ Child ${childId} doesn't have shared node ${sharedId} as parent`);
      connectionsOk = false;
    }
  });
});

if (connectionsOk) {
  console.log('✅ All parent-child connections are correct!');
}

// Check for orphaned nodes
console.log('\n\nChecking for Orphans:');
const orphans = Object.entries(result.FUNCTIONAL_NODES).filter(([id, node]) => {
  // Skip product nodes (they're roots)
  if (node.level === 'product') return false;
  
  // Check if has parents
  return !node.parents || node.parents.length === 0;
});

if (orphans.length > 0) {
  console.error(`❌ Found ${orphans.length} orphaned nodes:`);
  orphans.forEach(([id, node]) => {
    console.log(`  - ${id}: "${node.label}"`);
  });
} else {
  console.log('✅ No orphaned nodes found!');
}