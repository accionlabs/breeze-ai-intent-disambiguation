#!/usr/bin/env node

// Script to clean up manual shared nodes from any domain
const fs = require('fs');
const path = require('path');

// Get domain name from command line
const domain = process.argv[2];
if (!domain) {
  console.error('Usage: node cleanupDomain.js <domain-name>');
  console.error('Example: node cleanupDomain.js financial');
  process.exit(1);
}

const domainPath = path.join(__dirname, 'src', 'config', 'domains', domain);
const nodesPath = path.join(domainPath, 'nodes.ts');

if (!fs.existsSync(nodesPath)) {
  console.error(`Domain "${domain}" not found at ${domainPath}`);
  process.exit(1);
}

console.log(`\n=== Cleaning ${domain} domain ===\n`);

// Read the nodes file
let content = fs.readFileSync(nodesPath, 'utf-8');

// Find all shared/unified nodes
const sharedNodePattern = /['"]([^'"]+(?:-shared|-unified))['"]:/g;
const nodesToRemove = [];
let match;

while ((match = sharedNodePattern.exec(content)) !== null) {
  nodesToRemove.push(match[1]);
}

if (nodesToRemove.length === 0) {
  console.log('No manual shared/unified nodes found.');
  process.exit(0);
}

console.log(`Found ${nodesToRemove.length} manual shared/unified nodes to remove:`);
nodesToRemove.forEach(node => console.log(`  - ${node}`));

// Remove node definitions
console.log('\nRemoving node definitions...');
nodesToRemove.forEach(nodeId => {
  // Pattern to match the entire node definition
  const nodePattern = new RegExp(`  ['"]${nodeId}['"]:[\\s\\S]*?\\n  \\},?\\n`, 'g');
  const matches = content.match(nodePattern);
  if (matches) {
    content = content.replace(nodePattern, '');
  }
});

// Remove references from children and parents arrays
console.log('Removing references from parent/child arrays...');
nodesToRemove.forEach(nodeId => {
  // Various patterns for array references
  const patterns = [
    new RegExp(`['"]${nodeId}['"],\\s*`, 'g'),  // 'node-id',
    new RegExp(`,\\s*['"]${nodeId}['"]`, 'g'),   // , 'node-id'
    new RegExp(`\\[\\s*['"]${nodeId}['"]\\s*\\]`, 'g'), // ['node-id']
  ];
  
  patterns.forEach(pattern => {
    content = content.replace(pattern, (match) => {
      // If it's the only element in array, replace with []
      if (match.includes('[') && match.includes(']')) {
        return '[]';
      }
      // Otherwise remove it
      return match.startsWith(',') ? '' : '';
    });
  });
});

// Clean up any double commas or trailing commas
content = content.replace(/,\s*,/g, ',');
content = content.replace(/,\s*\]/g, ']');
content = content.replace(/\[\s*,/g, '[');

// Remove any empty lines created by deletion
content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

// Write the cleaned content back
fs.writeFileSync(nodesPath, content);

console.log(`\n✅ Successfully cleaned ${domain} domain!`);
console.log(`Removed ${nodesToRemove.length} manual shared/unified nodes.`);
console.log('The automatic shared node generator will create them dynamically.\n');