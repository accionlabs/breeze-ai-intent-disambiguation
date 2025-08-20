// Test script to verify workflow implementation across all domains
const fs = require('fs');
const path = require('path');

const domains = ['financial', 'healthcare', 'ecommerce', 'enterprise', 'cision'];

console.log('='.repeat(60));
console.log('WORKFLOW VERIFICATION REPORT');
console.log('='.repeat(60));

let totalWorkflowNodes = 0;
let totalWorkflowQuerys = 0;
let allErrors = [];

domains.forEach(domain => {
  console.log(`\n${domain.toUpperCase()} DOMAIN`);
  console.log('-'.repeat(40));
  
  try {
    // Load nodes
    const nodesPath = path.join(__dirname, `../config/domains/${domain}/nodes.ts`);
    const nodesContent = fs.readFileSync(nodesPath, 'utf8');
    
    // Find workflow nodes
    const workflowNodeMatches = nodesContent.match(/level:\s*'workflow'/g) || [];
    const workflowNodes = [];
    
    // Extract workflow node details
    const nodePattern = /'(workflow-[^']+)':\s*{[^}]*label:\s*'([^']+)'[^}]*level:\s*'workflow'[^}]*children:\s*\[([^\]]+)\]/g;
    let match;
    while ((match = nodePattern.exec(nodesContent)) !== null) {
      const [, id, label, children] = match;
      const childrenArray = children.match(/'([^']+)'/g)?.map(c => c.replace(/'/g, '')) || [];
      workflowNodes.push({ id, label, children: childrenArray });
    }
    
    console.log(`Found ${workflowNodes.length} workflow nodes:`);
    workflowNodes.forEach(node => {
      console.log(`  ✅ ${node.id}: "${node.label}"`);
      console.log(`     Orchestrates ${node.children.length} outcomes: ${node.children.join(', ')}`);
    });
    
    // Load querys
    const querysPath = path.join(__dirname, `../config/domains/${domain}/queries.ts`);
    const querysContent = fs.readFileSync(querysPath, 'utf8');
    
    // Find workflow querys
    const workflowQueryMatches = querysContent.match(/isWorkflow:\s*true/g) || [];
    const workflowQuerys = [];
    
    // Extract workflow query details
    const queryPattern = /id:\s*'([^']+)'[^}]*text:\s*'([^']+)'[^}]*entryNode:\s*'([^']+)'[^}]*isWorkflow:\s*true/g;
    while ((match = queryPattern.exec(querysContent)) !== null) {
      const [, id, text, entryNode] = match;
      workflowQuerys.push({ id, text, entryNode });
    }
    
    console.log(`\nFound ${workflowQuerys.length} workflow querys:`);
    workflowQuerys.forEach(query => {
      console.log(`  ✅ ${query.id}: "${query.text}"`);
      console.log(`     Maps to: ${query.entryNode}`);
    });
    
    // Verify mappings
    console.log('\nVerifying query-to-node mappings:');
    let mappingErrors = [];
    
    workflowQuerys.forEach(query => {
      const matchingNode = workflowNodes.find(node => node.id === query.entryNode);
      if (matchingNode) {
        console.log(`  ✅ Query "${query.text}" correctly maps to node "${matchingNode.label}"`);
      } else {
        mappingErrors.push(`  ❌ Query "${query.text}" references non-existent node: ${query.entryNode}`);
      }
    });
    
    if (mappingErrors.length > 0) {
      mappingErrors.forEach(error => console.log(error));
      allErrors.push(...mappingErrors);
    }
    
    // Check for orphaned workflow nodes (nodes without querys)
    const orphanedNodes = workflowNodes.filter(node => 
      !workflowQuerys.some(query => query.entryNode === node.id)
    );
    
    if (orphanedNodes.length > 0) {
      console.log('\n⚠️  Workflow nodes without querys:');
      orphanedNodes.forEach(node => {
        console.log(`  - ${node.id}: "${node.label}"`);
      });
    }
    
    totalWorkflowNodes += workflowNodes.length;
    totalWorkflowQuerys += workflowQuerys.length;
    
  } catch (error) {
    console.error(`❌ Error processing ${domain}: ${error.message}`);
    allErrors.push(`${domain}: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('SUMMARY');
console.log('='.repeat(60));
console.log(`Total Workflow Nodes:   ${totalWorkflowNodes}`);
console.log(`Total Workflow Querys: ${totalWorkflowQuerys}`);

if (allErrors.length > 0) {
  console.log('\n❌ Errors found:');
  allErrors.forEach(error => console.log(`  - ${error}`));
} else {
  console.log('\n✅ All workflows verified successfully!');
}

// Test workflow resolution logic
console.log('\n' + '='.repeat(60));
console.log('WORKFLOW BEHAVIOR TEST');
console.log('='.repeat(60));
console.log('Workflow querys should:');
console.log('  1. Be selectable in the UI');
console.log('  2. NOT resolve when workflows are OFF (show error message)');
console.log('  3. RESOLVE when workflows are ON (show cross-product actions)');
console.log('\nTo test:');
console.log('  1. Select any workflow query with Workflows OFF');
console.log('  2. Verify confidence score is 0% and error message appears');
console.log('  3. Turn Workflows ON');
console.log('  4. Verify workflow resolves with 100% confidence');
console.log('  5. Verify multiple products are activated in the resolution');