// Debug enterprise domain shared nodes
import { preprocessDomainNodes } from '../utils/automaticSharedNodeGenerator';

const enterpriseNodes = require('../config/domains/enterprise/nodes').FUNCTIONAL_NODES;
const result = preprocessDomainNodes(enterpriseNodes);

console.log('=== Enterprise Domain Shared Nodes Debug ===\n');

// Check for Customer 360 nodes
console.log('Customer 360 nodes:');
Object.keys(result.FUNCTIONAL_NODES).forEach(nodeId => {
  if (nodeId.toLowerCase().includes('customer') && nodeId.toLowerCase().includes('360')) {
    const node = result.FUNCTIONAL_NODES[nodeId];
    console.log(`\n${nodeId}:`);
    console.log(`  Label: ${node.label}`);
    console.log(`  Level: ${node.level}`);
    console.log(`  Products: ${node.products?.join(', ')}`);
    console.log(`  Parents: ${node.parents?.join(', ')}`);
    console.log(`  Is in SHARED_NODES: ${result.SHARED_NODES.includes(nodeId)}`);
    console.log(`  Is in DUPLICATE_NODES: ${result.DUPLICATE_NODES.includes(nodeId)}`);
  }
});

console.log('\n\nAll SHARED_NODES generated:');
result.SHARED_NODES.forEach(nodeId => {
  console.log(`- ${nodeId}`);
});

console.log('\n\nAll DUPLICATE_NODES detected:');
result.DUPLICATE_NODES.slice(0, 10).forEach(nodeId => {
  console.log(`- ${nodeId}`);
});

// Check if the manually created shared node is being handled correctly
const manualSharedNode = 'scenario-customer-360-shared';
console.log(`\n\nManual shared node (${manualSharedNode}):`);
console.log(`  Exists in nodes: ${manualSharedNode in result.FUNCTIONAL_NODES}`);
console.log(`  In SHARED_NODES: ${result.SHARED_NODES.includes(manualSharedNode)}`);
console.log(`  In DUPLICATE_NODES: ${result.DUPLICATE_NODES.includes(manualSharedNode)}`);

// Check what our automatic generator would create
console.log('\n\nWould automatic generator create a shared node for Customer 360?');
const customer360Nodes = Object.keys(enterpriseNodes).filter(id => 
  enterpriseNodes[id].label === 'Customer 360 View' && 
  !id.includes('-shared')
);
console.log(`Found ${customer360Nodes.length} duplicate Customer 360 View nodes:`, customer360Nodes);