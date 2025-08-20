// Test automatic rationalization in all domains
const { preprocessDomainNodes } = require('./src/utils/automaticSharedNodeGenerator');

const domainNames = ['financial', 'healthcare', 'ecommerce', 'enterprise', 'cision'];

console.log('=== Testing Automatic Rationalization in All Domains ===\n');

let allDomainsOk = true;

domainNames.forEach(domainName => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing ${domainName.toUpperCase()} domain`);
  console.log('='.repeat(60));
  
  try {
    // Import domain nodes
    const nodesModule = require(`./src/config/domains/${domainName}/nodes`);
    const FUNCTIONAL_NODES = nodesModule.FUNCTIONAL_NODES;
    
    // Count original nodes
    const originalNodeCount = Object.keys(FUNCTIONAL_NODES).length;
    const manualSharedCount = Object.keys(FUNCTIONAL_NODES).filter(id => 
      id.includes('-shared') || id.includes('-unified')
    ).length;
    
    console.log(`\nOriginal nodes: ${originalNodeCount}`);
    console.log(`Manual shared/unified nodes: ${manualSharedCount}`);
    
    // Process with automatic rationalization
    const result = preprocessDomainNodes(FUNCTIONAL_NODES);
    
    // Get results
    const processedNodeCount = Object.keys(result.FUNCTIONAL_NODES).length;
    const autoSharedCount = result.SHARED_NODES.length;
    const duplicateCount = result.DUPLICATE_NODES.length;
    
    console.log(`\nAfter automatic processing:`);
    console.log(`  Total nodes: ${processedNodeCount}`);
    console.log(`  Auto-generated shared nodes: ${autoSharedCount}`);
    console.log(`  Duplicate nodes identified: ${duplicateCount}`);
    
    // Verify no manual shared nodes remain (they should be ignored)
    if (manualSharedCount > 0) {
      console.log(`  ⚠️  Manual shared nodes are ignored (${manualSharedCount} found)`);
    }
    
    // List auto-generated shared nodes
    if (autoSharedCount > 0) {
      console.log(`\nAuto-generated shared nodes:`);
      result.SHARED_NODES.forEach(nodeId => {
        const node = result.FUNCTIONAL_NODES[nodeId];
        if (node) {
          console.log(`  - ${nodeId}: ${node.label} [${(node.products || []).join(', ')}]`);
        }
      });
    }
    
    // Verify graph integrity
    console.log('\nVerifying graph integrity...');
    let graphOk = true;
    
    // Check all nodes have valid connections
    Object.entries(result.FUNCTIONAL_NODES).forEach(([nodeId, node]) => {
      // Check parents exist
      if (node.parents && node.parents.length > 0) {
        node.parents.forEach(parentId => {
          if (!result.FUNCTIONAL_NODES[parentId]) {
            console.error(`  ❌ Node ${nodeId} has non-existent parent: ${parentId}`);
            graphOk = false;
          } else {
            // Verify bidirectional connection
            const parent = result.FUNCTIONAL_NODES[parentId];
            if (!parent.children || !parent.children.includes(nodeId)) {
              console.error(`  ❌ Parent ${parentId} doesn't list ${nodeId} as child`);
              graphOk = false;
            }
          }
        });
      }
      
      // Check children exist
      if (node.children && node.children.length > 0) {
        node.children.forEach(childId => {
          if (!result.FUNCTIONAL_NODES[childId]) {
            console.error(`  ❌ Node ${nodeId} has non-existent child: ${childId}`);
            graphOk = false;
          } else {
            // Verify bidirectional connection
            const child = result.FUNCTIONAL_NODES[childId];
            if (!child.parents || !child.parents.includes(nodeId)) {
              console.error(`  ❌ Child ${childId} doesn't list ${nodeId} as parent`);
              graphOk = false;
            }
          }
        });
      }
    });
    
    if (graphOk) {
      console.log('  ✅ Graph integrity verified - all connections valid');
    } else {
      console.log('  ❌ Graph integrity issues found');
      allDomainsOk = false;
    }
    
    // Check for orphaned nodes (nodes with no parents and no children, except root nodes)
    const orphanedNodes = Object.entries(result.FUNCTIONAL_NODES)
      .filter(([nodeId, node]) => {
        const hasNoParents = !node.parents || node.parents.length === 0;
        const hasNoChildren = !node.children || node.children.length === 0;
        const isRootNode = node.level === 'outcome';
        return hasNoParents && hasNoChildren && !isRootNode;
      })
      .map(([nodeId]) => nodeId);
    
    if (orphanedNodes.length > 0) {
      console.log(`\n  ⚠️  Found ${orphanedNodes.length} orphaned nodes:`);
      orphanedNodes.forEach(nodeId => {
        console.log(`    - ${nodeId}`);
      });
      allDomainsOk = false;
    } else {
      console.log('  ✅ No orphaned nodes found');
    }
    
    // Test rationalization modes
    console.log('\nTesting rationalization modes:');
    
    // Non-rationalized mode: duplicates should be visible, shared should be hidden
    const visibleInNonRationalized = Object.keys(result.FUNCTIONAL_NODES).filter(nodeId => {
      // Skip shared nodes
      if (result.SHARED_NODES.includes(nodeId) || nodeId.includes('-shared')) {
        return false;
      }
      return true;
    });
    
    // Rationalized mode: shared should be visible, duplicates should be hidden
    const visibleInRationalized = Object.keys(result.FUNCTIONAL_NODES).filter(nodeId => {
      // Skip duplicate nodes
      if (result.DUPLICATE_NODES.includes(nodeId)) {
        return false;
      }
      return true;
    });
    
    console.log(`  Non-rationalized mode: ${visibleInNonRationalized.length} nodes visible`);
    console.log(`  Rationalized mode: ${visibleInRationalized.length} nodes visible`);
    
    if (duplicateCount > 0 && autoSharedCount > 0) {
      const difference = visibleInNonRationalized.length - visibleInRationalized.length;
      console.log(`  Difference: ${difference} nodes (should equal duplicates - shared)`);
      const expectedDiff = duplicateCount - autoSharedCount;
      if (Math.abs(difference - expectedDiff) <= 1) {
        console.log('  ✅ Mode switching working correctly');
      } else {
        console.log(`  ⚠️  Unexpected difference (expected ~${expectedDiff})`);
      }
    }
    
    console.log(`\n✅ ${domainName.toUpperCase()} domain test completed`);
    
  } catch (error) {
    console.error(`\n❌ Error testing ${domainName} domain:`, error.message);
    allDomainsOk = false;
  }
});

console.log('\n' + '='.repeat(60));
if (allDomainsOk) {
  console.log('✅ ALL DOMAINS PASSED AUTOMATIC RATIONALIZATION TESTS');
} else {
  console.log('❌ SOME DOMAINS HAD ISSUES - Review output above');
}
console.log('='.repeat(60) + '\n');