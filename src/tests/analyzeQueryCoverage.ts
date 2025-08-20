// Analyze and validate query coverage across all domains
import { generateQueriesForDomain, validateQueryCoverage } from '../utils/queryGenerator';
import * as fs from 'fs';
import * as path from 'path';

const domainNames = ['financial', 'healthcare', 'ecommerce', 'enterprise', 'cision'];

console.log('=== Query Coverage Analysis ===\n');

domainNames.forEach(domainName => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`DOMAIN: ${domainName.toUpperCase()}`);
  console.log('='.repeat(60));
  
  try {
    // Load domain nodes and queries
    const nodesModule = require(`../config/domains/${domainName}/nodes`);
    const queriesModule = require(`../config/domains/${domainName}/queries`);
    
    const FUNCTIONAL_NODES = nodesModule.FUNCTIONAL_NODES;
    const USER_QUERIES = queriesModule.USER_QUERIES;
    
    console.log('\n📊 Current Query Status:');
    console.log(`  Total queries: ${USER_QUERIES.length}`);
    
    // Categorize existing queries
    const clearQueries = USER_QUERIES.filter((i: any) => !i.isDuplicate && !i.isWorkflow);
    const ambiguousQueries = USER_QUERIES.filter((i: any) => i.isDuplicate);
    const workflowQueries = USER_QUERIES.filter((i: any) => i.isWorkflow);
    
    console.log(`  Clear queries: ${clearQueries.length}`);
    console.log(`  Ambiguous queries: ${ambiguousQueries.length}`);
    console.log(`  Workflow queries: ${workflowQueries.length}`);
    
    // Generate recommended queries
    console.log('\n🤖 Automated Analysis:');
    const generatedResult = generateQueriesForDomain(FUNCTIONAL_NODES, domainName);
    
    console.log(`  Total nodes: ${generatedResult.stats.totalNodes}`);
    console.log(`  Duplicate nodes: ${generatedResult.stats.duplicateNodes}`);
    console.log(`  Products: ${generatedResult.stats.productsCount}`);
    console.log(`  Workflow nodes: ${generatedResult.stats.workflowNodes}`);
    
    console.log('\n📝 Generated Query Recommendations:');
    console.log(`  Clear queries: ${generatedResult.clearQueries.length}`);
    console.log(`  Ambiguous queries: ${generatedResult.ambiguousQueries.length}`);
    console.log(`  Workflow queries: ${generatedResult.workflowQueries.length}`);
    
    // Validate coverage
    const validation = validateQueryCoverage(generatedResult);
    
    if (validation.isValid) {
      console.log('\n✅ Query coverage is good!');
    } else {
      console.log('\n⚠️  Coverage Issues:');
      validation.issues.forEach(issue => console.log(`  - ${issue}`));
      
      console.log('\n💡 Suggestions:');
      validation.suggestions.forEach(suggestion => console.log(`  - ${suggestion}`));
    }
    
    // Show sample generated queries
    console.log('\n📋 Sample Generated Queries:');
    
    if (generatedResult.clearQueries.length > 0) {
      console.log('\n  Clear Query Examples:');
      generatedResult.clearQueries.slice(0, 3).forEach(query => {
        console.log(`    - "${query.text}" → ${query.entryNode} (${query.entryLevel})`);
      });
    }
    
    if (generatedResult.ambiguousQueries.length > 0) {
      console.log('\n  Ambiguous Query Examples:');
      generatedResult.ambiguousQueries.slice(0, 3).forEach(query => {
        console.log(`    - "${query.text}" → ${query.entryNode} (${query.products?.length || 0} products)`);
      });
    }
    
    if (generatedResult.workflowQueries.length > 0) {
      console.log('\n  Workflow Query Examples:');
      generatedResult.workflowQueries.slice(0, 3).forEach(query => {
        console.log(`    - "${query.text}" → ${query.entryNode}`);
      });
    }
    
    // Compare with existing queries
    console.log('\n🔄 Comparison with Existing:');
    const existingClear = clearQueries.length;
    const existingAmbiguous = ambiguousQueries.length;
    const existingWorkflow = workflowQueries.length;
    
    const recClear = generatedResult.clearQueries.length;
    const recAmbiguous = generatedResult.ambiguousQueries.length;
    const recWorkflow = generatedResult.workflowQueries.length;
    
    if (existingClear < recClear) {
      console.log(`  ⚠️  Consider adding ${recClear - existingClear} more clear queries`);
    }
    if (existingAmbiguous < recAmbiguous) {
      console.log(`  ⚠️  Consider adding ${recAmbiguous - existingAmbiguous} more ambiguous queries`);
    }
    if (existingWorkflow < recWorkflow) {
      console.log(`  ⚠️  Consider adding ${recWorkflow - existingWorkflow} more workflow queries`);
    }
    
    // Product coverage analysis
    console.log('\n🏷️  Product Coverage:');
    const productCoverage = generatedResult.stats.clearQueriesCoverage;
    Object.entries(productCoverage).forEach(([product, count]) => {
      console.log(`    ${product}: ${count} clear queries`);
    });
    
    // Level coverage analysis  
    console.log('\n📊 Level Distribution in Domain:');
    Object.entries(generatedResult.stats.levelCoverage).forEach(([level, count]) => {
      console.log(`    ${level}: ${count} nodes`);
    });
    
    // Export generated queries for review
    const outputDir = path.join(__dirname, '../../generated-queries');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputFile = path.join(outputDir, `${domainName}-queries.json`);
    fs.writeFileSync(outputFile, JSON.stringify({
      domain: domainName,
      generated: generatedResult,
      validation,
      existing: {
        total: USER_QUERIES.length,
        clear: existingClear,
        ambiguous: existingAmbiguous,
        workflow: existingWorkflow
      }
    }, null, 2));
    
    console.log(`\n💾 Full analysis saved to: generated-queries/${domainName}-queries.json`);
    
  } catch (error) {
    console.error(`\n❌ Error analyzing ${domainName}:`, error);
  }
});

console.log('\n' + '='.repeat(60));
console.log('📊 SUMMARY');
console.log('='.repeat(60));
console.log('\nQuery coverage analysis complete!');
console.log('Check generated-queries/ directory for detailed recommendations.');
console.log('\nNext steps:');
console.log('1. Review generated query recommendations');
console.log('2. Update domain queries.ts files with appropriate selections');
console.log('3. Ensure each domain has:');
console.log('   - 5-10 clear queries covering all products');
console.log('   - 3-5 ambiguous queries for testing context resolution');
console.log('   - 1-3 workflow queries (where applicable)');
console.log('');