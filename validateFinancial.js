// Simple validation script for financial domain
const { FUNCTIONAL_NODES } = require('./src/config/domains/financial/nodes.ts');

// Check for orphaned nodes
const orphanedNodes = [];
const nodeIds = Object.keys(FUNCTIONAL_NODES);

// Check each node
for (const [nodeId, node] of Object.entries(FUNCTIONAL_NODES)) {
  // Check if node has empty parents (orphaned) and is not a product
  if (node.level !== 'product' && (!node.parents || node.parents.length === 0)) {
    orphanedNodes.push(nodeId);
  }
  
  // Check if all parent references exist
  if (node.parents) {
    for (const parentId of node.parents) {
      if (!FUNCTIONAL_NODES[parentId]) {
        console.log(`ERROR: Node ${nodeId} references non-existent parent: ${parentId}`);
      }
    }
  }
  
  // Check if all child references exist
  if (node.children) {
    for (const childId of node.children) {
      if (!FUNCTIONAL_NODES[childId]) {
        console.log(`ERROR: Node ${nodeId} references non-existent child: ${childId}`);
      }
    }
  }
}

if (orphanedNodes.length > 0) {
  console.log('\nOrphaned nodes found (nodes with no parents):');
  orphanedNodes.forEach(id => {
    const node = FUNCTIONAL_NODES[id];
    console.log(`  - ${id} (${node.level}): ${node.label}`);
  });
}

// Check product tree independence
const products = ['core-banking', 'wealth', 'loans', 'payments', 'risk'];
const productTrees = {};

// Build reachability for each product
products.forEach(product => {
  const productNode = `product-${product}`;
  if (!FUNCTIONAL_NODES[productNode]) return;
  
  const reachable = new Set();
  const toVisit = [productNode];
  
  while (toVisit.length > 0) {
    const current = toVisit.pop();
    if (reachable.has(current)) continue;
    reachable.add(current);
    
    const node = FUNCTIONAL_NODES[current];
    if (node && node.children) {
      toVisit.push(...node.children);
    }
  }
  
  productTrees[product] = reachable;
});

// Check for overlapping nodes between products
console.log('\nChecking product tree independence:');
let hasOverlap = false;

for (let i = 0; i < products.length; i++) {
  for (let j = i + 1; j < products.length; j++) {
    const prod1 = products[i];
    const prod2 = products[j];
    
    if (!productTrees[prod1] || !productTrees[prod2]) continue;
    
    const overlap = [...productTrees[prod1]].filter(node => 
      productTrees[prod2].has(node) && 
      !node.includes('-shared') // Ignore shared nodes
    );
    
    if (overlap.length > 0) {
      hasOverlap = true;
      console.log(`  WARNING: ${prod1} and ${prod2} share non-shared nodes:`);
      overlap.forEach(nodeId => {
        const node = FUNCTIONAL_NODES[nodeId];
        console.log(`    - ${nodeId}: ${node.label}`);
      });
    }
  }
}

if (!hasOverlap) {
  console.log('  ✓ All product trees are independent (no shared non-shared nodes)');
}

// Count nodes
const nodeCounts = {
  total: nodeIds.length,
  products: 0,
  outcomes: 0,
  scenarios: 0,
  steps: 0,
  actions: 0,
  shared: 0
};

nodeIds.forEach(id => {
  const node = FUNCTIONAL_NODES[id];
  if (node.level === 'product') nodeCounts.products++;
  else if (node.level === 'outcome') nodeCounts.outcomes++;
  else if (node.level === 'scenario') nodeCounts.scenarios++;
  else if (node.level === 'step') nodeCounts.steps++;
  else if (node.level === 'action') nodeCounts.actions++;
  
  if (id.includes('-shared')) nodeCounts.shared++;
});

console.log('\nNode statistics:');
console.log(`  Total nodes: ${nodeCounts.total}`);
console.log(`  Products: ${nodeCounts.products}`);
console.log(`  Outcomes: ${nodeCounts.outcomes}`);
console.log(`  Scenarios: ${nodeCounts.scenarios}`);
console.log(`  Steps: ${nodeCounts.steps}`);
console.log(`  Actions: ${nodeCounts.actions}`);
console.log(`  Shared nodes: ${nodeCounts.shared}`);

console.log('\n✓ Financial domain validation complete');