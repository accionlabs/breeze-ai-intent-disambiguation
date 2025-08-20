// Test that duplicate nodes remain connected after shared node creation
import { preprocessDomainNodes } from '../utils/automaticSharedNodeGenerator';

const enterpriseNodes = require('../config/domains/enterprise/nodes').FUNCTIONAL_NODES;

console.log('=== Testing Duplicate Node Connections ===\n');

// Get original connections for duplicates
const originalDuplicates = [
  'scenario-customer-360-salesforce',
  'scenario-customer-360-analytics',
  'scenario-document-management-ms365',
  'scenario-document-management-projects',
  'scenario-employee-management-ms365',
  'scenario-employee-management-projects',
  'scenario-employee-management-fieldops'
];

console.log('Original duplicate connections:');
originalDuplicates.forEach(nodeId => {
  const node = enterpriseNodes[nodeId];
  if (node) {
    console.log(`\n${nodeId}:`);
    console.log(`  Parents: ${node.parents?.join(', ')}`);
    console.log(`  Children: ${node.children?.join(', ')}`);
  }
});

// Process nodes
const result = preprocessDomainNodes(enterpriseNodes);

console.log('\n\nAfter shared node creation:');
originalDuplicates.forEach(nodeId => {
  const node = result.FUNCTIONAL_NODES[nodeId];
  if (node) {
    console.log(`\n${nodeId}:`);
    console.log(`  Parents: ${node.parents?.join(', ')}`);
    console.log(`  Children: ${node.children?.join(', ')}`);
    
    // Check if parents still exist and have this node as child
    let parentsOk = true;
    node.parents?.forEach(parentId => {
      const parent = result.FUNCTIONAL_NODES[parentId];
      if (!parent) {
        console.error(`  ❌ Parent ${parentId} doesn't exist!`);
        parentsOk = false;
      } else if (!parent.children?.includes(nodeId)) {
        console.error(`  ❌ Parent ${parentId} doesn't have ${nodeId} as child!`);
        parentsOk = false;
      }
    });
    
    // Check if children still exist and have this node as parent
    let childrenOk = true;
    node.children?.forEach(childId => {
      const child = result.FUNCTIONAL_NODES[childId];
      if (!child) {
        console.error(`  ❌ Child ${childId} doesn't exist!`);
        childrenOk = false;
      } else if (!child.parents?.includes(nodeId)) {
        console.error(`  ❌ Child ${childId} doesn't have ${nodeId} as parent!`);
        childrenOk = false;
      }
    });
    
    if (parentsOk && childrenOk) {
      console.log(`  ✅ All connections intact!`);
    }
  }
});

// Also verify shared nodes are properly connected
console.log('\n\nShared node connections:');
result.SHARED_NODES.forEach(sharedId => {
  const node = result.FUNCTIONAL_NODES[sharedId];
  if (node && !sharedId.includes('manual')) {
    console.log(`\n${sharedId}:`);
    console.log(`  Parents: ${node.parents?.join(', ')}`);
    console.log(`  Children: ${node.children?.join(', ')}`);
    
    // Verify parents have shared node as child
    node.parents?.forEach(parentId => {
      const parent = result.FUNCTIONAL_NODES[parentId];
      if (parent && !parent.children?.includes(sharedId)) {
        console.error(`  ❌ Parent ${parentId} doesn't have shared node as child!`);
      }
    });
    
    // Verify children have shared node as parent  
    node.children?.forEach(childId => {
      const child = result.FUNCTIONAL_NODES[childId];
      if (child && !child.parents?.includes(sharedId)) {
        console.error(`  ❌ Child ${childId} doesn't have shared node as parent!`);
      }
    });
  }
});