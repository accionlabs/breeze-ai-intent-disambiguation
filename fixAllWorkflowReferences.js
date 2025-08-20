// Script to verify and fix all workflow node references
const fs = require('fs');
const path = require('path');

const domains = ['financial', 'healthcare', 'enterprise'];

domains.forEach(domain => {
  console.log(`\nChecking ${domain} domain...`);
  
  const nodesPath = path.join(__dirname, 'src', 'config', 'domains', domain, 'nodes.ts');
  let content = fs.readFileSync(nodesPath, 'utf8');
  let modified = false;
  
  // Find all workflow nodes and their children
  const workflowPattern = /'(workflow-[^']+)':\s*{[^}]*children:\s*\[([^\]]+)\]/g;
  let match;
  const workflows = [];
  
  while ((match = workflowPattern.exec(content)) !== null) {
    const [, workflowId, childrenStr] = match;
    const children = childrenStr.match(/'([^']+)'/g)?.map(c => c.replace(/'/g, '')) || [];
    workflows.push({ id: workflowId, children });
    console.log(`  Found workflow: ${workflowId}`);
    console.log(`    Children: ${children.join(', ')}`);
  }
  
  // For each workflow, ensure its children have it as a parent
  workflows.forEach(workflow => {
    workflow.children.forEach(childId => {
      // Find the child node
      const childPattern = new RegExp(`'${childId}':\\s*{[^}]*parents:\\s*\\[([^\\]]*)\\]`, 's');
      const childMatch = content.match(childPattern);
      
      if (childMatch) {
        const [fullMatch, parentsStr] = childMatch;
        
        // Check if workflow is already a parent
        if (!parentsStr.includes(workflow.id)) {
          // Add workflow as parent
          const newParentsStr = parentsStr ? `${parentsStr}, '${workflow.id}'` : `'${workflow.id}'`;
          const newFullMatch = fullMatch.replace(parentsStr, newParentsStr);
          content = content.replace(fullMatch, newFullMatch);
          modified = true;
          console.log(`    ✅ Added ${workflow.id} as parent to ${childId}`);
        }
      }
    });
  });
  
  if (modified) {
    fs.writeFileSync(nodesPath, content);
    console.log(`  ✅ Updated ${domain} nodes file`);
  } else {
    console.log(`  ✅ No updates needed for ${domain}`);
  }
});

console.log('\n✅ All workflow references fixed!');