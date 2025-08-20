// Quick intent coverage analysis by examining intents.ts files
const fs = require('fs');
const path = require('path');

const domainNames = ['financial', 'healthcare', 'ecommerce', 'enterprise', 'cision'];

console.log('=== Quick Intent Coverage Analysis ===\n');

domainNames.forEach(domainName => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`DOMAIN: ${domainName.toUpperCase()}`);
  console.log('='.repeat(50));
  
  try {
    const intentsPath = path.join(__dirname, 'src/config/domains', domainName, 'intents.ts');
    const nodesPath = path.join(__dirname, 'src/config/domains', domainName, 'nodes.ts');
    
    if (!fs.existsSync(intentsPath)) {
      console.log('❌ Intents file not found');
      return;
    }
    
    const intentsContent = fs.readFileSync(intentsPath, 'utf-8');
    const nodesContent = fs.readFileSync(nodesPath, 'utf-8');
    
    // Count intents
    const intentMatches = intentsContent.match(/\{[^}]*id:\s*['"][^'"]+['"]/g) || [];
    const totalIntents = intentMatches.length;
    
    // Count different types based on keywords
    const clearIntents = (intentsContent.match(/isDuplicate:\s*false/g) || []).length;
    const ambiguousIntents = (intentsContent.match(/isDuplicate:\s*true/g) || []).length;
    const workflowIntents = (intentsContent.match(/isWorkflow:\s*true/g) || []).length;
    
    // Analyze nodes
    const nodeMatches = nodesContent.match(/['"][\w-]+['"]\s*:\s*\{/g) || [];
    const totalNodes = nodeMatches.length;
    
    // Count duplicate patterns (nodes with same label)
    const duplicatePatterns = nodesContent.match(/label:\s*['"]([^'"]+)['"]/g) || [];
    const labelCounts = {};
    duplicatePatterns.forEach(match => {
      const label = match.replace(/label:\s*['"]/, '').replace(/['"]/, '');
      labelCounts[label] = (labelCounts[label] || 0) + 1;
    });
    const duplicateLabels = Object.values(labelCounts).filter(count => count > 1).length;
    
    // Count products
    const productMatches = nodesContent.match(/products:\s*\[[^\]]+\]/g) || [];
    const allProducts = new Set();
    productMatches.forEach(match => {
      const products = match.match(/['"][\w-]+['"]/g) || [];
      products.forEach(p => allProducts.add(p.replace(/['"]/g, '')));
    });
    
    // Count workflow nodes
    const workflowNodeCount = (nodesContent.match(/level:\s*['"]workflow['"]/g) || []).length;
    
    console.log('\n📊 Current Status:');
    console.log(`  Total intents: ${totalIntents}`);
    console.log(`  - Clear: ${clearIntents}`);
    console.log(`  - Ambiguous: ${ambiguousIntents}`);
    console.log(`  - Workflow: ${workflowIntents}`);
    console.log(`  - Untagged: ${totalIntents - clearIntents - ambiguousIntents - workflowIntents}`);
    
    console.log('\n🔍 Domain Analysis:');
    console.log(`  Total nodes: ~${totalNodes}`);
    console.log(`  Potential duplicates: ${duplicateLabels} labels`);
    console.log(`  Products: ${allProducts.size} [${Array.from(allProducts).slice(0, 5).join(', ')}${allProducts.size > 5 ? '...' : ''}]`);
    console.log(`  Workflow nodes: ${workflowNodeCount}`);
    
    // Recommendations
    console.log('\n💡 Recommendations:');
    
    const recommendedClear = Math.min(10, Math.max(5, allProducts.size * 2));
    const recommendedAmbiguous = Math.min(5, Math.max(0, duplicateLabels));
    const recommendedWorkflow = Math.min(3, workflowNodeCount);
    
    const clearNeeded = Math.max(0, recommendedClear - clearIntents);
    const ambiguousNeeded = Math.max(0, recommendedAmbiguous - ambiguousIntents);
    const workflowNeeded = Math.max(0, recommendedWorkflow - workflowIntents);
    
    if (clearNeeded > 0) {
      console.log(`  ⚠️  Add ${clearNeeded} more clear intents (have ${clearIntents}, want ${recommendedClear})`);
    } else {
      console.log(`  ✅ Clear intents: ${clearIntents}/${recommendedClear}`);
    }
    
    if (duplicateLabels > 0 && ambiguousNeeded > 0) {
      console.log(`  ⚠️  Add ${ambiguousNeeded} more ambiguous intents (have ${ambiguousIntents}, want ${recommendedAmbiguous})`);
    } else if (duplicateLabels === 0) {
      console.log(`  ℹ️  No duplicates detected - ambiguous intents optional`);
    } else {
      console.log(`  ✅ Ambiguous intents: ${ambiguousIntents}/${recommendedAmbiguous}`);
    }
    
    if (workflowNodeCount > 0 && workflowNeeded > 0) {
      console.log(`  ⚠️  Add ${workflowNeeded} more workflow intents (have ${workflowIntents}, want ${recommendedWorkflow})`);
    } else if (workflowNodeCount === 0) {
      console.log(`  ℹ️  No workflow nodes in this domain`);
    } else {
      console.log(`  ✅ Workflow intents: ${workflowIntents}/${recommendedWorkflow}`);
    }
    
    // Sample intents for untagged ones
    if (totalIntents - clearIntents - ambiguousIntents - workflowIntents > 0) {
      console.log(`\n  ⚠️  ${totalIntents - clearIntents - ambiguousIntents - workflowIntents} intents are not tagged with isDuplicate/isWorkflow`);
      console.log(`      Consider adding these flags for proper categorization`);
    }
    
  } catch (error) {
    console.error(`❌ Error:`, error.message);
  }
});

console.log('\n' + '='.repeat(50));
console.log('📊 OVERALL RECOMMENDATIONS');
console.log('='.repeat(50));
console.log(`
To ensure proper intent coverage:

1. TAG ALL INTENTS with appropriate flags:
   - isDuplicate: false (for clear intents)
   - isDuplicate: true (for ambiguous intents)  
   - isWorkflow: true (for workflow intents)

2. CLEAR INTENTS (5-10 per domain):
   - Natural language variations
   - Cover all products
   - Mix of action/step/scenario/outcome levels

3. AMBIGUOUS INTENTS (based on duplicates):
   - Use generic phrasing
   - Test context-based resolution
   - Focus on nodes that exist in multiple products

4. WORKFLOW INTENTS (if applicable):
   - Map to workflow nodes
   - Cross-product processes
`);