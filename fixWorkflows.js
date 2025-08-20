// Script to fix workflow relationships in Enterprise domain
const fs = require('fs');
const path = require('path');

// Read the nodes file
const nodesPath = path.join(__dirname, 'src/config/domains/enterprise/nodes.ts');
let nodesContent = fs.readFileSync(nodesPath, 'utf8');

console.log('Fixing workflow relationships in Enterprise domain...\n');

// Remove workflows from product children
console.log('1. Removing workflows from product children...');
nodesContent = nodesContent.replace(
  /(product-sap[^}]*children:\s*\[)([^\]]*)(workflow-employee-onboarding|workflow-business-intelligence)[,\s]*([^\]]*)/g,
  '$1$2$4'
);
nodesContent = nodesContent.replace(
  /(product-salesforce[^}]*children:\s*\[)([^\]]*)(workflow-business-intelligence)[,\s]*([^\]]*)/g,
  '$1$2$4'
);
nodesContent = nodesContent.replace(
  /(product-ms365[^}]*children:\s*\[)([^\]]*)(workflow-employee-onboarding|workflow-project-delivery)[,\s]*([^\]]*)/g,
  '$1$2$4'
);
nodesContent = nodesContent.replace(
  /(product-analytics[^}]*children:\s*\[)([^\]]*)(workflow-business-intelligence)[,\s]*([^\]]*)/g,
  '$1$2$4'
);
nodesContent = nodesContent.replace(
  /(product-servicenow[^}]*children:\s*\[)([^\]]*)(workflow-employee-onboarding|workflow-incident-response)[,\s]*([^\]]*)/g,
  '$1$2$4'
);
nodesContent = nodesContent.replace(
  /(product-monitoring[^}]*children:\s*\[)([^\]]*)(workflow-incident-response)[,\s]*([^\]]*)/g,
  '$1$2$4'
);

// Clean up any duplicate commas or trailing commas
nodesContent = nodesContent.replace(/,\s*,/g, ',');
nodesContent = nodesContent.replace(/\[\s*,/g, '[');
nodesContent = nodesContent.replace(/,\s*\]/g, ']');

// Remove workflow-project-delivery from outcome-collaboration-ms365 parents
console.log('2. Removing workflow-project-delivery from outcome parents...');
nodesContent = nodesContent.replace(
  /(outcome-collaboration-ms365[^}]*parents:\s*\[)([^\]]*)(,\s*'workflow-project-delivery'|'workflow-project-delivery',\s*)([^\]]*)/g,
  '$1$2$4'
);

// Update scenario-milestone-tracking to include step-define-scope and step-create-schedule as children
console.log('3. Updating scenario-milestone-tracking children...');
const milestonePattern = /(scenario-milestone-tracking[^}]*children:\s*\[)([^\]]*)(])/;
const milestoneMatch = nodesContent.match(milestonePattern);
if (milestoneMatch) {
  const existingChildren = milestoneMatch[2].trim();
  const childrenArray = existingChildren ? existingChildren.split(',').map(c => c.trim()) : [];
  
  // Add missing children if not present
  if (!childrenArray.includes("'step-define-scope'")) {
    childrenArray.push("'step-define-scope'");
  }
  if (!childrenArray.includes("'step-create-schedule'")) {
    childrenArray.push("'step-create-schedule'");
  }
  
  const updatedChildren = childrenArray.join(', ');
  nodesContent = nodesContent.replace(milestonePattern, `$1${updatedChildren}$3`);
}

// Write the fixed content back
fs.writeFileSync(nodesPath, nodesContent);

console.log('\n✅ Fixed workflow relationships in Enterprise domain!');
console.log('\nChanges made:');
console.log('1. Removed workflows from product children (workflows should be independent)');
console.log('2. Removed workflow references from outcome parents');
console.log('3. Updated scenario-milestone-tracking to include its step children');