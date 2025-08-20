// Script to fix orphan nodes in Enterprise domain
const fs = require('fs');
const path = require('path');

// Read the nodes file
const nodesPath = path.join(__dirname, 'src/config/domains/enterprise/nodes.ts');
let nodesContent = fs.readFileSync(nodesPath, 'utf8');

console.log('Fixing orphan nodes in Enterprise domain...\n');

// Mapping of orphaned scenarios to new parents
const orphanMappings = {
  // ServiceNow orphans - reassign to existing ServiceNow outcomes
  'scenario-document-management-servicenow': 'outcome-it-service-management-servicenow',
  'scenario-employee-management-servicenow': 'outcome-it-service-management-servicenow',
  'scenario-resource-allocation': 'outcome-it-service-management-servicenow',
  'scenario-milestone-tracking': 'outcome-customer-support-servicenow',
  'scenario-capacity-planning': 'outcome-it-service-management-servicenow',
  
  // Monitoring orphans - reassign to existing Monitoring outcomes  
  'scenario-employee-management-monitoring': 'outcome-system-observability-monitoring',
  'scenario-work-order-management': 'outcome-performance-optimization-monitoring',
  'scenario-route-optimization': 'outcome-performance-optimization-monitoring',
  'scenario-mobile-timesheet': 'outcome-system-observability-monitoring',
  'scenario-offline-sync': 'outcome-system-observability-monitoring',
  
  // Steps with missing scenario parents
  'step-define-scope': 'scenario-milestone-tracking',
  'step-create-schedule': 'scenario-milestone-tracking'
};

// Fix each orphan
for (const [nodeId, newParent] of Object.entries(orphanMappings)) {
  console.log(`Fixing ${nodeId} -> parent: ${newParent}`);
  
  // Find the node definition and update its parent
  const nodePattern = new RegExp(`('${nodeId}':\\s*{[^}]*parents:\\s*\\[)([^\\]]*)(\\])`, 's');
  const match = nodesContent.match(nodePattern);
  
  if (match) {
    // Replace the parent reference
    const updatedParent = `'${newParent}'`;
    nodesContent = nodesContent.replace(nodePattern, `$1${updatedParent}$3`);
  }
}

// Now update the parent outcomes to include these scenarios as children
const parentUpdates = {
  'outcome-it-service-management-servicenow': [
    'scenario-document-management-servicenow',
    'scenario-employee-management-servicenow', 
    'scenario-resource-allocation',
    'scenario-capacity-planning'
  ],
  'outcome-customer-support-servicenow': [
    'scenario-milestone-tracking'
  ],
  'outcome-system-observability-monitoring': [
    'scenario-employee-management-monitoring',
    'scenario-mobile-timesheet',
    'scenario-offline-sync'
  ],
  'outcome-performance-optimization-monitoring': [
    'scenario-work-order-management',
    'scenario-route-optimization'
  ]
};

for (const [parentId, newChildren] of Object.entries(parentUpdates)) {
  console.log(`\nUpdating ${parentId} to include new children...`);
  
  // Find the outcome definition
  const outcomePattern = new RegExp(`('${parentId}':\\s*{[^}]*children:\\s*\\[)([^\\]]*)(\\])`, 's');
  const match = nodesContent.match(outcomePattern);
  
  if (match) {
    // Get existing children
    const existingChildren = match[2].trim();
    const existingList = existingChildren ? existingChildren.split(',').map(c => c.trim()) : [];
    
    // Add new children if not already present
    for (const child of newChildren) {
      const childQuoted = `'${child}'`;
      if (!existingList.includes(childQuoted)) {
        existingList.push(childQuoted);
      }
    }
    
    // Replace with updated children list
    const updatedChildren = existingList.join(', ');
    nodesContent = nodesContent.replace(outcomePattern, `$1${updatedChildren}$3`);
  }
}

// Fix workflow references to non-existent outcomes
console.log('\nFixing workflow references...');

const workflowFixes = {
  'workflow-employee-onboarding': {
    old: ['outcome-employee-management-ms365', 'outcome-employee-management-servicenow', 'outcome-financial-reporting-sap'],
    new: ['outcome-automation-ms365', 'outcome-it-service-management-servicenow', 'outcome-financial-control-sap']
  },
  'workflow-project-delivery': {
    old: ['outcome-customer-support-servicenow', 'outcome-collaboration-ms365', 'outcome-business-intelligence-analytics'],
    new: ['outcome-customer-support-servicenow', 'outcome-collaboration-ms365', 'outcome-business-intelligence-analytics']
  },
  'workflow-business-intelligence': {
    old: ['outcome-financial-control-sap', 'outcome-business-intelligence-analytics', 'outcome-customer-insights-salesforce'],
    new: ['outcome-financial-control-sap', 'outcome-business-intelligence-analytics', 'outcome-sales-growth-salesforce']
  }
};

for (const [workflowId, fix] of Object.entries(workflowFixes)) {
  console.log(`Fixing ${workflowId}...`);
  
  // Find workflow definition and update children
  const workflowPattern = new RegExp(`('${workflowId}':\\s*{[^}]*children:\\s*\\[)([^\\]]*)(\\])`, 's');
  const newChildrenStr = fix.new.map(c => `'${c}'`).join(', ');
  nodesContent = nodesContent.replace(workflowPattern, `$1${newChildrenStr}$3`);
}

// Write the fixed content back
fs.writeFileSync(nodesPath, nodesContent);

console.log('\n✅ Fixed all orphan nodes in Enterprise domain!');
console.log('\nChanges made:');
console.log('1. Reassigned orphaned scenarios to appropriate existing outcomes');
console.log('2. Updated parent outcomes to include new scenario children');
console.log('3. Fixed workflow references to use existing outcomes');
console.log('4. Ensured all parent-child relationships are consistent');