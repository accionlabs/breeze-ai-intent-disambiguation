// Quick test to verify domain validation works with workflow nodes
import { DomainValidator } from './domainValidation';
import { FUNCTIONAL_NODES } from '../config/domains/cision/nodes';
import { USER_QUERIES } from '../config/domains/cision/queries';

const validator = new DomainValidator();
const results = validator.validateDomain('cision', FUNCTIONAL_NODES, USER_QUERIES);

// Find the Product Tree Independence Check result
const productTreeResult = results.find(r => r.test === 'Product Tree Independence Check');

if (productTreeResult) {
  console.log('\n=== Product Tree Independence Check ===');
  console.log(`Passed: ${productTreeResult.passed}`);
  
  if (productTreeResult.errors.length > 0) {
    console.log('\nErrors:');
    productTreeResult.errors.forEach(err => console.log(`  - ${err}`));
  }
  
  if (productTreeResult.warnings.length > 0) {
    console.log('\nWarnings:');
    productTreeResult.warnings.forEach(warn => console.log(`  - ${warn}`));
  }
  
  // Check if workflow nodes are being handled correctly
  const workflowNodes = Object.entries(FUNCTIONAL_NODES)
    .filter(([id, node]) => node.level === 'workflow');
  
  console.log(`\nFound ${workflowNodes.length} workflow nodes:`);
  workflowNodes.forEach(([id, node]) => {
    console.log(`  - ${id}: ${node.label}`);
    console.log(`    Products: ${node.products?.join(', ')}`);
  });
  
  // Check if any errors mention workflow nodes incorrectly
  const workflowErrors = productTreeResult.errors.filter(err => 
    err.includes('workflow-') || err.includes('Workflow')
  );
  
  if (workflowErrors.length > 0) {
    console.log('\n⚠️ Errors related to workflow nodes (should be 0):');
    workflowErrors.forEach(err => console.log(`  - ${err}`));
  } else {
    console.log('\n✅ No errors related to workflow nodes - validation working correctly!');
  }
} else {
  console.log('Product Tree Independence Check not found in results');
}

// Show summary
console.log('\n=== Overall Validation Summary ===');
const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
const passedTests = results.filter(r => r.passed).length;

console.log(`Tests Passed: ${passedTests}/${results.length}`);
console.log(`Total Errors: ${totalErrors}`);
console.log(`Total Warnings: ${totalWarnings}`);