// Test automatic shared node generation with cleaned enterprise domain
import { preprocessDomainNodes } from '../utils/automaticSharedNodeGenerator';

const enterpriseNodes = require('../config/domains/enterprise/nodes').FUNCTIONAL_NODES;

console.log('=== Testing Clean Enterprise Domain ===\n');

const result = preprocessDomainNodes(enterpriseNodes);

console.log('Statistics:');
console.log(`- Original nodes: ${Object.keys(enterpriseNodes).length}`);
console.log(`- Processed nodes: ${Object.keys(result.FUNCTIONAL_NODES).length}`);
console.log(`- Shared nodes generated: ${result.SHARED_NODES.length}`);
console.log(`- Duplicate nodes detected: ${result.DUPLICATE_NODES.length}`);

console.log('\n\nGenerated Shared Nodes:');
result.SHARED_NODES.forEach(nodeId => {
  const node = result.FUNCTIONAL_NODES[nodeId];
  if (node && !nodeId.includes('-shared') && !nodeId.includes('-unified')) {
    console.log('⚠️  WARNING: Non-shared node in SHARED_NODES:', nodeId);
  } else if (node) {
    console.log(`✅ ${nodeId}: "${node.label}" (${node.products?.join(', ')})`);
  }
});

console.log('\n\nDuplicate Nodes (will be hidden when rationalized):');
const duplicatesByLabel: Record<string, string[]> = {};
result.DUPLICATE_NODES.forEach(nodeId => {
  const node = result.FUNCTIONAL_NODES[nodeId];
  if (node) {
    const label = node.label;
    if (!duplicatesByLabel[label]) {
      duplicatesByLabel[label] = [];
    }
    duplicatesByLabel[label].push(nodeId);
  }
});

Object.entries(duplicatesByLabel).forEach(([label, nodeIds]) => {
  console.log(`\n"${label}":`);
  nodeIds.forEach(id => {
    const node = result.FUNCTIONAL_NODES[id];
    console.log(`  - ${id} (${node.products?.join(', ')})`);
  });
});

// Verify no manual shared nodes exist in original
const manualShared = Object.keys(enterpriseNodes).filter(id => 
  id.includes('-shared') || id.includes('-unified')
);
if (manualShared.length > 0) {
  console.log('\n\n❌ ERROR: Manual shared nodes still exist:', manualShared);
} else {
  console.log('\n\n✅ Success: No manual shared nodes in source!');
}

// Check that all expected duplicates have shared nodes generated
const expectedDuplicateGroups = [
  'Customer 360 View',
  'Document Management', 
  'Employee Management'
];

console.log('\n\nVerifying expected shared nodes:');
expectedDuplicateGroups.forEach(label => {
  const hasShared = result.SHARED_NODES.some(id => {
    const node = result.FUNCTIONAL_NODES[id];
    return node && node.label === label;
  });
  console.log(`${label}: ${hasShared ? '✅' : '❌'}`);
});