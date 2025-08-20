// Analyze intent coverage across all domains
const fs = require('fs');
const path = require('path');

const domainNames = ['financial', 'healthcare', 'ecommerce', 'enterprise', 'cision'];

console.log('=== Intent Coverage Analysis ===\n');

domainNames.forEach(domainName => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`DOMAIN: ${domainName.toUpperCase()}`);
  console.log('='.repeat(60));
  
  try {
    // Load domain nodes and intents
    const nodesModule = require(`./src/config/domains/${domainName}/nodes`);
    const intentsModule = require(`./src/config/domains/${domainName}/intents`);
    
    const FUNCTIONAL_NODES = nodesModule.FUNCTIONAL_NODES;
    const USER_INTENTS = intentsModule.USER_INTENTS;
    
    console.log('\n📊 Current Intent Status:');
    console.log(`  Total intents: ${USER_INTENTS.length}`);
    
    // Categorize existing intents
    const clearIntents = USER_INTENTS.filter(i => !i.isDuplicate && !i.isWorkflow);
    const ambiguousIntents = USER_INTENTS.filter(i => i.isDuplicate);
    const workflowIntents = USER_INTENTS.filter(i => i.isWorkflow);
    
    console.log(`  Clear intents: ${clearIntents.length}`);
    console.log(`  Ambiguous intents: ${ambiguousIntents.length}`);
    console.log(`  Workflow intents: ${workflowIntents.length}`);
    
    // Analyze nodes for duplicates
    const nodeGroups = new Map();
    let duplicateCount = 0;
    let workflowNodeCount = 0;
    const products = new Set();
    const levelCounts = {};
    
    Object.entries(FUNCTIONAL_NODES).forEach(([nodeId, node]) => {
      // Count products
      if (node.products) {
        node.products.forEach(p => products.add(p));
      }
      
      // Count levels
      levelCounts[node.level] = (levelCounts[node.level] || 0) + 1;
      
      // Count workflow nodes
      if (node.level === 'workflow') {
        workflowNodeCount++;
      }
      
      // Find duplicates (skip shared/unified/workflow)
      if (!nodeId.includes('-shared') && !nodeId.includes('-unified') && node.level !== 'workflow') {
        const groupKey = `${node.level}-${node.label.toLowerCase()}`;
        
        if (!nodeGroups.has(groupKey)) {
          nodeGroups.set(groupKey, []);
        }
        nodeGroups.get(groupKey).push(nodeId);
      }
    });
    
    // Count duplicate groups
    const duplicateGroups = Array.from(nodeGroups.values()).filter(group => group.length > 1);
    duplicateCount = duplicateGroups.reduce((sum, group) => sum + group.length, 0);
    
    console.log('\n🤖 Domain Analysis:');
    console.log(`  Total nodes: ${Object.keys(FUNCTIONAL_NODES).length}`);
    console.log(`  Duplicate nodes: ${duplicateCount}`);
    console.log(`  Duplicate groups: ${duplicateGroups.length}`);
    console.log(`  Products: ${products.size} [${Array.from(products).join(', ')}]`);
    console.log(`  Workflow nodes: ${workflowNodeCount}`);
    
    console.log('\n📊 Level Distribution:');
    Object.entries(levelCounts).forEach(([level, count]) => {
      console.log(`    ${level}: ${count} nodes`);
    });
    
    // Recommendations
    console.log('\n💡 Recommendations:');
    
    const recommendedClear = Math.min(10, Math.max(5, products.size * 2));
    const recommendedAmbiguous = Math.min(5, duplicateGroups.length);
    const recommendedWorkflow = Math.min(3, workflowNodeCount);
    
    if (clearIntents.length < recommendedClear) {
      console.log(`  ⚠️  Add ${recommendedClear - clearIntents.length} more clear intents (target: ${recommendedClear})`);
      console.log(`      - Ensure at least 1 intent per product`);
      console.log(`      - Cover action, step, scenario, and outcome levels`);
    } else {
      console.log(`  ✅ Clear intents coverage is good (${clearIntents.length}/${recommendedClear})`);
    }
    
    if (duplicateGroups.length > 0 && ambiguousIntents.length < recommendedAmbiguous) {
      console.log(`  ⚠️  Add ${recommendedAmbiguous - ambiguousIntents.length} more ambiguous intents (target: ${recommendedAmbiguous})`);
      console.log(`      - Focus on nodes that appear in multiple products`);
      
      // Show some duplicate examples
      if (duplicateGroups.length > 0) {
        console.log(`      Examples of duplicate nodes to consider:`);
        duplicateGroups.slice(0, 3).forEach(group => {
          const firstNode = FUNCTIONAL_NODES[group[0]];
          if (firstNode) {
            console.log(`        • "${firstNode.label}" (${firstNode.level}) - ${group.length} instances`);
          }
        });
      }
    } else if (duplicateGroups.length === 0) {
      console.log(`  ℹ️  No duplicate nodes found - ambiguous intents not needed`);
    } else {
      console.log(`  ✅ Ambiguous intents coverage is good (${ambiguousIntents.length}/${recommendedAmbiguous})`);
    }
    
    if (workflowNodeCount > 0 && workflowIntents.length < recommendedWorkflow) {
      console.log(`  ⚠️  Add ${recommendedWorkflow - workflowIntents.length} more workflow intents (target: ${recommendedWorkflow})`);
    } else if (workflowNodeCount === 0) {
      console.log(`  ℹ️  No workflow nodes in this domain`);
    } else {
      console.log(`  ✅ Workflow intents coverage is good (${workflowIntents.length}/${recommendedWorkflow})`);
    }
    
    // Product coverage check
    console.log('\n🏷️  Product Coverage in Clear Intents:');
    const productCoverage = {};
    clearIntents.forEach(intent => {
      const node = FUNCTIONAL_NODES[intent.entryNode];
      if (node && node.products) {
        node.products.forEach(p => {
          productCoverage[p] = (productCoverage[p] || 0) + 1;
        });
      }
    });
    
    products.forEach(product => {
      const count = productCoverage[product] || 0;
      const status = count > 0 ? '✅' : '❌';
      console.log(`    ${status} ${product}: ${count} intents`);
    });
    
    // Level coverage check
    console.log('\n📈 Level Coverage in Intents:');
    const levelCoverage = {};
    [...clearIntents, ...ambiguousIntents].forEach(intent => {
      levelCoverage[intent.entryLevel] = (levelCoverage[intent.entryLevel] || 0) + 1;
    });
    
    ['action', 'step', 'scenario', 'outcome'].forEach(level => {
      const count = levelCoverage[level] || 0;
      const status = count > 0 ? '✅' : '❌';
      console.log(`    ${status} ${level}: ${count} intents`);
    });
    
  } catch (error) {
    console.error(`\n❌ Error analyzing ${domainName}:`, error.message);
  }
});

console.log('\n' + '='.repeat(60));
console.log('📊 SUMMARY');
console.log('='.repeat(60));
console.log('\nIntent coverage analysis complete!');
console.log('\nBest Practices:');
console.log('1. Clear Intents (5-10 per domain):');
console.log('   - At least 1 per product');
console.log('   - Cover all hierarchy levels');
console.log('   - Use natural language variations');
console.log('\n2. Ambiguous Intents (3-5 per domain):');
console.log('   - Target duplicate nodes');
console.log('   - Test context resolution');
console.log('   - Use generic/ambiguous phrasing');
console.log('\n3. Workflow Intents (1-3 per domain):');
console.log('   - Map to workflow nodes');
console.log('   - Cross-product orchestration');
console.log('   - Long-running processes');
console.log('');