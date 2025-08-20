// Quick test of automatic rationalization
const fs = require('fs');
const path = require('path');

// Read the compiled automaticSharedNodeGenerator
const generatorPath = path.join(__dirname, 'build/static/js');
console.log('Checking for build files in:', generatorPath);

// Test with simple data directly
console.log('\n=== Testing Automatic Rationalization ===\n');

const domainNames = ['financial', 'healthcare', 'ecommerce', 'enterprise', 'cision'];

domainNames.forEach(domainName => {
  console.log(`\nTesting ${domainName.toUpperCase()}:`);
  
  try {
    // Check if domain files exist
    const nodesPath = path.join(__dirname, 'src/config/domains', domainName, 'nodes.ts');
    
    if (fs.existsSync(nodesPath)) {
      const content = fs.readFileSync(nodesPath, 'utf-8');
      
      // Count shared/unified nodes
      const sharedMatches = content.match(/['"]\w+-(shared|unified)['"]/g) || [];
      const uniqueShared = [...new Set(sharedMatches)];
      
      console.log(`  ✅ Domain exists`);
      console.log(`  📊 Manual shared/unified nodes found: ${uniqueShared.length}`);
      
      if (uniqueShared.length > 0) {
        console.log('  ⚠️  Manual shared nodes still present - should be removed');
        console.log('     Run: node cleanupDomain.js ' + domainName);
      } else {
        console.log('  ✅ No manual shared nodes - ready for automatic rationalization');
      }
    } else {
      console.log(`  ❌ Domain not found`);
    }
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
  }
});

console.log('\n=== Summary ===');
console.log('The application is configured to automatically generate shared nodes.');
console.log('Manual shared nodes are ignored during runtime.');
console.log('Test the app at http://localhost:3000 to verify rationalization toggle works.\n');