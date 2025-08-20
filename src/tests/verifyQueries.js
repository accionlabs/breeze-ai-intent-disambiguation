// Test script to verify query generation and categorization
const fs = require('fs');
const path = require('path');

const domains = ['financial', 'healthcare', 'ecommerce', 'enterprise', 'cision'];

console.log('='.repeat(60));
console.log('QUERY VERIFICATION REPORT');
console.log('='.repeat(60));

let totalClear = 0;
let totalAmbiguous = 0;
let totalWorkflow = 0;
let totalQuerys = 0;

domains.forEach(domain => {
  const queryPath = path.join(__dirname, `../config/domains/${domain}/queries.ts`);
  const content = fs.readFileSync(queryPath, 'utf8');
  
  // Extract querys array
  const querysMatch = content.match(/export const USER_QUERIES[^=]*=\s*\[([\s\S]*?)\];/);
  if (!querysMatch) {
    console.error(`Failed to parse querys for ${domain}`);
    return;
  }
  
  // Count query types
  const clearCount = (content.match(/isDuplicate: false,\s*isWorkflow: false/g) || []).length;
  const ambiguousCount = (content.match(/isDuplicate: true,\s*isWorkflow: false/g) || []).length;
  const workflowCount = (content.match(/isDuplicate: false,\s*isWorkflow: true/g) || []).length;
  const total = clearCount + ambiguousCount + workflowCount;
  
  // Verify entry levels
  const hasActionLevel = content.includes("entryLevel: 'action'");
  const hasStepLevel = content.includes("entryLevel: 'step'");
  const hasScenarioLevel = content.includes("entryLevel: 'scenario'");
  const hasOutcomeLevel = content.includes("entryLevel: 'outcome'");
  const hasWorkflowLevel = content.includes("entryLevel: 'workflow'");
  
  console.log(`\n${domain.toUpperCase()} DOMAIN`);
  console.log('-'.repeat(40));
  console.log(`Clear Querys:     ${clearCount} ${clearCount >= 5 && clearCount <= 10 ? '✅' : '❌'} (target: 5-10)`);
  console.log(`Ambiguous Querys: ${ambiguousCount} ${ambiguousCount >= 3 && ambiguousCount <= 5 ? '✅' : ambiguousCount < 3 ? '⚠️' : '❌'} (target: 3-5)`);
  console.log(`Workflow Querys:  ${workflowCount} ${domain === 'cision' ? (workflowCount >= 1 && workflowCount <= 3 ? '✅' : '❌') : (workflowCount === 0 ? '✅' : '❌')} (target: ${domain === 'cision' ? '1-3' : '0'})`);
  console.log(`Total:             ${total}`);
  
  console.log('\nHierarchy Coverage:');
  if (hasActionLevel) console.log('  ✅ Action level');
  if (hasStepLevel) console.log('  ✅ Step level');
  if (hasScenarioLevel) console.log('  ✅ Scenario level');
  if (hasOutcomeLevel) console.log('  ✅ Outcome level');
  if (hasWorkflowLevel) console.log('  ✅ Workflow level');
  
  // Check for duplicate detection
  if (ambiguousCount > 0) {
    console.log('\n  ✅ Duplicate nodes detected and mapped');
  }
  
  totalClear += clearCount;
  totalAmbiguous += ambiguousCount;
  totalWorkflow += workflowCount;
  totalQuerys += total;
});

console.log('\n' + '='.repeat(60));
console.log('SUMMARY');
console.log('='.repeat(60));
console.log(`Total Clear Querys:     ${totalClear}`);
console.log(`Total Ambiguous Querys: ${totalAmbiguous}`);
console.log(`Total Workflow Querys:  ${totalWorkflow}`);
console.log(`Grand Total:             ${totalQuerys}`);

// Verify query categorization logic
console.log('\n' + '='.repeat(60));
console.log('CATEGORIZATION VERIFICATION');
console.log('='.repeat(60));

domains.forEach(domain => {
  const queryPath = path.join(__dirname, `../config/domains/${domain}/queries.ts`);
  const content = fs.readFileSync(queryPath, 'utf8');
  
  // Check for proper flagging
  const hasProperFlags = content.includes('isDuplicate:') && content.includes('isWorkflow:');
  
  if (hasProperFlags) {
    console.log(`✅ ${domain}: Proper query flags (isDuplicate, isWorkflow)`);
  } else {
    console.log(`❌ ${domain}: Missing query flags`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('TEST COMPLETE');
console.log('='.repeat(60));