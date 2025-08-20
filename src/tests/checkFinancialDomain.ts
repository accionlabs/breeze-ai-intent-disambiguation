// Quick check for duplicate nodes in financial domain
import { FUNCTIONAL_NODES } from '../config/domains/financial/nodes';

console.log('Checking Financial Domain for duplicates...\n');

// Check for nodes with similar labels
const nodesByLabel: Record<string, string[]> = {};

Object.entries(FUNCTIONAL_NODES).forEach(([id, node]) => {
  const labelKey = node.label.toLowerCase();
  if (!nodesByLabel[labelKey]) {
    nodesByLabel[labelKey] = [];
  }
  nodesByLabel[labelKey].push(id);
});

// Find duplicates
const duplicates = Object.entries(nodesByLabel)
  .filter(([label, ids]) => ids.length > 1);

if (duplicates.length > 0) {
  console.log('Found duplicate labels:');
  duplicates.forEach(([label, ids]) => {
    console.log(`\nLabel: "${label}"`);
    ids.forEach(id => {
      const node = FUNCTIONAL_NODES[id];
      console.log(`  - ${id} (level: ${node.level}, products: ${node.products?.join(', ') || 'none'})`);
    });
  });
} else {
  console.log('No duplicate labels found.');
}

// Check for nodes with "unified" or "financial reporting" in name
console.log('\n\nNodes with "unified" or "reporting" in label:');
Object.entries(FUNCTIONAL_NODES).forEach(([id, node]) => {
  if (node.label.toLowerCase().includes('unified') || 
      node.label.toLowerCase().includes('reporting')) {
    console.log(`- ${id}: "${node.label}" (level: ${node.level})`);
    
    // Check parent-child relationships
    if (node.parents.length > 0) {
      console.log(`  Parents: ${node.parents.join(', ')}`);
    }
    if (node.children.length > 0) {
      console.log(`  Children: ${node.children.join(', ')}`);
    }
  }
});

// Check if any node is both a parent and child of another
console.log('\n\nChecking for circular or unusual relationships:');
Object.entries(FUNCTIONAL_NODES).forEach(([id, node]) => {
  node.children.forEach(childId => {
    if (node.parents.includes(childId)) {
      console.log(`WARNING: ${id} has ${childId} as both parent and child!`);
    }
  });
});

// List all shared nodes
console.log('\n\nAll shared/unified nodes:');
Object.entries(FUNCTIONAL_NODES).forEach(([id, node]) => {
  if (id.includes('-shared') || id.includes('-unified') || 
      node.label.toLowerCase().includes('unified')) {
    console.log(`- ${id}: "${node.label}"`);
    console.log(`  Level: ${node.level}`);
    console.log(`  Products: ${node.products?.join(', ') || 'none'}`);
    console.log(`  Parents: ${node.parents.join(', ') || 'none'}`);
    console.log(`  Children: ${node.children.join(', ') || 'none'}`);
  }
});