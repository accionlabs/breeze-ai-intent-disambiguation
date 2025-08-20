// Validation script for Enterprise domain nodes
const fs = require('fs');
const path = require('path');

// Load the nodes
const nodesPath = path.join(__dirname, 'src/config/domains/enterprise/nodes.ts');
const nodesContent = fs.readFileSync(nodesPath, 'utf8');

// Extract FUNCTIONAL_NODES
const nodesMatch = nodesContent.match(/export const FUNCTIONAL_NODES: Record<string, FunctionalNode> = ({[\s\S]*?^});/m);
if (!nodesMatch) {
  console.error('Could not find FUNCTIONAL_NODES');
  process.exit(1);
}

// Parse the nodes (simplified - treating as JavaScript object)
const nodesStr = nodesMatch[1]
  .replace(/as any/g, '')
  .replace(/as const/g, '')
  .replace(/FunctionalNode/g, '')
  .replace(/: Record<string, >/g, '')
  .replace(/export const FUNCTIONAL_NODES = /g, '');

// Create a temporary file to evaluate
const tempFile = `
const FUNCTIONAL_NODES = ${nodesStr};
module.exports = FUNCTIONAL_NODES;
`;

fs.writeFileSync('temp_nodes.js', tempFile);
const FUNCTIONAL_NODES = require('./temp_nodes.js');
fs.unlinkSync('temp_nodes.js');

// Validation checks
console.log('=== ENTERPRISE DOMAIN VALIDATION ===\n');

// 1. Check for orphan nodes (nodes with parents that don't exist)
console.log('1. Checking for orphan nodes...');
const orphanNodes = [];
const allNodeIds = Object.keys(FUNCTIONAL_NODES);

for (const [nodeId, node] of Object.entries(FUNCTIONAL_NODES)) {
  if (node.parents && node.parents.length > 0) {
    for (const parentId of node.parents) {
      if (!FUNCTIONAL_NODES[parentId]) {
        orphanNodes.push({
          node: nodeId,
          missingParent: parentId,
          nodeLabel: node.label
        });
      }
    }
  }
}

if (orphanNodes.length > 0) {
  console.log('❌ Found orphan nodes:');
  orphanNodes.forEach(orphan => {
    console.log(`   - Node "${orphan.nodeLabel}" (${orphan.node}) references missing parent: ${orphan.missingParent}`);
  });
} else {
  console.log('✅ No orphan nodes found');
}

// 2. Check for nodes with no parents (should only be outcomes and workflows)
console.log('\n2. Checking root nodes (nodes with no parents)...');
const rootNodes = [];
for (const [nodeId, node] of Object.entries(FUNCTIONAL_NODES)) {
  if (!node.parents || node.parents.length === 0) {
    rootNodes.push({
      id: nodeId,
      label: node.label,
      level: node.level
    });
  }
}

console.log(`Found ${rootNodes.length} root nodes:`);
rootNodes.forEach(root => {
  const icon = (root.level === 'outcome' || root.level === 'workflow') ? '✅' : '⚠️';
  console.log(`   ${icon} ${root.level}: "${root.label}" (${root.id})`);
});

// 3. Check for duplicate node IDs
console.log('\n3. Checking for duplicate node IDs...');
const nodeIds = Object.keys(FUNCTIONAL_NODES);
const uniqueIds = new Set(nodeIds);
if (nodeIds.length !== uniqueIds.size) {
  console.log('❌ Found duplicate node IDs');
} else {
  console.log('✅ All node IDs are unique');
}

// 4. Check for nodes referencing old product codes
console.log('\n4. Checking for old product references...');
const oldProducts = ['projects', 'fieldops'];
const nodesWithOldProducts = [];

for (const [nodeId, node] of Object.entries(FUNCTIONAL_NODES)) {
  // Check in node ID
  for (const oldProduct of oldProducts) {
    if (nodeId.includes(oldProduct)) {
      nodesWithOldProducts.push({
        nodeId,
        label: node.label,
        issue: `Node ID contains "${oldProduct}"`
      });
    }
  }
  
  // Check in products array
  if (node.products) {
    for (const product of node.products) {
      if (oldProducts.includes(product)) {
        nodesWithOldProducts.push({
          nodeId,
          label: node.label,
          issue: `Products array contains "${product}"`
        });
      }
    }
  }
}

if (nodesWithOldProducts.length > 0) {
  console.log('❌ Found nodes with old product references:');
  nodesWithOldProducts.forEach(node => {
    console.log(`   - ${node.label} (${node.nodeId}): ${node.issue}`);
  });
} else {
  console.log('✅ No old product references found');
}

// 5. Check product consistency
console.log('\n5. Checking product consistency...');
const validProducts = ['sap', 'salesforce', 'ms365', 'analytics', 'servicenow', 'monitoring', 'n/a'];
const invalidProductNodes = [];

for (const [nodeId, node] of Object.entries(FUNCTIONAL_NODES)) {
  if (node.products) {
    for (const product of node.products) {
      if (!validProducts.includes(product)) {
        invalidProductNodes.push({
          nodeId,
          label: node.label,
          invalidProduct: product
        });
      }
    }
  }
}

if (invalidProductNodes.length > 0) {
  console.log('❌ Found nodes with invalid products:');
  invalidProductNodes.forEach(node => {
    console.log(`   - ${node.label} (${node.nodeId}): invalid product "${node.invalidProduct}"`);
  });
} else {
  console.log('✅ All products are valid');
}

// 6. Check ServiceNow and Monitoring nodes exist
console.log('\n6. Checking new product nodes...');
const servicenowNodes = Object.keys(FUNCTIONAL_NODES).filter(id => id.includes('servicenow'));
const monitoringNodes = Object.keys(FUNCTIONAL_NODES).filter(id => id.includes('monitoring'));

console.log(`ServiceNow nodes: ${servicenowNodes.length}`);
if (servicenowNodes.length > 0) {
  console.log('✅ ServiceNow nodes found');
  servicenowNodes.slice(0, 5).forEach(id => {
    console.log(`   - ${FUNCTIONAL_NODES[id].label} (${id})`);
  });
  if (servicenowNodes.length > 5) {
    console.log(`   ... and ${servicenowNodes.length - 5} more`);
  }
} else {
  console.log('❌ No ServiceNow nodes found');
}

console.log(`\nMonitoring nodes: ${monitoringNodes.length}`);
if (monitoringNodes.length > 0) {
  console.log('✅ Monitoring nodes found');
  monitoringNodes.slice(0, 5).forEach(id => {
    console.log(`   - ${FUNCTIONAL_NODES[id].label} (${id})`);
  });
  if (monitoringNodes.length > 5) {
    console.log(`   ... and ${monitoringNodes.length - 5} more`);
  }
} else {
  console.log('❌ No Monitoring nodes found');
}

// Summary
console.log('\n=== VALIDATION SUMMARY ===');
const issues = [];
if (orphanNodes.length > 0) issues.push(`${orphanNodes.length} orphan nodes`);
if (nodesWithOldProducts.length > 0) issues.push(`${nodesWithOldProducts.length} nodes with old products`);
if (invalidProductNodes.length > 0) issues.push(`${invalidProductNodes.length} nodes with invalid products`);
if (servicenowNodes.length === 0) issues.push('No ServiceNow nodes');
if (monitoringNodes.length === 0) issues.push('No Monitoring nodes');

if (issues.length === 0) {
  console.log('✅ All validation checks passed!');
} else {
  console.log(`❌ Found ${issues.length} issue(s):`);
  issues.forEach(issue => console.log(`   - ${issue}`));
}

// Output detailed orphan information for fixing
if (orphanNodes.length > 0) {
  console.log('\n=== ORPHAN NODES TO FIX ===');
  const orphansByParent = {};
  orphanNodes.forEach(orphan => {
    if (!orphansByParent[orphan.missingParent]) {
      orphansByParent[orphan.missingParent] = [];
    }
    orphansByParent[orphan.missingParent].push(orphan);
  });
  
  for (const [missingParent, orphans] of Object.entries(orphansByParent)) {
    console.log(`\nMissing parent: ${missingParent}`);
    console.log('Affected nodes:');
    orphans.forEach(orphan => {
      console.log(`  - ${orphan.node} ("${orphan.nodeLabel}")`);
    });
  }
}