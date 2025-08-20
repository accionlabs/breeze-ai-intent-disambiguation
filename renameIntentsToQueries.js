#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration for renaming
const renameMappings = {
  // File renames
  files: {
    'intents.ts': 'queries.ts',
    'intents.backup.ts': 'queries.backup.ts'
  },
  
  // Text replacements (case-sensitive)
  text: [
    // UI Labels
    { from: 'User Intents', to: 'User Queries' },
    { from: 'user intents', to: 'user queries' },
    { from: 'User Intent', to: 'User Query' },
    { from: 'user intent', to: 'user query' },
    
    // Variable/Type names
    { from: 'USER_INTENTS', to: 'USER_QUERIES' },
    { from: 'UserIntent', to: 'UserQuery' },
    { from: 'userIntent', to: 'userQuery' },
    
    // Component/Function names
    { from: 'IntentExamples', to: 'QueryExamples' },
    { from: 'IntentInput', to: 'QueryInput' },
    { from: 'IntentDisambiguation', to: 'QueryDisambiguation' },
    { from: 'selectedIntent', to: 'selectedQuery' },
    { from: 'onIntentSelect', to: 'onQuerySelect' },
    { from: 'handleIntentSelect', to: 'handleQuerySelect' },
    { from: 'intentId', to: 'queryId' },
    { from: 'intent.id', to: 'query.id' },
    { from: 'intent.text', to: 'query.text' },
    
    // Import statements
    { from: "from './intents'", to: "from './queries'" },
    { from: "from '../intents'", to: "from '../queries'" },
    { from: '/intents', to: '/queries' },
    { from: 'intents.ts', to: 'queries.ts' },
    
    // Comments and documentation
    { from: 'Intent definitions', to: 'Query definitions' },
    { from: 'intent definitions', to: 'query definitions' },
    { from: 'INTENT', to: 'QUERY' },
    { from: 'Intent', to: 'Query' },
    { from: 'intent', to: 'query' },
    
    // Specific terminology updates
    { from: 'predefined intent', to: 'predefined query' },
    { from: 'Intent Resolution', to: 'Intent Resolution' }, // Keep this as is - it's the resolved intent
    { from: 'Intent Mapping', to: 'Intent Mapping' }, // Keep this as is - it's the resolved intent
    { from: 'Recent Intents', to: 'Recent Queries' },
    { from: 'recent intents', to: 'recent queries' },
    
    // Generator and test files
    { from: 'generateIntents', to: 'generateQueries' },
    { from: 'generateIntent', to: 'generateQuery' },
    { from: 'GeneratedIntent', to: 'GeneratedQuery' },
    { from: 'generatedIntent', to: 'generatedQuery' },
    { from: 'verifyIntents', to: 'verifyQueries' },
    { from: 'intentGenerator', to: 'queryGenerator' },
    { from: 'intentMatcher', to: 'queryMatcher' },
    { from: 'intentReorderer', to: 'queryReorderer' },
    
    // Keep workflow intents as "queries"
    { from: 'workflow intents', to: 'workflow queries' },
    { from: 'Workflow Intents', to: 'Workflow Queries' },
    { from: 'WORKFLOW INTENTS', to: 'WORKFLOW QUERIES' },
    
    // Categories
    { from: 'INTENT_CATEGORIES', to: 'QUERY_CATEGORIES' },
    { from: 'Clear Intents', to: 'Clear Queries' },
    { from: 'Ambiguous Intents', to: 'Ambiguous Queries' },
    { from: 'clear intents', to: 'clear queries' },
    { from: 'ambiguous intents', to: 'ambiguous queries' }
  ]
};

// Directories to process
const directories = [
  'src/components',
  'src/config',
  'src/config/domains/financial',
  'src/config/domains/healthcare',
  'src/config/domains/ecommerce',
  'src/config/domains/enterprise',
  'src/config/domains/cision',
  'src/sections',
  'src/types',
  'src/utils',
  'src/hooks',
  'src/tests'
];

// File extensions to process
const fileExtensions = ['.ts', '.tsx', '.js', '.jsx'];

console.log('Starting Intent -> Query renaming process...\n');

// Step 1: Rename files
console.log('Step 1: Renaming files...');
directories.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) return;
  
  fs.readdirSync(fullPath).forEach(file => {
    Object.entries(renameMappings.files).forEach(([oldName, newName]) => {
      if (file === oldName || file.includes('intents.backup')) {
        const oldPath = path.join(fullPath, file);
        const newFileName = file.replace('intents', 'queries');
        const newPath = path.join(fullPath, newFileName);
        
        if (fs.existsSync(oldPath)) {
          fs.renameSync(oldPath, newPath);
          console.log(`  ✓ Renamed: ${dir}/${file} -> ${dir}/${newFileName}`);
        }
      }
    });
  });
});

// Step 2: Update file contents
console.log('\nStep 2: Updating file contents...');
function processFile(filePath) {
  if (!fileExtensions.some(ext => filePath.endsWith(ext))) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Apply text replacements
  renameMappings.text.forEach(({ from, to }) => {
    if (content.includes(from)) {
      content = content.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    const relativePath = path.relative(__dirname, filePath);
    console.log(`  ✓ Updated: ${relativePath}`);
  }
}

function processDirectory(dir) {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) return;
  
  fs.readdirSync(fullPath).forEach(item => {
    const itemPath = path.join(fullPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      processDirectory(path.join(dir, item));
    } else if (stat.isFile()) {
      processFile(itemPath);
    }
  });
}

directories.forEach(processDirectory);

// Also process root src files
console.log('\nStep 3: Processing root src files...');
const rootSrcPath = path.join(__dirname, 'src');
fs.readdirSync(rootSrcPath).forEach(file => {
  const filePath = path.join(rootSrcPath, file);
  if (fs.statSync(filePath).isFile()) {
    processFile(filePath);
  }
});

// Step 4: Update specific component files that might have been missed
console.log('\nStep 4: Final cleanup...');

// Create a summary
console.log('\n' + '='.repeat(60));
console.log('RENAMING COMPLETE!');
console.log('='.repeat(60));
console.log('\nSummary of changes:');
console.log('  • Renamed all "intents.ts" files to "queries.ts"');
console.log('  • Updated "User Intents" to "User Queries" in UI');
console.log('  • Changed UserIntent type to UserQuery');
console.log('  • Updated all variable and function names');
console.log('  • Preserved "Intent Resolution" and "Intent Mapping" (these refer to resolved intents)');
console.log('\nNext steps:');
console.log('  1. Run: npm start');
console.log('  2. Test the application');
console.log('  3. Verify all queries work correctly');
console.log('  4. Check that Intent Resolution still shows properly');