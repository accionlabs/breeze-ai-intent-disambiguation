// Debug visibility issue for shared nodes
import { preprocessDomainNodes } from '../utils/automaticSharedNodeGenerator';

const enterpriseNodes = require('../config/domains/enterprise/nodes').FUNCTIONAL_NODES;
const result = preprocessDomainNodes(enterpriseNodes);

console.log('=== Debugging Shared Node Visibility ===\n');

// Check what shared nodes we have
console.log('Generated SHARED_NODES array:');
result.SHARED_NODES.forEach(id => {
  console.log(`  - ${id}`);
});

console.log('\n\nAll nodes with "shared" in ID:');
Object.keys(result.FUNCTIONAL_NODES).forEach(nodeId => {
  if (nodeId.includes('shared')) {
    const isInSharedArray = result.SHARED_NODES.includes(nodeId);
    console.log(`  ${nodeId}: In SHARED_NODES=${isInSharedArray}`);
  }
});

console.log('\n\nCustomer 360 related nodes:');
Object.keys(result.FUNCTIONAL_NODES).forEach(nodeId => {
  const node = result.FUNCTIONAL_NODES[nodeId];
  if (node.label === 'Customer 360 View') {
    console.log(`\nNode: ${nodeId}`);
    console.log(`  Label: ${node.label}`);
    console.log(`  Level: ${node.level}`);
    console.log(`  In SHARED_NODES: ${result.SHARED_NODES.includes(nodeId)}`);
    console.log(`  In DUPLICATE_NODES: ${result.DUPLICATE_NODES.includes(nodeId)}`);
    console.log(`  Has "-shared" suffix: ${nodeId.includes('-shared')}`);
  }
});

// Check if the auto-generated ID matches
const expectedSharedId = 'scenario-customer-360-view-shared';
console.log(`\n\nExpected shared node ID: ${expectedSharedId}`);
console.log(`Exists in nodes: ${expectedSharedId in result.FUNCTIONAL_NODES}`);
console.log(`In SHARED_NODES array: ${result.SHARED_NODES.includes(expectedSharedId)}`);