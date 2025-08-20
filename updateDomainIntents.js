#!/usr/bin/env node

// Script to update domain intents with proper categorization and coverage
const fs = require('fs');
const path = require('path');

const domainNames = ['financial', 'healthcare', 'ecommerce', 'enterprise', 'cision'];

console.log('=== Updating Domain Intents with Proper Categorization ===\n');

// Helper to extract existing intents from file
function extractExistingIntents(content) {
  const intents = [];
  const regex = /\{([^}]+)\}/g;
  let match;
  
  // Find the USER_INTENTS array
  const intentsStart = content.indexOf('export const USER_INTENTS');
  if (intentsStart === -1) return intents;
  
  const intentsSection = content.substring(intentsStart);
  const arrayStart = intentsSection.indexOf('[');
  const arrayEnd = intentsSection.indexOf('];');
  
  if (arrayStart === -1 || arrayEnd === -1) return intents;
  
  const intentsArray = intentsSection.substring(arrayStart, arrayEnd + 1);
  
  while ((match = regex.exec(intentsArray)) !== null) {
    const intentStr = match[1];
    if (intentStr.includes('id:')) {
      // Parse the intent object
      const intent = {};
      
      // Extract id
      const idMatch = intentStr.match(/id:\s*['"]([^'"]+)['"]/);
      if (idMatch) intent.id = idMatch[1];
      
      // Extract text
      const textMatch = intentStr.match(/text:\s*['"]([^'"]+)['"]/);
      if (textMatch) intent.text = textMatch[1];
      
      // Extract entryNode
      const entryNodeMatch = intentStr.match(/entryNode:\s*['"]([^'"]+)['"]/);
      if (entryNodeMatch) intent.entryNode = entryNodeMatch[1];
      
      // Extract entryLevel
      const entryLevelMatch = intentStr.match(/entryLevel:\s*['"]([^'"]+)['"]/);
      if (entryLevelMatch) intent.entryLevel = entryLevelMatch[1];
      
      if (intent.id) {
        intents.push(intent);
      }
    }
  }
  
  return intents;
}

// Analyze nodes to find duplicates and categorize intents
function analyzeNodesAndCategorize(nodesContent, existingIntents) {
  const nodeInfo = {};
  const nodeLabels = {};
  const products = new Set();
  let workflowNodes = [];
  
  // Extract node information
  const nodeMatches = nodesContent.match(/['"]([^'"]+)['"]\s*:\s*\{[^}]+\}/g) || [];
  
  nodeMatches.forEach(match => {
    const idMatch = match.match(/['"]([^'"]+)['"]\s*:/);
    const labelMatch = match.match(/label:\s*['"]([^'"]+)['"]/);
    const levelMatch = match.match(/level:\s*['"]([^'"]+)['"]/);
    const productsMatch = match.match(/products:\s*\[([^\]]+)\]/);
    
    if (idMatch && labelMatch && levelMatch) {
      const nodeId = idMatch[1];
      const label = labelMatch[1];
      const level = levelMatch[1];
      
      nodeInfo[nodeId] = {
        label,
        level,
        products: []
      };
      
      // Track labels for duplicate detection
      const labelKey = `${level}-${label.toLowerCase()}`;
      if (!nodeLabels[labelKey]) {
        nodeLabels[labelKey] = [];
      }
      nodeLabels[labelKey].push(nodeId);
      
      // Extract products
      if (productsMatch) {
        const productList = productsMatch[1].match(/['"]([^'"]+)['"]/g) || [];
        productList.forEach(p => {
          const product = p.replace(/['"]/g, '');
          products.add(product);
          nodeInfo[nodeId].products.push(product);
        });
      }
      
      // Track workflow nodes
      if (level === 'workflow') {
        workflowNodes.push(nodeId);
      }
    }
  });
  
  // Find duplicates (same label and level, multiple instances)
  const duplicateNodeIds = new Set();
  Object.values(nodeLabels).forEach(nodes => {
    if (nodes.length > 1) {
      nodes.forEach(id => duplicateNodeIds.add(id));
    }
  });
  
  // Categorize existing intents
  const categorizedIntents = existingIntents.map(intent => {
    const node = nodeInfo[intent.entryNode];
    
    if (!node) {
      // Keep intent as is if node not found
      return { ...intent, isDuplicate: false, isWorkflow: false };
    }
    
    // Check if it's a workflow intent
    if (node.level === 'workflow') {
      return { ...intent, isDuplicate: false, isWorkflow: true };
    }
    
    // Check if it's an ambiguous intent (duplicate node)
    if (duplicateNodeIds.has(intent.entryNode)) {
      return { ...intent, isDuplicate: true, isWorkflow: false };
    }
    
    // Otherwise it's a clear intent
    return { ...intent, isDuplicate: false, isWorkflow: false };
  });
  
  return {
    categorizedIntents,
    nodeInfo,
    duplicateNodeIds,
    workflowNodes,
    products: Array.from(products)
  };
}

// Generate the updated intents.ts content
function generateIntentsFile(categorizedIntents, domainName) {
  const clearIntents = categorizedIntents.filter(i => !i.isDuplicate && !i.isWorkflow);
  const ambiguousIntents = categorizedIntents.filter(i => i.isDuplicate);
  const workflowIntents = categorizedIntents.filter(i => i.isWorkflow);
  
  let content = `// Intent definitions for ${domainName} domain
// Auto-categorized with proper flags for clear, ambiguous, and workflow intents

import { UserIntent } from '../../types';

export const USER_INTENTS: UserIntent[] = [
`;

  // Add clear intents first
  if (clearIntents.length > 0) {
    content += `  // Clear Intents - Unambiguous, single product/function mapping\n`;
    clearIntents.forEach((intent, index) => {
      content += `  {
    id: '${intent.id}',
    text: '${intent.text}',
    entryNode: '${intent.entryNode}',
    entryLevel: '${intent.entryLevel}' as any,
    isDuplicate: false,
    isWorkflow: false
  }${index < clearIntents.length - 1 || ambiguousIntents.length > 0 || workflowIntents.length > 0 ? ',' : ''}\n`;
    });
  }
  
  // Add ambiguous intents
  if (ambiguousIntents.length > 0) {
    content += `\n  // Ambiguous Intents - Require context for resolution\n`;
    ambiguousIntents.forEach((intent, index) => {
      content += `  {
    id: '${intent.id}',
    text: '${intent.text}',
    entryNode: '${intent.entryNode}',
    entryLevel: '${intent.entryLevel}' as any,
    isDuplicate: true,
    isWorkflow: false
  }${index < ambiguousIntents.length - 1 || workflowIntents.length > 0 ? ',' : ''}\n`;
    });
  }
  
  // Add workflow intents
  if (workflowIntents.length > 0) {
    content += `\n  // Workflow Intents - Cross-product orchestration\n`;
    workflowIntents.forEach((intent, index) => {
      content += `  {
    id: '${intent.id}',
    text: '${intent.text}',
    entryNode: '${intent.entryNode}',
    entryLevel: '${intent.entryLevel}' as any,
    isDuplicate: false,
    isWorkflow: true
  }${index < workflowIntents.length - 1 ? ',' : ''}\n`;
    });
  }
  
  content += `];

// Intent categorization summary
export const INTENT_CATEGORIES = {
  clear: ${clearIntents.length},
  ambiguous: ${ambiguousIntents.length},
  workflow: ${workflowIntents.length},
  total: ${categorizedIntents.length}
};
`;
  
  return content;
}

// Process each domain
domainNames.forEach(domainName => {
  console.log(`\nProcessing ${domainName.toUpperCase()}...`);
  
  try {
    const intentsPath = path.join(__dirname, 'src/config/domains', domainName, 'intents.ts');
    const nodesPath = path.join(__dirname, 'src/config/domains', domainName, 'nodes.ts');
    
    if (!fs.existsSync(intentsPath) || !fs.existsSync(nodesPath)) {
      console.log(`  ❌ Missing files for ${domainName}`);
      return;
    }
    
    // Backup existing intents
    const backupPath = intentsPath.replace('.ts', '.backup.ts');
    const intentsContent = fs.readFileSync(intentsPath, 'utf-8');
    fs.writeFileSync(backupPath, intentsContent);
    console.log(`  ✅ Backed up to intents.backup.ts`);
    
    // Extract existing intents
    const existingIntents = extractExistingIntents(intentsContent);
    console.log(`  📊 Found ${existingIntents.length} existing intents`);
    
    // Read nodes and analyze
    const nodesContent = fs.readFileSync(nodesPath, 'utf-8');
    const analysis = analyzeNodesAndCategorize(nodesContent, existingIntents);
    
    // Generate updated file
    const updatedContent = generateIntentsFile(analysis.categorizedIntents, domainName);
    
    // Write updated file
    fs.writeFileSync(intentsPath, updatedContent);
    
    // Report results
    const clear = analysis.categorizedIntents.filter(i => !i.isDuplicate && !i.isWorkflow).length;
    const ambiguous = analysis.categorizedIntents.filter(i => i.isDuplicate).length;
    const workflow = analysis.categorizedIntents.filter(i => i.isWorkflow).length;
    
    console.log(`  ✅ Updated intents.ts with categorization:`);
    console.log(`     - Clear: ${clear}`);
    console.log(`     - Ambiguous: ${ambiguous}`);
    console.log(`     - Workflow: ${workflow}`);
    
    // Recommendations
    if (clear < 5) {
      console.log(`  ⚠️  Consider adding ${5 - clear} more clear intents`);
    }
    if (analysis.duplicateNodeIds.size > 0 && ambiguous < 3) {
      console.log(`  ⚠️  Consider adding ${3 - ambiguous} more ambiguous intents`);
    }
    if (analysis.workflowNodes.length > 0 && workflow === 0) {
      console.log(`  ⚠️  Consider adding workflow intents for workflow nodes`);
    }
    
  } catch (error) {
    console.error(`  ❌ Error processing ${domainName}:`, error.message);
  }
});

console.log('\n' + '='.repeat(60));
console.log('✅ INTENT CATEGORIZATION COMPLETE');
console.log('='.repeat(60));
console.log('\nAll domains have been updated with proper intent categorization.');
console.log('The intents are now tagged with:');
console.log('  - isDuplicate: false/true');
console.log('  - isWorkflow: false/true');
console.log('\nBackup files created as intents.backup.ts in each domain.');
console.log('\nNext steps:');
console.log('1. Review the categorization in each domain');
console.log('2. Add more intents where recommended');
console.log('3. Test intent resolution with the new categorization');