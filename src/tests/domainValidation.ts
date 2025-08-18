// Domain configuration validation tests
// These tests ensure that domain configurations are consistent and well-formed

import { FunctionalNode, UserIntent } from '../types';

interface ValidationResult {
  domain: string;
  test: string;
  passed: boolean;
  errors: string[];
  warnings: string[];
}

export class DomainValidator {
  private results: ValidationResult[] = [];
  
  // Validate a single domain configuration
  validateDomain(
    domainName: string,
    FUNCTIONAL_NODES: Record<string, FunctionalNode>,
    USER_INTENTS: UserIntent[],
    RATIONALIZED_NODE_ALTERNATIVES?: Record<string, Record<string, string>>
  ): ValidationResult[] {
    const domainResults: ValidationResult[] = [];
    
    // Test 1: Check for orphaned nodes (nodes not referenced by any parent)
    domainResults.push(this.checkOrphanedNodes(domainName, FUNCTIONAL_NODES));
    
    // Test 2: Check parent-child relationship consistency
    domainResults.push(this.checkParentChildConsistency(domainName, FUNCTIONAL_NODES));
    
    // Test 3: Check for duplicate labels and proper rationalization
    domainResults.push(this.checkDuplicateLabels(domainName, FUNCTIONAL_NODES));
    
    // Test 4: Check that all intents reference valid nodes
    domainResults.push(this.checkIntentReferences(domainName, FUNCTIONAL_NODES, USER_INTENTS));
    
    // Test 5: Check that non-shared steps have action children
    domainResults.push(this.checkStepActions(domainName, FUNCTIONAL_NODES));
    
    // Test 6: Check that all nodes have required properties
    domainResults.push(this.checkRequiredProperties(domainName, FUNCTIONAL_NODES));
    
    // Test 7: Check for circular dependencies
    domainResults.push(this.checkCircularDependencies(domainName, FUNCTIONAL_NODES));
    
    // Test 8: Check product consistency
    domainResults.push(this.checkProductConsistency(domainName, FUNCTIONAL_NODES));
    
    // Test 9: Check rationalization mapping if provided
    if (RATIONALIZED_NODE_ALTERNATIVES) {
      domainResults.push(this.checkRationalizationMapping(domainName, FUNCTIONAL_NODES, RATIONALIZED_NODE_ALTERNATIVES));
    }
    
    return domainResults;
  }
  
  // Check for orphaned nodes
  private checkOrphanedNodes(domain: string, nodes: Record<string, FunctionalNode>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const referencedNodes = new Set<string>();
    
    // Collect all nodes that are referenced as children
    Object.values(nodes).forEach(node => {
      node.children.forEach(childId => referencedNodes.add(childId));
    });
    
    // Check each node
    Object.entries(nodes).forEach(([nodeId, node]) => {
      // Skip product-level nodes (they're roots)
      if (node.level === 'product') return;
      
      // Check if node is referenced or has parents
      const isReferenced = referencedNodes.has(nodeId);
      const hasParents = node.parents && node.parents.length > 0;
      
      if (!isReferenced && !hasParents) {
        errors.push(`Orphaned node: ${nodeId} (${node.label}) - not referenced by any parent`);
      }
    });
    
    return {
      domain,
      test: 'Orphaned Nodes Check',
      passed: errors.length === 0,
      errors,
      warnings
    };
  }
  
  // Check parent-child relationship consistency
  private checkParentChildConsistency(domain: string, nodes: Record<string, FunctionalNode>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    Object.entries(nodes).forEach(([nodeId, node]) => {
      // Check that all children exist and reference this node as parent
      node.children.forEach(childId => {
        const child = nodes[childId];
        if (!child) {
          errors.push(`Missing child: ${nodeId} references non-existent child ${childId}`);
        } else if (!child.parents.includes(nodeId)) {
          errors.push(`Inconsistent relationship: ${nodeId} has child ${childId}, but ${childId} doesn't list ${nodeId} as parent`);
        }
      });
      
      // Check that all parents exist and reference this node as child
      node.parents.forEach(parentId => {
        const parent = nodes[parentId];
        if (!parent) {
          errors.push(`Missing parent: ${nodeId} references non-existent parent ${parentId}`);
        } else if (!parent.children.includes(nodeId)) {
          errors.push(`Inconsistent relationship: ${nodeId} has parent ${parentId}, but ${parentId} doesn't list ${nodeId} as child`);
        }
      });
    });
    
    return {
      domain,
      test: 'Parent-Child Consistency',
      passed: errors.length === 0,
      errors,
      warnings
    };
  }
  
  // Check for duplicate labels and proper rationalization
  private checkDuplicateLabels(domain: string, nodes: Record<string, FunctionalNode>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const labelMap: Record<string, string[]> = {};
    const sharedNodeMap: Record<string, string[]> = {};
    
    // First, collect all nodes and shared nodes by label
    Object.entries(nodes).forEach(([nodeId, node]) => {
      const key = `${node.level}:${node.label.toLowerCase()}`;
      
      if (nodeId.includes('-shared')) {
        // Track shared nodes separately
        if (!sharedNodeMap[key]) sharedNodeMap[key] = [];
        sharedNodeMap[key].push(nodeId);
      } else {
        // Track regular nodes
        if (!labelMap[key]) labelMap[key] = [];
        labelMap[key].push(nodeId);
      }
    });
    
    // Now check for duplicates
    Object.entries(labelMap).forEach(([key, nodeIds]) => {
      if (nodeIds.length > 1) {
        const [level, label] = key.split(':');
        
        // Check if they're in different products
        const products = new Set<string>();
        nodeIds.forEach(nodeId => {
          const node = nodes[nodeId];
          if (node.products) {
            node.products.forEach(p => products.add(p));
          }
        });
        
        if (products.size <= 1) {
          // Same product - this is definitely an error
          errors.push(`Duplicate label "${label}" at ${level} level within same product: ${nodeIds.join(', ')}`);
        } else {
          // Different products - check if there's a corresponding shared node
          const hasSharedNode = Object.keys(sharedNodeMap).some(sharedKey => {
            const [sharedLevel, sharedLabel] = sharedKey.split(':');
            // Check for exact match or similar label (accounting for variations like "unified", "shared")
            return sharedLevel === level && 
                   (sharedLabel === label || 
                    sharedLabel.includes(label) || 
                    label.includes(sharedLabel));
          });
          
          if (!hasSharedNode) {
            // No shared node for these duplicates - this will break the demo!
            errors.push(`Duplicate label "${label}" at ${level} level across products (${nodeIds.join(', ')}) WITHOUT a corresponding shared node for rationalization. This will break ambiguity resolution!`);
          }
          // If there IS a shared node, this is expected behavior - no warning needed
        }
      }
    });
    
    return {
      domain,
      test: 'Duplicate Labels & Rationalization Check',
      passed: errors.length === 0,
      errors,
      warnings
    };
  }
  
  // Check that all intents reference valid nodes
  private checkIntentReferences(domain: string, nodes: Record<string, FunctionalNode>, intents: UserIntent[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    intents.forEach(intent => {
      if (!nodes[intent.entryNode]) {
        errors.push(`Intent "${intent.text}" references non-existent node: ${intent.entryNode}`);
      } else {
        const node = nodes[intent.entryNode];
        if (node.level !== intent.entryLevel) {
          warnings.push(`Intent "${intent.text}" declares level as ${intent.entryLevel} but node ${intent.entryNode} is actually ${node.level}`);
        }
      }
    });
    
    return {
      domain,
      test: 'Intent References Check',
      passed: errors.length === 0,
      errors,
      warnings
    };
  }
  
  // Check that non-shared steps have action children
  private checkStepActions(domain: string, nodes: Record<string, FunctionalNode>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    Object.entries(nodes).forEach(([nodeId, node]) => {
      if (node.level === 'step' && !nodeId.includes('-shared')) {
        // Find all action descendants
        const actions = this.findDescendantsByLevel(nodeId, nodes, 'action');
        
        if (actions.length === 0) {
          // Check if it has scenario children (might be OK)
          const hasScenarioChildren = node.children.some(childId => {
            const child = nodes[childId];
            return child && child.level === 'scenario';
          });
          
          if (hasScenarioChildren) {
            warnings.push(`Step "${node.label}" (${nodeId}) has scenario children but no direct actions`);
          } else {
            errors.push(`Step "${node.label}" (${nodeId}) has no action children - cannot execute`);
          }
        }
      }
    });
    
    return {
      domain,
      test: 'Step Actions Check',
      passed: errors.length === 0,
      errors,
      warnings
    };
  }
  
  // Check required properties
  private checkRequiredProperties(domain: string, nodes: Record<string, FunctionalNode>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    Object.entries(nodes).forEach(([nodeId, node]) => {
      // Check required fields
      if (!node.id) errors.push(`Node ${nodeId} missing id property`);
      if (!node.label) errors.push(`Node ${nodeId} missing label property`);
      if (!node.level) errors.push(`Node ${nodeId} missing level property`);
      if (!Array.isArray(node.children)) errors.push(`Node ${nodeId} missing or invalid children array`);
      if (!Array.isArray(node.parents)) errors.push(`Node ${nodeId} missing or invalid parents array`);
      
      // Check ID consistency
      if (node.id && node.id !== nodeId) {
        errors.push(`Node ${nodeId} has mismatched id property: ${node.id}`);
      }
      
      // Validate level
      const validLevels = ['product', 'workflow', 'outcome', 'scenario', 'step', 'action'];
      if (node.level && !validLevels.includes(node.level)) {
        errors.push(`Node ${nodeId} has invalid level: ${node.level}`);
      }
    });
    
    return {
      domain,
      test: 'Required Properties Check',
      passed: errors.length === 0,
      errors,
      warnings
    };
  }
  
  // Check for circular dependencies
  private checkCircularDependencies(domain: string, nodes: Record<string, FunctionalNode>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    
    const hasCycle = (nodeId: string, path: string[] = []): boolean => {
      if (recursionStack.has(nodeId)) {
        errors.push(`Circular dependency detected: ${[...path, nodeId].join(' -> ')}`);
        return true;
      }
      
      if (visited.has(nodeId)) return false;
      
      visited.add(nodeId);
      recursionStack.add(nodeId);
      
      const node = nodes[nodeId];
      if (node && node.children) {
        for (const childId of node.children) {
          if (hasCycle(childId, [...path, nodeId])) {
            return true;
          }
        }
      }
      
      recursionStack.delete(nodeId);
      return false;
    };
    
    // Check from each root node
    Object.entries(nodes).forEach(([nodeId, node]) => {
      if (node.level === 'product' && !visited.has(nodeId)) {
        hasCycle(nodeId);
      }
    });
    
    return {
      domain,
      test: 'Circular Dependencies Check',
      passed: errors.length === 0,
      errors,
      warnings
    };
  }
  
  // Check product consistency
  private checkProductConsistency(domain: string, nodes: Record<string, FunctionalNode>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    Object.entries(nodes).forEach(([nodeId, node]) => {
      // Check that product-level nodes don't have products array
      if (node.level === 'product' && node.products && node.products.length > 0) {
        warnings.push(`Product node ${nodeId} has products array - this is redundant`);
      }
      
      // Check that non-product nodes have product info (except workflows)
      if (node.level !== 'product' && node.level !== 'workflow' && !nodeId.includes('-shared')) {
        if (!node.products || node.products.length === 0) {
          // Try to infer from ancestors
          const ancestorProducts = this.inferProductFromAncestors(nodeId, nodes);
          if (ancestorProducts.length === 0) {
            warnings.push(`Node ${nodeId} (${node.label}) has no product association`);
          }
        }
      }
    });
    
    return {
      domain,
      test: 'Product Consistency Check',
      passed: errors.length === 0,
      errors,
      warnings
    };
  }
  
  // Helper: Find descendants by level
  private findDescendantsByLevel(
    nodeId: string, 
    nodes: Record<string, FunctionalNode>, 
    targetLevel: string,
    visited: Set<string> = new Set()
  ): string[] {
    if (visited.has(nodeId)) return [];
    visited.add(nodeId);
    
    const results: string[] = [];
    const node = nodes[nodeId];
    
    if (!node) return results;
    
    if (node.level === targetLevel) {
      results.push(nodeId);
    }
    
    node.children.forEach(childId => {
      results.push(...this.findDescendantsByLevel(childId, nodes, targetLevel, visited));
    });
    
    return results;
  }
  
  // Helper: Infer product from ancestors
  private inferProductFromAncestors(
    nodeId: string,
    nodes: Record<string, FunctionalNode>,
    visited: Set<string> = new Set()
  ): string[] {
    if (visited.has(nodeId)) return [];
    visited.add(nodeId);
    
    const node = nodes[nodeId];
    if (!node) return [];
    
    // Check if this node has products
    if (node.products && node.products.length > 0) {
      return node.products;
    }
    
    // Check parents
    const products = new Set<string>();
    node.parents.forEach(parentId => {
      const parentProducts = this.inferProductFromAncestors(parentId, nodes, visited);
      parentProducts.forEach(p => products.add(p));
    });
    
    return Array.from(products);
  }
  
  // Check rationalization mapping configuration
  private checkRationalizationMapping(
    domain: string,
    nodes: Record<string, FunctionalNode>,
    rationalizationMap: Record<string, Record<string, string>>
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check each shared node in the rationalization map
    Object.entries(rationalizationMap).forEach(([sharedNodeId, productMappings]) => {
      // Check if shared node exists
      if (!nodes[sharedNodeId]) {
        errors.push(`Rationalization map references non-existent shared node: ${sharedNodeId}`);
        return;
      }
      
      const sharedNode = nodes[sharedNodeId];
      
      // Check if it's actually a shared node
      if (!sharedNodeId.includes('-shared')) {
        warnings.push(`Node ${sharedNodeId} in rationalization map is not marked as shared (doesn't contain '-shared')`);
      }
      
      // Check each product mapping
      Object.entries(productMappings).forEach(([product, originalNodeId]) => {
        // Check if original node exists
        if (!nodes[originalNodeId]) {
          errors.push(`Rationalization map references non-existent original node: ${originalNodeId} for product ${product}`);
          return;
        }
        
        const originalNode = nodes[originalNodeId];
        
        // Check if original node belongs to the specified product
        if (!originalNode.products || !originalNode.products.includes(product)) {
          errors.push(`Original node ${originalNodeId} doesn't belong to product ${product} as specified in rationalization map`);
        }
        
        // Check if they're at the same level
        if (sharedNode.level !== originalNode.level) {
          errors.push(`Level mismatch in rationalization: shared node ${sharedNodeId} (${sharedNode.level}) vs original ${originalNodeId} (${originalNode.level})`);
        }
        
        // Check if shared node includes this product
        if (!sharedNode.products || !sharedNode.products.includes(product)) {
          warnings.push(`Shared node ${sharedNodeId} doesn't include product ${product} from rationalized node ${originalNodeId}`);
        }
      });
    });
    
    // Also check for duplicate nodes that should be in rationalization map but aren't
    const duplicateLabels: Record<string, string[]> = {};
    
    Object.entries(nodes).forEach(([nodeId, node]) => {
      if (nodeId.includes('-shared')) return;
      
      const key = `${node.level}:${node.label.toLowerCase()}`;
      if (!duplicateLabels[key]) duplicateLabels[key] = [];
      duplicateLabels[key].push(nodeId);
    });
    
    Object.entries(duplicateLabels).forEach(([key, nodeIds]) => {
      if (nodeIds.length > 1) {
        // Check if these are in different products
        const productSets = nodeIds.map(nodeId => {
          const node = nodes[nodeId];
          return new Set(node.products || []);
        });
        
        const allDifferentProducts = productSets.every((set1, idx1) => 
          productSets.every((set2, idx2) => {
            if (idx1 === idx2) return true;
            // Check if sets have no overlap
            let hasOverlap = false;
            set1.forEach(p => {
              if (set2.has(p)) hasOverlap = true;
            });
            return !hasOverlap;
          })
        );
        
        if (allDifferentProducts) {
          // These are duplicates across different products - should have rationalization
          const hasRationalization = Object.values(rationalizationMap).some(mappings =>
            nodeIds.some(nodeId => Object.values(mappings).includes(nodeId))
          );
          
          if (!hasRationalization) {
            warnings.push(`Duplicate nodes ${nodeIds.join(', ')} across different products are not in rationalization map. Consider adding them.`);
          }
        }
      }
    });
    
    return {
      domain,
      test: 'Rationalization Mapping Check',
      passed: errors.length === 0,
      errors,
      warnings
    };
  }
  
  // Gather statistics about a domain
  gatherStatistics(domain: string, nodes: Record<string, any>, intents: any[]): {
    totalNodes: number;
    nodesByLevel: Record<string, number>;
    uniqueNodes: number;
    sharedNodes: number;
    rationalizedNodes: number;
    duplicateLabels: number;
    products: string[];
    productDistribution: Record<string, number>;
    totalIntents: number;
    intentsByLevel: Record<string, number>;
    graphDepth: number;
    avgChildrenPerLevel: Record<string, number>;
  } {
    // Count nodes by level
    const nodeCounts: Record<string, number> = {
      product: 0,
      outcome: 0,
      scenario: 0,
      step: 0,
      action: 0
    };
    
    // Count unique vs shared nodes
    let uniqueNodes = 0;
    let sharedNodes = 0;
    let rationalizedNodes = 0;
    
    // Product distribution
    const productDistribution: Record<string, number> = {};
    
    // Analyze each node
    Object.values(nodes).forEach((node: any) => {
      // Count by level
      if (nodeCounts[node.level] !== undefined) {
        nodeCounts[node.level]++;
      }
      
      // Count shared vs unique
      if (node.products && node.products.length > 1) {
        sharedNodes++;
        if (node.label.toLowerCase().includes('unified') || 
            node.label.toLowerCase().includes('shared') ||
            node.id.includes('-shared') ||
            node.id.includes('-unified')) {
          rationalizedNodes++;
        }
      } else if (node.products && node.products.length === 1) {
        uniqueNodes++;
      }
      
      // Track product distribution
      if (node.products) {
        node.products.forEach((product: string) => {
          productDistribution[product] = (productDistribution[product] || 0) + 1;
        });
      }
    });
    
    // Find duplicate labels (potential rationalization candidates)
    const labelCounts: Record<string, number> = {};
    const duplicateLabels: Record<string, string[]> = {};
    
    Object.entries(nodes).forEach(([id, node]: [string, any]) => {
      const key = `${node.level}:${node.label}`;
      if (!labelCounts[key]) {
        labelCounts[key] = 0;
        duplicateLabels[key] = [];
      }
      labelCounts[key]++;
      duplicateLabels[key].push(id);
    });
    
    const duplicatesCount = Object.entries(labelCounts)
      .filter(([_, count]) => count > 1).length;
    
    // Intent statistics
    const intentsByLevel: Record<string, number> = {
      product: 0,
      outcome: 0,
      scenario: 0,
      step: 0,
      action: 0
    };
    
    intents.forEach((intent: any) => {
      if (intentsByLevel[intent.entryLevel] !== undefined) {
        intentsByLevel[intent.entryLevel]++;
      }
    });
    
    // Calculate graph depth (longest path from product to action)
    const calculateMaxDepth = (): number => {
      let maxDepth = 0;
      
      const traverse = (nodeId: string, depth: number): void => {
        const node = nodes[nodeId];
        if (!node) return;
        
        maxDepth = Math.max(maxDepth, depth);
        
        if (node.children && node.children.length > 0) {
          node.children.forEach((childId: string) => {
            traverse(childId, depth + 1);
          });
        }
      };
      
      // Start from product nodes
      Object.values(nodes)
        .filter((node: any) => node.level === 'product')
        .forEach((node: any) => traverse(node.id, 0));
      
      return maxDepth;
    };
    
    const maxDepth = calculateMaxDepth();
    
    // Calculate average children per node level
    const avgChildren: Record<string, number> = {};
    ['product', 'outcome', 'scenario', 'step'].forEach(level => {
      const nodesAtLevel = Object.values(nodes).filter((n: any) => n.level === level);
      if (nodesAtLevel.length > 0) {
        const totalChildren = nodesAtLevel.reduce((sum, node: any) => 
          sum + (node.children?.length || 0), 0);
        avgChildren[level] = Math.round((totalChildren / nodesAtLevel.length) * 10) / 10;
      }
    });
    
    // Get all products
    const products = new Set<string>();
    Object.values(nodes).forEach((node: any) => {
      if (node.level === 'product') {
        products.add(node.id.replace('product-', ''));
      }
    });
    
    return {
      totalNodes: Object.keys(nodes).length,
      nodesByLevel: nodeCounts,
      uniqueNodes,
      sharedNodes,
      rationalizedNodes,
      duplicateLabels: duplicatesCount,
      products: Array.from(products),
      productDistribution,
      totalIntents: intents.length,
      intentsByLevel,
      graphDepth: maxDepth,
      avgChildrenPerLevel: avgChildren
    };
  }

  // Generate validation report with statistics
  generateReport(results: ValidationResult[], domainData?: Record<string, { nodes: Record<string, FunctionalNode>, intents: UserIntent[] }>): string {
    let report = '\n' + '='.repeat(80) + '\n';
    report += 'DOMAIN CONFIGURATION VALIDATION REPORT\n';
    report += '='.repeat(80) + '\n\n';
    
    // Group by domain
    const byDomain: Record<string, ValidationResult[]> = {};
    results.forEach(r => {
      if (!byDomain[r.domain]) byDomain[r.domain] = [];
      byDomain[r.domain].push(r);
    });
    
    // Summary
    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
    const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
    
    report += `Summary: ${passedTests}/${totalTests} tests passed\n`;
    report += `Total Errors: ${totalErrors}\n`;
    report += `Total Warnings: ${totalWarnings}\n\n`;
    
    // Details by domain
    Object.entries(byDomain).forEach(([domain, domainResults]) => {
      report += '-'.repeat(40) + '\n';
      report += `Domain: ${domain.toUpperCase()}\n`;
      report += '-'.repeat(40) + '\n\n';
      
      // Add statistics if domain data is provided
      if (domainData && domainData[domain]) {
        const { nodes, intents } = domainData[domain];
        const stats = this.gatherStatistics(domain, nodes, intents);
        console.log(`Statistics for ${domain}:`, stats); // Debug log
        
        report += '📊 DOMAIN STATISTICS:\n';
        report += `  Total Nodes: ${stats.totalNodes}\n`;
        report += `  Products: ${stats.products.join(', ')}\n`;
        report += `  Graph Depth: ${stats.graphDepth} levels\n`;
        report += '\n';
        
        report += '  Node Distribution:\n';
        Object.entries(stats.nodesByLevel).forEach(([level, count]) => {
          report += `    ${level}: ${count}`;
          if (stats.avgChildrenPerLevel[level] !== undefined) {
            report += ` (avg ${stats.avgChildrenPerLevel[level]} children)`;
          }
          report += '\n';
        });
        report += '\n';
        
        report += '  Node Sharing:\n';
        report += `    Unique to single product: ${stats.uniqueNodes}\n`;
        report += `    Shared across products: ${stats.sharedNodes}\n`;
        report += `    Rationalized/Unified: ${stats.rationalizedNodes}\n`;
        report += `    Duplicate labels: ${stats.duplicateLabels}\n`;
        report += '\n';
        
        if (Object.keys(stats.productDistribution).length > 0) {
          report += '  Product Coverage:\n';
          Object.entries(stats.productDistribution).forEach(([product, count]) => {
            const percentage = Math.round((count as number / stats.totalNodes) * 100);
            report += `    ${product}: ${count} nodes (${percentage}%)\n`;
          });
          report += '\n';
        }
        
        report += `  User Intents: ${stats.totalIntents} total\n`;
        Object.entries(stats.intentsByLevel).forEach(([level, count]) => {
          if ((count as number) > 0) {
            report += `    ${level} level: ${count}\n`;
          }
        });
        report += '\n';
      }
      
      report += '📋 VALIDATION RESULTS:\n';
      domainResults.forEach(result => {
        const status = result.passed ? '✅' : '❌';
        report += `${status} ${result.test}\n`;
        
        if (result.errors.length > 0) {
          report += '  Errors:\n';
          result.errors.forEach(err => {
            report += `    - ${err}\n`;
          });
        }
        
        if (result.warnings.length > 0) {
          report += '  Warnings:\n';
          result.warnings.forEach(warn => {
            report += `    ⚠️  ${warn}\n`;
          });
        }
        
        report += '\n';
      });
    });
    
    report += '='.repeat(80) + '\n';
    
    return report;
  }
}